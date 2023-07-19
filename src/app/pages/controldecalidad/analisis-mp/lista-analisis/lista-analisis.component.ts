import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalisisMateriaPrimaService } from '@data/services/backEnd/pages/analisis-materia-prima.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-analisis',
  templateUrl: './lista-analisis.component.html',
  styleUrls: ['./lista-analisis.component.css']
})
export class ListaAnalisisComponent implements OnInit {

  formFiltros: FormGroup;
  fechaActual: Date = new Date();
  fechaInicial: Date = new Date(this.fechaActual.getDate() + 30);
  flagPrimeraConsulta: boolean = false;
  listaAnalisis: any[] = [];
  flagBuscar: boolean = false;
  flagDescargandoReporte: boolean = false;
  reporteSeleccionado: string = "";

  numeroOrdenSelect: string
  analisisSelect: string
  tipoItemSelect: string

  constructor(private _toastr: ToastrService, private _analisisService: AnalisisMateriaPrimaService,
    private _router: Router, private _fileService: FileService, private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.listarAnalisis();
  }

  inicializarFormularios() {
    this.formFiltros = new FormGroup(
      {
        numeroOrden: new FormControl('1968'),
        codigoAnalisis: new FormControl('')
      }
    );
  }

  listarAnalisis() {

    let validacionFecha: boolean = false;

    const body = this.formFiltros.value;

    if (this.flagBuscar)
      return this._toastr.warning("Espere un momento...", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 })

    if ((body.fechaFin != '' && body.fechaFin != null) && (body.fechaInicio != '' && body.fechaInicio != null))
      validacionFecha = true;

    if (body.numeroOrden == '' && body.codigoAnalisis == '' && !validacionFecha)
      return this._toastr.warning("Debe de ingresar como mínimo un filtro.", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 })

    this.flagPrimeraConsulta = true;
    this.flagBuscar = true;

    this.listaAnalisis = []

    const orndeCompra = this.formFiltros.get('numeroOrden').value
    const codigoAnalisis = this.formFiltros.get('codigoAnalisis').value

    this._analisisService.listarAnalisis(orndeCompra, codigoAnalisis).subscribe(x => {
      this.listaAnalisis = x
      this.flagBuscar = false;
    },
      (_) => {
        this.flagBuscar = false;
      })

  }

  registrarAnalisis(controlNumero: string, analisis: string, tipoItem: string) {
    if (tipoItem != 'Hebra')
      return this._toastr.warning("El item no es una hebra", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 })

    this._router.navigate(['ControlCalidad/AnalisisMP/hebra', controlNumero, analisis]);
  }

  descargarReporteAnalisis(ordenCompra: string, codigoAnalisis: string, tipoItem: string) {

    if (this.flagDescargandoReporte)
      return this._toastr.warning('Se esta descargando el reporte...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    if (tipoItem != 'Hebra')
      return this._toastr.warning("El item no es una hebra", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 })

    this.flagDescargandoReporte = true;

    this._analisisService.rptAnalisisMateriaPrimaHebra(ordenCompra, codigoAnalisis).subscribe(
      response => {

        if (response['success'] == false) {
          this.flagDescargandoReporte = false;
          this._toastr.warning(response['message'], "Adventencia !!", { timeOut: 5000, closeButton: true });
          return
        }
        
        this._fileService.decargarPDF_Base64(response['content'], "ReporteAnalisis.pdf")
        this._toastr.success("Se descargo el reporte.", "Éxito !!", { timeOut: 5000, closeButton: true });

        this.flagDescargandoReporte = false;
      },
      _ => this.flagDescargandoReporte = false
    )


  }

  descargarReporteProtocolo(ordenCompra: string, codigoAnalisis: string, tipoItem: string) {

    if (this.flagDescargandoReporte)
      return this._toastr.warning('Se esta descargando el reporte...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    if (tipoItem != 'Hebra')
      return this._toastr.warning("El item no es una hebra", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000 })

    this.flagDescargandoReporte = true;

    this._analisisService.rptProtocoloAnalisisMateriaPrima(ordenCompra, codigoAnalisis).subscribe(
      response => {

        if (response['success'] == false){
          this.flagDescargandoReporte = false;
          this._toastr.warning(response['message'], "Adventencia !!", { timeOut: 5000, closeButton: true });
          return
        }
        
        this._fileService.decargarPDF_Base64(response['content'], "Protocolo Materia Prima")
        this._toastr.success("Se descargo el reporte.", "Éxito !!", { timeOut: 5000, closeButton: true });
        this.flagDescargandoReporte = false
      },
      _ => this.flagDescargandoReporte = false
    )


  }

  descargarReporte() {

    if (this.reporteSeleccionado == 'a')
      this.descargarReporteAnalisis(this.numeroOrdenSelect, this.analisisSelect, this.tipoItemSelect)

    if (this.reporteSeleccionado == 'p')
      this.descargarReporteProtocolo(this.numeroOrdenSelect, this.analisisSelect, this.tipoItemSelect)
  }

  cerrarModal() {
    this._modalService.dismissAll();
  }

  abrirModalReporte(modal: NgbModal, numeroOrden: string, analisis: string, tipoItem: string) {
    this.reporteSeleccionado = ''
    this.numeroOrdenSelect = numeroOrden
    this.analisisSelect = analisis
    this.tipoItemSelect = tipoItem

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
  }

}
