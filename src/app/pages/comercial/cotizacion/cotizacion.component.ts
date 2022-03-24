import { Component, Input, OnInit,Output ,EventEmitter } from '@angular/core';
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

	childMessage: string = "Hola Mundo!";
	
	vistaDetalle: Boolean = false;
	FormatoNoEncontrado: Boolean = false;
	IdFormato: Number;
	NroDocumento: String;
	pagina: Number = 1
	pageSize: Number = 10;
	page: Number = 1;
	dropdownSettings = {};
	EditarBoolean: boolean = false;

	// Formulario: FormGroup;
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
			
				} else {
					this.toastr.info("La cotización elegida no cuenta con un formato, favor de revisar el número de documento");
				}

			}
		)

	}

	procesaPropagar(mensaje) {
		this.vistaDetalle=mensaje;
	  }



}
