import { Component, Input, OnInit } from '@angular/core';
import { DatosFormatoDetalleRecetaMP } from '@data/interface/Response/DatosFormatoDetalleRecetaMP.interface';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-detalle-receta',
  templateUrl: './modal-detalle-receta.component.html',
  styleUrls: ['./modal-detalle-receta.component.css']
})
export class ModalDetalleRecetaComponent implements OnInit {
  @Input() Item;
  @Input() Cantidad;
  ListarDetalleReceta:DatosFormatoDetalleRecetaMP[]=[];
  constructor( public activeModal: NgbActiveModal,
    private _LogisticaService:LogisticaService) { }

  ngOnInit(): void {  
    this.BuscarRecetaDetalle(this.Item,this.Cantidad);
  }

  BuscarRecetaDetalle(Item,Cantidad){
    this._LogisticaService.ListarDetalleReceta(Item, Cantidad).subscribe(
      (resp:any)=>{
          this.ListarDetalleReceta= resp;
      }
  )
  }




}
