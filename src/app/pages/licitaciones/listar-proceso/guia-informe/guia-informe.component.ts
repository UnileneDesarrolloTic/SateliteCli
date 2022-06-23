import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { visitseparationChartOptions } from '@data/interface/Request/DatosGraficos.interface';
import { ListarGuiaInformeModel } from '@data/interface/Response/ListarGuiaInforme.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalEditaGuiainformeComponent } from '../modal-edita-guiainforme/modal-edita-guiainforme.component';

@Component({
	selector: 'app-guia-informe',
	templateUrl: './guia-informe.component.html',
	styleUrls: ['./guia-informe.component.css']
})
export class GuiaInformeComponent implements OnInit {

	ListarInformeGuia: ListarGuiaInformeModel[] = [];
	TempListarInformeGuia:ListarGuiaInformeModel[] = [];
	Formulario: FormGroup;
	ListarGuia: FormGroup;
	ContarGrafico:number;
	public visitseparationChartOptions: Partial<visitseparationChartOptions>;

	ComboFiltro = new FormControl('TODOS');

	constructor(private modalService: NgbModal,
		private toastr: ToastrService,
		private _fb: FormBuilder,
		private _LicitacionesServices: LicitacionesService,
		private _router: Router,) { }

	EstadoGrafico(Estado){
			let ArrayGrafico=this.TempListarInformeGuia.filter((element)=>element.estadoLogistica==Estado);
			return ArrayGrafico.length;	
	}


	ngOnInit(): void {
		this.CrearFormulario();
	}

	CrearFormulario() {
		this.Formulario = new FormGroup({
			NumeroEntrega: new FormControl('1', Validators.required),
			OrdenCompra: new FormControl('', Validators.required),
		})

		this.ListarGuia = new FormGroup({
			FormArrayListarGuia: this._fb.array([])
		})
	}



	Filtrar() {
		this._LicitacionesServices.ListarGuiaInfomeLP(this.Formulario.value).subscribe(
			(resp: any) => {
				if (resp["success"]) {
					this.ListarInformeGuia = resp["content"];
					this.TempListarInformeGuia= resp["content"];
					this.ComboFiltro.setValue('TODOS');
					this.CuiaInformeFormArray(this.ListarInformeGuia);
					this.Graficos();
				} else {
					this.ListarInformeGuia = [];
					this.TempListarInformeGuia= [];
					this.ComboFiltro.setValue('TODOS');
					this.CuiaInformeFormArray(this.ListarInformeGuia);
					this.Graficos();
				}

			},
			(error) => { this.toastr.info("Debe Ingresar la orden de Compra") }
		)
	}

	

	get ListarGuiaNumeroLP() {
		return this.ListarGuia.controls["FormArrayListarGuia"] as FormArray;
	}


	CuiaInformeFormArray(ListInformeGuide) {

		const ArrayNumeroGuia = this.ListarGuia.controls.FormArrayListarGuia as FormArray;
		ArrayNumeroGuia.controls = [];

		ListInformeGuide.forEach((itemRow:ListarGuiaInformeModel ) => {
			const ItemFilaForm = this._fb.group({
				serieNumero: [itemRow.serieNumero],
				guiaNumero: [itemRow.guiaNumero],
				ordenCompra: [itemRow.ordenCompra],
				estado: [itemRow.estado],
				comentario: [itemRow.comentario],
				entregaPecosa: [itemRow.entregaPecosa],
				estadoLogistica: [itemRow.estadoLogistica],
				comentarioSalida: [itemRow.comentarioSalida],
				fechadocumento:[ itemRow.fechadocumento]
			});
			this.ListarGuiaNumeroLP.push(ItemFilaForm);
		});
		
	}

	CambiarEstado(){
		
		this.ListarInformeGuia= this.ComboFiltro.value=='TODOS' ? this.TempListarInformeGuia : this.TempListarInformeGuia.filter((elementoFila)=> elementoFila.estadoLogistica==this.ComboFiltro.value)
		this.CuiaInformeFormArray(this.ListarInformeGuia)
	}

	EstadoColor(Estado){
		let Color='';
		switch (Estado) {
			case 'OK':
				Color='green';
				break;
			case 'SIN RETORNO':
				Color='red';
				break;
			case 'SIN ORDEN DE SERVICIO':
				Color='blue';
				break;
			case 'TODOS':
				Color:'black';
				break;
		}
		return Color;
	}

	Graficos(){
		this.visitseparationChartOptions = {
			series: [this.EstadoGrafico('OK'), this.EstadoGrafico('SIN RETORNO'), this.EstadoGrafico('SIN ORDEN DE SERVICIO')],
			chart: {
				fontFamily: 'Montserrat,sans-serif',
				type: 'donut',
				height: 240
			},
			plotOptions: {
				pie: {
					donut: {
						size: '70px',
					}
				}
			},
			tooltip: {
				fillSeriesColor: false,
			},
			dataLabels: {
				enabled: true,
				style:{
					fontSize:'20px',
					colors: ['#FFFFFF'],

				},
				background: {
					enabled: false,
					foreColor: '#ffffff',
					opacity: 0,				
				},
			},
			stroke: {
				width: 0,
			},
			legends: {
				show: true,

			},
			labels: ['OK', 'SIN RETORNO', 'SIN ORDEN DE SERVICIO'],
			colors: ['#289B45', '#F72F44', '#396FDA'],
		};
	}

	ModalEditarGuia() {

		const modalRefModalEditarGuia = this.modalService.open(ModalEditaGuiainformeComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xs',
			scrollable: true,
			keyboard: false
		});


		modalRefModalEditarGuia.componentInstance.fromParent = "";
		modalRefModalEditarGuia.result.then((result) => {

		}, (reason) => {

		});

	}

	Salir(){
		this._router.navigate(['Licitaciones', 'proceso','listar-proceso'])
	}
}
