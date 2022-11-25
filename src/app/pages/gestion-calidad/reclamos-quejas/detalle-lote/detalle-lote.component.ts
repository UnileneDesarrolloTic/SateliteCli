import { DatePipe, formatDate, formatNumber } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionSistemaDetalle } from '@data/interface/Response/Common.interface';
import { CabeceraLoteReclamo, DatosItemPorLote, EvidenciaLoteReclamo, FiltrosLotesReclamos, LotesFiltradosReclamo } from '@data/interface/Response/GestionCalidad.interface';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { OnExit } from '@guard/confirm-exit.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-lote',
  templateUrl: './detalle-lote.component.html',
  styleUrls: ['./detalle-lote.component.css']
})
export class DetalleLoteComponent implements OnInit, OnDestroy, OnExit {

  codigoReclamo: string = '';
  codigoLote: string = '';
  codigoCliente: number = 0;
  documentoCliente: string = '';
  suscripcion: Subscription;
  formDatosLote: FormGroup;
  formFiltroLote: FormGroup;
  formReclamoDetalle: FormGroup;
  formRespuesta: FormGroup;
  listaLotesFiltados: LotesFiltradosReclamo[] = [];
  flagExisteRegistrosLotesFiltrados: boolean = true;
  fechaActual: Date = new Date;
  flagTransaccionDatos: boolean = false;
  flagBtnGuardarDetalle:boolean = false;
  listaCbxClasificacion: ConfiguracionSistemaDetalle[] = [];
  listaCbxAreaInvolucrada: ConfiguracionSistemaDetalle[] = [];
  flagNuevoLote: boolean = true;
  listaEvidencias: EvidenciaLoteReclamo[] = [];
  loadingArchivos: boolean = false;
  rutaVistaPrevia: SafeResourceUrl = "";
  flagDisabledForms: boolean = false;

  private url = environment.urlRespositorioDocumentos + "/GestionCalidad/QuejasReclamos";

  constructor(private _activateRoute: ActivatedRoute, private _toastr: ToastrService, private _router: Router,
    private _modalService: NgbModal, private _gestionCalidadService: GestionCalidadService, private _datePipe: DatePipe,
    private _genericoService: GenericoService, public sanitizer: DomSanitizer) 
  { 
    this.obtenerAndValidarParametrosURL()
  }

  ngOnInit(): void 
  {
    this.inicializarFormularios();
    this.nuevoRegistroOActualizar();

    this.obtenerListaComboBox();
  }

  ngOnDestroy(): void 
  {
    // this.suscripcion.unsubscribe();
  }

  obtenerAndValidarParametrosURL()
  {
    this.suscripcion = this._activateRoute.params.subscribe(parametro => 
      {        
        this.codigoCliente = Number.parseInt(parametro['codCliente']);
        this.codigoReclamo = parametro['codReclamo'];

        this.codigoLote = parametro['lote'];
        this.documentoCliente = parametro['documento'];
      })

    this.suscripcion.unsubscribe();

    if(this.codigoReclamo == undefined || this.codigoReclamo == '' || this.codigoReclamo == null 
      || this.codigoCliente == undefined  || this.codigoCliente == null  || this.codigoCliente < 1)
    {
      this._toastr.error('Comunicarse con Soporte Técnico', 'Error !!', {closeButton: true, progressBar: true, timeOut: 3000})
      this._router.navigate(['GestionCalidad/ReclamosQuejas/']);
      return
    }

  }

