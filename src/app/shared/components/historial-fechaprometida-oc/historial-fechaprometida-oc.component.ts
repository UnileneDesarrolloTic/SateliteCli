import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosDetalleOrdenCompra } from '@data/interface/Response/ComprobanteOrdenCompra/DatosDetalleOrdenCompra.interfaces';
import { HistorialFechaPrometida } from '@data/interface/Response/ComprobanteOrdenCompra/DatosHistorialFechaPrometida.interface';
import { ComprobanteOrdenCompraService } from '@data/services/backEnd/pages/comprobante-orden-compra.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historial-fechaprometida-oc',
  templateUrl: './historial-fechaprometida-oc.component.html',
  styleUrls: ['./historial-fechaprometida-oc.component.css']
})
export class HistorialFechaprometidaOcComponent implements OnInit {
  @Input() filaNumeroDocumento:any;
  detalleOrdenCompra: DatosDetalleOrdenCompra[] = [];
  form:FormGroup;
  maestroSeleccion: boolean = false;
  seleccionDetalle: DatosDetalleOrdenCompra[] = [];
  

  constructor(private _comprobanteOrdenCompraService: ComprobanteOrdenCompraService, public activeModal: NgbActiveModal, private toast: ToastrService) { }

  ngOnInit(): void {

    this.crearFormulario();
    this.listadoDetalleOC(this.filaNumeroDocumento.numeroOrden, this.filaNumeroDocumento.item, this.filaNumeroDocumento.secuencia);
  }

  crearFormulario(){
      this.form = new FormGroup({
          prometida   : new FormControl(null,Validators.required),
          comentario  : new FormControl(null,Validators.required)
      })
  } 


  registrarFechaPrometida(){
      const dato = 
      {
        ...this.form.value,
        ordenCompra : this.filaNumeroDocumento.numeroOrden,
        secuencia : this.filaNumeroDocumento.secuencia,
        item      : this.filaNumeroDocumento.item,
        detalle   : this.detalleOrdenCompra.filter((itemfila:DatosDetalleOrdenCompra) => itemfila.seleccionar ==  true)
      }

      this._comprobanteOrdenCompraService.registrarFechaPrometida(dato).subscribe(
        (resp:any)=>{

            if(resp["success"]){
                this.toast.success(resp["content"],"Existoso");
                this.activeModal.close();
            }
        }
      )
  }

  listadoDetalleOC(ordenCompra, item, secuencia){
    this._comprobanteOrdenCompraService.listadoDetalle(ordenCompra,item, secuencia).subscribe(
      (resp:any)=>{
          this.detalleOrdenCompra = resp;
      }
    );
  }

  checkTodo() {
    this.detalleOrdenCompra = this.detalleOrdenCompra.map((filaElemento:DatosDetalleOrdenCompra)=> ({ ...filaElemento, seleccionar: this.maestroSeleccion }));  
  }

  seleccionaItem(rowItem:DatosDetalleOrdenCompra){
    this.seleccionDetalle=[];
    
    this.detalleOrdenCompra.forEach((fila:DatosDetalleOrdenCompra)=>{
            if(fila.item == rowItem.item && fila.secuencia == rowItem.secuencia)
            {
                fila.seleccionar == rowItem.seleccionar
            }
    });
  }
}
