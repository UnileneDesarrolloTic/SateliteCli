import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentosPendientesFirma } from '@data/interface/Response/FirmaDigital.interface';
import { FirmaDigitalService } from '@data/services/backEnd/pages/firma-digital.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { environment } from "environments/environment";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';
import { ToastrService } from 'ngx-toastr';
import { CryptoService } from '@shared/services/comunes/crypto.service';

@Component({
  selector: 'app-firmar-documento',
  templateUrl: './firmar-documento.component.html',
  styleUrls: ['./firmar-documento.component.css']
})
export class FirmarDocumentoComponent implements OnInit, OnDestroy {

  formFiltro: FormGroup;
  formCertificado: FormGroup;
  subscriptionRuta: Subscription;
  listaDocumetosPendientes: DocumentosPendientesFirma[]
  rutaVistaPrevia: SafeResourceUrl;
  idSolicitud: number = 0;
  listaTiposDocumentos: any[]
  usuarioSession: UsuarioSesionData;
  idsDocumentosSeleccionados: number[] = []
  idDocumentoVistaPrevia: number = 0;
  tipoProcesoFirma: "seleccion"|"documento" = "seleccion";
  ngbModalVistaPrevia: NgbModalRef;
  ngbModalCertificado: NgbModalRef;
  loadingFirmar: boolean = false;
  loadingRechazar: boolean = false;

  private url = environment.urlRespositorioDocumentos + "/FirmaDigital/Pendientes";

  constructor(private _firmaDigitalService: FirmaDigitalService, private _activateRoute: ActivatedRoute, public sanitizer: DomSanitizer, 
    private _modalService: NgbModal, private _genericoService: GenericoService, private _session: SesionService, 
    private _toastr: ToastrService, private _cryptoService: CryptoService) 
  { 
    this.subscriptionRuta = this._activateRoute.params.subscribe(param => this.idSolicitud = Number.parseInt(param['idSolicitud']));
    this.usuarioSession = this._session.datosPersonales()
    this.inicializarFormulario()
  }

  ngOnInit(): void {
    this.obtenerDocumentoFirma()
    this.obtenerTipoDocumentos()
  }

  ngOnDestroy(): void {
    this.subscriptionRuta.unsubscribe();
  }

  inicializarFormulario ()
  {
    this.formFiltro = new FormGroup({
      codigo: new FormControl(''),
      tipoDocumento: new FormControl(0),
      nombre: new FormControl('')
    });

    this.formCertificado = new FormGroup({
      usuario: new FormControl({value: this.usuarioSession.usuario, disabled: true}, Validators.required),
      claveCertificado: new FormControl('', Validators.required)
    });

    this.formFiltro.valueChanges.pipe(debounceTime(500)).subscribe(
      _ => this.obtenerDocumentoFirma()
    )
  }

  obtenerDocumentoFirma()
  {

    let codTipoDocumento: number= 0

    if(this.formFiltro.get('codigo').value != '' && this.formFiltro.get('codigo').value != NaN && this.formFiltro.get('codigo').value != null)
      codTipoDocumento = Number.parseInt(this.formFiltro.get('codigo').value)

    const body = {
      "idSolicitud": this.idSolicitud,
      "tipoDocumento": this.formFiltro.get('tipoDocumento').value,
      "nombre": this.formFiltro.get('nombre').value,
      "codigo": codTipoDocumento
    }

    this.listaDocumetosPendientes = []
    
    this._firmaDigitalService.documentosPendientesFirma(body).subscribe(
      (resp) => this.listaDocumetosPendientes = resp
    );
  }

  obtenerTipoDocumentos()
  {
    this._genericoService.ObtenerConfiguracion(8, 'FD_Licitaciones').subscribe(
      resp => this.listaTiposDocumentos = resp
    )
  }