  nuevoRegistroOActualizar()
  {
      if(this.codigoLote == '0' && this.documentoCliente == 'N')
      {
        this.flagNuevoLote = true;

        this.formFiltroLote.get('tipoFiltro').valueChanges.subscribe( _ => {
          this.formFiltroLote.patchValue({
            valorFiltro: ''
          })
        });
  
        this.formFiltroLote.get('valorFiltro').valueChanges.pipe(debounceTime(500)).subscribe( _ =>  this.filtrarLotes());
      }
      else
      {
        this.flagNuevoLote = false;

        this._gestionCalidadService.obtenerDatosLoteReclamo(this.codigoReclamo, this.codigoLote, this.documentoCliente)
        .subscribe((datoLote: CabeceraLoteReclamo) => 
        {

          this.formDatosLote.patchValue({
            id: datoLote.id,
            fechaDocumento: this._datePipe.transform(datoLote.fechaDocumento, 'dd/MM/yyyy HH:mm'),
            codTipoDocumento: datoLote.codTipoDocumento,
            tipoDocumento: datoLote.tipoDocumento,
            documento: datoLote.documento,
            numeroLote: this.codigoLote,
            ordenFabricacion: datoLote.ordenFabricacion,
            linea: datoLote.linea,
            familia: datoLote.familia,
            subFamilia: datoLote.subFamilia,
            cantidadPedida: datoLote.cantidadPedida,
            cantidadRecibida: datoLote.cantidadEntregada,
            item: datoLote.item,
            descripcion: datoLote.descripcion,
            marca: datoLote.marca,
            precioUnitario: formatNumber(datoLote.precioUnitario, 'en-US', '1.0-2'),
            montoTotal: formatNumber(datoLote.monto, 'en-US', '1.0-2'),
          })

          this.formReclamoDetalle.patchValue({
            motivo: datoLote.motivo,
            solicitud: datoLote.solicitud,
            remitente: datoLote.remitente,
            reingreso: datoLote.reingreso,
            porCarta: datoLote.porCarta,
            fechaIncidencia: formatDate(datoLote.fechaIncidencia, 'yyyy-MM-dd', 'en'),
            clasificacion: datoLote.clasificacion,
            areaInvolucrada: datoLote.areaInvolucrada,
            cantidad: datoLote.cantidad,
            observaciones: datoLote.observaciones,
          })

          this.obtenerEvidenciasLote(datoLote.id);

          if(datoLote.estado != 'P')
          {
            this.flagDisabledForms = true;
            this.formRespuesta.patchValue({
              estado: datoLote.estado,
              tipoEnvio: datoLote.tipoEnvioRespuesta,
              destinatario: datoLote.destinatarioRespuesta,
              loteCanje: datoLote.loteCanjeRespuesta,
              respuesta: datoLote.respuesta
            })
          }

          
        });
      }
  }

  inicializarFormularios()
  {
    this.formDatosLote = new FormGroup({
      id: new FormControl({value: '', disabled: true}, Validators.required),
      numeroLote: new FormControl({value: '', disabled: true}),
      ordenFabricacion: new FormControl({value: '', disabled: true}),
      codTipoDocumento: new FormControl({value: '', disabled: true}),
      tipoDocumento: new FormControl({value: '', disabled: true}),
      documento: new FormControl({value: '', disabled: true}),
      fechaDocumento: new FormControl({value: '', disabled: true}),
      item: new FormControl({value: '', disabled: true}),
      descripcion: new FormControl({value: '', disabled: true}),
      linea: new FormControl({value: '', disabled: true}),
      familia: new FormControl({value: '', disabled: true}),
      subFamilia: new FormControl({value: '', disabled: true}),
      marca: new FormControl({value: '', disabled: true}),
      cantidadPedida: new FormControl({value: '', disabled: true}),
      cantidadRecibida: new FormControl({value: '', disabled: true}),
      precioUnitario: new FormControl({value: '', disabled: true}),
      montoTotal: new FormControl({value: '', disabled: true})
    })

    this.formFiltroLote = new FormGroup({
      tipoFiltro: new FormControl('L', Validators.required),
      valorFiltro: new FormControl('', Validators.required),
      item: new FormControl({value: '', disabled: true}),
      descripcion: new FormControl({value: '', disabled: true})
    })
    
    this.formReclamoDetalle = new FormGroup(
      {
        motivo: new FormControl('', [Validators.required, Validators.minLength(5)]),
        solicitud: new FormControl('', [Validators.required, Validators.minLength(5)]),
        remitente: new FormControl('', Validators.required),
        reingreso: new FormControl(false, Validators.required),
        porCarta: new FormControl(false, Validators.required),
        fechaIncidencia: new FormControl(formatDate(this.fechaActual, 'yyyy-MM-dd', 'en'), Validators.required),
        clasificacion: new FormControl('', Validators.required),
        areaInvolucrada: new FormControl('', Validators.required),
        cantidad: new FormControl('', [Validators.required, Validators.min(0)]),
        observaciones: new FormControl(''),
      });

    this.formRespuesta = new FormGroup({
      estado: new FormControl('', Validators.required),
      tipoEnvio: new FormControl('', Validators.required),
      destinatario: new FormControl('', Validators.required),
      loteCanje: new FormControl('', Validators.required),
      respuesta: new FormControl('', Validators.required)
    });

    this.formReclamoDetalle.get('clasificacion').valueChanges.subscribe(
      resp => {
          const clasificacionSeleccinada = this.listaCbxClasificacion.filter(x => x.id == resp).map( x => x.valorEntero1)[0]

          if(this.formReclamoDetalle.get('areaInvolucrada').value == '' && clasificacionSeleccinada != undefined)
          {
            this.formReclamoDetalle.patchValue({
              areaInvolucrada: clasificacionSeleccinada
            })
          }
      } 
    );
  }

