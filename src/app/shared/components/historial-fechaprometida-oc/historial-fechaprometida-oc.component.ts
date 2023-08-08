import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input() permiso:boolean;

  listadoHistorialPrometida: HistorialFechaPrometida[] = [];
  form:FormGroup;

  constructor(private _comprobanteOrdenCompraService: ComprobanteOrdenCompraService, public activeModal: NgbActiveModal, private toast: ToastrService) { }

  ngOnInit(): void {
    
    this.crearFormulario();
    this._comprobanteOrdenCompraService.listarFechaPrometida(this.filaNumeroDocumento.numeroOrden, this.filaNumeroDocumento.secuencia, this.filaNumeroDocumento.item)
    .subscribe(
      (resp)=> {
            this.listadoHistorialPrometida = resp;
      }
    )
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
        documento : this.filaNumeroDocumento.numeroOrden,
        secuencia : this.filaNumeroDocumento.secuencia,
        item      :this.filaNumeroDocumento.item
      }

      this._comprobanteOrdenCompraService.registrarFechaPrometida(dato).subscribe(
        (resp:any)=>{

            if(resp["success"]){
                this.toast.success(resp["content"],"Existoso");
                this.activeModal.close();
            }
        }
      )
      console.log(dato);
  }

}
