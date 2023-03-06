import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { OrdenCompraVencidas } from '@data/interface/Response/OCDrogueria/DatosFormatoOrdenCompraVencidas.interfaces';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-oc-vencidas',
  templateUrl: './modal-oc-vencidas.component.html',
  styleUrls: ['./modal-oc-vencidas.component.css']
})
export class ModalOcVencidasComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, public _ProduccionService:ProduccionService) { }
  formFiltro:FormGroup;
  mostrarOrdenCompra:OrdenCompraVencidas[]=[];

  ngOnInit(): void {
    this.listarOrdenCompraVencidas();
  }

  listarOrdenCompraVencidas(){
      this._ProduccionService.ordenCompraVencidas().subscribe(
          (resp:any)=>{
              this.mostrarOrdenCompra=resp; 
          }
      )
  }

}
