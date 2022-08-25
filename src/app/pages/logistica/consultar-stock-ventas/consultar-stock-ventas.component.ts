import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemVentasModel } from '@data/interface/Response/DatosFormatoItemsVentas.interfaces';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DetalleItemVentasModel } from '@data/interface/Response/DatosFormatosItemVentasDetalle.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { MarcarModel } from '@data/interface/Response/DatosMarca.interface';
import { AgrupadorModel } from '@data/interface/Response/DatosAgrupador.interface';



@Component({
  selector: 'app-consultar-stock-ventas',
  templateUrl: './consultar-stock-ventas.component.html',
  styleUrls: ['./consultar-stock-ventas.component.css']
})
export class ConsultarStockVentasComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  ListarItem:ItemVentasModel[]=[];
  Marcas:MarcarModel[]=[];
  ListarAgrupador:AgrupadorModel[]=[];

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
              private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.ListarItemVentasResumen();
    this.ListarItemVentasDetalle();
    this.ListarMarca();
    this.Agrupador();



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
      Item: new FormControl(''),
      Codsut:new FormControl(''),
      Descripcion:new FormControl(''),
      Origen: new FormControl(0),
      idAgrupador:new FormControl(null),
      idmarca:new FormControl(null),
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
      idmarca:this.opcionMarcar
    }

    
    this._LogisticaService.ListarItemVentas(this.dato).subscribe(
      (resp:any)=>{
            this.ListarItem = resp;
            this.ListarItemDetalleTemporal=resp;
            this.flagLoading=false;
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

  Agrupador(){
    this._GenericoService.ListarAgrupador().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.ListarAgrupador=resp["content"];
        }
      }
    )
  }

  BuscarProducto(){
      this.ListarItemVentasResumen();
  }

  

}
