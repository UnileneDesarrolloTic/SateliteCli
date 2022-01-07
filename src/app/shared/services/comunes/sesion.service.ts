import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private cryptoService: CryptoService, private router:Router) { }


  datosPersonales(): UsuarioSesionData{

    try {
      var  datos: UsuarioSesionData = {
        codUsuario: 0,
        nombres: "",
        apellidoPaterno: "",
        correo:"",
        token: ""
      }

      datos = JSON.parse(this.cryptoService.desencriptar(localStorage.getItem('datos')));
      return datos;
    }
    catch (error) {
      localStorage.clear();
      this.router.navigate(['authentication/login']);
    }
  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(['authentication/login'])
  }

}
