import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PedidoEnTransito } from '@data/interface/Response/PedidoEnTransito.interface';
import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-producto-terminado',
  templateUrl: './producto-terminado.component.html'
})
export class ProductoTerminadoComponent implements OnInit {


  private  _periodoActual =  new Date().toISOString().substring(0,7)

  dataCompleta: SeguimientoCandidato[] = []
  listaCandidatos: SeguimientoCandidato[] = []
  flagLoading: boolean = false
  pedidosItemTransito : PedidoEnTransito[]

  filtrosForm: FormGroup;
  periodoCtrl = new FormControl(this._periodoActual);
  textFilterCtrl = new FormControl('');
  itemDetalle: string = '';

  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado candidatos para estos filtro',
    'totalMessage': 'Candidatos'
  }

  constructor( private _produccionService: ProduccionService, private _modalService: NgbModal, private _fb: FormBuilder, private toastr: ToastrService )
  {
    this.inicializarFormulario();
    this.instanciarObservadoresFilter();
    this.deshabilitarFiltroPorPeriodo();
  }

  ngOnInit(): void {
    this.ObtenerProductos();
  }

  public get reglaSeleccionada() : string {
    return this.filtrosForm.value['regla']
  }

  inicializarFormulario(){
    this.filtrosForm = this._fb.group({
      regla: ['', Validators.required],
      agrupador: [''],
      filtro: ['']
    })

    this.filtrosForm.reset({
      regla: 'R1',
      agrupador: '',
      filtro: ''
    })
  }

  instanciarObservadoresFilter(){

    this.periodoCtrl.valueChanges.subscribe( _ => {
      this.deshabilitarFiltroPorPeriodo();
      // this.ObtenerProductos();
    });

    this.filtrosForm.valueChanges.subscribe( _ => {
      this.filtroSeleccion();
    })

    this.textFilterCtrl.valueChanges.pipe( debounceTime(900) ).subscribe( _ => {
      this.filtroSeleccion();
    })
  }

  ObtenerProductos (){

    if(this.filtrosForm.valid)
    {

      this.listaCandidatos = []
      this.dataCompleta = []
      this.flagLoading = true

      let periodo =  this.periodoCtrl.value.replace('-','');
      this.messagerNgxTable.emptyMessage = "No se ha encontrado candidatos, seleccione otro periodo"

      this._produccionService.ListarProductosArima(periodo).subscribe(
        resp => {
          this.dataCompleta = resp;
          this.filtroSeleccion();
          this.flagLoading = false
        },
        catchError => {
          this.flagLoading = false
          this.messagerNgxTable.emptyMessage = "Ocurrio un error al obtener los candidatos"
        }
      )
    }
  }

  filtroSeleccion()
  {

    if(this.filtrosForm.valid)
    {

      const valorFiltro = this.filtrosForm.value
      this.flagLoading = true
      this.listaCandidatos = []

      this.listaCandidatos = this.dataCompleta.filter( producto => {

        if(producto.regla.substring(7, 9) != valorFiltro['regla'])
          return false;

        if(valorFiltro['agrupador'] != '' && producto.regla.substring(2, 4) != valorFiltro['agrupador'])
          return false;

        if(valorFiltro['filtro'] != '')
        {
          if(valorFiltro['filtro'] == 'FAL')
            return producto.alerta >= 0
          if(valorFiltro['filtro'] == 'FSA')
            return producto.alerta < 0
          if(valorFiltro['filtro'] == 'FPA')
            return producto.pedidoAtrasado
        }

        return true;
      });

      if(this.textFilterCtrl.value != '')
      {
        const texto = this.textFilterCtrl.value.toLowerCase();

        this.listaCandidatos = this.listaCandidatos.filter( x => x.codSut?.toLowerCase().indexOf(texto) !== -1
            || x.item?.toLowerCase().indexOf(texto) !== -1
            || x.descripcion?.toLowerCase().indexOf(texto) !== -1
        );
      }
    }
    else
      this.toastr.warning('Debe seleccionar los filtros necesarios', 'Filtros inválidos')

    this.flagLoading = false

  }

  deshabilitarFiltroPorPeriodo(){
    if (this.periodoCtrl.value != this._periodoActual)
    {
        this.filtrosForm.controls['filtro'].setValue('');
        this.filtrosForm.controls['filtro'].disable();
    }
    else
    {
        this.filtrosForm.controls['filtro'].setValue('');
        this.filtrosForm.controls['filtro'].enable();
    }
  }

  abrirModalTransito(modal: NgbModal, detalle, item:string){
    this.itemDetalle = item
    this.pedidosItemTransito = []
    this.pedidosItemTransito = detalle

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

}
