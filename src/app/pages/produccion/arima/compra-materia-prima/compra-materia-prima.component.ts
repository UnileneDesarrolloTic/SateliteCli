import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { ComprasMateriaPrimaArima } from '@data/interface/Response/CompraMateriaPrimaArima';
import { DetalleOrdenCompraMP } from '@data/interface/Response/DetalleordenCompraMPArima';
import { SubFamilia } from '@data/interface/Response/SubFamilia.Interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-compra-mprima',
  templateUrl: './compra-materia-prima.component.html'
})
export class CompraMateriaPrimaComponent implements OnInit {
  filtrosForm: FormGroup;
  ListaCompraMaterial: ComprasMateriaPrimaArima[] = [];
  ListaTemporalCompraMaterial: ComprasMateriaPrimaArima[] = [];
  DetalleOrdenCompraMP: DetalleOrdenCompraMP[];
  ListarArraySubFamilia:SubFamilia[]=[];
  flagLoading: boolean = false;
  DisabledCampo:boolean=false;
  pagina: number = 0


  private _periodoActual = new Date().toISOString().substring(0, 7)
  periodoCtrl = new FormControl(this._periodoActual);
  textFilterCtrl = new FormControl('');
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


  constructor(private _modalService: NgbModal, private _fb: FormBuilder, private _produccionService: ProduccionService, private _commonService: GenericoService ) {
    this.inicializarFormulario();
    this.instanciarObservadoresFilter();
    this.listarFamiliaMateriaPrima();
  }



  ngOnInit(): void {    
    this.BuscarProducto();
    
  }

  


  inicializarFormulario() {
    this.filtrosForm = this._fb.group({
      periodo: [new Date().toISOString().substring(0, 7), Validators.required],
      regla: ["TD", Validators.required],
      agrupador: ["TD", Validators.required],
      familia: ["TD", Validators.required],
      familiaMP:["TD",Validators.required],
      linea: ["MI"],
      FiltrarAlerta: [{ value: "TD", disabled: true }]
    })

    this.filtrosForm.reset({
      periodo: new Date().toISOString().substring(0, 7),
      regla: 'TD',
      agrupador: 'TD',
      familia: 'TD',
      familiaMP:"TD",
      linea: 'MI',
      FiltrarAlerta: "TD"
    })
  }


  
  filtroItem() {
    if (this.textFilterCtrl.value != '') {
      const TextFiltro = this.textFilterCtrl.value.toLowerCase();
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
    // vamos a quitarle  el - a la fecha
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
        this.flagLoading = false
        if(parametros.periodo==this._periodoActual.replace("-","")){
          this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
          this.filtrosForm.controls['FiltrarAlerta'].enable();
        }
       
        // this.CambiodeFiltroSubfamilia("");
      },
      catchError => {
        this.messagerNgxTable.emptyMessage = "Ocurrio un error al obtener lista de producto"
      }
    )
  }

  listarFamiliaMateriaPrima(){
    this._commonService.ListarFamiliaMateriaP().subscribe(
        resp=>{
            this.ListarArraySubFamilia=resp;
            this.ListarArraySubFamilia.push({codigo:"TD",valor1:"TODOS"});
            
        },
        catchError => {
          this.messagerNgxTable.emptyMessage = "Ocurrio un error al obtener lista de producto"
        }
    );
  }



  instanciarObservadoresFilter() {
    this.flagLoading = true;

    this.filtrosForm.get("periodo").valueChanges.subscribe( valor => {
      if(valor==this._periodoActual){
        this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
        this.filtrosForm.controls['FiltrarAlerta'].enable();
      }else{
        this.filtrosForm.controls['FiltrarAlerta'].setValue('TD');
        this.filtrosForm.controls['FiltrarAlerta'].disable();
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
    this.DetalleOrdenCompraMP = []
    this.DetalleOrdenCompraMP = detalle

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }



  // Getter method to access formcontrols
  get f() {
    return this.filtrosForm.controls;
  }



}
