import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { FiltrosSolitud, ResponseListarSolicitud, SolicitudFirmaDigital } from '@data/interface/Response/FirmaDigital.interface';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';
import { FirmaDigitalService } from '@data/services/backEnd/pages/firma-digital.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-solicitud',
  templateUrl: './listar-solicitud.component.html',
  styleUrls: ['./listar-solicitud.component.css']
})
export class ListarSolicitudComponent implements OnInit {

  formFiltro: FormGroup;
  formPaginado: FormGroup;
  formNuevaSolicitud:FormGroup;
  listaSolicitudes: SolicitudFirmaDigital[];
  listaFlujos: any[];
  paginadoModel: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  };

  page: number = 1;
  pageSize: number = 20;
  usuarioSesion: UsuarioSesionData;
  modalNuevaSolicitud : NgbModalRef;


  constructor(private _firmaDigitalService: FirmaDigitalService, private _toastr: ToastrService, private _modalService: NgbModal, 
    private _genericoService: GenericoService, private _sesionService: SesionService, private _router: Router) 
  { 
    this.usuarioSesion  = this._sesionService.datosPersonales();
    this.inicializarFormularioFiltro();
  }

  ngOnInit(): void {
    this.obtenerListaSolicitudes();
    this.obtenerListaFlujo(); 
  }

  inicializarFormularioFiltro()
  {
    this.formFiltro = new FormGroup(
      {
        flujo: new FormControl(''),
        estado: new FormControl(''),
        asunto: new FormControl(''),
        fecha: new FormControl(null),
        usuario: new FormControl(this.usuarioSesion.usuario),
      }
    );

    this.formPaginado = new FormGroup(
      {
        pagina: new FormControl(1, [Validators.required, Validators.min(1)]),
        registrosPorPagina: new FormControl("20", [Validators.required, Validators.min(1)])
      }
    );

    this.formNuevaSolicitud = new FormGroup(
      {
        flujo: new FormControl("", [Validators.required]),
        asunto: new FormControl("", [Validators.required, Validators.minLength(5)])
      }
    );

    this.formFiltro.valueChanges.pipe(debounceTime(450)).subscribe( _ => this.obtenerListaSolicitudes());
    this.formPaginado.valueChanges.subscribe( _ => this.obtenerListaSolicitudes());

  }

  get registrosPorPagina(){
    return this.formPaginado.get('registrosPorPagina').value
  }

  get nombreUsuarioSesio(){
    return this.usuarioSesion.nombres.split(" ",1) + ' ' + this.usuarioSesion.apellidoPaterno;
  }

  obtenerListaSolicitudes()
  {

    if(this.formPaginado.invalid || this.formFiltro.invalid)
      this._toastr.warning("Los datos por enviar no son válidos", "Advertencia !", {closeButton:true, timeOut: 4000, progressBar: true});

    this.pageSize = this.formPaginado.get('registrosPorPagina').value

    this.listaSolicitudes = []

    const fechaFiltro = this.formFiltro.value["fecha"] == '' ? null : this.formFiltro.value["fecha"]

    const body: FiltrosSolitud = {
      ...this.formFiltro.value,
      flujo : Number(this.formFiltro.value["flujo"]),
      fecha: fechaFiltro, 
      ...this.formPaginado.value,
      registrosPorPagina: Number(this.formPaginado.value["registrosPorPagina"])
    }    

    this._firmaDigitalService.listarSolicitudes(body).subscribe(
      (result:ResponseListarSolicitud) => 
      {
        this.listaSolicitudes = result.lista
        this.paginadoModel = result.paginado
      }
    )
    
  }

  obtenerListaFlujo()
  {
    this._genericoService.ObtenerConfiguracion(7, 'FD_Maestro').subscribe(
      resp => this.listaFlujos = resp
    );
  }

  registrarNuevaSolicitud()
  {
    if(this.formNuevaSolicitud.invalid)
    {
      this.formNuevaSolicitud.markAllAsTouched()
      this._toastr.warning("Los datos de la solicitud no son válidas.", 'Advertencia !', {closeButton:true, timeOut: 3000, progressBar: true})
      return
    }

    const body =                              
    {
      idFlujo : Number(this.formNuevaSolicitud.get("flujo").value),
      asunto: this.formNuevaSolicitud.get("asunto").value
    }

    this._firmaDigitalService.registrarSolicitud(body).subscribe(
      (response: any) => 
      {        
        if(response['success'] == true)
        {
          this.formNuevaSolicitud.reset()
          this.modalNuevaSolicitud.close()
          this.obtenerListaSolicitudes()
          this._toastr.success(`Se ha registrar la solicitud Nro. ${response['content']['idSolicitud']}`, 'Éxito !!', {closeButton:true, timeOut:3000, progressBar:true})
        }
        else
          this._toastr.error('Ocurrio un error al registrar la solicitud', 'Error !!', {closeButton:true, timeOut:3000, progressBar:true})
      }
    );    
  }

  mostrarDocumentosPorSolicitud(idSolicitud: number)
  { 
    this._router.navigate(['FirmaDigital/DocumentosSolicitud', idSolicitud]);
  }

  cambioPagina(pagina: number)
  {
    this.formPaginado.patchValue({
      pagina: pagina
    })
  }

  abrirModalNuevaSolicitud(modal:NgbModal)
  {
    this.formNuevaSolicitud.reset({
      flujo: '',
      asunto: ''
    })

    this.modalNuevaSolicitud = this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });
  }

  
}
