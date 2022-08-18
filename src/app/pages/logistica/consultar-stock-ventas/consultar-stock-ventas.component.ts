import { Component, OnInit } from '@angular/core';
import { ItemVentasModel } from '@data/interface/Response/DatosFormatoItemsVentas.interfaces';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DetalleItemVentasModel } from '@data/interface/Response/DatosFormatosItemVentasDetalle.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { MarcarModel } from '@data/interface/Response/DatosMarca.interface';



@Component({
  selector: 'app-consultar-stock-ventas',
  templateUrl: './consultar-stock-ventas.component.html',
  styleUrls: ['./consultar-stock-ventas.component.css']
})
export class ConsultarStockVentasComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  ListarItem:ItemVentasModel[]=[];
  Marcas:MarcarModel[]=[]
  filtrosForm: FormGroup;
  ListarItemDetalleTemporal:ItemVentasModel[]=[];
  ListarItemDetalle:DetalleItemVentasModel[]=[];
  flagLoading: boolean = false;

  constructor(private _LogisticaService: LogisticaService,
              private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.ListarItemVentasResumen();
    this.ListarItemVentasDetalle();
    this.ListarMarca();
  
  }

  inicializarFormulario() {
    this.filtrosForm = new FormGroup({
      Item: new FormControl(''),
      Codsut:new FormControl(''),
      Descripcion:new FormControl(''),
      //Origen: new FormControl(null),
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
    this._LogisticaService.ListarItemVentas(this.filtrosForm.value).subscribe(
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
        }
      }
    )
  }

  BuscarProducto(){
      this.ListarItemVentasResumen();
  }

  

}
