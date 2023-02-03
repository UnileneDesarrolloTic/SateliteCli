import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemVentasModel } from '@data/interface/Response/DatosFormatoItemsVentas.interfaces';
import { LineaModel } from '@data/interface/Response/DatosLinea.interface';
import { SubFamiliaModel } from '@data/interface/Response/DatosSubFamilia.interface';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { FileService } from '@shared/services/comunes/file.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ventas-clientes',
  templateUrl: './ventas-clientes.component.html',
  styleUrls: ['./ventas-clientes.component.css']
})
export class VentasClientesComponent implements OnInit {

  listaLinea:LineaModel[]=[];
  listaFamilia:ListaFamiliaMaestroItem[]=[];
  listaSubFamilia:SubFamiliaModel[]=[];
  listarItem:ItemVentasModel[]=[];
  listarcliente:object[]=[];
  listaVentas:any[]=[];
  flagResultadosVentas: boolean = false;
  flagPrimeraConsulta: boolean = false;
  cantidadDeVentas: number = 0;

  formFiltros: FormGroup;
  private fechaActual: Date = new Date(Date.now());
  private primerDiaMes: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);

  constructor(private _genericoService: GenericoService, private _toastrService: ToastrService, private _modalService: NgbModal,
    private _comercialService: ComercialService, private _gestionCalidad: GestionCalidadService, private _fileService: FileService) 
  {
    this.inicializarFormulario();
  }

  ngOnInit(): void 
  {
    this.cargarComboLinea();
    this.listarCliente();

    
  }

  inicializarFormulario()
  {
    this.formFiltros = new FormGroup({
      cliente: new FormControl(0),
      clienteNombre: new FormControl({value:'', disabled: true}),
      linea : new FormControl(''),
      familia : new FormControl(''),
      subFamilia : new FormControl(''),
      fechaInicio: new FormControl(''),//new FormControl(formatDate(this.primerDiaMes, 'yyyy-MM-dd', 'en')),
      fechaFin: new FormControl(''), //new FormControl(formatDate(this.fechaActual, 'yyyy-MM-dd', 'en')),
      item: new FormControl(''),
      numeroParte: new FormControl(''),
      lote: new FormControl('')
    })

    this.formFiltros.get('linea').valueChanges.subscribe( () => this.cargarComboLineaFamilia())
    this.formFiltros.get('familia').valueChanges.subscribe( () => this.cargarComboSubFamilia())
  }

  cargarComboLinea()
  {
    this.listaLinea = []

    this._genericoService.ListarLinea().subscribe(
      (resp:any)=>
      {
        if(resp["success"])
        {
          this.listaLinea = resp["content"];
          this.cargarComboLineaFamilia();
        }
      }
    )
  }

  cargarComboLineaFamilia()
  {

    this.formFiltros.patchValue({
      familia: '',
      subFamilia: ''
    })

    this.listaFamilia = []
    this.listaSubFamilia = []

    const lineaSeleccionada = this.formFiltros.get('linea').value

    if(lineaSeleccionada != '' && lineaSeleccionada != undefined)
    {
      this._genericoService.ListarGenerar(lineaSeleccionada).subscribe(
        (resp:any)=>
        {
          if(resp["success"])
            this.listaFamilia = resp["content"];

          this.cargarComboSubFamilia()
        }
      )
    }
  }

  cargarComboSubFamilia()
  {   
    this.listaSubFamilia = []

    this.formFiltros.patchValue({
      subFamilia: ''
    })

    const lineaSeleccionado = this.formFiltros.get('linea').value;
    const familiaSeleccionado = this.formFiltros.get('familia').value;

    if(lineaSeleccionado != '' && familiaSeleccionado != '' && familiaSeleccionado != undefined && lineaSeleccionado != '')
    {
      this._genericoService.ListarSubFamilia(lineaSeleccionado, familiaSeleccionado).subscribe(
        (resp:any)=>
        {
          if(resp["success"])
            this.listaSubFamilia = resp["content"];          
        }
      )

    }
  }

  filtrarVentas()
  {

    let cliente = this.formFiltros.get('cliente').value
    let lote = this.formFiltros.get('lote').value
    
    console.log(cliente);
    
    if ((cliente == '' || cliente == 0 || cliente == null) && lote == '')
    {
      this._toastrService.warning('Los filtros debe ser por cliente o lote','Advertencia !!', {timeOut: 2000, closeButton: true, progressBar: true})
      return
    }
    
    let inicio = this.formFiltros.get('fechaInicio').value
    let fin = this.formFiltros.get('fechaFin').value

    if(lote == '' && (cliente == '' || cliente == 0 || cliente == null)  && (inicio == '' || fin == ''))
    {
      this._toastrService.warning('Al buscar por cliente debe de seleccionar un rango de fechas.','Advertencia !!', {timeOut: 2000, closeButton: true, progressBar: true})
      return
    }

    if (cliente == null)
      this.formFiltros.patchValue({
        cliente : 0
      })

    if (this.formFiltros.get('fechaInicio').value == '' || this.formFiltros.get('fechaFin').value == ''){
      this.formFiltros.patchValue({
        fechaInicio: null,
        fechaFin: null
      })
    }
    
    const body = {
      ...this.formFiltros.value
    };

    this.flagPrimeraConsulta = true;
    this.flagResultadosVentas = true;
    this.listaVentas = [];
    this.cantidadDeVentas = 0;

    this._gestionCalidad.obtenerVentaPorCliente(body).subscribe(
      (resp: any[]) => 
      {
        this.listaVentas = resp
        this.cantidadDeVentas = resp.length;
        this.flagResultadosVentas = resp.length > 0;
      }
    )
    
  }

  limpiarCliente () 
  {
    this.formFiltros.patchValue({
      cliente: 0,
      clienteNombre: "",
    });
  }

  listarCliente()
  {
    this._comercialService.ListarClientes({}).subscribe(
      (resp) => resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[]
    );
  }

  descargarReporte()
  {
    let cliente = this.formFiltros.get('cliente').value
    let lote = this.formFiltros.get('lote').value
    console.log(cliente);
    
    if ((cliente == '' || cliente == 0 || cliente == null) && lote == '')
    {
      this._toastrService.warning('Los filtros debe ser por cliente o lote','Advertencia !!', {timeOut: 2000, closeButton: true, progressBar: true})
      return
    }
    
    let inicio = this.formFiltros.get('fechaInicio').value
    let fin = this.formFiltros.get('fechaFin').value

    if(lote == '' && (cliente == '' || cliente == 0 || cliente == null) && (inicio == '' || fin == ''))
    {
      this._toastrService.warning('Al buscar por cliente debe de seleccionar un rango de fechas.','Advertencia !!', {timeOut: 2000, closeButton: true, progressBar: true})
      return
    }

    if (cliente == null)
      this.formFiltros.patchValue({
        cliente : 0
      })

    if (this.formFiltros.get('fechaInicio').value == '' || this.formFiltros.get('fechaFin').value == ''){
      this.formFiltros.patchValue({
        fechaInicio: null,
        fechaFin: null
      })
    }

    const body = {
      ...this.formFiltros.value
    };

    this._gestionCalidad.ReporteVentasPorCliente(body).subscribe(
      (resp: any) => {

        if(resp.content == null)
        {
          this._toastrService.warning(resp.message, 'Avíso !!', { closeButton: true, timeOut: 3000, progressBar: true})
          return
        }

        this._fileService.decargarExcel_Base64(resp.content, "Ventas por cliente", 'xlsx')
      }
    )

  }

  openModalConsultaClientes()
  {
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });

    this.formFiltros.patchValue({           
      cliente: null,
      clienteNombre: ''
    })
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => 
    {
        if(result!=undefined)
        {
          this.formFiltros.patchValue({           
            cliente: parseInt(result.persona),
            clienteNombre: result.nombreCompleto
          })
          
          if(this.formFiltros.get('lote').value == '' && this.formFiltros.get('fechaInicio').value == '' && this.formFiltros.get('fechaFin').value == '' )
          {
            this.formFiltros.patchValue({
              fechaInicio: formatDate(this.primerDiaMes, 'yyyy-MM-dd', 'en'),
              fechaFin: formatDate(this.fechaActual, 'yyyy-MM-dd', 'en')
            })
          }
        }
		});
     
  }

}
