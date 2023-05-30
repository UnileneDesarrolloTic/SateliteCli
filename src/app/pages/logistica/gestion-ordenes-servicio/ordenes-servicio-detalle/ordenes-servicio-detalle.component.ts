import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenServicioService } from '@data/services/backEnd/pages/OrdenServicio.Service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ordenes-servicio-detalle',
  templateUrl: './ordenes-servicio-detalle.component.html'
})
export class OrdenesServicioDetalleComponent implements OnInit {

  formFiltroGuia: FormGroup;
  formEditarDetalle: FormGroup;
  formNuevoTransportista: FormGroup;
  subscriptionRuta: Subscription;
  ordenServicio: string = "";
  codigoOrdenServicio: number = 0;
  idTransportista: number= 0;
  transportistas: [] = [];
  detalleOrdenServicio: any[] = [];
  guiasRemision: any[] = [];
  flagFiltrarGuia: boolean = false;
  flagGuardar: boolean = false;
  flagGuardarEditar: boolean = false;
  flagGuardarTransportista: boolean = false;

  constructor(private _activatedRoute: ActivatedRoute, private _ordenServicioService: OrdenServicioService, 
    private _toastr: ToastrService, private _modalService: NgbModal, private _router: Router) {
    this.subscriptionRuta = this._activatedRoute.params.subscribe(param => {
      this.codigoOrdenServicio = param['codigo']
      this.ordenServicio = param['ordenServicio']
      this.idTransportista = param['transportista']
    })
    this.subscriptionRuta.unsubscribe();
  }

  ngOnInit(): void {
    this.obtenerTransprotistas();
    this.obtenerDetalleOrdenServicio();
    this.inicializarFormularios();
  }

