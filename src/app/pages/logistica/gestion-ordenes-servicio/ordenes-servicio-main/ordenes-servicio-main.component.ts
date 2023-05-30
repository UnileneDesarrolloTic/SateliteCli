import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdenServicioService } from '@data/services/backEnd/pages/OrdenServicio.Service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ordenes-servicio-main',
  templateUrl: './ordenes-servicio-main.component.html'

})
export class OrdenesServicioMainComponent implements OnInit {

  formFiltros: FormGroup;
  formFiltroGuia: FormGroup;
  flagLoadingLista: boolean = false;
  flagFiltrarGuia: boolean = false;
  flagCrearOS: boolean = false;
  listaOrdenesServicio: any[] = [];
  guiasRemision: any[] = [];
  ordenServicioInput: string = "";
  mensajeRetorno: string = "";
  flagMarcarRetorno: boolean = false;
  flagReporteGuia: boolean = false;
  transportistas: [] = [];
  transportistaSeleccionada: number = 0;
  flagExportarDatos: boolean = false;

  datosOrdenServicio: any = {
    "ordenServicio": "",
    "transportista": "",
    "fechaRegistro": new Date()
  };

  constructor(private _toastr: ToastrService, private _ordenServicioService: OrdenServicioService,
    private _router: Router, private _modalService: NgbModal, private _fileService: FileService) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.listarOrdenesServicio();
  }

  inicializarFormularios() {
    this.formFiltros = new FormGroup({
      fechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required),
      fechaFin: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required)
    })

    this.formFiltroGuia = new FormGroup({
      fechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required),
      fechaFin: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required)
    });

  }

  listarOrdenesServicio() {

    if (this.formFiltros.invalid)
      return this._toastr.warning('El rango de fechas es obligatorio.', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })

    this.flagLoadingLista = true;

    const fechaInicio = this.formFiltros.get('fechaInicio').value;
    const fechaFin = this.formFiltros.get('fechaFin').value;

    this.listaOrdenesServicio = [];

    this._ordenServicioService.listarOrdenesServicio(fechaInicio, fechaFin).subscribe(
      resp => {
        this.listaOrdenesServicio = resp
        this.flagLoadingLista = false
      },
      _ => this.flagLoadingLista = false
    );
  }

  obtenerTransprotistas() {
    this._ordenServicioService.listarTransportistaCombox().subscribe(resp => this.transportistas = resp)
  }

  editar(codigo: Number, ordenServicio: string, idTransportista: Number) {
    this._router.navigate(['Logistica/Gestion/ordenesServicio/detalle', codigo.toString(), ordenServicio, idTransportista.toString()]);
  }

  abrirModalNuevaOrdenServicio(modal: NgbModal) {

    this.obtenerListaGuiaRemision();
    this.obtenerTransprotistas();

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: true
    });
  }

  abrirModalRetornoOrdenServicio(modal: NgbModal) {


    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });

    this.autoFocusSelect_CodeBarInput()

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

  crearOrdenServicio() {

    if (this.flagCrearOS)
      return this._toastr.warning("Se está creando la Orden de Servicio.", "Advertencia !!", { progressBar: true, timeOut: 3000, closeButton: true })

    if( +this.transportistaSeleccionada <1)
      return this._toastr.warning("Debe de selecciona el transportista.", "Advertencia !!", { progressBar: true, timeOut: 3000, closeButton: true })

    const guiasSeleccionados = this.guiasRemision.filter(x => x.checkSeleccion == true)

    if (guiasSeleccionados.length < 1 )
      return this._toastr.warning("No hay guias seleccionados", "Advertencia !!", { progressBar: true, timeOut: 3000, closeButton: true })

    this.flagCrearOS = true;

    let detalleGuia: any[] = []

    guiasSeleccionados.forEach(x => {
      const detalleAdicional = {
        cabecera: 0,
        id: 0,
        guia: x.guia,
        fecha: x.fechaGuia,
        cliente: x.cliente,
        direccion: x.destinatarioDireccion,
        departamento: x.departamento,
        factura: x.documento,
        peso: 0,
        bultos: 0
      }

      detalleGuia.push(detalleAdicional)
    });

    const body = {
      detalle: detalleGuia,
      transportista: +this.transportistaSeleccionada,
      usuario: ''
    }

    this._ordenServicioService.nuevaOrdenServicio(body).subscribe(_ => {
      this.flagCrearOS = false
      this.listarOrdenesServicio()
      this._modalService.dismissAll()
      this._toastr.success('Se ha creado la Orden de Servicio', 'Éxito !!', { progressBar: true, timeOut: 3000, closeButton: true });
    },
      _ => this.flagCrearOS = false
    );
  }

  exportarReporteSalidas() {

    if(this.flagExportarDatos)
      return this._toastr.warning('Se está descargando el reporte.', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })

    if (this.formFiltros.invalid)
      return this._toastr.warning('El rango de fechas es obligatorio.', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })

    const inicio = this.formFiltros.get('fechaInicio').value
    const fin = this.formFiltros.get('fechaFin').value

    if (inicio > fin)
      return this._toastr.warning('La fecha de inicio no pude ser mayor a la fecha fin', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })

    this.flagExportarDatos = true
    
    this._ordenServicioService.exportarOrdenServicioSalidas(inicio, fin).subscribe((reporte: string) => {
      this._fileService.decargarExcel_Base64(reporte, 'Reporte de Ordenes de Servicio', 'xlsx');
      this.flagExportarDatos = false;
    },
    _ => this.flagExportarDatos = false);
  }

  exportarReporteOrdenServicio(id: number) {

    if (id < 1)
      return this._toastr.warning('El codifo del OS no es válido', 'Advertencia !!', { closeButton: true, progressBar: true, timeOut: 3000 })

    this._ordenServicioService.exportarOrdenServicio_PDF(id).subscribe(reporte => {
      this._fileService.decargarPDF_Base64(reporte, "Reporte de Orden de Servicio");
    });
  }

  marcarRetornoOrdenServicio() {

    if (this.ordenServicioInput == null || this.ordenServicioInput == undefined || this.ordenServicioInput.trim() == '' || this.ordenServicioInput.length < 11) {
      document.getElementById('ordenServicioInput').focus();
      return this._toastr.warning('La orden de servicio no es válida.', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })
    }

    this.flagMarcarRetorno = true;
    this.mensajeRetorno = "";

    const ordenServicio = this.ordenServicioInput;

    this._ordenServicioService.retornarOrdenServicio(ordenServicio).subscribe((resp: any) => {
      if (resp['success'] == false)
        this.mensajeRetorno = resp['message']
      else{
        this.listarOrdenesServicio()
        this.datosOrdenServicio = resp['content']['value']
      }


      this.autoFocusSelect_CodeBarInput()
      this.flagMarcarRetorno = false;
    },
      _ => this.flagMarcarRetorno = true
    );
  }

  autoFocusSelect_CodeBarInput() {
    this.ordenServicioInput = "";
    document.getElementById('ordenServicioInput').focus();
  }

  eliminarOrdenServicio(ordenServicio: string) {
    if (ordenServicio == null || ordenServicio == undefined || ordenServicio.trim() == "")
      return this._toastr.warning("La orden de servicio no es válido", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 })

    let opcion = confirm("¿Segúro de eliminar la Orden de Servio?");

    if (!opcion)
      return

    this._ordenServicioService.eliminarOrdenServicio(ordenServicio).subscribe(_ => {
      this.listarOrdenesServicio()
      this._toastr.success("Se ha eliminar la Oden de servicio", "Éxito !!", { closeButton: true, progressBar: true, timeOut: 3000 })
    });

  }

  generarReporteGuia() {
    if (this.formFiltros.invalid)
      return this._toastr.warning('El rango de fechas es obligatorio.', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })

    if(this.flagReporteGuia)
      return this._toastr.warning('Se esta generado el reporte...', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })
    
    this.flagReporteGuia =  true;
    const fechaInicio = this.formFiltros.get('fechaInicio').value
    const fechaFin = this.formFiltros.get('fechaFin').value

    if (fechaInicio > fechaFin)
      return this._toastr.warning('La fecha de inicio no pude ser mayor a la fecha fin', 'Advertencia !!', { progressBar: true, timeOut: 3000, closeButton: true })
    
    this._ordenServicioService.reporteGuiaOrdenServicio(fechaInicio, fechaFin).subscribe(
      (resp: any) => 
      {
        if(resp['success'] == false)
          this._toastr.warning(resp['message'], "Advertencia !!", { progressBar: true, timeOut: 3000, closeButton: true })
        else {
          this._toastr.success("Se generó el reporte.", "Éxito !!", { progressBar: true, timeOut: 3000, closeButton: true })
          this._fileService.decargarExcel_Base64(resp['content'], 'Reporte de Guias - Orden Servicio', "xlsx");
        }

        this.flagReporteGuia = false;
    }, 
    _ => this.flagReporteGuia = false
    );

  }

}
