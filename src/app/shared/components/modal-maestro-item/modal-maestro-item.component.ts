import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RespuestaMaestroItemModel } from '@data/interface/Response/DatosRespuestaMaestroItem.interface';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-maestro-item',
  templateUrl: './modal-maestro-item.component.html',
  styleUrls: ['./modal-maestro-item.component.css']
})
export class ModalMaestroItemComponent implements OnInit {
  @Input() fromParent;
  form:FormGroup;
  ListarArraySubFamilia:ListaFamiliaMaestroItem[]=[];
  Respuesta:RespuestaMaestroItemModel;

  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _GenericoService:GenericoService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.ListarArraySubFamilia=this.fromParent["Familia"];
    this.CrearFormulario(this.fromParent["Codsut"]);
  }

  CrearFormulario(Codsut){
    this.form = new FormGroup({
      codsut: new FormControl(Codsut,[ Validators.required, Validators.minLength(21), Validators.maxLength(21),Validators.pattern("^[a-zA-Z0-9]+$")]),
      familia:  new FormControl(null, Validators.required),
    })
  }

  Guardar(){
    const RequestRegistro={
      ...this.form.value,
      codsut: this.form.controls.codsut.value.toUpperCase()
      
    }

    this._GenericoService.RegistarMaestroItem(RequestRegistro).subscribe(
      (resp:any)=>{
        if(resp["success"]){
            this.Respuesta=resp.content.response;            
            this.Respuesta.respuesta==false  && this.toastr.warning(this.Respuesta.descripcionLocal,this.Respuesta.comentario);

        }
      }
    )
  }
  CerrarModal(){

    this.activeModal.dismiss(this.Respuesta);
}
  
}
