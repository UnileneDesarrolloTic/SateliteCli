import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransferenciaMPService } from '@data/services/backEnd/pages/transferencia-pt.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-producto-terminado-transferido',
  templateUrl: './producto-terminado-transferido.component.html',
  styleUrls: ['./producto-terminado-transferido.component.css']
})
export class ProductoTerminadoTransferidoComponent implements OnInit {

  filtroTexto: FormControl;
  listaPendientesCompleta: any[] = [];
  listaPendientes: any[] = [];
  formFiltro: FormGroup;
  modalNuevaSolicitud: NgbModalRef;
  formTransferencia: FormGroup;
  pendienteTransferencia: number = 0
  flagRegistrarTransferencia: boolean = false;
  flagDescargarReporte: boolean = false;

  constructor(private _transferenciaService: TransferenciaMPService, private _modalService: NgbModal,
    private _toastr: ToastrService, private _fileService: FileService) { }

  ngOnInit(): void {
    this.inicializarFormulario()
    this.listarPendientesTransferencia()
  }

  inicializarFormulario() {

    this.filtroTexto = new FormControl('')

    this.filtroTexto.valueChanges.pipe(debounceTime(500)).subscribe(x =>
      this.filtrarPorTexto()
    )

    this.formFiltro = new FormGroup({
      almacen: new FormControl('ALMPRT', [Validators.required, Validators.minLength(2)])
    })

    this.formTransferencia = new FormGroup({
      idControl: new FormControl({ value: null, disabled: true }, Validators.required),
      controlNumero: new FormControl({ value: null, disabled: true }, Validators.required),
      cantidadTotal: new FormControl({ value: null, disabled: true }, Validators.required),
      cantidadParcial: new FormControl(null, [Validators.required, Validators.min(1)])
    })

  }

  listarPendientesTransferencia() {

    if (this.formFiltro.invalid)
      return this._toastr.warning('El almacen seleccionado no es válido.', 'Advetencia', { closeButton: true, timeOut: 3000, progressBar: true })

    this.listaPendientes = []
    this.listaPendientesCompleta= []

    const almacen = this.formFiltro.get('almacen').value

    this._transferenciaService.listaPendienteTransferenciaFisica(almacen).subscribe(
      x => {
        this.listaPendientesCompleta = x;
        this.filtrarPorTexto()
      }
    )
  }

  abrirModalTransferencia(modal: NgbModal, id: number, controlNumero: string, cantidadRecibida: number, cantidadPendiente: number, cantidadAceptado: number) {
    this.formTransferencia.reset()

    this.pendienteTransferencia = (cantidadRecibida ?? 0) - ((cantidadPendiente ?? 0) + (cantidadAceptado ?? 0))

    this.formTransferencia.patchValue({
      idControl: id,
      controlNumero: controlNumero,
      cantidadTotal: formatNumber(cantidadRecibida, 'en', '1.0-2')
    })

    this.modalNuevaSolicitud = this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });
  }

  registrarTransferencia() {

    if (this.flagRegistrarTransferencia)
      return this._toastr.warning('Se esta guardando la transferencia.', 'Advetencia', { closeButton: true, timeOut: 3000, progressBar: true })

    if (this.formTransferencia.invalid)
      return this._toastr.warning('Los datos del formulario no son válidos', 'Advetencia', { closeButton: true, timeOut: 3000, progressBar: true })

    const cantidaTransferida = this.formTransferencia.get('cantidadParcial').value;

    if (cantidaTransferida > this.pendienteTransferencia)
      return this._toastr.warning('La cantidad transferida no es válida', 'Advetencia', { closeButton: true, timeOut: 3000, progressBar: true })

    this.flagRegistrarTransferencia = true

    const { cantidadParcial, cantidadTotal, controlNumero, idControl } = this.formTransferencia.getRawValue()

    this._transferenciaService.registrarTransfenciaPT(idControl, controlNumero, cantidadTotal, cantidadParcial).subscribe(
      _ => {
        this.listarPendientesTransferencia()
        this.flagRegistrarTransferencia = false
        this.modalNuevaSolicitud.close()
        this._toastr.success('Se ha registrado la transferencia.', 'Éxito !!', { closeButton: true, timeOut: 3000, progressBar: true })
      },
      _ => this.flagRegistrarTransferencia = false
    )
  }

  filtrarPorTexto() {
    
    const texto = this.filtroTexto.value
    
    if(texto == '' || texto == null || texto == undefined)
      this.listaPendientes = this.listaPendientesCompleta
    else{
      this.listaPendientes = this.listaPendientesCompleta.filter( x => x.ordenFabricacion?.toLowerCase().indexOf(texto) !== -1
        || x.lote?.toLowerCase().indexOf(texto) !== -1)
    }
    

  }

  descargarReporte() {

    if (this.flagDescargarReporte)
      return this._toastr.warning('Se esta descargando el reporte...', "Advertencia !!", { closeButton: true, timeOut: 3000, progressBar: true })

    this.flagDescargarReporte = true
    this._transferenciaService.reporteTransferencia().subscribe(x => {
      this._fileService.decargarExcel_Base64(x, "Reporte de Transferencia", 'xlsx')
      this.flagDescargarReporte = false
    }, _ => this.flagDescargarReporte = false)
  }
}
