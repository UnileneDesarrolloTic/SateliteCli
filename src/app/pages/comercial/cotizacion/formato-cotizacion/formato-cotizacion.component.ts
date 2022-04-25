import { Component, Input, OnInit, Output,EventEmitter  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CabeceraPantillaCotizacion } from '@data/interface/Response/CabeceraPantillaCotizacion.interface';
import { DetallePantillaCotizacion } from '@data/interface/Response/DetallePantillaCotizacion.interface';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalAgregarCotizacionComponent } from '../modal-agregar-cotizacion/modal-agregar-cotizacion.component';
@Component({
  selector: 'app-formato-cotizacion',
  templateUrl: './formato-cotizacion.component.html',
  styleUrls: ['./formato-cotizacion.component.css']
})
export class FormatoCotizacionComponent implements OnInit {
	@Input() idformatos;
	@Input() NroDocumento;
	@Input() ListCamposPantillaCabecera: CabeceraPantillaCotizacion[] = [];;
	@Input() ListCabeceraDetalle: DetallePantillaCotizacion[] = [];
	@Input() vistaDetalle: Boolean;
	@Input() FlagGuardarActualizar:number;
	@Input() InformacionCotizacion: any;
	@Input() Codigo:string
	@Input() nombreFormato:string;

	@Output()
	propagar = new EventEmitter<boolean>();

 	//FORMATOS POR CLIENTE
	ListarFormatoClient: Object[] = [];
	listaCotizaciones: Object[] = [];

	CabeceraDetalle: any = [];

	DetalleCotizacion: Object[] = [];
	DetalleCotizacionTotal: any;
	ListaFaltantesCotizacion: Object[] = [];

  Formulario: FormGroup;

	constructor(private modalService: NgbModal,
			private _cotizacionService: CotizacionService,
			private _fb: FormBuilder,
			private toastr: ToastrService) {

			this.Formulario = this._fb.group({
				// detalle: new FormArray([]),
			})
	}

	ngOnInit(): void {
		//console.log(this.ListCabeceraDetalle,this.ListCamposPantillaCabecera);
		if(this.FlagGuardarActualizar==1){
			//this.ListarDetalleCotizacion(this.idformatos, this.NroDocumento);
			this.ConstruirDetalle(this.idformatos, this.NroDocumento);
		}else{
			//this.ListarDetalleCotizacion(this.idformatos, this.NroDocumento);
			this.ConstruirDetalleActualizar(this.InformacionCotizacion);
		}
	}

	async ListarDetalleCotizacion(idFormato, numeroDocumento) {
			return this._cotizacionService.InformacionDetalleCotizacion(idFormato, numeroDocumento).toPromise()
	}

	async ConstruirDetalle(idFormato, numeroDocumento) {

		//contruimos la cabecera de la cotizacion
		for (let items in this.ListCamposPantillaCabecera) {
				this.Formulario.addControl(this.ListCamposPantillaCabecera[items].columnaResp, new FormControl(this.ListCamposPantillaCabecera[items].valorDefecto, this.ListCamposPantillaCabecera[items].requerido ? Validators.required : null));
		}


		//CABECERA DEL DETALLE
		this.CabeceraDetalle = this.ListCabeceraDetalle.map((items: any) => ({ columnaResp: this.CambioPrimeraLetra(items.columnaResp), valorDefecto: items.valorDefecto, requerido: items.requerido, tipoDato: items.tipoDato }))
		this.InformacionCotizacion = await this.ListarDetalleCotizacion(idFormato, numeroDocumento);
		this.DetalleCotizacionTotal = await this.InformacionCotizacion.detalle;

		//COLOCAMOS LO QUE VIENE EL API DE ObtenerDatos
		for (let variable in this.InformacionCotizacion.cabecera) {
			this.ListCamposPantillaCabecera.forEach((row: any) => {
				switch (row.columnaResp) {
					case this.CambioPrimeraLetra(variable):
							if(row.tipoDato!='DATE'){
								this.Formulario.get(this.CambioPrimeraLetra(variable)).patchValue(this.InformacionCotizacion.cabecera[variable]);
							}else{
								let formatodate=this.InformacionCotizacion.cabecera[variable].split("T");
								this.Formulario.get(this.CambioPrimeraLetra(variable)).patchValue(formatodate[0]);
							}
						break;
				}
			})
		}

		//COMPARACION DE ARRAY  DE LO QUE TENGO Y LO QUE ME SOBRA
		this.DetalleCotizacion = this.DetalleCotizacionTotal; /// LO QUE VIENE  (hay una variable de prueba) this.Prueba
		this.ListaFaltantesCotizacion = this.DetalleCotizacionTotal;


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
		table.setAttribute("style", "font-size: 12px; width: auto;overflow-y: auto; height:  30rem");
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
				td.setAttribute("id", this.CambioPrimeraLetra(campo));
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



	GuardarCotizacion(opcionesDescarga?:boolean) {
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

							obj[element.childNodes[posicion].id] = cabecera.tipoDato == 'NUMBER' ? parseFloat(element.childNodes[posicion].innerText) : element.childNodes[posicion].innerText
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
				if(this.FlagGuardarActualizar==1)
					 this.Guardar(respcotizacion,opcionesDescarga);
				else
					this.Actualizar(respcotizacion,opcionesDescarga);

		}else
			this.toastr.info(Mensajedevalicacion);

	}

