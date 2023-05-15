import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seguimiento-lote',
  templateUrl: './seguimiento-lote.component.html',
  styleUrls: ['./seguimiento-lote.component.css']
})
export class SeguimientoLoteComponent implements OnInit {

  formFiltros: FormGroup;
  listaMateriaPrima: any[] = [];
  ordenesDeCompra: any[]= [];
  ordenesDeFabricacion: any[]= [];
  documentosFactura: any[] = [];
  documentosPedidos: any[] = [];
  guiasRelacionadas: any[] = [];
  flagResultItems: boolean = false;
  flagOrdenCompraResult: boolean = false;
  flagOrdenFabricacionResult: boolean = false;
  flagDocumentosPedidosResult: boolean = false;
  flagGuiasRelacionadosResult: boolean = false;
  flagPrimeraBusqueda: boolean = false;

  constructor(private _toastr: ToastrService, private _gestionCalidadService: GestionCalidadService) { }

  ngOnInit(): void {
    this.inicializarFormulario()
  }

  inicializarFormulario()
  {
    this.formFiltros = new FormGroup({
      tipoItem: new FormControl('PT', Validators.required),
      lote: new FormControl('', Validators.required)
    })
  }

  get tipoItem() 
  {
    return this.formFiltros.get('tipoItem').value
  }

  get flagSelectItemMP()
  {
    return this.listaMateriaPrima.filter(x => x.flagSelect ==true).length > 0
  }

  filtrarLote()
  {
    if(this.formFiltros.invalid)
    {
      this.formFiltros.markAllAsTouched();
      this._toastr.warning("Los datos del filtro no son válidos", "Datos incompletos !!", {timeOut: 3000, progressBar: true, closeButton: true})
      return
    }

    this.flagPrimeraBusqueda = true;

    this.listaMateriaPrima = []
    
    const tipoItem = this.formFiltros.get('tipoItem').value
    const lote = this.formFiltros.get('lote').value

    this._gestionCalidadService.listarMateriaPrima(tipoItem, lote).subscribe(
      (resp: any) => {
        this.listaMateriaPrima = resp
        this.flagResultItems  = resp.length > 0 ?  false : true;
      }
    )
  }

  seleccionItem()
  {

    const lotesSelec = this.listaMateriaPrima.filter(x=> x.flagSelect == true).map( x => x.numeroAnalisis)
    const ordFabricacionSelec = this.listaMateriaPrima.filter(x=> x.flagSelect == true).map( x => x.ordenFabricacion)

    const body = {
      lotes: lotesSelec,
      ordenesFabricacion: ordFabricacionSelec
    }

    if(body.lotes.length < 1)
    {
      this.ordenesDeCompra = []
      return
    }

    this._gestionCalidadService.obtenerDetalleSeguimientoLote(body).subscribe( (resp: any) => 
    {
      this.ordenesDeCompra = resp['ordenesDeCompra']
      this.flagOrdenCompraResult = resp['ordenesDeCompra'].length > 0

      this.ordenesDeFabricacion = resp['ordenesDeFabricacion']
      this.flagOrdenFabricacionResult = resp['ordenesDeFabricacion'].length > 0

      this.documentosFactura = resp['documentosPedidos'].filter(documento=> documento.tipoDocumento != 'PE')
      this.documentosPedidos = resp['documentosPedidos'].filter(documento=> documento.tipoDocumento == 'PE')
      this.flagDocumentosPedidosResult= resp['documentosPedidos'].length > 0

      

      this.guiasRelacionadas = resp['guiasRelacionadas']
      this.flagGuiasRelacionadosResult= resp['guiasRelacionadas'].length > 0
    })
  }

 

}
