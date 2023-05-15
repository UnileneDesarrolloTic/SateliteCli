import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-guias',
  templateUrl: './gestion-guias.component.html'
})
export class GestionGuiasComponent {

  @ViewChild('guiaCodeBarOutput') guiaCodeBarOutputElement: ElementRef;
  @ViewChild('guiaCodeBarInput') guiaCodeBarInputElement: ElementRef;
  numeroDocumentoInput: string = "";
  numeroDocumentoOutput: string = "";

  datosGuiaInput: any = {
    "guiaNumero":"",
    "destinatario":"",
    "factura":"",
    "fechaDocumento": new Date()
  };

  datosGuiaOutput: any = {
    "guiaNumero":"",
    "destinatario":"",
    "factura":"",
    "fechaDocumento": new Date()
  };

  mensajeAdvertenciaInput: string;
  mensajeAdvertenciaOutput: string;

  flagAdvertenciaInput: boolean = false;
  flagAdvertenciaOutput: boolean = false;
 
  flagSpinnerInput: boolean = false;
  flagSpinnerOutput: boolean = false;

  constructor(private _comercialService:ComercialService, private _toastr: ToastrService) { }

  registrarRecepcionGuia(tipoRegistro: string)
  {
    let tipoDocumento = "";
    
    if(this.flagSpinnerInput || this.flagSpinnerOutput)
    {
      this._toastr.warning("Estamos procesando el documento...", "Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }
      
    if(tipoRegistro == 'I')
    {
      
      if(this.numeroDocumentoInput == undefined || this.numeroDocumentoInput == null || this.numeroDocumentoInput.trim() == "")
      {
        this._toastr.warning("El código del documento no es válido.", "Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
        return
      }

      if(!this.numeroDocumentoInput.includes('-') || this.numeroDocumentoInput.substring(0,1).toUpperCase() != 'T' )
      {
        this._toastr.warning("El código del documento no es válido.", "Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
        return
      }
      tipoDocumento = this.numeroDocumentoInput
    }

    if(tipoRegistro == 'O')
    {
      
      if(this.numeroDocumentoOutput == undefined || this.numeroDocumentoOutput == null || this.numeroDocumentoOutput.trim() == "")
      {
        this._toastr.warning("El código del documento no es válido.", "Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
        return
      }

      if(!this.numeroDocumentoOutput.includes('-') || this.numeroDocumentoOutput.substring(0,1).toUpperCase() != 'T' )
      {
        this._toastr.warning("El código del documento no es válido.", "Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
        return
      }

      tipoDocumento = this.numeroDocumentoOutput
    }

    
    this.flagSpinnerInput = true;
    this.flagSpinnerOutput = true;

    this._comercialService.RegistrarRecepcionGuia(tipoDocumento, tipoRegistro).subscribe(
      (resp: any)=>
      {        
        if(resp['success'] === true)
        {
          if(tipoRegistro == 'I')
          {
            this.flagAdvertenciaInput = false;
            this.datosGuiaInput = resp['content']['value']

            this.guiaCodeBarInputElement.nativeElement.select()
            this.guiaCodeBarInputElement.nativeElement.focus()
          }

          if(tipoRegistro == 'O')
          {
            this.flagAdvertenciaOutput = false;
            this.datosGuiaOutput = resp['content']['value']

            this.guiaCodeBarOutputElement.nativeElement.select()
            this.guiaCodeBarOutputElement.nativeElement.focus()
          }
        }
        else
        {
          if(tipoRegistro == 'I')
          {
            this.flagAdvertenciaInput = true;
            this.mensajeAdvertenciaInput = resp['message'];
            this.guiaCodeBarInputElement.nativeElement.select()
            this.guiaCodeBarInputElement.nativeElement.focus()
          }
          if(tipoRegistro == 'O')
          {
            this.flagAdvertenciaOutput = true;
            this.mensajeAdvertenciaOutput = resp['message'];
            this.guiaCodeBarOutputElement.nativeElement.select()
            this.guiaCodeBarOutputElement.nativeElement.focus()
          }
        }
        this.flagSpinnerInput = false;
        this.flagSpinnerOutput = false;
      }, err => 
      {
        if(tipoRegistro == 'O')
        {
          this.guiaCodeBarOutputElement.nativeElement.select()
          this.guiaCodeBarOutputElement.nativeElement.focus()
        }
        if(tipoRegistro == 'I')
        {
          this.guiaCodeBarInputElement.nativeElement.select()
          this.guiaCodeBarInputElement.nativeElement.focus()
        }

        this.flagSpinnerInput = false;
        this.flagSpinnerOutput = false;
      }
    );
  }

  

}
