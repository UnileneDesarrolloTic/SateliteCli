import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemVentasModel } from '@data/interface/Response/DatosFormatoItemsVentas.interfaces';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DetalleItemVentasModel } from '@data/interface/Response/DatosFormatosItemVentasDetalle.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { MarcarModel } from '@data/interface/Response/DatosMarca.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AgrupadorModel } from '@data/interface/Response/DatosAgrupador.interface';
import { SubAgrupadorModel } from '@data/interface/Response/DatosSubAgrupador.interface';
import { LineaModel } from '@data/interface/Response/DatosLinea.interface';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { SubFamiliaModel } from '@data/interface/Response/DatosSubFamilia.interface';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-consultar-stock-ventas',
  templateUrl: './consultar-stock-ventas.component.html',
  styleUrls: ['./consultar-stock-ventas.component.css']
})
export class ConsultarStockVentasComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
 
  ListarAgrupador:AgrupadorModel[]=[];
  ListarSubAgrupador:SubAgrupadorModel[]=[];
  ListarLinea:LineaModel[]=[];
  FamiliaMaestro:ListaFamiliaMaestroItem[]=[];
  SubFamilias:SubFamiliaModel[]=[];

  ListarItem:ItemVentasModel[]=[];
  Marcas:MarcarModel[]=[];

  filtrosForm: FormGroup;
  ListarItemDetalleTemporal:ItemVentasModel[]=[];
  ListarItemDetalle:DetalleItemVentasModel[]=[];
  flagLoading: boolean = false;
  opcionMarcar:string ='';
  dato={}


  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  
  constructor(private _LogisticaService: LogisticaService,
              private _GenericoService:GenericoService,
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.Agrupador();
    this.Linea();
    this.ListarMarca();
    this.instanciarObservadoresAgrupador();
    this.instanciarObservadoresLinea();
    this.instanciarObservadoresfamilia();
    // this.ListarItemVentasResumen();
    // this.ListarItemVentasDetalle();


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'marcaCodigo',
      textField: 'descripcionLocal',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      maxHeight:150
    };
  
  }

  inicializarFormulario() {
    this.filtrosForm = new FormGroup({
      idAgrupador:new FormControl(1),
      idSubAgrupador: new FormControl(),
      idLinea:  new FormControl("P"),
      idfamilia: new FormControl("MC"),
      idSubFamilia: new FormControl(),
      idmarca:new FormControl(null),
      Item: new FormControl(''),
      Codsut:new FormControl(''),
      Descripcion:new FormControl(''),
      Origen: new FormControl(0),
      
    })

  }

  currentJustify = 'start';
  currentOrientation = 'horizontal';
  // tslint:disable-next-line: deprecation
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }

  ListarItemVentasResumen(){
    this.flagLoading=true;
    this.opcionMarcar="";
    this.filtrosForm.controls.idmarca.value?.forEach(element => {
      this.opcionMarcar+=element.marcaCodigo+","
    });

    this.dato={
      ...this.filtrosForm.value,
      Origen:parseInt(this.filtrosForm.controls.Origen.value),
      idAgrupador:parseInt(this.filtrosForm.controls.idAgrupador.value),
      idSubAgrupador:parseInt(this.filtrosForm.controls.idSubAgrupador.value),
      idmarca:this.opcionMarcar
    }

    this._LogisticaService.ListarItemVentas(this.dato).subscribe(
      (resp:any)=>{
            this.ListarItem = resp;
            this.ListarItemDetalleTemporal=resp;
            this.flagLoading=false;
            this.ListarItem.length == 0 && this.toastr.info("No hay Elementos")
      }
    )
  }

  ListarItemVentasDetalle(){
    this._LogisticaService.ListarItemVentasDetalle().subscribe(
      (resp:any)=>{
            this.ListarItemDetalle = resp;
      }
    )
  }

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
          this.filtrosForm.get("idSubAgrupador").patchValue(this.ListarSubAgrupador[0].codSubAgrupador)
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
    this._GenericoService.ListarGenerar(idlinea).subscribe(
      (resp:any)=>{

        if(resp["success"]){
          this.FamiliaMaestro=resp["content"];
          this.SubFamilia(this.filtrosForm.controls.idLinea.value,this.FamiliaMaestro[0]?.familia)
        }
      }
    )
  }

  SubFamilia(idlinea,idFamilia){
    this._GenericoService.ListarSubFamilia(idlinea,idFamilia).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.SubFamilias=resp["content"];
          this.filtrosForm.get("idSubFamilia").patchValue(this.SubFamilias[0]?.subFamilia)
        }
      }
    )
  }

  ListarMarca(){
    this._GenericoService.ListarMarca().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.Marcas=resp["content"];
          this.filtrosForm.get("idmarca").patchValue(this.Marcas);
        }
      }
    )
  }


  instanciarObservadoresAgrupador(){
    this.filtrosForm.get("idAgrupador").valueChanges.subscribe( idAgrupador => {
         this.SubAgrupador(idAgrupador)
    })
  }

  instanciarObservadoresLinea(){
    this.filtrosForm.get("idLinea").valueChanges.subscribe(idlinea=>{
        this.Familias(idlinea);
    })
  }

instanciarObservadoresfamilia(){
    this.filtrosForm.get("idfamilia").valueChanges.subscribe(idfamilia=>{
        this.SubFamilia(this.filtrosForm.controls.idLinea.value,idfamilia);
    })
}




 

  

  BuscarProducto(){
    this.ListarItemVentasResumen();
    this.ListarItemVentasDetalle();
  }

  

}