  get tipoFiltro()
  {
    return this.formFiltroLote.get('tipoFiltro').value;
  }

  get numeroLote()
  {
    return this.formDatosLote.get('numeroLote').value  
  }

  get valorFiltro()
  {
    return this.formFiltroLote.get('valorFiltro').value
  }

  private limpiarDatosFormFiltros()
  {
    this.listaLotesFiltados = [];
    this.flagExisteRegistrosLotesFiltrados = false;
    this.formFiltroLote.patchValue({
      item: '',
      valorFiltro: '',
      descripcion: ''
    })
  }

  obtenerListaComboBox()
  {
    this._genericoService.ObtenerConfiguracion(14, 'CBX_CLASIFICACION').subscribe(
      (resp: ConfiguracionSistemaDetalle[]) => this.listaCbxClasificacion = resp
    );

    this._genericoService.ObtenerConfiguracion(14, 'CBX_AREA_INVOLUCRADA').subscribe(
      (resp: ConfiguracionSistemaDetalle[]) => this.listaCbxAreaInvolucrada = resp
    );
  }

  guardarDetalleReclamo()
  {

    if(this.formReclamoDetalle.pristine)
    {
      this._toastr.warning('No se ha modificado el formulario.', 'Advertencia Formulario !!', {closeButton: true, progressBar: true, timeOut: 3000});
      return;
    }

    if(this.formReclamoDetalle.invalid)
    {
      this.formReclamoDetalle.markAllAsTouched();
      this._toastr.warning('Los datos del reclamo no son válidos.', 'Advertencia Formulario !!', {closeButton: true, progressBar: true, timeOut: 3000});
      return;
    }

    if(this.flagTransaccionDatos)
    {
      this._toastr.warning('Los datos se estan guardando.', 'Advertencia !!', {closeButton: true, progressBar: true, timeOut: 3000});
      return;
    }

    this.flagTransaccionDatos = true;

    const body =
    {
      codReclamo: this.codigoReclamo,
      lote: this.numeroLote,
      ordenFabricacion: this.formDatosLote.get('ordenFabricacion').value,
      documento: this.formDatosLote.get('documento').value,
      tipoDocumento: this.formDatosLote.get('codTipoDocumento').value,
      item: this.formDatosLote.get('item').value,
      ...this.formReclamoDetalle.value,
      clasificacion: +this.formReclamoDetalle.get('clasificacion').value,
      areaInvolucrada: +this.formReclamoDetalle.get('areaInvolucrada').value,
    }
    
    this.flagBtnGuardarDetalle = false;

    if(this.flagNuevoLote)
    {
      this._gestionCalidadService.guardarDetalleReclamo(body).subscribe(resp => {
        if(resp['success'] == true)
        {
          const idDetalle: number = resp['content']['idDetalle']

          this.formDatosLote.patchValue({
            id: idDetalle
          })

          this.flagBtnGuardarDetalle = true;
          this._toastr.success('Se ha registrado el detalle del reclamo.','Éxito !!',{timeOut: 3000, closeButton: true, progressBar: true})
          this.cancelar()
        }
        else
          this._toastr.warning(resp['message'],'Validación !!',{timeOut: 3000, closeButton: true, progressBar: true})
        
        this.flagTransaccionDatos = false;
      }, 
      error => {
        this.flagTransaccionDatos = false;
      })
    }
    else
    {
      this._gestionCalidadService.actualizarDetelleLoteReclamo(body).subscribe(resp => {
        if(resp['success'] == true)
        {
          this.flagBtnGuardarDetalle = true;
          this._toastr.success('Se ha actualizado el detalle del reclamo.','Éxito !!',{timeOut: 3000, closeButton: true, progressBar: true})
          this.cancelar()
        }
        else
          this._toastr.error(resp['message'],'Validación !!',{timeOut: 3000, closeButton: true, progressBar: true})
        
        this.flagTransaccionDatos = false;
      },
      err => {
        this.flagTransaccionDatos = false;
      },)
    }

  }

