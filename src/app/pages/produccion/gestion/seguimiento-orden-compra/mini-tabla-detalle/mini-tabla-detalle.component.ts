import { Component, Input, OnInit, Output , EventEmitter } from '@angular/core';
import { CalendarioDetalleSeguimiento } from '@data/interface/Response/DatosFormatoDetalleCalendarioSeguimientoOC.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalVisualizarDetalleImportacionComponent } from '../modal-visualizar-detalle-importacion/modal-visualizar-detalle-importacion.component';

@Component({
  selector: 'app-mini-tabla-detalle',
  templateUrl: './mini-tabla-detalle.component.html',
  styleUrls: ['./mini-tabla-detalle.component.css']
})
export class MiniTablaDetalleComponent implements OnInit {

  @Input() ListarDetalleSeguimientoItemOC:CalendarioDetalleSeguimiento[]=[];
  @Input() item:string="";
  @Input() mes:string="";
  @Input() PermisoAcceso:boolean;
  @Output() ItemEvent = new EventEmitter<boolean>();

  TempListarDetalleSeguimientoItemOC:CalendarioDetalleSeguimiento[]=[];
  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.TempListarDetalleSeguimientoItemOC=this.ListarDetalleSeguimientoItemOC;
    this.FiltrarOrdenCompra(this.item,this.mes)
    
  }

  FiltrarOrdenCompra(itemCalendario,mes){
    this.TempListarDetalleSeguimientoItemOC = this.ListarDetalleSeguimientoItemOC.filter((elemento:CalendarioDetalleSeguimiento)=> elemento.item == itemCalendario && elemento.fecha==mes )
  }

  ModalDetalleOrdenCompra(Detalle){
   
    const modalRef = this._modalService.open(ModalVisualizarDetalleImportacionComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'dark-modal',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });

    const Datos={
      Detalle: Detalle,
      Permiso :  this.PermisoAcceso
    }

    modalRef.componentInstance.fromParent = Datos;
    modalRef.result.then((result) => {
          this.SalirModal(result);
    }, (reason) => {
       
    });
    
  }

  SalirModal(respuesta:boolean){
    this.ItemEvent.emit(respuesta);
  }

}
