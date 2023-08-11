import { Component, Input, OnInit } from '@angular/core';
import { ComprobanteOrdenCompraService } from '@data/services/backEnd/pages/comprobante-orden-compra.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HistorialFechaprometidaOcComponent } from '../historial-fechaprometida-oc/historial-fechaprometida-oc.component';

@Component({
  selector: 'app-modal-comentario-arima',
  templateUrl: './modal-comentario-arima.component.html',
  styleUrls: ['./modal-comentario-arima.component.css']
})
export class ModalComentarioArimaComponent implements OnInit {
  @Input() filaNumeroDocumento:any;
  listadoHistorialPrometida: HistorialFechaprometidaOcComponent[] = [];
  constructor(private _comprobanteOrdenCompraService: ComprobanteOrdenCompraService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this._comprobanteOrdenCompraService.listarFechaPrometida(this.filaNumeroDocumento.numeroOrden, this.filaNumeroDocumento.secuencia, this.filaNumeroDocumento.item)
    .subscribe(
      (resp)=> {
            this.listadoHistorialPrometida = resp;
      }
    )
  }

}
