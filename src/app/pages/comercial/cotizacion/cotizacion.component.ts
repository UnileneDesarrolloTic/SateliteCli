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

		// if (idFormato == 0) {
		//   this.FormatoNoEncontrado = true;
		// }
		// else {
		//   this.FormatoNoEncontrado = false;
		//   this.vistaDetalle = true;
		//   this.IdFormato = idFormato;
		//   this.NroDocumento = numeroDocumento;

		//   const body = {
		//     IdFormato: parseInt(idFormato),
		//     NumeroDocumento: numeroDocumento
		//   }

		//   this._cotizacionService.ObtenerEstructuraFormato(body).subscribe(resp => {
		//     var data = resp;
		//     this.ConstruirDetalle(data);
		//   });

	}


	async ListarDetalleCotizacion() {
		return this._cotizacionService.InformacionDetalleCotizacion().toPromise()
	}

	async ConstruirDetalle() {
		for (let items in this.ListCamposPantillaCabecera) {
			this.Formulario.addControl(this.ListCamposPantillaCabecera[items].columnaResp, new FormControl(this.ListCamposPantillaCabecera[items].valorDefecto, this.ListCamposPantillaCabecera[items].requerido ? Validators.required : null))
		}

		//CABECERA DEL DETALLE
		// this.CabeceraDetalle = this.ListCabeceraDetalle.map((items: any) => ({ valorCabecera: items.etiqueta, columnaResp: items.columnaResp, valorDefecto: items.valorDefecto, requerido: items.requerido }))
		this.InformacionCotizacion = await this.ListarDetalleCotizacion();
		this.DetalleCotizacion = this.InformacionCotizacion.detalle;


		this.ConstruirTable(this.DetalleCotizacion, this.ListCabeceraDetalle);

		console.log(this.Formulario.value)
	}

	ListDetalleCotizacion(): FormArray {
		return this.Formulario.get("detalle") as FormArray;
	}

	ConstruirTable(ArrayListDetalleCotizacion, ArrayCabecera) {
		const ArrayProduct = this.Formulario.controls.detalle as FormArray;
		ArrayListDetalleCotizacion.forEach((itemproduct) => {
			// ArrayProduct.push(this._fb.group(this.prueba(itemproduct,ArrayCabecera)))
			ArrayProduct.push(this._fb.group({
				nroItem : itemproduct.nroItem,
				codigoSAP : [itemproduct.codigoSAP],
				denominacion : [itemproduct.denominacion],
				undMedida : [itemproduct.undMedida],
				cantidadTotal : [itemproduct.cantidadTotal],
				marca : [itemproduct.marca],
				paisProcedencia : [itemproduct.paisProcedencia],
				presentacion : [itemproduct.presentacion],
				modelo : [itemproduct.modelo],

				rnpVigente : [itemproduct.rnpVigente],
				vigenciaMinima : [itemproduct.vigenciaMinima],
				cumpleDenominacionItem : [itemproduct.cumpleDenominacionItem],
				cartaPresentacion : [itemproduct.cartaPresentacion],
				registroSanitario : [itemproduct.registroSanitario],
				certificadoAnalisis : [itemproduct.certificadoAnalisis],
				cumpleEspecificacionTec : [itemproduct.cumpleEspecificacionTec],
				practicaAlmacenamiento : [itemproduct.practicaAlmacenamiento],

				practicaManufactura : [itemproduct.practicaManufactura],
				capacidadAtencion : [itemproduct.capacidadAtencion],
				plazoEntrega : [itemproduct.plazoEntrega],
				precioUnitario : [itemproduct.precioUnitario],
				valorTotal : [itemproduct.valorTotal],

				
			}))
			
		});
		console.log(this.Formulario.value);
	}

	// prueba(itemproduct,ArrayCabecera):object{

	// 	return {
	// 		Andy:["entre",[Validators.required]]

	// 	}
	// }

	ItemCreateDetalle(ItemsVariables) {

	}







	GenerarCotizacion(modal: NgbModal) {

	}

	CancelEdit() {
		this.vistaDetalle = false;
	}
}
