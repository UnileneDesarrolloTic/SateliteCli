import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransferenciaMPService } from '@data/services/backEnd/pages/transferencia-pt.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
import { LogIn } from 'angular-feather/icons';
import { tickStep } from 'd3-array';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-recepcion-pt',
  templateUrl: './recepcion-pt.component.html',
  styleUrls: ['./recepcion-pt.component.css']
})
export class RecepcionPtComponent implements OnInit {

  filtroTexto: FormControl;
  listaPendientes: any[] = []
  listaPendientesCompleto: any[] = []
  formFiltro: FormGroup;
  modalNuevaSolicitud: NgbModalRef;
  formRecepcion: FormGroup;
  flagRegistrarRecepcion: boolean;
  indexSeleccionado: number = -1;
  flagDescargarReporte: boolean = false;

  constructor(private _transferenciaService: TransferenciaMPService, private _modalService: NgbModal, 
      private _toastr: ToastrService,  private _fileService: FileService) { }

  ngOnInit(): void {
    this.inicializarFormulario()
    this.listarPendientesTransferencia()
  }

  inicializarFormulario(){

    this.filtroTexto = new FormControl('')

    this.filtroTexto.valueChanges.pipe(debounceTime(500)).subscribe(x =>
      this.filtrarPorTexto()
    )
    
    this.formFiltro = new FormGroup({
      almacen: new FormControl('ALMPRT', [Validators.required, Validators.minLength(2)]),
      estado: new FormControl('AP', [Validators.required, Validators.minLength(2)])
    })

    this.formRecepcion = new FormGroup({
      controlNumero: new FormControl({value: null, disabled: true}, Validators.required),
      cantidadTotal: new FormControl({value: null, disabled: true}, Validators.required),
      cantidadTransferida: new FormControl({value: null, disabled: true}, [Validators.required, Validators.min(1)]),
      cantidadRecibida: new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(1)]),
    })

  }

  listarPendientesTransferencia(){

    if(this.formFiltro.invalid)
      return this._toastr.warning('El almacen seleccionado no es válido.', 'Advetencia', {closeButton: true, timeOut: 3000, progressBar: true})
    
    const almacen = this.formFiltro.get('almacen').value
    const estado = this.formFiltro.get('estado').value
    this.listaPendientes = []
    
    this._transferenciaService.listaPendienteRecepcionFisica(almacen, estado).subscribe( 
      x => {
        this.listaPendientesCompleto = x
        this.filtrarPorTexto()
      }
    )
  }

  registrarRecepcion(){

    if(this.flagRegistrarRecepcion)
      return this._toastr.warning('Se esta guardando la transferencia.', 'Advetencia', {closeButton: true, timeOut: 3000, progressBar: true})
    
    if(this.indexSeleccionado < 0)
      return this._toastr.warning('Item seleccionado no es válido', 'Advetencia', {closeButton: true, timeOut: 3000, progressBar: true})

    if(this.formRecepcion.invalid)
      return this._toastr.warning('Los datos del formulario no son válidos', 'Advetencia', {closeButton: true, timeOut: 3000, progressBar: true})
    
    this.flagRegistrarRecepcion = true

    const pendienteSeleccionado = this.listaPendientes[this.indexSeleccionado]
    const almacen = this.formFiltro.get('almacen').value

    const cantidaParcial = +this.formRecepcion.get('cantidadRecibida').value

    const body = {
      idDetalle: +pendienteSeleccionado.idDetalle,
      controlNumero: pendienteSeleccionado.controlNumero.trim(),
      lote: pendienteSeleccionado.lote.trim(),
      ordenFabricacion: pendienteSeleccionado.ordenFabricacion.trim(),
      itemCodigo: pendienteSeleccionado.item.trim(),
      cantidadParcial: cantidaParcial,
      almacenDestino: almacen
    }
    this._transferenciaService.registrarRecepcionPT(body).subscribe( mensaje => {

      this.modalNuevaSolicitud.close()
      this._toastr.success(mensaje, 'ÉXITO !!', {closeButton: true, timeOut: 5000, progressBar: true})
      this.flagRegistrarRecepcion = false,
      this.listarPendientesTransferencia()

    },
    _ => this.flagRegistrarRecepcion = false)

  }

  abrirModalRecepcion(modal:NgbModal, index: number)
  {

    if(index < 0)
      return this._toastr.warning('Item seleccionado no es válido', 'Advetencia', {closeButton: true, timeOut: 3000, progressBar: true})

    this.indexSeleccionado = index;
    
    const pendienteSeleccionado = this.listaPendientes[index]
    
    this.formRecepcion.reset()
    
    this.formRecepcion.patchValue({
      controlNumero: pendienteSeleccionado.controlNumero,
      cantidadTotal: formatNumber(pendienteSeleccionado.cantidadTotal, 'en', '1.0-2'),
      cantidadTransferida: formatNumber(pendienteSeleccionado.cantidadEnviada, 'en', '1.0-2'),
      cantidadRecibida: pendienteSeleccionado.cantidadEnviada,  
    })

    this.modalNuevaSolicitud = this._modalService.open(modal, {
        centered: true,
        backdrop: 'static',
        size: 'md',
        scrollable: true
      });
  }

  filtrarPorTexto() {
    
    const texto = this.filtroTexto.value.toLowerCase()
    
    if(texto == '' || texto == null || texto == undefined)
      this.listaPendientes = this.listaPendientesCompleto
    else{
      this.listaPendientes = this.listaPendientesCompleto.filter( x => x.ordenFabricacion?.toLowerCase().indexOf(texto) !== -1
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
