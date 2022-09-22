import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { SolicitudPendienteFirma } from '@data/interface/Response/FirmaDigital.interface';
import { FirmaDigitalService } from '@data/services/backEnd/pages/firma-digital.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-bandeja-pendientes',
  templateUrl: './bandeja-pendientes.component.html',
  styleUrls: ['./bandeja-pendientes.component.css']
})
export class BandejaPendientesComponent implements OnInit 
{

  formFiltro: FormGroup;
  listaSolicitudes: SolicitudPendienteFirma[] = [];
  listaFlujos: any[];

  paginado: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  };

  registrosPorPagina: number = 20;
  pagina:number = 1

  constructor(private _firmaDigitalService: FirmaDigitalService, private _genericoService: GenericoService, private _router: Router, private _toastr: ToastrService) 
  { 
    this.inicializarFormulario()
  }

  ngOnInit(): void 
  {
    this.obtenerSolicitudesPendintes();
    this.obtenerListaFlujo()
  }

  inicializarFormulario()
  {
    this.formFiltro = new FormGroup(
      {
        flujo: new FormControl(0),
        asunto: new FormControl(''),
        usuario: new FormControl(''),
        fecha: new FormControl(null),
      }
    );

    this.formFiltro.valueChanges.pipe(debounceTime(500)).subscribe(
      _ => this.obtenerSolicitudesPendintes()
    )

  }

  obtenerSolicitudesPendintes()
  {
    
    const body = 
    {
      ...this.formFiltro.value,
      "idUsuarioToken":0,
      "pagina": this.pagina,
      "registrosPorPagina": this.registrosPorPagina
    }

    this.listaSolicitudes = []

    if(body.fecha == "")
      body.fecha = null
    
    this._firmaDigitalService.solicitudesPendientesFirma(body).subscribe(
      response => {
        this.listaSolicitudes = response.lista
        this.paginado = response.paginado
      }
    );

  }

  cambioRegistroPorPagina()
  { 
    this.obtenerSolicitudesPendintes();
  }

  cambioPagina()
  {
    this.obtenerSolicitudesPendintes();
  }

  obtenerListaFlujo()
  {
    this._genericoService.ObtenerConfiguracion(7, 'FD_Maestro').subscribe(
      resp => this.listaFlujos = resp
    );
  }

  abrirFormularioParaFirmar(idSolicitud: number)
  {
    if(idSolicitud == undefined || idSolicitud < 1)
    {
      this._toastr.warning("El código de la solicitud no es válido.","Advertencia !!", {timeOut: 3000, closeButton: true, progressBar: true})
      return;
    }

    this._router.navigate(['FirmaDigital/FirmarDocumento', idSolicitud]);

  }



}

