import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registrar-editar',
  templateUrl: './registrar-editar.component.html',
  styleUrls: ['./registrar-editar.component.css']
})
export class RegistrarEditarComponent implements OnInit {

  @Input() Interfaz:string;
  @Input() data:any;
  FormFormulario:FormGroup
  constructor(public activeModal: NgbActiveModal,
              private _toastrService: ToastrService) { }

  ngOnInit(): void {
    console.log(this.Interfaz,this.data);
    this.Formulario();
  }

  Formulario(){
    this.FormFormulario = new FormGroup({
      codigo : new FormControl(),
      nombreDocumento : new FormControl(),
      tipoDocumento : new FormControl(),
      version : new FormControl(),
      fechapublicacion : new FormControl(),
      fecharevision : new FormControl(),
      estado : new FormControl(),
    });
  }

  Guardar(){

  }
}
