import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFormatoListadoCompraAguja } from '@data/interface/Response/CompraAguja/DatosFormatoListadoCompraAguja.interface';
import { PedidosAgujas } from '@data/interface/Response/CompraAguja/DatosFormatoListadoPedidoAguja.interface';
import { OCPendientesArima } from '@data/interface/Response/CompraAguja/DatosFormatoOCPendientes.interface';
import { DatosFormatoListadoCantidadTotal } from '@data/interface/Response/CompraAguja/DatosFormatosListadoCantidadTotal.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistorialFechaprometidaOcComponent } from '@shared/components/historial-fechaprometida-oc/historial-fechaprometida-oc.component';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { ModalComentarioArimaComponent } from '@shared/components/modal-comentario-arima/modal-comentario-arima.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-compra-aguja',
  templateUrl: './compra-aguja.component.html',
  styleUrls: ['./compra-aguja.component.css']
})
export class CompraAgujaComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  listadoCompraAguja:DatosFormatoListadoCompraAguja[]=[];
  templistadoCompraAguja:DatosFormatoListadoCompraAguja[]=[];
  listaDettalleCC:OCPendientesArima[]=[];
  cantidadTotal: DatosFormatoListadoCantidadTotal[]=[];
  totalAduanas : number = 0;
  totalDisponible : number = 0;
  totalControlCalidad : number = 0;
  totalPendiente : number = 0;
  flagEspera: boolean = false;
  flagEsperaExcel:boolean=false;
  mostrarmodal:Boolean=false;

  checkMostrarColumna = new FormControl(false);
  textFiltrarAgujas = new FormControl('');
  pedidosAgujas: PedidosAgujas[] =[] 

  itemModal:string = '';
  descripcionModal:string = '';
  tipomodal:string = '';
  flagRegistrarFecha:boolean = true;
  
  constructor(public _ProduccionService: ProduccionService,private _modalService: NgbModal, private _GenericoService: GenericoService,
    private _Cargarbase64Service:Cargarbase64Service, private _toastr: ToastrService, private _fullComponente: FullComponent) { 
        this._fullComponente.options.sidebartype = 'mini-sidebar';
    }

  ngOnInit(): void {
    this.listadoComprasAguja();
    this.isObservableFiltro();
    this.permisoColumnaTransito();
  }


  listadoComprasAguja(){
    this.listadoCompraAguja = [];
    this.templistadoCompraAguja = [];
    this.flagEspera = true;
    this._ProduccionService.listarSeguimientoCompraAguja().subscribe(
      (resp:any)=>{
             
            this.listadoCompraAguja = resp["detalleInformacionAguja"];
            this.templistadoCompraAguja = resp["detalleInformacionAguja"];
            this.calcularTotal(resp["total"])
            this.flagEspera = false;
      },
      _=> this.flagEspera = false
    );
  }

  isObservableFiltro(){
    this.textFiltrarAgujas.valueChanges.pipe(debounceTime(900)).subscribe(valorBusqueda=>{
          this.filtrar(valorBusqueda);
    })
  }

  filtrar(valorBusqueda){
    const inputText = valorBusqueda.toLowerCase().trim();
    this.listadoCompraAguja = this.templistadoCompraAguja.filter(element => element.itemFinal.toLowerCase().indexOf(inputText) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(inputText) !== -1 );
    // this.listarItemDrogueria = this.templistarItemDrogueria.filter(element => element.item.toLowerCase().indexOf(inputText) !== -1 || element.descProveedor?.toLowerCase().indexOf(inputText) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(inputText) !== -1);
  }


  exportarExcel() {
    this.flagEsperaExcel=true;
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._ProduccionService.exportarSeguimientoCompraAguja(this.checkMostrarColumna.value).subscribe(
      (resp:any)=>{
        if(resp.success){
          this._Cargarbase64Service.file(resp.content,`CompraAguja-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this._toastr.info(resp.message);
        }
        this.flagEsperaExcel=false;
      },
      error=> {
            ModalCarga.close();
            this.flagEsperaExcel=false;
      }
    );
  }


  abrirModalMostrarOC(modal: NgbModal,item:string, tipo:string , descripcion : string ){  

  this.itemModal = item;
  this.descripcionModal = descripcion;
  this.tipomodal = tipo;
  this._modalService.open(modal, {
    centered: true,
    windowClass: 'my-class',
    backdrop: 'static',
    size: 'lg',
    scrollable: true
  });

  this._ProduccionService.mostrarOrdenCompraArima(item,tipo).subscribe(
    (resp:any) => {
      if(resp["success"]){
        this.listaDettalleCC=resp["content"];
      }else{
        this.listaDettalleCC=[];
      }
    }
  )
   
  }


  calcularTotal(cantidadTotales:DatosFormatoListadoCantidadTotal[]){
    cantidadTotales.forEach((element:DatosFormatoListadoCantidadTotal) => {
          if(element.tipoBanner == "Aduanas"){
              this.totalAduanas = element.cantidad;
          }else if(element.tipoBanner == "Disponible"){
              this.totalDisponible = element.cantidad;
          }else if(element.tipoBanner == "ControlCalidad"){
              this.totalControlCalidad = element.cantidad;
          }else {
              this.totalPendiente = element.cantidad;
          }
    });
  }


  mostrarCantidad(){
    this.mostrarmodal=true;
    this.tableRowClicked();
  }

  tableRowClicked() {
    (document.getElementById('rightMenu') as HTMLFormElement).style.width = '300px';
  }

  cancelClick(){
    this.mostrarmodal=false;
    (document.getElementById('rightMenu') as HTMLFormElement).style.width = '0';
  }


  historialFechaPrometida(fila:OCPendientesArima){
    const ModalFechaPrometida = this._modalService.open(HistorialFechaprometidaOcComponent, {
      centered: true,
      backdrop: 'static',
      // windowClass: 'my-class',
      size: 'lg',
      scrollable: true
    });

    ModalFechaPrometida.componentInstance.filaNumeroDocumento = fila;
    ModalFechaPrometida.result.then((result) => {
      this._ProduccionService.mostrarOrdenCompraArima(fila.item,'Aprobados').subscribe(
        (resp:any) => {
          if(resp["success"]){
            this.listaDettalleCC=resp["content"];
          }else{
          }
        }
      )
    }, (refrescado) => {
    });
  }



  getRowClass = (row:DatosFormatoListadoCompraAguja) => {
    if (row.idGestion == 0)
    {
       return {'row-color-gestioncompra': true  };
    }

    if (row.idGestion == 1)
    {
      return {'row-color-nocomprar': true};
    }

    if (row.idGestion == 2)
    {
      return {'row-color-comercial': true};
    }
  }


  abrirModalPedidos(modal: NgbModal,item:string, descripcion:string){
    this.itemModal = item;
    this.descripcionModal = descripcion;
    this._modalService.open(modal, {
      centered: true,
      windowClass: 'my-class',
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  
    this._ProduccionService.informacionPedidos(item).subscribe(
      (resp:any) => {
        this.pedidosAgujas = resp;
      }
    );
  }

  permisoColumnaTransito(){
    this._GenericoService.AccesosPermiso('BTN004').subscribe(
      (resp:any)=>{
          if(resp["success"])
              this.flagRegistrarFecha = resp["content"];
          else
              this.flagRegistrarFecha = false;
      }
    )
  }


  modalComentario(fila:OCPendientesArima){
    const ModalComentario = this._modalService.open(ModalComentarioArimaComponent, {
      centered: true,
      backdrop: 'static',
      // windowClass: 'my-class',
      size: 'lg',
      scrollable: true
    });

    ModalComentario.componentInstance.filaNumeroDocumento = fila;
    ModalComentario.result.then((result) => {
    
    }, (refrescado) => {
    });
  }



}
