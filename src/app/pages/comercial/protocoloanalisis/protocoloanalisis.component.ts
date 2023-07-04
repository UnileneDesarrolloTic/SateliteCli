import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ProtocoloAnalisisData } from "@data/interface/Request/ProtocoloAnalisis.interface";
import { ComercialService } from "@data/services/backEnd/pages/comercial.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ModalClienteComponent } from "@shared/components/modal-cliente/modal-cliente.component";
import { FileService } from "@shared/services/comunes/file.service";

@Component({
  selector: "app-protocoloanalisis",
  templateUrl: "./protocoloanalisis.component.html",
})
export class ProtocoloAnalisisComponent implements OnInit
{
  listaProtocoloAnalisis: ProtocoloAnalisisData[] = [];
  listaProtocoloAnalisisAux: ProtocoloAnalisisData[] = [];
  modalCargaReporte: any;
  modalBusquedaCliente: any;
  flagLoading: boolean = false;
  listarcliente:object[] = [];
  selected = [];
  flagDescargarLista: boolean = false;
  flagDescargarPdf: boolean = false;

  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado protocolos',
    'totalMessage': 'Protocolos'
  }

  frmBusqueda: FormGroup;
  disabledInput:boolean=false;

  //IMPRIMIR PROTOCOLO 
  idioma = new FormControl(1);

  constructor( private _fb: FormBuilder, private _modalService: NgbModal, private _comercialService: ComercialService,
    private toastr: ToastrService, private _fileService: FileService )
  {
    this.crearFormularioBusqueda();
  }

  ngOnInit(): void 
  {
    this.listarCliente();
  }

  listarCliente()
  {
    this._comercialService.ListarClientes({}).subscribe(
      (resp) => resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[]
    );
  }

  crearFormularioBusqueda() 
  {
    this.frmBusqueda = this._fb.group(
      {
        fechaInicio: [""],
        fechaFin: [""],
        numeroDocumento: [{ value: "", disabled: false }],
        lote: [""],
        ordenFabricacion: [""],
        idCliente: [""],
        nombreCliente: [{ value: "", disabled: true }],
        tipoDocumento: ["F"],
        protocolo: [""],
      });
  }

  openModalConsultaClientes() 
  {
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });

    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => {        
        if(result!=undefined){
          this.frmBusqueda.patchValue({           
            idCliente: parseInt(result.persona),
            nombreCliente: result.nombreCompleto
          })
        }
		});
  }
  
  filtrarProtocoloAnalisis() 
  {
    const body = this.frmBusqueda.getRawValue();
    const boolValidacion: boolean = this.validarFiltros(body);

    this.selected = [];

    if(!boolValidacion)
      return

    if(body.fechaInicio == "" || body.fechaFin == "")
    {
      body.fechaInicio = null
      body.fechaFin = null
    }

    body.idCliente = body.idCliente == "" ? 0 : body.idCliente;

    this.flagLoading = true;
    this.listaProtocoloAnalisis = [];

    this._comercialService.ListarProtocoloAnalisis(body).subscribe(resp => 
    {
      this.listaProtocoloAnalisisAux = resp["content"];
      this.listaProtocoloAnalisis = resp["content"];
      this.flagLoading = false;
    },
    err => {
      this.flagLoading = false;
    });
  }

  exportarExcel()
  {
    if(this.flagDescargarLista)
    {
      this.toastr.warning('Espere un momento por favor...', 'Advertencia !!', { progressBar: true, timeOut: 2000, closeButton: true });
      return
    }

    const body = this.frmBusqueda.getRawValue();
    const resultValidacion: boolean = this.validarFiltros(body);

    if(!resultValidacion)
      return

    if(body.fechaInicio == "" || body.fechaFin == "")
    {
      body.fechaInicio = null
      body.fechaFin = null
    }

    body.idCliente = body.idCliente == "" ? 0 : body.idCliente;

    this.flagDescargarLista = true;
    
    this._comercialService.ExportarExcelProtocoloAnalisis(body).subscribe(
      (resp:any) =>
        {
          if(resp.success)
            this._fileService.decargarExcel_Base64(resp.content, "Protocolo análisis", "xlsx");
          else
            this.toastr.info(resp.message, "Advertencia !!", { progressBar: true, timeOut: 3000, closeButton: true });
          
          this.flagDescargarLista = false;
        }, 
        err => this.flagDescargarLista = false
    );
  }


  modalProtocolo(modal:NgbModal)
  { 
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

  }


  imprimirProtocolos(){

    const lotesSeleccion = this.selected.filter( p => p.ordenFabricacion).map( p => p.ordenFabricacion)

    if(lotesSeleccion.length < 1)
    {
      this.toastr.warning("No se detecto ningun protocolo seleccionado", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000})
      return
    }
   
    if(lotesSeleccion.length != this.selected.length)
      this.toastr.warning("Para los protocolos seleccionados sin Ord. Fabricación, no se podra generar el reporte.", "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000})

    const ordenesFabricacion = { ordenesFabricacion: lotesSeleccion , idioma: this.idioma.value}
    this.flagDescargarPdf = true;


    this._comercialService.GenerarReporteProtocoloAnalisis(ordenesFabricacion).subscribe( resp => 
      {
        if(!resp['success'])
        {
          this.toastr.error(resp['message'], "Error !!", { closeButton: true, progressBar: true, timeOut: 3000})
          this.flagDescargarPdf = false;
          return
        }

        if(resp['message'] !== "Ok")
          this.toastr.warning(resp['message'], "Advertencia !!", { closeButton: true, progressBar: true, timeOut: 3000})
        

        this._fileService.decargarPDF_Base64(resp['content'], "Protocolo de Análisis")
        this.flagDescargarPdf = false;
      },
      err => this.flagDescargarPdf = false
    );
  }


  

  eventoSeleccionar( {selected} ) 
  {
    this.selected = []
    this.selected.push(...selected);
  }

  cambioTipoDocumento ()
  {
    if (this.tipoDocumento == '')
    {
      this.frmBusqueda.patchValue({
        numeroDocumento: ""
      })
      this.frmBusqueda.controls['numeroDocumento'].disable()
    }
    else
      this.frmBusqueda.controls['numeroDocumento'].enable()
  }

  limpiarCliente () 
  {
    this.frmBusqueda.patchValue({
      idCliente: "",
      nombreCliente: "",
    });
  }
  
  private validarFiltros(formDatos): boolean
  {
    if (formDatos.lote == '' && formDatos.ordenFabricacion == '' && formDatos.tipoDocumento == '')
    {
      this.toastr.warning("Debe de contrar como mínimo con los filtros: Ord. Fabricacion, Lote ó Documento", "Advertencia !!", {closeButton: true, progressBar: true, timeOut: 3000})
      return false
    }

    if (formDatos.tipoDocumento != '' && formDatos.numeroDocumento == '')
    {
      this.toastr.warning("Debe de ingresar el tipo y número de documento", "Advertencia !!", {closeButton: true, progressBar: true, timeOut: 3000})
      return false
    }
    
    if ((formDatos.fechaInicio == '' && formDatos.fechaFin != '') || (formDatos.fechaInicio != '' && formDatos.fechaFin == '') )
    {
      this.toastr.warning("Las fechas no son válidas.", "Advertencia !!", {closeButton: true, progressBar: true, timeOut: 3000})
      return false
    }

    if ( formDatos.fechaInicio > formDatos.fechaFin ) 
    {
      this.toastr.warning("La fecha inicio no puede ser mayor a la fecha fin", "Advertencia !!", {closeButton: true, progressBar: true, timeOut: 3000})
      return false
    }

    if(formDatos.fechaInicio.substring(0,7) != formDatos.fechaFin.substring(0,7))
    {
      this.toastr.warning("Las fechas deben pertenecer al mismo periodo", "Advertencia !!", {closeButton: true, progressBar: true, timeOut: 3000})
      return false
    }

    return true;
  }

  get tipoDocumento()
  {
    return this.frmBusqueda.get('tipoDocumento').value
  }

}
