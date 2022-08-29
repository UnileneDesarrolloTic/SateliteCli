import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarioCabeceraSeguimiento } from '@data/interface/Response/DatosFormatoCabeceraCalendarioSeguimiento.interfaces';
import { CalendarioDetalleSeguimiento } from '@data/interface/Response/DatosFormatoDetalleCalendarioSeguimientoOC.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionItemComponent } from '../modal-informacion-item/modal-informacion-item.component';

@Component({
  selector: 'app-tag-resumen',
  templateUrl: './tag-resumen.component.html',
  styleUrls: ['./tag-resumen.component.css']
})
export class TagResumenComponent implements OnInit {
  @Input() ListarSeguimientoItemOC:CalendarioCabeceraSeguimiento[]=[];
  @Input() ListarDetalleSeguimientoItemOC:CalendarioDetalleSeguimiento[]=[];
  @Output() ItemEventMinitabla = new EventEmitter<boolean>();
  ListadoOrdenCompra:FormGroup;

  constructor(private _modalService: NgbModal,
              private _fb:FormBuilder,) { }

  ngOnInit(): void {
    console.log("refrescar");
  }


  AbrirModalItem(item){
    const modalRef = this._modalService.open(ModalInformacionItemComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'dark-modal',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });

    modalRef.componentInstance.fromParent = item;
    modalRef.result.then((result) => {
      this.SalirModalMinitabla(result)
    }, (reason) => {
       console.log("salir2", reason)
    });
  }

  SalirModalMinitabla(valor){
      this.ItemEventMinitabla.emit(valor)
  }

  FiltrarOrdenCompra(itemCalendario,mes){
      return  this.ListarDetalleSeguimientoItemOC.filter((elemento:CalendarioDetalleSeguimiento)=> elemento.item == itemCalendario && elemento.fecha==mes )
  }
 
}
