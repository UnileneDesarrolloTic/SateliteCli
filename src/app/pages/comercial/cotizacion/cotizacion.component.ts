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
	FlagGuardarActualizar:number=1;
	Codigo:string;
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
					this.FlagGuardarActualizar=1;
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
			this.FlagGuardarActualizar=2;
			this.InformacionCotizacion=result.bodyCotizacion;
			this.Codigo=result.Codigo
			this.Editar(result.idformato,result.numeroDocumento);
			
		}, (reason) => {
			
			// console.log("salir Generar Cotizacion", reason)
		});
	}

	PrimeraLetra(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	
	// Editar Cotizacion 
	Editar(idFormato, numeroDocumento?) {
		this._cotizacionService.SeleccionarCotizacion(idFormato).subscribe(
			(resp: Cotizacion) => {
				if (resp.cabecera.length > 0) {
					this.ListCamposPantillaCabecera = [];
					this.CabeceraDetalle = [];
					this.InformacionCotizacion;
					this.DetalleCotizacion = [];
					this.DetalleCotizacionTotal = [];
					this.ListaFaltantesCotizacion = [];
					this.vistaDetalle = true;
					this.IdFormato = idFormato;
					this.NroDocumento = numeroDocumento;
					this.ListCamposPantillaCabecera = resp.cabecera.map((element)=>({
									...element,
									columnaResp: this.PrimeraLetra(element.columnaResp)
					}));
					this.ListCabeceraDetalle = resp.detalle.map((element)=>({
										...element,
										columnaResp : this.PrimeraLetra(element.columnaResp)
					}));
			
				} else {
					this.toastr.info("La cotización elegida no cuenta con un formato, favor de revisar el número de documento");
				}

			}
		)

	}

	CambiarEstadoInterface(mensaje) {
		this.vistaDetalle=mensaje;
	}



}
