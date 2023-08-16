import { formatDate } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncajadoService } from '@data/services/backEnd/pages/encajado.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { easeSin } from 'd3';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-encaje',
  templateUrl: './encaje.component.html',
  styleUrls: ['./encaje.component.css']
})
export class EncajeComponent implements OnInit {

  formFiltro: FormGroup;
  etapaEncajado: number = 1;
  listaTransferenciasEncaje: any[] = [];
  formNuevaAsignacion: FormGroup;
  formNuevaTransferencia: FormGroup;
  formHeaderTransferencia: FormGroup;
  formReporte: FormGroup;
  listaOrdenesFabricacion: any[];
  flagListandoOrdenes: boolean = true;
  flagListarTransferenciaEncaje: boolean = false;
  flagDescargaExcel: boolean = false;
  totalTransferida: number = 0;

  listaAsignaciones: any[] = []
  totalAnterior: number = 0
  totalActual: number = 0

  private idEncajeSeleccionado: number = 0

  constructor(private _modalService: NgbModal, private _toatsr: ToastrService,
    private _encajadoService: EncajadoService, private _sesionService: SesionService,
    private _fileService: FileService) { }

  ngOnInit(): void {
    this.inicializarFomrulario()
    this.listarOrdenesCompra();
  }

  inicializarFomrulario() {

    this.formReporte = new FormGroup({
      fechaInicio: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]),
      fechaFin: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required])
    })

    this.formFiltro = new FormGroup({
      ordenFabricacion: new FormControl(''),
      lote: new FormControl('')
    })

    this.formHeaderTransferencia = new FormGroup({
      ordenFabricacion: new FormControl({ value: '', disabled: true }, Validators.required),
      codsut: new FormControl({ value: '', disabled: true }, Validators.required),
      item: new FormControl({ value: '', disabled: true }, Validators.required),
      total: new FormControl({value: 0, disabled: true}, Validators.required)
    })
    
  }

  listarOrdenesCompra() {

    const ordenFabricacion = this.formFiltro.get('ordenFabricacion').value.trim()
    const lote = this.formFiltro.get('lote').value.trim()

    this.flagListandoOrdenes = true;
    this.listaOrdenesFabricacion = [];

    this._encajadoService.listaOrdenesFabricacion(ordenFabricacion, lote).subscribe((x: any) => {
      if (x.success == true)
        this.listaOrdenesFabricacion = x.content

      this.flagListandoOrdenes = false;
    },
      _ => this.flagListandoOrdenes = false)

  }

  listarTransferenciasEncaje(ordenFabricacion: string) {

    if (ordenFabricacion == undefined || ordenFabricacion == null || ordenFabricacion == '')
      return this._toatsr.warning('La orden de fabricacion no es válida.', 'Error !!', { timeOut: 3000, progressBar: true, closeButton: true })

    this.flagListarTransferenciaEncaje = true
    this.listaTransferenciasEncaje = []
    this.totalTransferida = 0

    this._encajadoService.listaTransferenciasEncaje(ordenFabricacion).subscribe(
      (x: any) => {
        if (x.success){
          this.listaTransferenciasEncaje = x.content

          this.totalTransferida = this.listaTransferenciasEncaje.reduce((ant, act) => {
            return ant + (+act.cantidadTransferida)
          }, 0)

        }
        this.flagListarTransferenciaEncaje = false
      },
      _ => this.flagListarTransferenciaEncaje = false
    )
  }

  abrirModalTransferencia(modal: NgbModal, index: number) {

    const ordenFabricacionSeleccionado = this.listaOrdenesFabricacion[index]

    if (ordenFabricacionSeleccionado == undefined)
      return this._toatsr.warning('La orden de fabricación seleccionada, no es válida !!', 'Error !!', { closeButton: true, timeOut: 3000, progressBar: true })

    this.listarTransferenciasEncaje(ordenFabricacionSeleccionado.ordenFabricacion)

    this.formHeaderTransferencia.patchValue({
      ordenFabricacion: ordenFabricacionSeleccionado.ordenFabricacion,
      codsut: ordenFabricacionSeleccionado.codSut,
      item: ordenFabricacionSeleccionado.descripcion,
      total: +ordenFabricacionSeleccionado.cantidadProgramada
    })

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  agregarFormNuevoRegistroTransferencia()
  {
    if (this.listaTransferenciasEncaje.findIndex(x => x.id == 0) != -1)
      return this._toatsr.warning('Debe de ingresar los datos de la transferencia.', 'Aviso !!', { closeButton: true, progressBar: true, timeOut: 3000 })

    const usuarioSesion = this._sesionService.datosPersonales()

    this.formNuevaTransferencia = new FormGroup({
      id: new FormControl({value: 0, disabled: true}),
      usuarioRegistro: new FormControl({value: usuarioSesion.usuario, disabled: true}, Validators.required),
      fechaRegistro: new FormControl({value: formatDate(new Date, 'yyyy-MM-dd HH:mm', 'en'), disabled: true}, Validators.required),
      cantidadTransferida: new FormControl(0, [Validators.required, Validators.min(1)]),
    })

    this.listaTransferenciasEncaje.unshift({
      id: 0, 
      usuarioRegistro: '',
      fechaRegistro: '',
      cantidadTransferida: 0
    })
  }

  eliminarFormNuevaTransferencia()
  {
    const index = this.listaTransferenciasEncaje.findIndex(x => x.id == 0);
    this.listaTransferenciasEncaje.splice(index, 1)
  }

  registrarNuevaTransferencia(){

    if(this.formNuevaTransferencia.invalid)
      return this._toatsr.warning('Los datos ingresados no son válidos', 'Advertencia !!', {progressBar: true, timeOut: 3000, closeButton: true})

    const ordenFabricacion = this.formHeaderTransferencia.get('ordenFabricacion').value
    const cantidad = +this.formNuevaTransferencia.get('cantidadTransferida').value
    
    const totalProgramado = +this.formHeaderTransferencia.get('total').value

    if( cantidad > (totalProgramado - this.totalTransferida) )
      return this._toatsr.warning('La cantidad no puede ser mayor al pendiente '+(totalProgramado - this.totalTransferida), 'Advertencia !!', {progressBar: true, timeOut: 3000, closeButton: true})

    this._encajadoService.registarNuevaTrasnferencia(ordenFabricacion, cantidad).subscribe( (x: any) => {
      if(x.success)
      {
        this._toatsr.success('Se ha registrado los datos de la transferencia', 'Éxito !!', {progressBar: true, timeOut: 3000, closeButton: true})
        this.eliminarFormNuevaTransferencia()
        this.listarTransferenciasEncaje(ordenFabricacion)
      }else{
        this._toatsr.success('Hubo un error al guardar los datos de la transferencia', 'Error !!', {progressBar: true, timeOut: 3000, closeButton: true})
      }
    })
    
  }

  abrirModalProgramacion(modal: NgbModal, idEncaje: number){

    this.idEncajeSeleccionado = idEncaje
    this.cambiarEtapa(1)
    this.listaAsignacionEncaje(idEncaje, 1);
    
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  abrirModalReporte(modal: NgbModal){

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });
  }

  listaAsignacionEncaje(idEncaje:number, etapa: number){

    this.listaAsignaciones = []
    this.totalAnterior = 0
    this.totalActual = 0

    this._encajadoService.listraAsignacionesEncajePorEtapa(idEncaje, etapa).subscribe( (x: any) => {
      this.totalAnterior = x.content.totalAnterior
      this.totalActual = x.content.totalActual
      this.listaAsignaciones = x.content.lista
    })

  }

  get pendienteAsignar(): Number
  {
    return this.totalAnterior - this.totalActual
  }

  cambiarEtapa(etapa: number) {

    this.listaAsignacionEncaje(this.idEncajeSeleccionado, etapa)
    
    this.etapaEncajado = etapa
  }

  agregarFormAsignacionRegistro() {

    if( this.pendienteAsignar <= 0)
      return this._toatsr.warning('Se ha completado el total transferido, para esta etapa.', 'Aviso !!', { closeButton: true, progressBar: true, timeOut: 3000 })

    if (this.listaAsignaciones.findIndex(x => x.codigo == 0) != -1)
      return this._toatsr.warning('Debe de ingresar el registro.', 'Aviso !!', { closeButton: true, progressBar: true, timeOut: 3000 })

    this.formNuevaAsignacion = new FormGroup({
      empleado: new FormControl(null, Validators.required),
      nombreEmpleado: new FormControl({ value: null, disabled: true }, Validators.required),
      fecha: new FormControl(formatDate(new Date, 'yyyy-MM-dd hh:mm', 'en'), Validators.required),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.listaAsignaciones.unshift({
      empleado: 0,
      nombreEmpleado: '',
      fecha: '',
      cantidad: 0
    })
  }

  registrarNuevaAsignacion(etapa: number) {

    if (this.formNuevaAsignacion.invalid)
      return this._toatsr.warning('Los datos ingresados no son válidos.', 'Error !!', { closeButton: true, progressBar: true, timeOut: 3000 })

    const cantidadAsignada = +this.formNuevaAsignacion.get('cantidad').value
    
    if( this.pendienteAsignar < cantidadAsignada)
      return this._toatsr.warning('La cantidad asignada es mayor a la cantidad pendiente.', 'Error !!', { closeButton: true, progressBar: true, timeOut: 3000 })

    const asignacion = {
      idEncaje: +this.idEncajeSeleccionado,
      etapa: +etapa,
      usuarioRegistro: '',
      ...this.formNuevaAsignacion.value,
      fecha: new Date (Date.parse(this.formNuevaAsignacion.get('fecha').value))
    }

    this._encajadoService.registrarAsignacion(asignacion).subscribe( (x: any)=>{
      if(x.success)
      {
        this._toatsr.success('Se ha registrado los datos de la asignación', 'Éxito !!', {progressBar: true, timeOut: 3000, closeButton: true})
        this.eliminarFormNuevoRegistro()
        this.listaAsignacionEncaje(this.idEncajeSeleccionado, etapa)
      }else{
        this._toatsr.warning(x.message, 'Error !!', {progressBar: true, timeOut: 3000, closeButton: true})
      }
    })

  }

  actualizarEstadoAsignacion(id: number, estado: string, etapa: number){
    
    this._encajadoService.actualizaEstadoAsignacion(id, estado).subscribe( _ => 
    {
      if(estado == 'C')
        this._toatsr.success('Se ha completado la asignación', 'Éxito !!', {closeButton: true, timeOut: 3000, progressBar: true})
      if(estado == 'I')
        this._toatsr.success('Se ha eliminado la asignación.', 'Éxito !!', {closeButton: true, timeOut: 3000, progressBar: true})
      
      this.listaAsignacionEncaje(this.idEncajeSeleccionado, etapa)
    })

  }

  descargarReprote(){
    if(this.flagDescargaExcel)
      return this._toatsr.warning('El reporte de estar generando...', 'Proceso...', {closeButton: true, progressBar: true, timeOut: 3000})

    if(this.formReporte.invalid)
      return this._toatsr.warning('Las fechas no son válidas', 'Advertencia', {closeButton: true, progressBar: true, timeOut: 3000})
    
    this.flagDescargaExcel = true

    const fechaInicio = this.formReporte.get('fechaInicio').value
    const fechaFin = this.formReporte.get('fechaFin').value

    this._encajadoService.reporteAsignacionEncajado(fechaInicio, fechaFin).subscribe( 
      (x: any) => {
        if(x.success){
          this._fileService.decargarExcel_Base64(x.content, 'Reporte Asignación Encajado', 'xlsx')
          this._toatsr.success('Se ha descargado el reporte.', 'Éxito !!', {closeButton: true, progressBar: true, timeOut: 3000})
        }
        else
          this._toatsr.warning(x.message, 'Advertencia !!', {closeButton: true, progressBar: true, timeOut: 3000})

        this.flagDescargaExcel = false
      },
      _ => this.flagDescargaExcel = false
    )
  }

  eliminarItem() {
    var r = confirm("¿ Seguro de eliminar el item ?");
  }

  eliminarFormNuevoRegistro() {
    const indexForm = this.listaAsignaciones.findIndex(x => x.empleado == 0)
    this.listaAsignaciones.splice(indexForm, 1)
  }

}
