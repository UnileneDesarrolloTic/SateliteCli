import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgrupadorModel } from '@data/interface/Response/DatosAgrupador.interface';
import { LineaModel } from '@data/interface/Response/DatosLinea.interface';
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
  

  constructor(  private modalService: NgbModal,
                private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    this.CrearFormulario();
    this.Agrupador();
    this.Linea();
    this.instanciarObservadoresAgrupador();
    this.instanciarObservadoresLinea();
    this.instanciarObservadoresfamilia();
  }

  CrearFormulario(){
    this.filtroForm = new FormGroup({
      idAgrupador: new FormControl({value:1,disabled:true}),
      idSubAgrupador:  new FormControl({value:1,disabled:true}),
      idLinea:  new FormControl({value:"P",disabled:true}),
      idfamilia: new FormControl({value:"MC",disabled:false}),
      idSubFamilia: new FormControl(),
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
      Familia:this.FamiliaMaestro
    }
    modalRefGenerarCotizacion.componentInstance.fromParent =ConstDetraccion;
		modalRefGenerarCotizacion.result.then((result) => {
         
		}, (reason) => {

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
}
