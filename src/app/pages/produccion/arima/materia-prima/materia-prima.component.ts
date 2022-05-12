import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-materia-prima',
  templateUrl: './materia-prima.component.html'
})
export class MateriaPrimaComponent {

  listaCandidatos: any[]
  dataCompleta: any[]
  listaCompletaOCPendientes: any[]
  listaDettalleOC: any[]
  listaDettalleCC: any[]
  itemModal: string = ""
  descripcionModal: string = ""
  flagLoading: boolean =  false
  formularioFiltro: FormGroup

  TotalAduanas:number=0;
  TotalPendiente:number=0;
  TotalControlCalidad:number=0;
  TotalDisponible:number=0;
  TotalCantidadCC:number=0;
  ColumnaOcultas:boolean;
  
  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado candidatos para este filtro',
    'totalMessage': 'Candidatos'
  }

  constructor(private _pronosticoService: ProduccionService, 
              private _modalService: NgbModal, 
              private _fb: FormBuilder) {
    this.MostrarColumnaMateriaPrima();
    this.crearFormulario()
    this.obtenerListaCandidatosMP()
    
  }

  crearFormulario(){
    this.formularioFiltro =  this._fb.group({
      regla: ['', Validators.required],
      textFilter: ['']
    })

    this.formularioFiltro.reset({
      regla: 'MPAGAR1',
      textFilter: ''
    })
  }

  MostrarColumnaMateriaPrima(){
    this._pronosticoService.MostrarColumna().subscribe(
        (resp:any)=>{
            this.ColumnaOcultas=resp.content.permisoColumna;
        }
    )
      
  }

  obtenerListaCandidatosMP(){
    this.flagLoading =  true
    this.listaCandidatos = []
    this.dataCompleta = []
    this.messagerNgxTable.emptyMessage = 'No se ha encontrado candidatos para este filtro'
    let regla = this.formularioFiltro.get('regla').value

    this._pronosticoService.ListSeguimientoCandidatosMateriaPrima(regla).subscribe(
      (resp:any) => {
        this.listaCandidatos = resp['seguimientoCandidatosMPA']
        this.dataCompleta = resp['seguimientoCandidatosMPA']
        this.listaCompletaOCPendientes = resp['ordenComprasPendientes']
        this.filtroCandidato();
        this.flagLoading = false;
        this.calcularTotal(resp["detalleTotalesProducto"]);
        
      },
      catchError => {
        this.messagerNgxTable.emptyMessage = 'Ocurrio un error al obtener los candidatos'
      }
    )
  }

  filtroCandidato(){
    this.listaCandidatos = []
    let texto =  this.formularioFiltro.get('textFilter').value.toLowerCase()

    if(texto == '')
      this.listaCandidatos = this.dataCompleta
    else
      this.listaCandidatos = this.dataCompleta.filter( x => x['item'].toLowerCase().indexOf(texto) !== -1 || x['descripcion'].toLowerCase().indexOf(texto) !== -1)
  }

  getPendienteOrdenComprar(item: string): boolean{
    return this.listaCompletaOCPendientes.filter(x => x['item'] == item && x['pendienteOC'] > 0).length > 0
  }

  getTransitoCC(item: string): boolean{
    return this.listaCompletaOCPendientes.filter(x => x['item'] == item && x['almacen'] == 'CONTRCALID').length > 0
  }

  getTransitoAduana(item: string): boolean{
    return this.listaCompletaOCPendientes.filter(x => x['item'] == item && x['almacen'] == 'TRANSITO' && x['cantidadRecibida'] > 0).length > 0
  }

  abrirModalTransito(modal: NgbModal, item, filtro, descripcion){

    this.listaDettalleOC = []
    this.itemModal = item
    this.descripcionModal = descripcion

    if (filtro == 'pendienteOC')
      this.listaDettalleOC = this.listaCompletaOCPendientes.filter(x => x['item'] == item && x['pendienteOC'] > 0)
    if (filtro == 'transporteCC')
      this.listaDettalleOC = this.listaCompletaOCPendientes.filter(x => x['item'] == item && x['almacen'] == 'CONTRCALID')
    if(filtro == 'aduanas')
      this.listaDettalleOC = this.listaCompletaOCPendientes.filter(x => x['item'] == item && x['almacen'] == 'TRANSITO')

    if (filtro == 'pendienteOC'){
      this._modalService.open(modal, {
        centered: true,
        backdrop: 'static',
        size: 'xl',
        scrollable: true
      });
    }
    else {
      this.ObtenerOrdenCompra(item)
      this._modalService.open(modal, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        scrollable: false
      });
    }
  }

  ObtenerOrdenCompra(item){
    this._pronosticoService.DetalleControlCalidadMP(item).subscribe(
      (resp:any) => {
         this.TotalCantidadCC=0;
         this.listaDettalleCC=resp;
         this.listaDettalleCC.forEach(element=> this.TotalCantidadCC = this.TotalCantidadCC + element.cantidad)
        
      },
      catchError => {
        this.messagerNgxTable.emptyMessage = 'Ocurrio un error al obtener los candidatos'
      }
    )
  }

  calcularTotal(ProductoAlmacen){
        ProductoAlmacen.forEach((element:any) => {
              if(element.nombreTotal=="ADUANAS"){
                  this.TotalAduanas=element.cantidad;
              }else if(element.nombreTotal=="STOCKACTUAL"){
                  this.TotalDisponible=element.cantidad;
              }else if(element.nombreTotal=="CALIDAD"){
                  this.TotalControlCalidad=element.cantidad;
              }else {
                  this.TotalPendiente  = element.cantidad;
              }
        });
  }

}


