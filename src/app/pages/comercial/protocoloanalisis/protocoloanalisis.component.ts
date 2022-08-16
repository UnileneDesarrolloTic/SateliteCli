import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, ViewChild } from "@angular/core";
import { ProtocoloAnalisisData } from "@data/interface/Request/ProtocoloAnalisis.interface";
import { ComercialService } from "@data/services/backEnd/pages/comercial.service";
import { Paginado } from "@data/interface/Comodin/Paginado.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SesionService } from "@shared/services/comunes/sesion.service";
import { formatDate } from "@angular/common";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-protocoloanalisis",
  templateUrl: "./protocoloanalisis.component.html",
})
export class ProtocoloAnalisisComponent {
  //Variables Globales - Principal
  GlobalesPrincipal = {
    fechas: true,
    resultB64: "",
    documento: true,
  };
  modalCargaReporte: any;
  modalBusquedaCliente: any;
  listaProtocoloAnalisis: ProtocoloAnalisisData[] = [];
  listaProtocoloAnalisisTemporal: ProtocoloAnalisisData[] = [];
  pagina: Number = 1;
  pageSize: Number = 1000;
  page: Number = 1;
  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 1000,
    totalRegistros: 1,
    siguiente: true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false,
  };

  frmBusqueda: FormGroup;
  disabledInput:boolean=false;

  //Variables Globales - Búsqueda Cliente
  GlobalesBusquedaCliente = {
    data: [],
    _searchTerm: "",
    editing: {},
    rows: new Array(),
    temp: [],
    loadingIndicator: true,
    reorderable: true,
  };
  get searchTerm(): string {
    return this.GlobalesBusquedaCliente._searchTerm;
  }

  @ViewChild(ProtocoloAnalisisComponent) table:
    | ProtocoloAnalisisComponent
    | any;
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _comercialService: ComercialService,
    private _sesionService: SesionService,
    private _fb: FormBuilder
  ) {
    this.crearFormularioBusqueda();
    this.filtrarClientes();
    this.validacampos();
  }

  /****************Funciones - Principal****************/

  crearFormularioBusqueda() {
    this.frmBusqueda = this._fb.group({
      fechaInicio: [{ value: "", disabled: true }],
      fechaFin: [{ value: "", disabled: true }],
      numeroDocumento: [""],
      lote: [""],
      ordenFabricacion: [""],
      idCliente: [""],
      nombreCliente: [""],
      tipoDocu: ["F"],
    });
  }

  ActivaDesactivaFechas() {
    let button = document.getElementById("btnFechas");
    let fechaInicio = <HTMLInputElement>document.getElementById("fechaInicio");
    let fechaFin = <HTMLInputElement>document.getElementById("fechaFin");

    if (this.GlobalesPrincipal.fechas) {
      this.GlobalesPrincipal.fechas = false;
      button.innerHTML = "Desactivar";
      button.removeAttribute("class");
      button.setAttribute(
        "class",
        "btn btn-danger btn-sm mr-0 h-75 border-top-0"
      );
      let date = new Date();
      let day = date.getDate();
      let dayS = day < 10 ? "0" + day : day;
      let month = date.getMonth() + 1;
      let monthS = month < 10 ? "0" + month : month;
      let year = date.getFullYear();
      let now = `${year}-${monthS}-${dayS}`;

      this.frmBusqueda.patchValue({
        fechaInicio: now,
        fechaFin: now,
      });
      fechaInicio.disabled = false;
      fechaFin.disabled = false;
    } else {
      this.GlobalesPrincipal.fechas = true;
      button.innerHTML = "Activar";
      button.removeAttribute("class");
      button.setAttribute(
        "class",
        "btn btn-success btn-sm mr-0 h-75 border-top-0"
      );
      this.frmBusqueda.patchValue({
        fechaInicio: "",
        fechaFin: "",
      });
      fechaInicio.disabled = true;
      fechaFin.disabled = true;
    }
  }

  AlternaGuiaFactura() {
    let button = document.getElementById("btnNroDocumento");
    let nroDocumento = <HTMLInputElement>(
      document.getElementById("nroDocumentoAlterna")
    );

    if (!this.GlobalesPrincipal.documento) {
      this.GlobalesPrincipal.documento = true;
      button.innerHTML = "Factura";
      nroDocumento.removeAttribute("placeholder");
      nroDocumento.setAttribute("placeholder", "N° Factura");
      this.frmBusqueda.patchValue({
        tipoDoc: "F",
      });
    } else {
      this.GlobalesPrincipal.documento = false;
      button.innerHTML = "Guía";
      nroDocumento.removeAttribute("placeholder");
      nroDocumento.setAttribute("placeholder", "N° Guía");
      this.frmBusqueda.patchValue({
        tipoDoc: "G",
      });
    }
  }

  openModalConsultaClientes(modal: NgbModal) {
    this.filtrarClientes();
    this.modalBusquedaCliente = this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });
  }

  cambioPagina(paginaCambiada: Number) {
    this.pagina = paginaCambiada;
    this.filtrarProtocoloAnalisis();
  }

  validacampos(){
    this.frmBusqueda.get("numeroDocumento").patchValue("");
    this.frmBusqueda.controls.tipoDocu.value=="N" ? this.disabledInput=true :  this.disabledInput=false; 
  }

  filtrarProtocoloAnalisis() {
    
    let checkbox = <HTMLInputElement>(
      document.getElementById("alternaSeleccion")
    );
    checkbox.checked = false;
    let fecIni = "";
    let fecFin = "";
    let date = new Date();
    let day = date.getDate();
    let dayS = day < 10 ? "0" + day : day;
    let month = date.getMonth() + 1;
    let monthS = month < 10 ? "0" + month : month;
    let year = date.getFullYear();
    let now = `${year}-${monthS}-${dayS}`;

    if (this.frmBusqueda.get("fechaInicio").value === "") {
      fecIni = now;
      fecFin = now;
    } else {
      fecIni = formatDate(
        this.frmBusqueda.get("fechaInicio").value,
        "dd/MM/yyyy",
        "en"
      );
      fecFin = formatDate(
        this.frmBusqueda.get("fechaFin").value,
        "dd/MM/yyyy",
        "en"
      );
      if (
        this.frmBusqueda.get("fechaInicio").value >
        this.frmBusqueda.get("fechaFin").value
      ) {
        this.toastr.error("La Fecha Inicio no puede ser mayor a la Fecha Fin");
      }
    }

    if(this.frmBusqueda.controls.tipoDocu.value=="N"){
        if(this.frmBusqueda.controls.ordenFabricacion.value.trim()=="" && this.frmBusqueda.controls.lote.value.trim()==""){
            return this.toastr.info("Debe Ingresar la Orden de fabricación o Lote");
        }

        
        
    }

    const body = {
      FechaInicio: fecIni,
      FechaFinal: fecFin,
      NumeroDocumento: this.frmBusqueda.get("numeroDocumento").value,
      Lote: this.frmBusqueda.get("lote").value,
      OrdenFabricacion: this.frmBusqueda.get("ordenFabricacion").value,
      IdCliente: this.frmBusqueda.get("idCliente").value,
      TipoDoc: this.frmBusqueda.get("tipoDocu").value,
      Pagina: this.pagina,
      RegistrosPorPagina: 1000,
    };

    this._comercialService.ListarProtocoloAnalisis(body).subscribe((resp) => {
      this.listaProtocoloAnalisisTemporal = resp["contenido"];
      this.listaProtocoloAnalisis = resp["contenido"];
      this.paginador = resp["paginado"];
      this.listaProtocoloAnalisis.length==0 && this.toastr.info("No se encontraron resultados");
    });
  }

  alternaSeleccion() {
    let checkbox = <HTMLInputElement>(
      document.getElementById("alternaSeleccion")
    );
    if (checkbox.checked) {
      this.seleccionarTodos();
    } else {
      this.desSeleccionarTodos();
    }
  }


  

  seleccionarTodos() {
    let tbody = document.getElementById("tbodyPrincipal");
    tbody.childNodes.forEach((element) => {
      if (element.childNodes.length !== 0) {
        let checkbox = <HTMLInputElement>element.childNodes[10].childNodes[0];
        if (checkbox.getAttribute("disabled") == null) {
          checkbox.checked = true;
        }
      }
    });
  }

  desSeleccionarTodos() {
    let tbody = document.getElementById("tbodyPrincipal");
    tbody.childNodes.forEach((element) => {
      if (element.childNodes.length !== 0) {
        (<HTMLInputElement>element.childNodes[10].childNodes[0]).checked = false;
      }
    });
  }

  filterLotes() {
    let tbody = document.getElementById("tbodyPrincipal");
    let lotes = [];
    tbody.childNodes.forEach((element) => {
      if (element.childNodes.length !== 0) {
        let checkbox = <HTMLInputElement>element.childNodes[10].childNodes[0];
        if (
          checkbox.getAttribute("disabled") == null &&
          checkbox.checked == true
        ) {
          let lote = checkbox.getAttribute("id");
          lotes.push(lote);
        }
      }
    });
    let lotesFormat = lotes.filter((item, index) => {
      return lotes.indexOf(item) === index;
    });
    return lotesFormat;
  }

  async imprimirProtocoloAnalisis(modal: NgbModal) {
    this.openVerticallyCentered(modal);

    let pdfs = [];
    let lotes = this.filterLotes();

    await Promise.all(
      lotes.map(async (lote) => {
        let body = {
          Lote: lote,
        };
        const pdfdoc = await this.ObtieneB64(body);
        const pdf = await PDFDocument.load(pdfdoc);

        pdfs.push(pdf);
      })
    );
    this.mergePdfs(pdfs);
    this.modalCargaReporte.close();
  }

  ObtieneB64(body) {
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

  async mergePdfs(pdfs) {
    const mergedPdf = await PDFDocument.create();
    for (let pdf of pdfs) {
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    const mergedPdfFile = await mergedPdf.save();

    saveAs(new Blob([mergedPdfFile]), "ProtocoloAnalisis.pdf");
  }

  openVerticallyCentered(modal: NgbModal) {
    this.modalCargaReporte = this.modalService.open(modal, {
      centered: true,
      backdrop: "static",
    });
  }

  /****************Funciones - Búsqueda Cliente****************/

  filtrarClientes() {
    const body = {};

    this._comercialService.ListarClientes(body).subscribe((resp) => {
      //console.log(resp);
      this.GlobalesBusquedaCliente.data = resp["content"];
      this.GlobalesBusquedaCliente.rows = this.GlobalesBusquedaCliente.data;
      this.GlobalesBusquedaCliente.temp = [
        ...this.GlobalesBusquedaCliente.data,
      ];
      setTimeout(() => {
        this.GlobalesBusquedaCliente.loadingIndicator = false;
      }, 1500);
    });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.GlobalesBusquedaCliente.temp.filter(function (d) {
      return d.nombreCompleto.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.GlobalesBusquedaCliente.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.GlobalesBusquedaCliente.data;
  }

  updateValue(event: any, cell: any, rowIndex: number) {
    this.GlobalesBusquedaCliente.editing[rowIndex + "-" + cell] = false;
    this.GlobalesBusquedaCliente.rows[rowIndex][cell] = event.target.value;
    this.GlobalesBusquedaCliente.rows = [...this.GlobalesBusquedaCliente.rows];
  }

  ObtenerCliente(row) {
    this.frmBusqueda.patchValue({
      idCliente: row.persona,
      nombreCliente: row.persona + " - " + row.nombreCompleto,
    });
    this.modalBusquedaCliente.close();
  }

  LimpiarCliente() {
    this.frmBusqueda.patchValue({
      idCliente: "",
      nombreCliente: "",
    });
  }


  CambioEstadoTiene(event: any) {
    this.listaProtocoloAnalisis = []
    let TextFiltro = event.target.value;

    this.listaProtocoloAnalisis = this.listaProtocoloAnalisisTemporal

    if (TextFiltro == "S") { // Productos con alerta
      this.listaProtocoloAnalisis = this.listaProtocoloAnalisisTemporal.filter((element:any) => element.protocoloFlag == 'S');
    } else if (TextFiltro == "N") { //Productos sin alerta
      this.listaProtocoloAnalisis = this.listaProtocoloAnalisisTemporal.filter(element => element.protocoloFlag == 'N');
    } else {//Ambas
      this.listaProtocoloAnalisis = this.listaProtocoloAnalisisTemporal
    }
  }
}
