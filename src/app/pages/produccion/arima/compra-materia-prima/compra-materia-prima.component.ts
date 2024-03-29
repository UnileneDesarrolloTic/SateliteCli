import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { ComprasMateriaPrimaArima } from '@data/interface/Response/CompraMateriaPrimaArima';
import { DetalleCalidad } from '@data/interface/Response/DetalleCalidad.interface';
import { DetalleOrdenCompraMP } from '@data/interface/Response/DetalleordenCompraMPArima';
import { SubFamilia } from '@data/interface/Response/SubFamilia.Interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime, pairwise, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-compra-mprima',
  templateUrl: './compra-materia-prima.component.html'
})
export class CompraMateriaPrimaComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  filtrosForm: FormGroup;
  ListaCompraMaterial: ComprasMateriaPrimaArima[] = [];
  ListaTemporalCompraMaterial: ComprasMateriaPrimaArima[] = [];
  DetalleOrdenCompraMP: DetalleOrdenCompraMP[];
  DetalleCalidad:DetalleCalidad[];
  ListarArraySubFamilia:SubFamilia[]=[];
  flagLoading: boolean = false;
  DisabledCampo:boolean=false;
  pagina: number = 0



  private _periodoActual = new Date().toISOString().substring(0, 7)
  periodoCtrl = new FormControl(this._periodoActual);
  FiltrarAlerta = new FormControl('TD');
  textFilterCtrl = new FormControl('');
  subcripcion : Subscription
  isSubmitted = false;

  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado productos',
    'totalMessage': 'Registros'
  }

  paginado: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 5,
    totalRegistros: 1,
    siguiente: false,
    anterior: false,
    primeraPagina: false,
    ultimaPagina: false
  };


  constructor(private _modalService: NgbModal,
              private toastr: ToastrService,
              private servicebase64:Cargarbase64Service, private _fb: FormBuilder, 
              private _produccionService: ProduccionService, private _commonService: GenericoService,
              private _fullComponente: FullComponent) {
                this._fullComponente.options.sidebartype = 'mini-sidebar';
  
    this.inicializarFormulario();
    this.instanciarObservadoresFilter();
    this.CargarFamiliaMP();
  }



  ngOnInit(): void {
    this.BuscarProducto();
    this.cambiarlinea();
  }

  inicializarFormulario() {
    //new Date().toLocaleString("es-Cl").substring(3,10);  '03-2022'\
    //Date().toISOString().substring(0, 7)
    this.filtrosForm = this._fb.group({
      periodo: [ this.CambioFormato(new Date().toLocaleString("es-Cl").substring(3,10)), Validators.required],
      regla: ["TD", Validators.required],
      agrupador: ["TD", Validators.required],
      familia: ["TD", Validators.required],
      familiaMP:["TD",Validators.required],
      linea: ["MI"],
      tipo:['AB']
      // FiltrarAlerta: [{ value: "TD", disabled: true }]
    })

  }

  CambioFormato(fecha){
      let format = fecha.split("-");

      return format[1]+''+format[0];
  }

  filtroItem() {
    if (this.textFilterCtrl.value != '') {
      const TextFiltro = this.textFilterCtrl.value.toLowerCase().trim();
      this.ListaCompraMaterial = this.ListaTemporalCompraMaterial.filter(element => element.item.toLowerCase().indexOf(TextFiltro) !== -1 || element.descripcion?.toLowerCase().indexOf(TextFiltro) !== -1 || element.familiaMP?.toLowerCase().indexOf(TextFiltro) !== -1);
    } else {
      this.ListaCompraMaterial = this.ListaTemporalCompraMaterial
    }

    this.flagLoading = false
  }




  getObtenerLimit() {
    return this.filtrosForm.get('registroPorPagina').value * 1
  }

  dataTableOnChange(event: any) {
    this.pagina = event.offset
  }


  get BooleanListProduct(){
      return true;
  }


  BuscarProducto() {
    this.flagLoading = true;

    const ConstParametros = {
      Periodo: this.filtrosForm.controls.periodo.value.replace("-", ""),
      Regla: this.filtrosForm.controls.regla.value,
      Agrupador: this.filtrosForm.controls.agrupador.value,
      Familia: this.filtrosForm.controls.familia.value,
      Linea: this.filtrosForm.controls.linea.value,
      FamiliaMP:this.filtrosForm.controls.familiaMP.value,
    }
    this.listaProductos(ConstParametros);

  }


  listaProductos(parametros){
    this._produccionService.ListaCompraMP(parametros).subscribe(
      resp => {
        this.ListaCompraMaterial = resp;
        this.ListaTemporalCompraMaterial = resp;

        if(parametros.Periodo==this._periodoActual.replace("-","")){
          // this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
          // this.filtrosForm.controls['FiltrarAlerta'].enable();
          this.FiltrarAlerta.setValue('TD');
          this.FiltrarAlerta.enable;

        }else{

          // this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
          this.FiltrarAlerta.setValue('TD');

        }

        this.textFilterCtrl.patchValue("");

        this.flagLoading = false
      },
      catchError => {
        this.messagerNgxTable.emptyMessage = "Ocurrio un error al obtener lista de producto"
      }
    )
  }

 



  instanciarObservadoresFilter() {
    this.flagLoading = true;

    this.filtrosForm.get("periodo").valueChanges.subscribe( valor => {

      if(valor==this._periodoActual){
        // this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
        // this.filtrosForm.controls['FiltrarAlerta'].enable();
          this.FiltrarAlerta.setValue('TD');
          this.FiltrarAlerta.enable();
      }else{
        // this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
        // this.filtrosForm.controls['FiltrarAlerta'].disable();
        this.FiltrarAlerta.setValue('TD');
        this.FiltrarAlerta.disable();
      }
    })

    this.textFilterCtrl.valueChanges.pipe(debounceTime(900)).subscribe(_ => {
      this.filtroItem();
    })
    this.flagLoading = false;
  }

  //combox box
  CambiodeFiltroAlerta(event: any) {
    this.ListaCompraMaterial = []
    let TextFiltro = event.target.value;

    this.ListaCompraMaterial = this.ListaTemporalCompraMaterial

    if (TextFiltro == "FAL") { // Productos con alerta
      this.ListaCompraMaterial = this.ListaTemporalCompraMaterial.filter(element => element.alerta > 0);
    } else if (TextFiltro == "FSA") { //Productos sin alerta
      this.ListaCompraMaterial = this.ListaTemporalCompraMaterial.filter(element => element.alerta <= 0);
    } else {//Ambas
      this.ListaCompraMaterial = this.ListaTemporalCompraMaterial
    }
  }

  abrirModalTransito(modal: NgbModal, detalle) {
    this.DetalleOrdenCompraMP = [];
    this.DetalleOrdenCompraMP = detalle;

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  abrirModalCalidad(modal:NgbModal,detalle){
      this.DetalleCalidad=[];
      this.DetalleCalidad=detalle;

      this._modalService.open(modal, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        scrollable: true
      });
  }

  get f() {
    return this.filtrosForm.controls;
  }
  
  CargarFamiliaMP(){
    this._commonService.ListarFamiliaMateriaP(this.filtrosForm.controls.tipo.value).subscribe(
     async resp=>{
          this.ListarArraySubFamilia= await resp ;
          this.filtrosForm.get("familiaMP").patchValue('TD');
      },
      catchError => {
        this.messagerNgxTable.emptyMessage = "Ocurrio un error al obtener lista de producto"
      }
    );  
  }

  cambiarlinea(){
    this.filtrosForm.get("linea").valueChanges.subscribe(
        valor=>{    
        }
    )
    this.CargarFamiliaMP();
  }


  exportarExcel(){

    const ConstParametros = {
      Periodo: this.filtrosForm.controls.periodo.value.replace("-", ""),
      Regla: this.filtrosForm.controls.regla.value,
      Agrupador: this.filtrosForm.controls.agrupador.value,
      Familia: this.filtrosForm.controls.familia.value,
      Linea: this.filtrosForm.controls.linea.value,
      FamiliaMP:this.filtrosForm.controls.familiaMP.value,
    }


    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._produccionService.ExportarCompraArima(ConstParametros).subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`CompraArima-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );

  }


  
}