  inicializarFormularios() {

    this.formFiltroGuia = new FormGroup({
      fechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required),
      fechaFin: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required)
    });

    this.formEditarDetalle =  new FormGroup({
      plan: new FormControl({value: '', disabled: true}, Validators.required),
      guia: new FormControl({value: '', disabled: true}, Validators.required),
      departamento: new FormControl(''),
      peso: new FormControl(null, Validators.required),
      bultos: new FormControl(null, Validators.required),
      fechaRetorno: new FormControl(null),
      cliente: new FormControl('', Validators.required),
      entrega: new FormControl('', Validators.required),
      comentario: new FormControl('')
    })

    this.formNuevoTransportista = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      descripcion: new FormControl('', Validators.required),
      direccion: new FormControl(null),
      ruc: new FormControl(null),
      telefono_1: new FormControl(null),
      telefono_2: new FormControl(null),
      email: new FormControl(null),
      detalle: new FormControl(null)
    })
  }

  obtenerTransprotistas() {
    this._ordenServicioService.listarTransportistaCombox().subscribe(resp => this.transportistas = resp)
  }

  obtenerDetalleOrdenServicio() {
    this._ordenServicioService.listaDetalleOrdenServicio(this.codigoOrdenServicio).subscribe(resp => this.detalleOrdenServicio = resp)
  }

  obtenerListaGuiaRemision() {

    if (this.formFiltroGuia.invalid)
      return this._toastr.warning('El rango de fechas seleccionadas no es válido', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    const fechaInicio = this.formFiltroGuia.get('fechaInicio').value
    const fechaFin = this.formFiltroGuia.get('fechaFin').value

    if (fechaFin > fechaFin)
      return this._toastr.warning('La fecha de inicio debe ser mayor a la fecha fin', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    this.flagFiltrarGuia = true
    this.guiasRemision = []

    this._ordenServicioService.listaGuiaRemision(fechaInicio, fechaFin).subscribe(
      (resp: any[]) => {
        resp.forEach((guia) => {
          const datosGuia = { ...guia, checkSeleccion: false }
          this.guiasRemision.push(datosGuia)
        });

        this.flagFiltrarGuia = false
      },
      _ => this.flagFiltrarGuia = false
    )
  }

  agregarGuiasSeleccionados() {
    const guiasSeleccionados = this.guiasRemision.filter(x => x.checkSeleccion == true)

    if (guiasSeleccionados.length < 1)
      return this._toastr.warning("No hay guias seleccionados", "Advertencia !!", { progressBar: true, timeOut: 3000, closeButton: true })

    guiasSeleccionados.forEach((x, index) => {
      const existe = this.detalleOrdenServicio.findIndex((d: any) => d.guia == x.guia)

      if (existe > 0)
        this._toastr.warning("Se han agregado las guías sin duplicado", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 });

      if (existe == -1) {
        const detalleAdicional = {
          cabecera: +this.codigoOrdenServicio,
          id: 0,
          guia: x.guia,
          fecha: x.fechaGuia,
          cliente: x.cliente,
          direccion: x.destinatarioDireccion,
          departamento: x.departamento,
          factura: x.documento,
          peso: null,
          bultos: null
        }

        this.detalleOrdenServicio.push(detalleAdicional)
        guiasSeleccionados[index].checkSeleccion = false
      }

      this._modalService.dismissAll()

    }
    )
  }

  guardarOrdenServicio() {

    if (this.flagGuardar)
      return this._toastr.warning('Se están guardando los datos...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    if (this.detalleOrdenServicio.length < 1)
      return this._toastr.warning('Debe de terner detalle la O.S.', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    this.flagGuardar = true;

    const body = {
      idTransportista: +this.idTransportista,
      itemsDetalle: []
    }

    for (const orden of this.detalleOrdenServicio) {
      if (orden.bultos == undefined || orden.peso == undefined || orden.bultos == null || orden.peso == null || orden.bultos === '' || orden.peso === '') 
      {
        this.flagGuardar = false;
        return this._toastr.warning('Los datos del peso y bulto no son válidos.', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })
      }

      body.itemsDetalle.push({
        cabecera: +this.codigoOrdenServicio,
        id: orden.id,
        guia: orden.guia,
        fecha: orden.fecha,
        cliente: orden.cliente,
        direccion: orden.direccion,
        departamento: orden.departamento,
        comercial: orden.factura,
        peso: +orden.peso,
        bultos: +orden.bultos,
      })
    }

    this._ordenServicioService.guardarDetalleOrdenServicio(body).subscribe(
      resp => {
        if (resp['success'] == true) {
          this.obtenerDetalleOrdenServicio()
          this._toastr.success('Se ha guardos la Orden de Servicio', 'Éxito !!', { closeButton: true, timeOut: 3000, progressBar: true })
        }

        this.flagGuardar = false;

      },
      _ => this.flagGuardar = false
    )
  }

  agregarExtra() {
    const adicional = {
      id: -1,
      guia: '',
      fecha: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      cliente: '',
      direccion: '',
      departamento: '',
      factura: '',
      peso: null,
      bultos: null
    }

    this.detalleOrdenServicio.push(adicional)
  }

  abrirModalAgregarGuia(modal: NgbModal) {

    this.obtenerListaGuiaRemision();

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: true
    });
  }

  abrirModalEditar(detalle: any, modal: NgbModal)
  {

    if(detalle.id == 0)
      return this._toastr.warning('Primero debe de guardar la Orden de Servicio..','Nueva GuÍa !!', {timeOut: 3000, closeButton: true, progressBar: true});

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: true
    });

    if(detalle.id == -1 )
      this.formEditarDetalle.controls['guia'].enable() 
    else
      this.formEditarDetalle.controls['guia'].disable() 

    this.formEditarDetalle.reset()
    
    this.formEditarDetalle.patchValue({
      plan: detalle.id,
      guia: detalle.guia,
      departamento: detalle.departamento,
      peso: detalle.peso,
      bultos: detalle.bultos,
      fechaRetorno: formatDate(detalle.fecha, 'yyyy-MM-dd', 'en'),
      cliente: detalle.cliente,
      entrega: detalle.direccion,
      comentario: detalle.comentario
    })
  }

  abrirModalNuevoTransportista(modal: NgbModal){
    this.formNuevoTransportista.reset()
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: true
    });
  }

  eliminarDetalle(id: number, index: number) {

    const confirmacion = confirm("¿Seguro de eliminar el registro?");

    if (!confirmacion)
      return


    if (id !== -1 && id !== 0) {
      this._ordenServicioService.eliminarDetalle(id).subscribe(
        _ => this._toastr.success("Elemento eliminado", 'Éxito !!', { closeButton: true, progressBar: true, timeOut: 3000 })
      )

      this.detalleOrdenServicio.splice(index, 1)

    } else {
      this.detalleOrdenServicio.splice(index, 1)
      this._toastr.success("Elemento eliminado", 'Éxito !!', { closeButton: true, progressBar: true, timeOut: 3000 })
    }

  }

  guardarEditarGuia()
  {
    if (this.flagGuardarEditar)
      return this._toastr.warning('Se están guardando los datos...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    if(this.formEditarDetalle.invalid)
      return this._toastr.warning('Los datos del formulario no son válidos.', 'Advertencia !!', {closeButton: true, timeOut: 3000, progressBar: true})

    const formulario = this.formEditarDetalle.getRawValue()
    
    if(formulario.plan == 0)
      return this._toastr.warning('Debe de guardar la orden de servicio.', 'Advertencia !!', {closeButton: true, timeOut: 3000, progressBar: true})

    this.flagGuardarEditar = true;

    const body = {
      cabecera: +this.codigoOrdenServicio,
      id: +formulario.plan,
      fecha: formulario.fechaRetorno,
      cliente: formulario.cliente,
      direccion: formulario.entrega,
      departamento: formulario.departamento,
      comercial: formulario.guia,
      peso: +formulario.peso,
      bultos: +formulario.bultos,
      comentario: formulario.comentario
    }

    this._ordenServicioService.editarGuia_OS(body).subscribe(
      _ => {
        this.flagGuardarEditar = false
        this._modalService.dismissAll()
        this.obtenerDetalleOrdenServicio()
        this._toastr.success('Se ha actualizado los datos.', 'Éxito !!', {closeButton:true, progressBar: true, timeOut: 3000})
      },
      _ => this.flagGuardarEditar = false
    )    
  }

  guardarNuevoTransportista(){

    if (this.flagGuardarTransportista)
      return this._toastr.warning('Se están guardando los datos...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    if(this.formNuevoTransportista.invalid)
      return this._toastr.warning('Los datos del formulario no son válidos.', 'Advertencia !!', {closeButton: true, timeOut: 3000, progressBar: true})
    
    this.flagGuardarTransportista = true;
    const body = {
      ...this.formNuevoTransportista.getRawValue(),
      id: this.formNuevoTransportista.get('id').value ?? 0
    }
    
    this._ordenServicioService.guardarTransportista(body).subscribe( _ => {
      this.flagGuardarTransportista = false
      this.obtenerTransprotistas()
      this.cerrarModal()
      this._toastr.success('Se guardo datos del transportista.', 'Éxito !!', {closeButton: true, timeOut: 3000, progressBar: true})
    }, 
    _ => this.flagGuardarTransportista = false);
    
  }

  cerrarModal(){
    this._modalService.dismissAll()
  }

  regresar(){
    this._router.navigate(['Logistica/Gestion/ordenesServicio']);
  }
}


