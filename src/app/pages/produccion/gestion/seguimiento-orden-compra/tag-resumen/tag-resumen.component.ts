import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionItemComponent } from '../modal-informacion-item/modal-informacion-item.component';

@Component({
  selector: 'app-tag-resumen',
  templateUrl: './tag-resumen.component.html',
  styleUrls: ['./tag-resumen.component.css']
})
export class TagResumenComponent implements OnInit {
  @Input() ListarSeguimientoItemOC:any[]=[];
  ListadoOrdenCompra:FormGroup;

  constructor(private _modalService: NgbModal,
            private _fb:FormBuilder,) { }

  ngOnInit(): void {

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
      
    }, (reason) => {
       console.log("salir2", reason)
    });
  }
 
}
