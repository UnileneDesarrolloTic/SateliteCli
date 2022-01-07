import { Component } from '@angular/core';
import { CotizacionData } from '@data/interface/Request/Cotizacion.interface';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver'
import { SesionService } from '@shared/services/comunes/sesion.service';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';

@Component({
  selector: 'app-generacionformatos',
  templateUrl: './generacionformatos.component.html'
})
export class GeneracionFormatosComponent {

  ngmNumeroDocumento : string = '';
  ngmClienteNombre : string = '';
  modalCargaReporte: any;
  _searchTerm: string='';

  get searchTerm(): string {
    return this._searchTerm;
  }

  listaCotizaciones: CotizacionData[] = []

  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  }

  pagina: Number = 1
  pageSize: Number = 10;
  page: Number =1;
  dropdownSettings = {};
  vistaDetalle: Boolean = false;
  IdFormato: Number;
  NroDocumento: String;
  FormatoNoEncontrado: Boolean = false;

  constructor(private modalService: NgbModal, private _cotizacionService: CotizacionService, private _sesionService: SesionService)
  {}

  cambioPagina(paginaCambiada: Number){
    this.pagina = paginaCambiada;
    this.filtrarCotizaciones();
  }

  filtrarCotizaciones(){
    const body = {
      NumeroDocumento: this.ngmNumeroDocumento.trim() ,//this.formulario.get('codigoCertificado').value,
      ClienteNombre: this.ngmClienteNombre.trim(),
      Pagina : this.pagina,
      RegistrosPorPagina: 10
    }

    this._cotizacionService.ListarCotizaciones(body).subscribe( resp => {
      this.listaCotizaciones = resp['contenido']
      this.paginador = resp['paginado'];
    });
  }

  public closeAlert() {
    this.FormatoNoEncontrado = false;
  }

  GenerarReporte(numeroDocumento, idFormato, modal: NgbModal){
    const body = {
      NumeroDocumento: numeroDocumento,
      IdFormato: parseInt(idFormato)
    }
    this.openVerticallyCentered(modal);
    var base64 = "";
    this._cotizacionService.GenerarReporteCotizacion(body).subscribe( resp => {
      base64 = resp['content']
      this.downloadFile(base64, "Cotizacion_" + numeroDocumento + ".xls");
      this.modalCargaReporte.close();
    });
  }

  openVerticallyCentered(modal: NgbModal) {
		this.modalCargaReporte = this.modalService.open(modal, { centered: true, backdrop: 'static' });
	}

  base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }
  downloadFile(b64encodedString: string, name: string) {
    if (b64encodedString) {
      var blob = this.base64ToBlob(b64encodedString, 'text/plain');
      saveAs(blob, name);
    }
  }
  Editar(idFormato, numeroDocumento){
    if(idFormato == 0){
      this.FormatoNoEncontrado = true;
    }
    else{
      this.FormatoNoEncontrado = false;
      this.vistaDetalle = true;
      this.IdFormato = idFormato;
      this.NroDocumento = numeroDocumento;

      const body = {
        IdFormato: parseInt(idFormato),
        NumeroDocumento: numeroDocumento
      }

      this._cotizacionService.ObtenerEstructuraFormato(body).subscribe( resp => {
        var data = resp;
        this.ConstruirDetalle(data);
      });

    }
  }

  CancelEdit(){
    this.vistaDetalle = false;
  }
  ConstruirDetalle(data){

    var campos = data.campos;
    campos.forEach(element => {
      var divHijo = document.createElement("div");
      var divNieto = document.createElement("div");
      var label = document.createElement("label");
      var input = document.createElement("input");
      var spanIdCampo = document.createElement("span");
      var spanTipoCampo = document.createElement("span");
      spanIdCampo.textContent = element.idCampo;
      spanIdCampo.setAttribute("hidden", "");
      spanTipoCampo.textContent = element.tipoCampo;
      spanTipoCampo.setAttribute("hidden", "");
      document.getElementById("contenedor").appendChild(divHijo);
      divHijo.appendChild(divNieto);
      divNieto.appendChild(label);
      divNieto.appendChild(input);
      divNieto.appendChild(spanIdCampo);
      divNieto.appendChild(spanTipoCampo);
      divHijo.setAttribute("class", "col-md-4");
      divNieto.setAttribute("class", "form-group");
      label.setAttribute("class", "control-label");
      label.htmlFor = element.identificador;
      label.innerHTML = element.descripcionCampo;
      input.classList.add("form-control");
      input.type = "text";
      input.value = element.valorDefault;
      input.setAttribute("id",element.identificador);
    });
    //Contrucción de Tabla
    var cabeceras = data.cabeceras;
    var detalle = data.data;

    var tercerDiv = document.getElementById("cbTitle");
    var h4 = document.createElement("h4");
    h4.setAttribute("class", "card-title");
    h4.innerHTML = "Detalle"
    tercerDiv.appendChild(h4);
    var bodyt = document.getElementById("cbBody");


    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var trh = document.createElement("tr");
    table.setAttribute("class", "table table-striped no-wrap border mt-4 table-responsive");
    table.setAttribute("style", "font-size: 12px")
    bodyt.appendChild(table);

    table.appendChild(thead);
    thead.appendChild(trh);
    cabeceras.forEach(element => {
      var th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.setAttribute("style", "vertical-align: middle");
      th.innerHTML = element.nombreCabecera;
      trh.appendChild(th);
    });

    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbodyDetalle")
    table.appendChild(tbody);
    detalle.forEach(elementSup => {
      var tr = document.createElement("tr");
      // tr.setAttribute("role", "row");
      // tr.setAttribute("class", "odd");
      tbody.appendChild(tr);
      elementSup.lstFilas.forEach(elementInf => {
        var td = document.createElement("td");
        td.innerHTML = elementInf.valorColumna;
        td.setAttribute("contenteditable", "true");
        tr.appendChild(td);
      });
    });

  }

  GenerarCotizacion(modal: NgbModal){
    this.ConstruirBodyRespuestas(this.IdFormato, this.NroDocumento, modal);
  }

  ConstruirBodyRespuestas(IdFormato, NroDocumento, modal){
    const datosUsuario: UsuarioSesionData = this._sesionService.datosPersonales();

    var contenedor = document.getElementById("contenedor");
    var body = Object();
    var resp = Array();
    contenedor.childNodes.forEach(element => {
      var obj = Object();
      obj.DescripcionCampo = element.childNodes[0].childNodes[0].textContent;
      obj.CodigoDescripcionCampo = (<HTMLInputElement>element.childNodes[0].childNodes[1]).id;
      obj.Respuesta = (<HTMLInputElement>element.childNodes[0].childNodes[1]).value;
      obj.IdCampo = parseInt((<HTMLSpanElement>element.childNodes[0].childNodes[2]).innerHTML);
      obj.TipoCampo = element.childNodes[0].childNodes[3].textContent;
      obj.CodigoRespuesta = "";
      resp.push(obj);
    });

    body.IdFormato = parseInt(IdFormato);
    body.NroDocumento = NroDocumento;
    body.CodUsuario = datosUsuario.codUsuario;
    body.Campos = resp;

    var tbody = document.getElementById("tbodyDetalle");
    var data = "";

    tbody.childNodes.forEach(element => {
      var trs = element.childNodes;
      trs.forEach(item => {
        data = data + "'" + (<HTMLTableCellElement>item).innerHTML + "'" + "^";
      });
      data = data.substring(0, data.length - 1);
      data = data + "|"
    });

    let caracter = /<br>/gi;
    var DataFinal = data.substring(0, data.length - 1);
    body.Detalle = DataFinal.replace(caracter, '');

    this._cotizacionService.RegistrarRespuestas(body).subscribe( resp => {
      this.GenerarReporte(NroDocumento, IdFormato, modal)
      this.CancelEdit();
    });
  }
}
