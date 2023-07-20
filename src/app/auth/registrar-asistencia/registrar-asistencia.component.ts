import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegitroAsistenciaService } from '@data/services/backEnd/pages/registro-asistencia.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registrar-asistencia',
  templateUrl: './registrar-asistencia.component.html',
  styleUrls: ['./registrar-asistencia.component.css']
})
export class RegistrarAsistenciaComponent implements OnInit {

  formRegistro:FormGroup;
  ip:string = '';
  mostrarMensaje:boolean;
  mensaje:string = '';
  constructor(private _RegitroAsistenciaService: RegitroAsistenciaService, private _toasr:ToastrService) { }

  ngOnInit(): void {
   // this.obtenerProcotoloInternet();
    this.crearFormulario();
    
  }

  crearFormulario(){
    this.formRegistro = new FormGroup({
      numeroDocumento: new FormControl('',[ Validators.required, Validators.minLength(8)]),
    });
  }

  registroAsistencia(){
    this._RegitroAsistenciaService.registrarAsistencia(this.formRegistro.controls.numeroDocumento.value).subscribe(
      (resp:any)=>{
          if(resp["success"])
          {
            this._toasr.success(resp["message"], "Guardado !!", { timeOut: 3000, closeButton: true, messageClass:'font-medium' });
          }
          else
          {
            this._toasr.info(resp["message"], "Información !!", { timeOut: 4500, closeButton: true, messageClass:'font-medium' });
          }
      }
    );
  }

}