	CambioPrimeraLetra(variable) {
		return variable.charAt(0).toUpperCase() + variable.slice(1);
	}

	ValidarCamposArray(cabecera, valor) {
		if (cabecera.requerido == true)
			return valor == "" || valor == null || valor == "\n" ? false : true;

		return true;
	}

	CancelEdit() {
		this.vistaDetalle = false;
		this.ListCamposPantillaCabecera = [];
		this.CabeceraDetalle = [];
		this.InformacionCotizacion = [];
		this.DetalleCotizacion = [];
		this.ListaFaltantesCotizacion = [];
		this.propagar.emit(false);
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
		});
	}


	Guardar(respcotizacion,opcionesDescarga?:boolean){
		const ValorEnviarCotizacion = {
			idFormato:parseInt(this.idformatos),
			nroCotizacion:this.NroDocumento,
			cotizacion:{
				...this.Formulario.value,
				Detalle: respcotizacion
			},
		}
		this._cotizacionService.RegistrarCotizacion(ValorEnviarCotizacion).subscribe(
			(resp:any)=>{
				if(resp.success==true){

					this.toastr.success(resp.message);

					if(opcionesDescarga)
						this.GenerarReporte(resp.content);

					this.CancelEdit();
				}

			},
			error=>{this.toastr.info(error)}
		)
	}

	Actualizar(respcotizacion,opcionesDescarga?:boolean){

		const ValorEnviarCotizacion = {
			idObject: this.Codigo,
			cotizacion:{
			...this.Formulario.value,
				Detalle: respcotizacion
			}

		}

		this._cotizacionService.Actualizar(ValorEnviarCotizacion).subscribe(
			resp=>{
				this.toastr.success("Se Guardo Correctamente");
				if(opcionesDescarga){
					this.GenerarReporte(this.Codigo);
				}
				this.CancelEdit();
			},
			error=>{this.toastr.info(error)}
		)
	}


	GuardadoConDescargar(valor:boolean){
			if(valor){
				this.GuardarCotizacion(valor);
			}else{
				this.GuardarCotizacion();
			}
	}



	GenerarReporte(codigo){
		this._cotizacionService.ObtenerReporte(codigo).subscribe(
			(resp:any)=>{
			  this.file(resp.content)
			},
			error=>{this.toastr.info(error)}
		);
	}


	base64ToUint8Array(string) {
		var raw = atob(string);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));
		for (var i = 0; i < rawLength; i += 1) {
		  array[i] = raw.charCodeAt(i);
		}
		return array;
	}

	URL = window.URL || window.webkitURL;

	file(excelContent){
		const fileBlob = new Blob(
		  [this.base64ToUint8Array(excelContent)],
		  { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
		);

		var objectURL = URL.createObjectURL(fileBlob);
		const exportLinkElement = document.createElement('a');

		exportLinkElement.hidden = true;
		exportLinkElement.download = "Cotizacion "+this.NroDocumento+".xlsx";
		exportLinkElement.href = objectURL;
		exportLinkElement.text = "downloading...";

		document.body.appendChild(exportLinkElement);
		exportLinkElement.click();

		URL.revokeObjectURL(objectURL);

		exportLinkElement.remove();

	};

	//ACTUALIZAR
	async ConstruirDetalleActualizar(InformacionCotizacion){
		//contruimos la cabecera de la cotizacion
		for (let items in this.ListCamposPantillaCabecera) {
			this.Formulario.addControl(this.ListCamposPantillaCabecera[items].columnaResp, new FormControl("", this.ListCamposPantillaCabecera[items].requerido ? Validators.required : null));
		}

		this.DetalleCotizacionTotal = await this.ListarDetalleCotizacion(this.idformatos, this.NroDocumento);

		this.ListaFaltantesCotizacion = this.DetalleCotizacionTotal.detalle;
		this.DetalleCotizacion=await InformacionCotizacion.detalle;

		//COLOCAMOS LO QUE VIENE EL API DE ObtenerDatos
		for (let variable in InformacionCotizacion) {
			this.ListCamposPantillaCabecera.forEach((row: any) => {
				if(variable!="detalle"){
					switch (row.columnaResp) {
						case this.CambioPrimeraLetra(variable):

								 	if(row.tipoDato != 'DATE'){
										this.Formulario.get(this.CambioPrimeraLetra(variable)).patchValue(InformacionCotizacion[variable]);
									 }else{
										 //InformacionCotizacion[variable]
										let formatodate=InformacionCotizacion[variable].split("T")
										this.Formulario.get(this.CambioPrimeraLetra(variable)).patchValue(formatodate[0]);
									 }

							break;
					}
				}
			})
		}

		this.DetalleCotizacion.forEach((element: any) => {
			this.ListaFaltantesCotizacion = this.ListaFaltantesCotizacion.filter((elementFil: any) => element.nroItem != elementFil.nroItem);
		})
		this.ConstruirTable(this.DetalleCotizacion, this.ListCabeceraDetalle);
	}

}
