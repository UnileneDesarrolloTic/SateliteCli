import { SesionService } from '@shared/services/comunes/sesion.service';
import { Pais } from '@data/interface/Request/Pais.interface';
import { TipoDocumentoIdentidad } from '@data/interface/Request/TipoDocumentoIdentidad.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioData } from '@data/interface/Request/Usuario.interface';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  formulario: FormGroup;
  tiposDocumentos: TipoDocumentoIdentidad[];
  paises: Pais[];

  constructor(private _fb: FormBuilder,
        private _usuarioService: UsuarioService,
        private _genericoService: GenericoService,
        private _sesionUsuario: SesionService,
        private toastr: ToastrService
        ) {
    this.crearFormulario()
   }

  crearFormulario(){
    this.formulario = this._fb.group({
      nombre: [{value: "", disabled: true}, [Validators.required]],
      apellidoPaterno: [{value: "", disabled: true}, [Validators.required]],
      apellidoMaterno: [{value: "", disabled: true}, [Validators.required]],
      sexo: [{value: "M", disabled: true}, [Validators.required]],
      tipoDocumento: [{value: 1, disabled: true}, [Validators.required]],
      nroDocumento: [{value: "", disabled: true}, [Validators.required]],
      correo: [{value: "", disabled: true}, [Validators.required]],
      estado: [{value: "A", disabled: true}, [Validators.required]],
      pais: [{value: 51, disabled: true}, [Validators.required]],
      celular: [{value: "", disabled: true}, [Validators.required]],
      fechaNacimiento: [{value: "", disabled: true}, [Validators.required]],
    });
  }

  obtenerUsuario(){

    let usuario =  this._sesionUsuario.datosPersonales();

    const body = {
      IdUsuario: usuario.codUsuario,
      Apellido: usuario.apellidoPaterno
    }

    this._usuarioService.obtenerUsuarioDetalle(body).subscribe((resp: UsuarioData) => {
      if(resp['success']){
        this.formulario.reset(resp['content'])
      }else{
        this.toastr.error(resp['message'], 'Éxito!', {closeButton:true});
      }
    })

  }

  obtenerListaTipoDocumento(){
    this._genericoService.listarTipoDocumentoIdentidad().subscribe(resp => this.tiposDocumentos = resp)
  }

  obtenerListaPaises(){
    this._genericoService.listarPaises().subscribe( resp => this.paises = resp )
  }

  ngOnInit(): void {
    this.obtenerListaTipoDocumento()
    this.obtenerListaPaises()
    this.obtenerUsuario()
  }

}
