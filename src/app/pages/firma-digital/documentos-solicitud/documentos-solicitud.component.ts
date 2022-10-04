import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentoSolicitud, TipoDocumento } from '@data/interface/Response/FirmaDigital.interface';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';
import { FirmaDigitalService } from '@data/services/backEnd/pages/firma-digital.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documentos-solicitud',
  templateUrl: './documentos-solicitud.component.html',
  styleUrls: ['./documentos-solicitud.component.css']
})
export class DocumentosSolicitudComponent implements OnInit, OnDestroy {

  formSolicitud: FormGroup;
  subscriptionRuta: Subscription;
  idSolicitud: number = 0;
  documetosSolicitud : DocumentoSolicitud[];
  validacionParaIconoFormatos: string = "-application/pdf-";
  usuarioSesion: UsuarioSesionData;
  filesSelect: Blob[] = [];
  tipoDoc: string = ""
  tiposDocumentos: TipoDocumento[] = []
  formatoDocumentoRequerido: string = ""
  loadingArchivos: boolean = false
  

  constructor( private _toast: ToastrService, private _activateRoute: ActivatedRoute, private _firmaDigitalService: FirmaDigitalService, 
    private _sesionService: SesionService, private _fileService: FileService, private _modalService: NgbModal) 
  { 
    this.usuarioSesion  = this._sesionService.datosPersonales();
    this.subscriptionRuta = this._activateRoute.params.subscribe(param => this.idSolicitud = param['idSolicitud']);
  }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.obtenerDetalleSolicitud(this.idSolicitud);
    this.obtenerDocumentosSolicitud(this.idSolicitud);    
  }

  ngOnDestroy(): void {
    this.subscriptionRuta.unsubscribe();
  }

  inicializarFormularios()
  {
    this.formSolicitud =  new FormGroup(
      {
        flujo: new FormControl({value: "", disabled: true}),
        estado: new FormControl({value: "", disabled: true}),
        asunto: new FormControl({value: "", disabled: true}),
        fecha: new FormControl({value: "", disabled: true}),
        usuario: new FormControl({value: "", disabled: true}),
        grupoDocumentos: new FormControl({value: "", disabled: true})
      }
    );
  }

  obtenerDetalleSolicitud(idSolicitud: number)
  {
    this._firmaDigitalService.obtenerDetalleSolicituPorId(idSolicitud).subscribe(
      response => {
        this.formSolicitud.patchValue({
          ...response['content'],
          fecha: response['content']['fecha'].substring(0, 10)
        })        
      }
    );
  }

  obtenerDocumentosSolicitud(idSolicitud: number)
  {
    this._firmaDigitalService.listarDocumentosPorSolicitud(idSolicitud).subscribe(
      (response:any) => this.documetosSolicitud = response 
    )
  }

  solicitarFimarDocumentos()
  {
    const usuario = this.usuarioSesion.usuario;   
     
    const idDocumentoSeleccionados =  this.documetosSolicitud
      .filter(documento => documento.flagSelect && documento.usuario == usuario && documento.estadoFirma == null)
      .map(documento => documento.id);

    if(idDocumentoSeleccionados.length < 1)
    {
      this._toast.warning("No hay ningún documento seleccionado", 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true})
      return
    }
    
    const body = {
      idSolicitud: +this.idSolicitud,
      idsDocumentos: idDocumentoSeleccionados
    }    
    
    this._firmaDigitalService.solicitarFirmaDocumento(body).subscribe(
      response => 
      {
        if(response['success'] == true)
        {
          this._toast.success(`Se ha solicitado la firma de ${response['content']['solicitudesRegistradas']} documento(s).`, "Éxito !!", {closeButton:true, timeOut: 3000, progressBar: true})
          this.obtenerDocumentosSolicitud(this.idSolicitud)
        }
        else
          this._toast.error("Ocurrio un error al solicitar las firmas", "Error !!", {closeButton:true, timeOut: 3000, progressBar: true})
      }
    );

  }

  descargarDocumento(rutaDocumento: string, nombreDocumento: string)
  {
    this._firmaDigitalService.obtenerDocumento(rutaDocumento).subscribe(
      documento => {
        this._fileService.descargarArchivo(documento, nombreDocumento)
        this._toast.success(`Se descargó el documento ${nombreDocumento}`, 'Éxito !!', {closeButton:true, timeOut: 3000, progressBar:true })
      }
    )
  }

  obtenerDocumentos($event: any)
  {
    if(this.tipoDoc == undefined || this.tipoDoc == null || this.tipoDoc == "" )
    {
      this._toast.warning("Seleccione primero el tipo de documento.", "Advertencia !!", {progressBar: true, closeButton: true, timeOut: 3000})
      return
    }

    const nroTipoDocumento: number = Number.parseInt(this.tipoDoc);
    const datosTipoDocumento: TipoDocumento = this.tiposDocumentos.find( x => x.id == nroTipoDocumento);
    
    this.filesSelect = [];
    const docsArray: File[] = Array.from($event.target.files);

    for(const documento of docsArray)
    {
      if(documento.type != datosTipoDocumento.formatoDocumento)
      {
        this.filesSelect = []
        this._toast.warning(`El documento ${documento.name} no es del formato (${datosTipoDocumento.formatoDocumento}) requerido.`, "Advertencia !!", {closeButton:true, timeOut: 3000, progressBar: true})
        break;
      }
      
      if( (documento.size / 1024) > datosTipoDocumento.pesoMaximo)
      {
        this.filesSelect = []
        this._toast.warning(`El documento ${documento.name} ${documento.size / 1024} Kb, excede el peso permitido ${datosTipoDocumento.pesoMaximo} Kb.`, "Advertencia !!", {closeButton:true, timeOut: 3000, progressBar: true})
        break;
      }

      this.filesSelect.push(documento);
    }
    
  }

  eliminarDocumento(index: number)
  {
    if(this.loadingArchivos)
    {
      this._toast.warning("Se estan subiendo los archivos.", "Advertencia !!", {progressBar: true, closeButton: true, timeOut: 3000})
      return
    }
    this.filesSelect.splice(index, 1);
  }

  eliminarTodosDocumentos()
  {
    if(this.loadingArchivos)
    {
      this._toast.warning("Se estan subiendo los archivos.", "Advertencia !!", {progressBar: true, closeButton: true, timeOut: 3000})
      return
    }
    this.filesSelect = [];
  }

  publicarDocumentos()
  {
    if(this.loadingArchivos)
    {
      this._toast.warning("Ya se estan enviando los archivos..", "Advertencia !!", {progressBar: true, closeButton: true, timeOut: 3000})
      return
    }
    
    if(this.tipoDoc == undefined || this.tipoDoc == null || this.tipoDoc == "" )
    {
      this._toast.warning("No se ha seleccionado el tipo de documento.", "Advertencia !!", {progressBar: true, closeButton: true, timeOut: 3000})
      return
    }

    if(this.filesSelect.length < 1)
    {
      this._toast.warning("No se ha seleccionado ningun archivo.", "Advertencia !!", {progressBar: true, closeButton: true, timeOut: 3000})
      return
    }

    this.loadingArchivos = true

    const body = new FormData();
    body.append("IdSolicitud", this.idSolicitud.toString());
    body.append("IdTipoDocumento", this.tipoDoc);

    this.filesSelect.forEach( documento => body.append("Documentos", documento));

    this._firmaDigitalService.subirDocumentos(body).subscribe( resp => 
    {
        if(resp['success'] == true)
        {
          this._toast.success("Se enviaron los documentos correctamente.", "Éxito !!",  {progressBar: true, closeButton: true, timeOut: 3000})
          this.obtenerDocumentosSolicitud(this.idSolicitud)
          this._modalService.dismissAll()
        }
        else{
          this._toast.success("Ocurrio un error al subir los documentos.", "Éxito !!",  {progressBar: true, closeButton: true, timeOut: 3000})
          this.obtenerDocumentosSolicitud(this.idSolicitud)
          this._modalService.dismissAll()
        }
        this.loadingArchivos = false
    },
    err => this.loadingArchivos = false);
  }

  abrirModalCargarDocumentos(modal: NgbModal)
  {
    this.filesSelect = []
    this.tipoDoc = ""

    if(this.tiposDocumentos.length < 1)
    {
      const grupoDocumentos: string = this.formSolicitud.get('grupoDocumentos').value;

      this._firmaDigitalService.obtenerTiposDocumentos(grupoDocumentos).subscribe(
        tipoDocumento => this.tiposDocumentos = tipoDocumento
      );
    }
    
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });
  }

  cambioTipoDoc()
  {
    if(this.tipoDoc == undefined || this.tipoDoc == null || this.tipoDoc == "" )
      this.formatoDocumentoRequerido = ""
    else{
      const nroTipoDocumento: number = Number.parseInt(this.tipoDoc);
      const datosTipoDocumento: TipoDocumento = this.tiposDocumentos.find( x => x.id == nroTipoDocumento);
      this.formatoDocumentoRequerido = datosTipoDocumento.formatoDocumento
    }    
  }

}
