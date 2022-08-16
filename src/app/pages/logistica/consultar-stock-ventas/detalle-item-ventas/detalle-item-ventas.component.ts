import { Component, Input, OnInit } from '@angular/core';
import { DetalleAlmacenLoteModel } from '@data/interface/Response/DatosFormatosItem.interface';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-item-ventas',
  templateUrl: './detalle-item-ventas.component.html',
  styleUrls: ['./detalle-item-ventas.component.css']
})
export class DetalleItemVentasComponent implements OnInit {

  ListarDetalleItem:DetalleAlmacenLoteModel[]=[];
  @Input() fromParent;

  constructor(public activeModal: NgbActiveModal,
              private _LogisticaService: LogisticaService) { }

  ngOnInit(): void {
    this._LogisticaService.BuscarItemVentas(this.fromParent.item).subscribe(
      (resp:any)=>{
        this.ListarDetalleItem=resp;
      }
    )
  }

}
