import { Component, Input, OnInit } from '@angular/core';
import { OrdenCompraPrevio } from '@data/interface/Response/OCDrogueria/DatosFormatoOrdenCompraPrevio.interface';
import { ModalOrdenCompraPrevioComponent } from '@shared/components/modal-orden-compra-previo/modal-orden-compra-previo.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-listar-orden-compra-previo',
  templateUrl: './listar-orden-compra-previo.component.html',
  styleUrls: ['./listar-orden-compra-previo.component.css']
})
export class ListarOrdenCompraPrevioComponent implements OnInit {
  @Input() ordenCompraPrevio:OrdenCompraPrevio[]=[];
  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
  }

  verDetalle(ordenCompra){
    const modalRefDetalle = this._modalService.open(ModalOrdenCompraPrevioComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'my-class',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      size: 'xl',
      scrollable: true,
      keyboard: false
    });

    modalRefDetalle.componentInstance.ordenCompra = ordenCompra;
    modalRefDetalle.result.then((result) => {

    }, (reason) => {

    });
  }

}
