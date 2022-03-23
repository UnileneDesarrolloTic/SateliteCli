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
import { ModalDocumentoCotizacionComponent } from './modal-documento-cotizacion/modal-documento-cotizacion.component';
import { ModalDescargaCotizacionComponent } from './modal-descarga-cotizacion/modal-descarga-cotizacion.component';
import { ModalAgregarCotizacionComponent } from './modal-agregar-cotizacion/modal-agregar-cotizacion.component';



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
	EditarBoolean: boolean = false;

	Formulario: FormGroup;
	formSearch: FormGroup;

	//FORMATOS POR CLIENTE
	ListarFormatoClient: Object[] = [];
	listaCotizaciones: Object[] = [];
	// Cabecera Pantilla
	ListCamposPantillaCabecera: CabeceraPantillaCotizacion[] = [];
	//detalle Pantilla
	ListCabeceraDetalle: DetallePantillaCotizacion[] = [];
	CabeceraDetalle: any = [];

	//Detalle Cotizacion 
	DetalleCotizacion: Object[] = [];
	DetalleCotizacionTotal: Object[] = [];
	InformacionCotizacion: any;
	ListaFaltantesCotizacion: Object[] = [];


	Prueba: Object[] = [
		{
			"NroItem": 1,
			"CodigoSap": "",
			"Denominación": "Indicador multiparámetro de vapor - CD29 Bolsa x 500",
			"UM": "BOL",
			"Cantidad": 11.0000,
			"Marca": "TERRAGENE",
			"Procedencia": "ARGENTINA",
			"Presentacion": null,
			"PlazoEntrega": "02 Días Calendarios",
			"VigenciaMinima": "Mayor a 24 Meses",
			"AutoSanitario": "SI",
			"CartaRepresentacion": "SI",
			"Cbpm": "SI",
			"MetodologiaAnalisis": "SI",
			"FichaTecnica": "SI",
			"Folleteria": "SI",
			"CompPlazoEntrega": "SI",
			"CompReposicionDefecto": "SI",
			"Muestra": "SI",
			"RotuladoESSALUD": "SI",
			"PrecioUnitario": 41.525424,
			"PrecioTotal": 456.7796640000
		},
		{
			"NroItem": 2,
			"CodigoSap": "",
			"Denominación": "Integrador de vapor - IT26-C Bolsa x 250",
			"UM": "BOL",
			"Cantidad": 4.0000,
			"Marca": null,
			"Procedencia": "ARGENTINA",
			"Presentacion": null,
			"PlazoEntrega": "02 Días Calendarios",
			"VigenciaMinima": "Mayor a 24 Meses",
			"AutoSanitario": "SI",
			"CartaRepresentacion": "SI",
			"Cbpm": "SI",
			"MetodologiaAnalisis": "SI",
			"FichaTecnica": "SI",
			"Folleteria": "SI",
			"CompPlazoEntrega": "SI",
			"CompReposicionDefecto": "SI",
			"Muestra": "SI",
			"RotuladoESSALUD": "SI",
			"PrecioUnitario": 203.389831,
			"PrecioTotal": 813.5593240000
		},
		{
			"NroItem": 4,
			"CodigoSap": "",
			"Denominación": "MANGA POLIETILENO PARA ESTERILIZACION 15 CM X 60 M",
			"UM": "UNI",
			"Cantidad": 4.0000,
			"Marca": "BIOSEAL",
			"Procedencia": "PERU",
			"Presentacion": "ROLLO X 60 METROS",
			"PlazoEntrega": "02 Días Calendarios",
			"VigenciaMinima": "Mayor a 24 Meses",
			"AutoSanitario": "SI",
			"CartaRepresentacion": "SI",
			"Cbpm": "SI",
			"MetodologiaAnalisis": "SI",
			"FichaTecnica": "SI",
			"Folleteria": "SI",
			"CompPlazoEntrega": "SI",
			"CompReposicionDefecto": "SI",
			"Muestra": "SI",
			"RotuladoESSALUD": "SI",
			"PrecioUnitario": 29.491525,
			"PrecioTotal": 117.9661000000
		},
		{
			"NroItem": 5,
			"CodigoSap": "",
			"Denominación": "MANGA POLIETILENO PARA ESTERILIZACION 20 CM X 60 M",
			"UM": "UNI",
			"Cantidad": 7.0000,
			"Marca": "BIOSEAL",
			"Procedencia": "PERU",
			"Presentacion": "ROLLO X 60 METROS",
			"PlazoEntrega": "02 Días Calendarios",
			"VigenciaMinima": "Mayor a 24 Meses",
			"AutoSanitario": "SI",
			"CartaRepresentacion": "SI",
			"Cbpm": "SI",
			"MetodologiaAnalisis": "SI",
			"FichaTecnica": "SI",
			"Folleteria": "SI",
			"CompPlazoEntrega": "SI",
			"CompReposicionDefecto": "SI",
			"Muestra": "SI",
			"RotuladoESSALUD": "SI",
			"PrecioUnitario": 35.593220,
			"PrecioTotal": 249.1525400000
		},
		{
			"NroItem": 6,
			"CodigoSap": "",
			"Denominación": "MANGA POLIETILENO PARA ESTERILIZACION 30 CM X 60 M",
			"UM": "UNI",
			"Cantidad": 11.0000,
			"Marca": "BIOSEAL",
			"Procedencia": "PERU",
			"Presentacion": "ROLLO X 60 METROS",
			"PlazoEntrega": "02 Días Calendarios",
			"VigenciaMinima": "Mayor a 24 Meses",
			"AutoSanitario": "SI",
			"CartaRepresentacion": "SI",
			"Cbpm": "SI",
			"MetodologiaAnalisis": "SI",
			"FichaTecnica": "SI",
			"Folleteria": "SI",
			"CompPlazoEntrega": "SI",
			"CompReposicionDefecto": "SI",
			"Muestra": "SI",
			"RotuladoESSALUD": "SI",
			"PrecioUnitario": 42.203390,
			"PrecioTotal": 464.2372900000
		}
	]

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

		this.formSearch = this._fb.group({
			ngmNumeroDocumento: ['',],
			ngmClienteNombre: ['',],
		})

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

		this.ListarFormatoCotizacion();
		this.ListarCotizacion();


	}

	cambioPagina(paginaCambiada: Number) {
		this.pagina = paginaCambiada
		this.ListarCotizacion();
	}

	ListarCotizacion() {

		const dataCarga = {
			NumeroDocumento: this.formSearch.controls.ngmNumeroDocumento.value,
			ClienteNombre: this.formSearch.controls.ngmClienteNombre.value,
			Pagina: this.pagina,
			RegistrosPorPagina: 10
		}

		this._cotizacionService.ListarCotizacionApi(dataCarga).subscribe(
			(resp: any) => {
				this.listaCotizaciones = resp.contenido;
				this.paginador = resp.paginado;
			}
		);
	}

	ListarFormatoCotizacion() {
		this._cotizacionService.FormatoPorCliente().subscribe(
			(res: any) => {
				this.ListarFormatoClient = res;
			}
		)
	}

	NuevoDocumentoModal(cotizacion) {
		let ListFormatosCliente:any = this.ListarFormatoClient.filter(element => element["codCliente"] == cotizacion.codCliente)
		if (ListFormatosCliente.length>1){
				const data = {
					items: cotizacion,
					listaFormato: ListFormatosCliente
				}
				const modalRef = this.modalService.open(ModalDocumentoCotizacionComponent, {
					ariaLabelledBy: 'modal-basic-title',
					centered: true,
					windowClass: 'dark-modal',
					backdropClass: 'light-blue-backdrop',
					backdrop: 'static',
					keyboard: false
				});
		
				modalRef.componentInstance.fromParent = data;
				modalRef.result.then((result) => {
					this.Editar(result.seleccionado, result.numeroDocumento);
				}, (reason) => {
					// console.log("salir2", reason)
				});
		}else if(ListFormatosCliente.length==1){
			this.Editar(ListFormatosCliente[0].idFormato, cotizacion.numeroDocumento);
		}else{
			this.toastr.info("No continene ningun formato");
		}
		
	}

	GenerarCotizacion(cotizacion) {

		const modalRefGenerarCotizacion = this.modalService.open(ModalDescargaCotizacionComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			windowClass: 'md-class',
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});

		modalRefGenerarCotizacion.componentInstance.fromParent = cotizacion;
		modalRefGenerarCotizacion.result.then((result) => {
			console.log(result);
			this.Editar(result.seleccionado, result.numeroDocumento);

		}, (reason) => {
			// console.log("salir Generar Cotizacion", reason)
		});
	}



	// Editar Cotizacion 
	Editar(idFormato, numeroDocumento) {

		this._cotizacionService.SeleccionarCotizacion(idFormato).subscribe(
			(resp: Cotizacion) => {
				console.log(resp)
				if (resp.cabecera.length > 0) {
					this.ListCamposPantillaCabecera = [];
					this.CabeceraDetalle = [];
					this.InformacionCotizacion = [];
					this.DetalleCotizacion = [];
					this.DetalleCotizacionTotal = [];
					this.ListaFaltantesCotizacion = [];
					this.vistaDetalle = true;
					this.IdFormato = idFormato;
					this.NroDocumento = numeroDocumento;
					this.ListCamposPantillaCabecera = resp.cabecera;
					this.ListCabeceraDetalle = resp.detalle;
					this.ListarDetalleCotizacion(idFormato, numeroDocumento);
					this.ConstruirDetalle(idFormato, numeroDocumento);
				} else {
					this.toastr.info("La cotización elegida no cuenta con un formato, favor de revisar el número de documento");
				}

			}
		)

	}



	ListDetalleCotizacion(idFormato): FormArray {
		return this.Formulario.get("detalle") as FormArray;
	}

	async ListarDetalleCotizacion(idFormato, numeroDocumento) {
		return this._cotizacionService.InformacionDetalleCotizacion(idFormato, numeroDocumento).toPromise()
	}

	async ConstruirDetalle(idFormato, numeroDocumento) {

		//contruimos la cabecera de la cotizacion
		// for (let items in this.ListCamposPantillaCabecera) {
		// 	this.Formulario.addControl(this.ListCamposPantillaCabecera[items].columnaResp, new FormControl(this.ListCamposPantillaCabecera[items].valorDefecto, this.ListCamposPantillaCabecera[items].requerido ? Validators.required : null));
		// }

		for (let items in this.ListCamposPantillaCabecera) {
				this.Formulario.addControl(this.ListCamposPantillaCabecera[items].columnaResp, new FormControl(this.ListCamposPantillaCabecera[items].valorDefecto, this.ListCamposPantillaCabecera[items].requerido ? Validators.required : null));
		}
		

		//CABECERA DEL DETALLE
		this.CabeceraDetalle = this.ListCabeceraDetalle.map((items: any) => ({ columnaResp: items.columnaResp, valorDefecto: items.valorDefecto, requerido: items.requerido, tipoDato: items.tipoDato }))
		this.InformacionCotizacion = await this.ListarDetalleCotizacion(idFormato, numeroDocumento);
		this.DetalleCotizacionTotal = await this.InformacionCotizacion.detalle;


		//COLOCAMOS LO QUE VIENE EL API DE ObtenerDatos
		for (let variable in this.InformacionCotizacion.cabecera) {
			this.ListCamposPantillaCabecera.forEach((row: any) => {
				switch (row.columnaResp) {
					case variable:
							this.Formulario.get(variable).patchValue(this.InformacionCotizacion.cabecera[variable]);
						break;
				}
			})
		}
		
		//COMPARACION DE ARRAY  DE LO QUE TENGO Y LO QUE ME SOBRA
		this.DetalleCotizacion = this.Prueba; /// LO QUE VIENE  (hay una variable de prueba) this.Prueba
		this.ListaFaltantesCotizacion = this.DetalleCotizacionTotal;

		// console.log(this.DetalleCotizacion,this.Prueba);
		// SOLO LO QUE SOBRAN
		this.DetalleCotizacion.forEach((element: any) => {
			this.ListaFaltantesCotizacion = this.ListaFaltantesCotizacion.filter((elementFil: any) => element.NroItem != elementFil.NroItem);
		})

		this.ConstruirTable(this.DetalleCotizacion, this.ListCabeceraDetalle);
	}


	ConstruirTable(ArrayListDetalleCotizacion, ArrayCabecera) {

		var cabeceras = ArrayCabecera;
		var detalle = ArrayListDetalleCotizacion;

		var bodyt = document.getElementById("cbBody");
		var table = document.createElement("table");
		var thead = document.createElement("thead");
		var trh = document.createElement("tr");
		table.setAttribute("class", "table table-striped no-wrap border table-responsive");
		table.setAttribute("style", "font-size: 12px");
		table.setAttribute("id", "idtable")
		bodyt.appendChild(table);
		table.appendChild(thead);
		thead.appendChild(trh);
		cabeceras.forEach(element => {
			var th = document.createElement("th");
			th.setAttribute("scope", "col");
			th.setAttribute("style", "vertical-align: middle");
			th.innerHTML = element.etiqueta;
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
				td.setAttribute("id", campo);
				td.setAttribute("contenteditable", "true");
				tr.appendChild(td);
			}

			var td = document.createElement('td');
			td.innerHTML = '<i class="fa fa-trash" style="font-size:14px;color: red; cursor:pointer"></i>';
			td.addEventListener("click", () => {
				let Seleccionado = this.DetalleCotizacion.splice(index, 1);
				this.ListaFaltantesCotizacion.push(Seleccionado[0]);
				table.remove();
				this.ConstruirTable(this.DetalleCotizacion, this.ListCabeceraDetalle);
			})
			tr.appendChild(td);
		});
	}



	GuardarCotizacion() {
		var infordatelle = document.getElementById("tbodyDetalle");
		var respcotizacion = Array();
		var Mensajedevalicacion = null;
		infordatelle.childNodes.forEach((element: any) => {
			var obj = Object();
			this.ListCabeceraDetalle.forEach((cabecera, posicion) => {
				//validamos campos del array 
				let validar = this.ValidarCamposArray(cabecera, element.childNodes[posicion].innerText)
				if (validar) {
					switch (cabecera.columnaResp.toLocaleLowerCase()) {
						case element.childNodes[posicion].id.toLocaleLowerCase():
							obj[element.childNodes[posicion].id] = cabecera.columnaResp == 'NUMBER' ? parseFloat(element.childNodes[posicion].innerText) : element.childNodes[posicion].innerText
							break;
					}
				} else {
					Mensajedevalicacion = `La columna '${element.childNodes[posicion].id}' Necesita Agregar un valor`;
				}

			});

			respcotizacion.push(obj);
		});

		//mandamos el formato
		if (!Mensajedevalicacion) {
			const ValorEnviarCotizacion = {
				...this.Formulario.value,
				detalle: respcotizacion,
			}
			console.log(ValorEnviarCotizacion);
			this.toastr.success("Se Guardo Correctamente");
			this.CancelEdit();
		} else {
			this.toastr.info(Mensajedevalicacion);
		}



	}


	ValidarCamposArray(cabecera, valor) {
		if (cabecera.requerido == true) {
			return valor == "" || valor == null ? false : true;
		}
		return true;
	}


	CancelEdit() {
		this.vistaDetalle = false;
		this.ListCamposPantillaCabecera = [];
		this.CabeceraDetalle = [];
		this.InformacionCotizacion = [];
		this.DetalleCotizacion = [];
		this.ListaFaltantesCotizacion = [];
	}

	AgregarCotizacion() {

		const dataCotizacion = {
			ListaFaltante: this.ListaFaltantesCotizacion,
			CabeceraDetalle: this.ListCabeceraDetalle
		}

		const modalRefAgregarCotizacion = this.modalService.open(ModalAgregarCotizacionComponent, {
			ariaLabelledBy: 'modal-basic-title',
			windowClass: 'md-class',
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});

		modalRefAgregarCotizacion.componentInstance.fromParent = dataCotizacion;
		modalRefAgregarCotizacion.result.then((result) => {
			if (result.length > 0) {
				var table = document.getElementById("idtable");
				table.remove();
				this.DetalleCotizacion.push(result[0])
				this.ConstruirTable(this.DetalleCotizacion, this.ListCabeceraDetalle);

			}

		}, (reason) => {
			// console.log("salir Generar Cotizacion", reason)
		});
	}




}
