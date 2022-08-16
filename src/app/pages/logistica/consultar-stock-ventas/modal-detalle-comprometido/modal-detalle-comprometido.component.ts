import { Component, Input, OnInit } from '@angular/core';
import { DatosFormatoItemComprometido } from '@data/interface/Response/DatosFormatoDetalleItemComprometido.interfaces';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-detalle-comprometido',
  templateUrl: './modal-detalle-comprometido.component.html',
  styleUrls: ['./modal-detalle-comprometido.component.css']
})
export class ModalDetalleComprometidoComponent implements OnInit {

  @Input() fromParent;
  ListarComprometido:DatosFormatoItemComprometido[]=[];
  constructor(public activeModal: NgbActiveModal,
              private _LogisticaService: LogisticaService) { }


  ngOnInit(): void {
    this.DetalleComprometido(this.fromParent)
  }

  DetalleComprometido(row){
    this._LogisticaService.DetalleComprometidoItem(row).subscribe(
        (resp:any)=>{
            this.ListarComprometido=resp;
        }
    )
  }

}