  firmarSeleccionados(modalCertificado: NgbModal)
  {
    this.tipoProcesoFirma = "seleccion";
    this.idsDocumentosSeleccionados = []
    this.listaDocumetosPendientes.filter(x => x.flagSelect).forEach( x => this.idsDocumentosSeleccionados.push(x.idDocumento));

    if(this.idsDocumentosSeleccionados.length < 1)
    {
      this._toastr.warning("Debe de seleccionar los documentos a firmar", "Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    this.abrirModalCertificado(modalCertificado);
  }

  firmarDocumento(modalCertificado: NgbModal)
  {
    this.tipoProcesoFirma = "documento";
    this.abrirModalCertificado(modalCertificado)
  }

  rechazarDocumento()
  {

    if(this.loadingFirmar){
      this._toastr.warning("Los documentos estan en proceso de firma...", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    if(this.loadingRechazar){
      this._toastr.warning("Los documentos se encuentran en proceso...", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    let idDocumentosRechazar: number[] = []

    if(this.tipoProcesoFirma == 'seleccion')
      idDocumentosRechazar = this.idsDocumentosSeleccionados
      
    if(this.tipoProcesoFirma == 'documento')
      idDocumentosRechazar.push(this.idDocumentoVistaPrevia)

    if(idDocumentosRechazar.length < 1)
    {
      this._toastr.error("Error al obtener el código del documento.", "Error !!", {timeOut: 3000, closeButton: true, progressBar: true});
      return
    }

    this.loadingRechazar = true

    const body = {
      "idSolicitud": this.idSolicitud,
      "idsDocumentos": idDocumentosRechazar
    }

    this._firmaDigitalService.rechazarDocumentos(body).subscribe(
      resp => {
        if(resp['success'] == true)
          this._toastr.success("Se rechazó los documentos correctamente", "Éxito !!", {timeOut: 3000, closeButton: true, progressBar: true});
        else
          this._toastr.success("Error al rechazar los documentos", "Error !!", {timeOut: 3000, closeButton: true, progressBar: true});
        
        this.loadingRechazar = false
      },
      err => this.loadingRechazar = false
    );
  }

  enviarFirmarDocumentos()
  {

    if(this.formCertificado.invalid)
    {
      this._toastr.warning("Los datos del certificado no son correctos", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    if(this.loadingFirmar){
      this._toastr.warning("Los documentos estan en proceso de firma...", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    if(this.loadingRechazar){
      this._toastr.warning("Los documentos se estan procesando..", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    let idDocumentosFirmar: number[] = []

    if(this.tipoProcesoFirma == 'seleccion')
      idDocumentosFirmar = this.idsDocumentosSeleccionados
    if(this.tipoProcesoFirma == 'documento')
      idDocumentosFirmar.push(this.idDocumentoVistaPrevia)

    if(idDocumentosFirmar.length < 1)
    {
      this._toastr.error("Error al obtener el código del documento.", "Error !!", {timeOut: 3000, closeButton: true, progressBar: true});
      return
    }

    this.loadingFirmar = true

    const claveCertificadoCryp =  this._cryptoService.encriptarBack(this.formCertificado.get('claveCertificado').value) // 7TP14VdHnNeqGvKWHRIKEw==

    const body = {
      "idSolicitud": this.idSolicitud,
      "idDocumentos": idDocumentosFirmar,
      "claveCertificado": claveCertificadoCryp //this.formCertificado.get('claveCertificado').value
    }

    this._firmaDigitalService.firmarDocumento(body).subscribe(
      resp => {
        if(resp['success'] == true)
        {
          this._toastr.success('Se ha firmado los documentos', 'Éxito !!', {timeOut: 3000, closeButton: true, progressBar: true})
        }
        else{
          this._toastr.error("Error al firmar los documentos.", "Error !!", {timeOut: 3000, closeButton: true, progressBar: true});
        }
        this._modalService.dismissAll()
        this.loadingFirmar = false
        this.obtenerDocumentoFirma()
      },
      err => this.loadingFirmar = false
    )
    
  }

  cancelar()
  {
    if(this.loadingFirmar){
      this._toastr.warning("Los documentos estan en proceso de firma...", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    if(this.loadingRechazar){
      this._toastr.warning("Los documentos se estan procesando..", "Advertencia", {timeOut: 3000, closeButton: true, progressBar: true})
      return
    }

    this._modalService.dismissAll()
  }

  abrirModalVistaPrevia(modal: NgbModal, nombreArchivo: string, idDocumento: number)
  {
    this.tipoProcesoFirma = "documento";
    this.idDocumentoVistaPrevia = idDocumento

    this.rutaVistaPrevia = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.url}/${this.idSolicitud}/${nombreArchivo}`);;

    this.ngbModalVistaPrevia = this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: false
    });
  }

  abrirModalCertificado(modalCertificado: NgbModal)
  {
    this.formCertificado.patchValue({
      usuario: this.usuarioSession.nombres + ' ' + this.usuarioSession.apellidoPaterno,
      claveCertificado: ""
    });

    this.ngbModalCertificado = this._modalService.open(modalCertificado, {
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });
  }
}