  submitRespuesta()
  {
    if(this.formRespuesta.invalid)
    {
      this.formRespuesta.markAllAsTouched();
      this._toastr.warning("Debe de ingresar todos loca datos de la respuesta", "Advertencia !!", {closeButton:true, timeOut: 3000, progressBar: true})
      return
    }

    const confirmacion = confirm("¿Seguro de guardar la respuesta?");

    if(!confirmacion)
      return

    const idDetalle = this.formDatosLote.get('id').value

    if(idDetalle == undefined || idDetalle == 0)
    {
      this._toastr.error("No se puedo obtener el código del detalle.", "Error !!", {closeButton:true, timeOut: 3000, progressBar: true})
      return
    }
    
    const body = {
      idDetalle,
      ...this.formRespuesta.value
    }
    
    this._gestionCalidadService.responderReclamo(body).subscribe(
      resp => {
        if(resp['success']== true)
        {
          this._toastr.success("Se registro la respuesta", "Éxito !!", {closeButton:true, timeOut: 3000, progressBar: true})
          this.cancelar();
        }
      }
    )
  }

  cancelar()
  {
    this._router.navigate(['GestionCalidad/ReclamosQuejas/Detalle/', this.codigoReclamo]);
  }

  subirEvidenciaReclamos($event: any)
  {
    const idDetalle = this.formDatosLote.get('id').value

    if(idDetalle == undefined || idDetalle == 0)
    {
      this._toastr.error("No se pudo obtener el código del detalle", "Error !!", {closeButton:true, timeOut: 3000, progressBar: true})
      return
    }

    const docsArray: File[] = Array.from($event.target.files);
    const body = new FormData();
    body.append("IdDetalle", idDetalle);

    if(docsArray.length) 

    for(const documento of docsArray)
    {      
      if( (documento.size / 1024) > 1024)
      {
        this._toastr.warning(`El documento ${documento.name} ${documento.size / 1024} Kb, excede el peso permitido 1024 Kb.`, "Advertencia !!", {closeButton:true, timeOut: 3000, progressBar: true})
        break;
      }
      body.append("Documentos", documento)
    }

    this._gestionCalidadService.subirEvidenciasLoteReclamo(body).subscribe( resp => 
      {
          if(resp['success'] == true)
            this._toastr.success("Se enviaron los documentos correctamente.", "Éxito !!",  {progressBar: true, closeButton: true, timeOut: 3000})
          else
            this._toastr.success("Ocurrio un error al subir los documentos.", "Éxito !!",  {progressBar: true, closeButton: true, timeOut: 3000})
          
          this.obtenerEvidenciasLote(idDetalle);
          this.loadingArchivos = false
      },
      err => this.loadingArchivos = false);
  }

  eliminarDocumento(idDocumento: number, nombreDocumento: string)
  {
    const idDetalle = this.formDatosLote.get('id').value

    if(idDetalle == undefined || idDetalle == 0)
    {
      this._toastr.error("No se pudo obtener el código del detalle", "Error !!", {closeButton:true, timeOut: 3000, progressBar: true})
      return
    }

    const confirmacion = confirm(`¿Está seguro de eliminar el archivo ${nombreDocumento} ?`);
    
    if(confirmacion)
      this._gestionCalidadService.borrarArchivoEvidencia(idDetalle, idDocumento).subscribe(
        resp => {
          if(resp['success'] == true)
            this._toastr.success('El documento ' + nombreDocumento + 'ha sido eliminado.', 'Éxito !!', {closeButton: true, progressBar: true, timeOut: 3000}); 
          else 
            this._toastr.error('Hubo un error al eliminar el documento ' + nombreDocumento, 'Error !!', {closeButton: true, progressBar: true, timeOut: 3000}); 

          this.obtenerEvidenciasLote(idDetalle);
        }
      )
    
  }

