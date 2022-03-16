import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { ToastrService } from 'ngx-toastr';
import { CotizacionData } from '@data/interface/Request/Cotizacion.interface';
import { CabeceraPantillaCotizacion } from '@data/interface/Response/CabeceraPantillaCotizacion.interface';
import { Cotizacion } from '@data/interface/Response/Cotizacion.interface';
import { DetalleCotizacion } from '@data/interface/Response/DetalleCotizacion.interface';
import { DetallePantillaCotizacion } from '@data/interface/Response/DetallePantillaCotizacion.interface';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { entries } from 'd3';


@Component({
	selector: 'app-cotizacion',
	templateUrl: './cotizacion.component.html',
	styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

	vistaDetalle: Boolean = false;
	FormatoNoEncontrado: Boolean = false;
	IdFormato: Number;
	NroDocumento: String;
	pagina: Number = 1
	pageSize: Number = 10;
	page: Number = 1;
	dropdownSettings = {};

	//para editar
	Formulario: FormGroup;

	listaCotizaciones: CotizacionData[] = [
		{
			"idFormato": 12,
			"numeroDocumento": "0000019372",
			"clienteNombre": "CLINICA ESPECIALIZADA EMANUEL SOCIEDAD ANONIMA CERRADA",
			"clienteRUC": "20601681898",
			"clienteDireccion": "CAL. LAS AZUCENAS 203 (PLAZA JOSE A. QUIÑONES)",
			"contacto": "Logistica"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019371",
			"clienteNombre": "SUTUMED CORPORATION",
			"clienteRUC": "90000000168",
			"clienteDireccion": "9280 COLLEGE PKWAY, UNIT #5, FORT MYERS FL 33919",
			"contacto": "QIHAN ZHAI"
		},
		{
			"idFormato": 5,
			"numeroDocumento": "0000019370",
			"clienteNombre": "SEGURO SOCIAL DE SALUD ESSALUD-RED PRESTACIONAL ALMENARA",
			"clienteRUC": "20131257750",
			"clienteDireccion": "AV. GRAU No. 800",
			"contacto": "Ismael Lopez"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019369",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019368",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019367",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019366",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019365",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019364",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		},
		{
			"idFormato": 12,
			"numeroDocumento": "0000019363",
			"clienteNombre": "HOSP. DE APOYO DEPART. MARIA AUXILIADORA",
			"clienteRUC": "20162041291",
			"clienteDireccion": "AV.MIGUEL IGLESIAS 968",
			"contacto": "Paddy Pella Jimenez - Programación"
		}
	]

	// Cabecera Pantilla
	ListCamposPantillaCabecera: CabeceraPantillaCotizacion[] = [];

	//detalle Pantilla
	ListCabeceraDetalle: DetallePantillaCotizacion[] = [];
	CabeceraDetalle: any = [];

	//Detalle Cotizacion 
	DetalleCotizacion: DetalleCotizacion[] = []


	InformacionCotizacion: any;


	paginador: Paginado = {
		paginaActual: 1,
		totalPaginas: 1,
		registroPorPagina: 10,
		totalRegistros: 1,
		siguiente: true,
		anterior: false,
		primeraPagina: true,
		ultimaPagina: false
	}

	constructor(private modalService: NgbModal,
		private _sesionService: SesionService,
		private _cotizacionService: CotizacionService,
		private _fb: FormBuilder,
		private toastr: ToastrService) {

		this.Formulario = this._fb.group({
			// cabecera: new FormArray([]),
			detalle: new FormArray([]),
		})
	}

	ngOnInit(): void {
		this.paginador = {
			"paginaActual": 1,
			"totalPaginas": 1919,
			"registroPorPagina": 10,
			"totalRegistros": 19185,
			"siguiente": true,
			"anterior": false,
			"primeraPagina": false,
			"ultimaPagina": true
		};

	}


	// Editar Cotizacion 
	Editar(idFormato, numeroDocumento) {

		this._cotizacionService.SeleccionarCotizacion().subscribe(
			(resp: Cotizacion) => {

				if (resp.cabecera.length > 0) {
					this.ListCamposPantillaCabecera = [];
					this.CabeceraDetalle=[];
					this.InformacionCotizacion = [];
					this.DetalleCotizacion = [];


					this.vistaDetalle = true;
					this.IdFormato = idFormato;
					this.NroDocumento = numeroDocumento;
					this.ListCamposPantillaCabecera = resp.cabecera;
					this.ListCabeceraDetalle = resp.detalle;
					this.ListarDetalleCotizacion();
					this.ConstruirDetalle();
				} else {
					this.toastr.info("La cotización elegida no cuenta con un formato, favor de revisar el número de documento");
				}

			}
		)

	}

	ListDetalleCotizacion(): FormArray {
		return this.Formulario.get("detalle") as FormArray;
	}

	async ListarDetalleCotizacion() {
		return this._cotizacionService.InformacionDetalleCotizacion().toPromise()
	}

	async ConstruirDetalle() {
		for (let items in this.ListCamposPantillaCabecera) {
			this.Formulario.addControl(this.ListCamposPantillaCabecera[items].columnaResp, new FormControl(this.ListCamposPantillaCabecera[items].valorDefecto, this.ListCamposPantillaCabecera[items].requerido ? Validators.required : null))
		}
		//CABECERA DEL DETALLE
		this.CabeceraDetalle = this.ListCabeceraDetalle.map((items: any) => ({ columnaResp: items.columnaResp, valorDefecto: items.valorDefecto, requerido: items.requerido, tipoDato: items.tipoDato }))
		this.InformacionCotizacion = await this.ListarDetalleCotizacion();
		this.DetalleCotizacion = this.InformacionCotizacion.detalle;
		this.ConstruirTable(this.DetalleCotizacion, this.ListCabeceraDetalle);

	}

	ConstruirTable(ArrayListDetalleCotizacion, ArrayCabecera) {

		var cabeceras = ArrayCabecera;
		var detalle = ArrayListDetalleCotizacion;

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
			th.innerHTML = element.columnaResp;
			trh.appendChild(th);
		});
		//cabecera de opcion
		var th = document.createElement("th");
		th.setAttribute("scope", "col");
		th.setAttribute("style", "vertical-align: middle");
		th.innerHTML = "Opcion";
		trh.appendChild(th);

		var tbody = document.createElement("tbody");
		tbody.setAttribute("id", "tbodyDetalle")
		table.appendChild(tbody);
		detalle.forEach((elementSup, index) => {
			var tr = document.createElement("tr");
			tbody.appendChild(tr);
			for (let campo in elementSup) {
				var td = document.createElement("td");
				td.innerHTML = elementSup[campo];
				td.setAttribute("id",campo);
				td.setAttribute("contenteditable", "true");
				tr.appendChild(td);
			}

			var td = document.createElement('td');
			td.innerHTML = '<button class="btn"  type="button"><i class="fa fa-trash" style="font-size:15px;color: red" ></i></button>';
			td.addEventListener("click",()=>{
					this.DetalleCotizacion.splice(index,1);
					console.log(this.DetalleCotizacion);
					table.remove();
					this.ConstruirTable(this.DetalleCotizacion,this.ListCabeceraDetalle)
			})
			// td.onclick = (function(entry) {return function() {this.Alert()}});

			// var td = document.createElement('td');
			// td.innerHTML = '<button type="button">Delete</button>';
			// td.onclick = function (elementSup) {
			// 	// this.DetalleCotizacion.splice(elementSup,1);
			// };
			tr.appendChild(td);
		});
	}

	Alert(posicion){
		console.log(posicion)
		// this.DetalleCotizacion.splice(elementSup,1)
	}


	GenerarCotizacion(modal: NgbModal) {
		
	}

	GuardarCotizacion() {
		var infordatelle = document.getElementById("tbodyDetalle");
    	var respcotizacion = Array();
		var Mensajedevalicacion=null;
		infordatelle.childNodes.forEach((element:any) => {
			var obj = Object();
			this.ListCabeceraDetalle.forEach((cabecera,posicion)=>{
				//validamos campos del array 
				let validar = this.ValidarCamposArray(cabecera,element.childNodes[posicion].innerText)
				if (validar){
					switch (cabecera.columnaResp.toLocaleLowerCase()) {
						case element.childNodes[posicion].id.toLocaleLowerCase():
							obj[element.childNodes[posicion].id]= cabecera.columnaResp=='NUMBER' ?  parseFloat(element.childNodes[posicion].innerText) : element.childNodes[posicion].innerText
							break;
					}
				}else{
					Mensajedevalicacion=`La columna '${element.childNodes[posicion].id}' Necesita Agregar un valor`;
				}
				
			});	

			respcotizacion.push(obj);	
		});
		
		//mandamos el formato
		if(!Mensajedevalicacion){
			const ValorEnviarCotizacion={
				...this.Formulario.value,
				detalle: respcotizacion,
			}
			console.log(ValorEnviarCotizacion)
			this.toastr.success("Se Guardo Correctamente");
			this.CancelEdit();
		}else{
			this.toastr.info(Mensajedevalicacion);
		}
		

		
	}


	ValidarCamposArray(cabecera,valor){
		if(cabecera.requerido==true){
			return valor=="" || valor==null ? false : true;
		}
		return true;
	}


	CancelEdit() {
		this.vistaDetalle = false;
		this.ListCamposPantillaCabecera = [];
		this.CabeceraDetalle=[];
		this.InformacionCotizacion = [];
		this.DetalleCotizacion = [];
	}
}
