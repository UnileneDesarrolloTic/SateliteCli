import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ProtocoloAnalisisData } from "@data/interface/Request/ProtocoloAnalisis.interface";
import { ComercialService } from "@data/services/backEnd/pages/comercial.service";
import { Paginado } from "@data/interface/Comodin/Paginado.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SesionService } from "@shared/services/comunes/sesion.service";
import { formatDate } from "@angular/common";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToastrService } from "ngx-toastr";
import { ModalCargarComponent } from "@shared/components/modal-cargar/modal-cargar.component";
import { Cargarbase64Service } from "@shared/services/comunes/cargarbase64.service";
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

  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado protocolos',
    'totalMessage': 'Protocolos'
  }

  frmBusqueda: FormGroup;
  disabledInput:boolean=false;

  constructor(
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    private _comercialService: ComercialService,
    private toastr: ToastrService,
    private _fileService: FileService,
    private modalService: NgbModal,
    private _sesionService: SesionService,
    private servicebase64:Cargarbase64Service,
  )
  {
    this.crearFormularioBusqueda();
    // this.filtrarClientes();
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
        numeroDocumento: [{ value: "0000000146", disabled: true }],
        lote: [""],
        ordenFabricacion: [""],
        idCliente: [""],
        nombreCliente: [{ value: "", disabled: true }],
        tipoDocumento: ["C"],
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

    if(!boolValidacion)
      return

    if(body.fechaInicio == "" || body.fechaFin == "")
    {
      body.fechaInicio = null
      body.fechaFin = null
    }

    body.idCliente = body.idCliente == "" ? 0 : body.idCliente;

    this.flagLoading = true;
    this.listaProtocoloAnalisisAux = [];

    this._comercialService.ListarProtocoloAnalisis(body).subscribe(resp => 
    {
      this.listaProtocoloAnalisisAux = resp["content"];
      // this.listaProtocoloAnalisis = resp["content"];
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

  // AlternaGuiaFactura() {
  //   let button = document.getElementById("btnNroDocumento");
  //   let nroDocumento = <HTMLInputElement>(
  //     document.getElementById("nroDocumentoAlterna")
  //   );

  //   if (!this.GlobalesPrincipal.documento) {
  //     this.GlobalesPrincipal.documento = true;
  //     button.innerHTML = "Factura";
  //     nroDocumento.removeAttribute("placeholder");
  //     nroDocumento.setAttribute("placeholder", "N° Factura");
  //     this.frmBusqueda.patchValue({
  //       tipoDoc: "F",
  //     });
  //   } else {
  //     this.GlobalesPrincipal.documento = false;
  //     button.innerHTML = "Guía";
  //     nroDocumento.removeAttribute("placeholder");
  //     nroDocumento.setAttribute("placeholder", "N° Guía");
  //     this.frmBusqueda.patchValue({
  //       tipoDoc: "G",
  //     });
  //   }
  // }

  // filterLotes() {
  //   let tbody = document.getElementById("tbodyPrincipal");
  //   let lotes = [];
  //   tbody.childNodes.forEach((element) => {
  //     if (element.childNodes.length !== 0) {
  //       let checkbox = <HTMLInputElement>element.childNodes[10].childNodes[0];
  //       if (
  //         checkbox.getAttribute("disabled") == null &&
  //         checkbox.checked == true
  //       ) {
  //         let lote = checkbox.getAttribute("id");
  //         lotes.push(lote);
  //       }
  //     }
  //   });
  //   let lotesFormat = lotes.filter((item, index) => {
  //     return lotes.indexOf(item) === index;
  //   });
  //   return lotesFormat;
  // }

  // async imprimirProtocoloAnalisis(modal: NgbModal) {
  //   this.openVerticallyCentered(modal);

  //   let pdfs = [];
  //   let lotes = this.filterLotes();

  //   await Promise.all(
  //     lotes.map(async (lote) => {
  //       let body = {
  //         Lote: lote,
  //       };
  //       const pdfdoc = await this.ObtieneB64(body);
  //       const pdf = await PDFDocument.load(pdfdoc);

  //       pdfs.push(pdf);
  //     })
  //   );
  //   this.mergePdfs(pdfs);
  //   this.modalCargaReporte.close();
  // }

  ObtieneB64(body) 
  {
    var b64 = new Promise<string>((resolve, reject) => {
      this._comercialService
        .GenerarReporteProtocoloAnalisis(body)
        .subscribe(async (resp) => {
          let base64 = resp["content"];
          resolve(base64);
        });
    });
    return b64;
  }

  // async mergePdfs(pdfs) {
  //   const mergedPdf = await PDFDocument.create();
  //   for (let pdf of pdfs) {
  //     const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  //     copiedPages.forEach((page) => {
  //       mergedPdf.addPage(page);
  //     });
  //   }
  //   const mergedPdfFile = await mergedPdf.save();

  //   saveAs(new Blob([mergedPdfFile]), "ProtocoloAnalisis.pdf");
  // }

  // openVerticallyCentered(modal: NgbModal) {
  //   this.modalCargaReporte = this.modalService.open(modal, {
  //     centered: true,
  //     backdrop: "static",
  //   });
  // }

  // /****************Funciones - Búsqueda Cliente****************/

  // filtrarClientes() {
  //   const body = {};

  //   this._comercialService.ListarClientes(body).subscribe((resp) => {
  //     //console.log(resp);
  //     this.GlobalesBusquedaCliente.data = resp["content"];
  //     this.GlobalesBusquedaCliente.rows = this.GlobalesBusquedaCliente.data;
  //     this.GlobalesBusquedaCliente.temp = [
  //       ...this.GlobalesBusquedaCliente.data,
  //     ];
  //     setTimeout(() => {
  //       this.GlobalesBusquedaCliente.loadingIndicator = false;
  //     }, 1500);
  //   });
  // }

  // updateFilter(event: any) {
  //   const val = event.target.value.toLowerCase();

  //   // filter our data
  //   const temp = this.GlobalesBusquedaCliente.temp.filter(function (d) {
  //     return d.nombreCompleto.toLowerCase().indexOf(val) !== -1 || !val;
  //   });

  //   // update the rows
  //   this.GlobalesBusquedaCliente.rows = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.table = this.GlobalesBusquedaCliente.data;
  // }

  // updateValue(event: any, cell: any, rowIndex: number) {
  //   this.GlobalesBusquedaCliente.editing[rowIndex + "-" + cell] = false;
  //   this.GlobalesBusquedaCliente.rows[rowIndex][cell] = event.target.value;
  //   this.GlobalesBusquedaCliente.rows = [...this.GlobalesBusquedaCliente.rows];
  // }

  // ObtenerCliente(row) {
  //   this.frmBusqueda.patchValue({
  //     idCliente: row.persona,
  //     nombreCliente: row.persona + " - " + row.nombreCompleto,
  //   });
  //   this.modalBusquedaCliente.close();
  // }

  

  // CambioEstadoTiene(event: any) {
  //   this.listaProtocoloAnalisis = []  
  //   let TextFiltro = event.target.value;

  //   this.listaProtocoloAnalisis = this.listaProtocoloAnalisisAux

  //   if (TextFiltro == "S") { // Productos con alerta
  //     this.listaProtocoloAnalisis = this.listaProtocoloAnalisisAux.filter((element:any) => element.protocoloFlag == 'S');
  //   } else if (TextFiltro == "N") { //Productos sin alerta
  //     this.listaProtocoloAnalisis = this.listaProtocoloAnalisisAux.filter(element => element.protocoloFlag == 'N');
  //   } else {//Ambas
  //     this.listaProtocoloAnalisis = this.listaProtocoloAnalisisAux
  //   }
  // }

  
}
