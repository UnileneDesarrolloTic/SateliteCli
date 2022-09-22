import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private claveEncryp = environment.secretKeyEncryption;
  
  constructor(private cryptoService: CryptoService, private router:Router) { }


  datosPersonales(): UsuarioSesionData{

    try {
      var  datos: UsuarioSesionData = {
        codUsuario: 0,
        usuario: "",
        nombres: "",
        apellidoPaterno: "",
        correo:"",
        token: ""
      }

      datos = JSON.parse(this.cryptoService.desencriptar(localStorage.getItem('datos'), this.claveEncryp));     
      
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
