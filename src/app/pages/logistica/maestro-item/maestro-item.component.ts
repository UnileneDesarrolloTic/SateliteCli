import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { AgrupadorModel } from '@data/interface/Response/DatosAgrupador.interface';
import { LineaModel } from '@data/interface/Response/DatosLinea.interface';
import { MaestroItemModel } from '@data/interface/Response/DatosMaestroItem.interface';
import { MarcarModel } from '@data/interface/Response/DatosMarca.interface';
import { SubAgrupadorModel } from '@data/interface/Response/DatosSubAgrupador.interface';
import { SubFamiliaModel } from '@data/interface/Response/DatosSubFamilia.interface';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMaestroItemComponent } from '@shared/components/modal-maestro-item/modal-maestro-item.component';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-maestro-item',
  templateUrl: './maestro-item.component.html',
  styleUrls: ['./maestro-item.component.css']
})
export class MaestroItemComponent implements OnInit {
  filtroForm:FormGroup;
 
  ListarAgrupador:AgrupadorModel[]=[];
  ListarSubAgrupador:SubAgrupadorModel[]=[];
  ListarLinea:LineaModel[]=[];
  FamiliaMaestro:ListaFamiliaMaestroItem[]=[];
  SubFamilias:SubFamiliaModel[]=[];
  Marcas:MarcarModel[]=[]
  LstarMaestroItem: MaestroItemModel[]=[];

  pagina: Number = 1
	pageSize: Number = 10;
	page: Number = 1;
	dropdownSettings = {};

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


  constructor(  private modalService: NgbModal,
                private _GenericoService:GenericoService) { }




  ngOnInit(): void {
    this.CrearFormulario();
    this.Agrupador();
    this.Linea();
    this.ListarMarca();
    this.instanciarObservadoresAgrupador();
    this.instanciarObservadoresLinea();
    this.instanciarObservadoresfamilia();


    this.paginador = {
			"paginaActual": 1,
			"totalPaginas": 1919,
			"registroPorPagina": 7,
			"totalRegistros": 19185,
			"siguiente": true,
			"anterior": false,
			"primeraPagina": false,
			"ultimaPagina": true
		};
  }

  cambioPagina(paginaCambiada: Number) {
		this.pagina = paginaCambiada
		this.Filtrar();
	}

  CrearFormulario(){
    this.filtroForm = new FormGroup({
      idAgrupador: new FormControl({value:1,disabled:true}),
      idSubAgrupador:  new FormControl({value:1,disabled:true}),
      idLinea:  new FormControl({value:"P",disabled:true}),
      idfamilia: new FormControl({value:"MC",disabled:false}),
      idSubFamilia: new FormControl(),
      idmarca: new FormControl({value:null,disabled:false}),
      idestado: new FormControl({value:"A",disabled:false}),
      item: new FormControl(''),
      Descripcion: new FormControl(''),
      NumeroParte: new FormControl('')
    })
  }

 

  AbrirModalNuevoItems(){
    const modalRefGenerarCotizacion = this.modalService.open(ModalMaestroItemComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});

    const ConstDetraccion={
      Familia:this.FamiliaMaestro,
      Codsut:''
    }
    modalRefGenerarCotizacion.componentInstance.fromParent =ConstDetraccion;
		modalRefGenerarCotizacion.result.then((result) => {
         
		}, (reason) => {
        // console.log(reason);
		});
  }


  instanciarObservadoresAgrupador(){
    this.filtroForm.get("idAgrupador").valueChanges.subscribe( idAgrupador => {
         this.SubAgrupador(idAgrupador)
    })
  }

  instanciarObservadoresLinea(){
      this.filtroForm.get("idLinea").valueChanges.subscribe(idlinea=>{
          this.Familias(idlinea);
      })
  }
  
  instanciarObservadoresfamilia(){
      this.filtroForm.get("idfamilia").valueChanges.subscribe(idfamilia=>{
          this.SubFamilia(this.filtroForm.controls.idLinea.value,idfamilia);
      })
  }

  Filtrar(){
    const DatosCabecera={
      idAgrupador:this.filtroForm.controls.idAgrupador.value,
      idSubAgrupador:this.filtroForm.controls.idSubAgrupador.value,
      idLinea:this.filtroForm.controls.idLinea.value,
      Pagina: this.pagina,
			RegistrosPorPagina: 7,
      ...this.filtroForm.value
    }
    this.ListarFiltro(DatosCabecera)
  }

  ListarFiltro(DatosCabecera){
      this._GenericoService.ListarMaestroItem(DatosCabecera).subscribe(
        (resp:any)=>{
            this.LstarMaestroItem=resp["contenido"];
        }
      )
  }

  //LISTAR COMBOS
  Agrupador(){
    this._GenericoService.ListarAgrupador().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.ListarAgrupador=resp["content"];
          this.SubAgrupador(1);
        }
      }
    )
  }
  
  SubAgrupador(idAgrupador){
    this._GenericoService.ListarSubAgrupador(idAgrupador).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.ListarSubAgrupador=resp["content"];
        }
      }
    )
  }

  Linea(){
    this._GenericoService.ListarLinea().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.ListarLinea=resp["content"];
          this.Familias('P');
        }
      }
    )
  }

  Familias(idlinea){
    this._GenericoService.ListarFamiliaMaestroItem(idlinea).subscribe(
      (resp:any)=>{

        if(resp["success"]){
          this.FamiliaMaestro=resp["content"];
          this.SubFamilia(this.filtroForm.controls.idLinea.value,this.FamiliaMaestro[0].familia)
        }
      }
    )
  }

  SubFamilia(idlinea,idFamilia){
    this._GenericoService.ListarSubFamilia(idlinea,idFamilia).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.SubFamilias=resp["content"];
          this.filtroForm.get("idSubFamilia").patchValue(this.SubFamilias[0].subFamilia)
        }
      }
    )
  }

  ListarMarca(){
    this._GenericoService.ListarMarca().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.Marcas=resp["content"];
        }
      }
    )
  }
}