  obtenerEvidenciasLote(idDetalle: number)
  {
    this._gestionCalidadService.obtenerEvidenciasPorIdDetalle(idDetalle)
      .subscribe((evidencias: EvidenciaLoteReclamo[]) => this.listaEvidencias = evidencias)
  }


  filtrarLotes()
  {
    if(this.valorFiltro == '')
    {
      this.limpiarDatosFormFiltros();
      return
    }

    if(this.formFiltroLote.invalid)
    {
      this.formFiltroLote.markAllAsTouched()
      this._toastr.warning('Los filtros no son válidos.','Advertencia !!',{closeButton: true, timeOut: 3000, progressBar: true})
      return;
    }

    this.flagExisteRegistrosLotesFiltrados = true;
    this.listaLotesFiltados = [];

    const filtros : FiltrosLotesReclamos = 
    {
      cliente: +this.codigoCliente,
      ...this.formFiltroLote.value
    }
    
    this._gestionCalidadService.obtenerLotesFiltrados(filtros).subscribe(
      lotes => 
      {
        this.listaLotesFiltados = lotes;

        const item: string= lotes[0]?.item;
        const descripcion: string = lotes[0]?.descripcion;

        this.formFiltroLote.patchValue({
          item: item,
          descripcion: descripcion
        })

        if(lotes.length < 1 )
          this.flagExisteRegistrosLotesFiltrados = false
      }
    );
    
  }

  loteSeleccionado(datosLote: LotesFiltradosReclamo)
  {
    this.formDatosLote.patchValue({
      fechaDocumento: this._datePipe.transform(datosLote.fechaDocumento, 'dd/MM/yyyy HH:mm'),
      codTipoDocumento: datosLote.codTipoDocumento,
      tipoDocumento: datosLote.tipoDocumento,
      documento: datosLote.numeroDocumento,
      numeroLote: datosLote.lote,
      ordenFabricacion: datosLote.ordenFabricacion,
      cantidadPedida: datosLote.cantidadPedida,
      cantidadRecibida: datosLote.cantidadEntregada,
      item: datosLote.item,
      descripcion: datosLote.descripcion,
      precioUnitario: formatNumber(datosLote.precioUnitario, 'en-US', '1.0-2'),
      montoTotal: formatNumber(datosLote.montoTotal, 'en-US', '1.0-2'),
    })

    this.formReclamoDetalle.patchValue({
      cantidad: datosLote.cantidadEntregada
    })

    this.obtenerDatosItemPorLote(datosLote.lote);

    this._modalService.dismissAll();
  }
  
  obtenerDatosItemPorLote(lote: string)
  {
    this._gestionCalidadService.obtenerDatosItemLote(lote).subscribe((resp: DatosItemPorLote) => {      
      this.formDatosLote.patchValue({
        linea: resp.linea,
        familia: resp.familia,
        subFamilia: resp.subFamilia,
        marca: resp.marca,
      })
    })
  }

  abrirModalVistaPrevia(modal: NgbModal, nombreArchivo: string)
  {
    const idDetalle = this.formDatosLote.get('id').value

    if(idDetalle == undefined || idDetalle == 0)
    {
      this._toastr.error("No se pudo obtener el código del detalle", "Error !!", {closeButton:true, timeOut: 3000, progressBar: true})
      return
    }
    
    this.rutaVistaPrevia = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.url}/${idDetalle}/${nombreArchivo}`);
    
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: false
    });
  }

  abrirModalSeleccionarLote(modal: NgbModal)
  {
    this.limpiarDatosFormFiltros();

    this._modalService.open(modal, 
      {
        centered: true,
        backdrop: 'static',
        size: 'xl',
        scrollable: true,
      }
    );
  }

  onExit()
  {

    if(this.flagTransaccionDatos)
    {
      this._toastr.warning('Los datos se estan guardando.', 'Advertencia !!', {closeButton: true, progressBar: true, timeOut: 3000});
      return;
    }

    if(this.formReclamoDetalle.dirty && !this.flagBtnGuardarDetalle && this.formReclamoDetalle.dirty)
    {
      const rpta = confirm("¿Está seguro de salir del formulario sin guardar?");
      return rpta;
    }

    return true;
  };

}
