import { Component, OnInit } from '@angular/core';
import { DatosFormatoListadoCompraAguja } from '@data/interface/Response/CompraAguja/DatosFormatoListadoCompraAguja.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';

@Component({
  selector: 'app-compra-aguja',
  templateUrl: './compra-aguja.component.html',
  styleUrls: ['./compra-aguja.component.css']
})
export class CompraAgujaComponent implements OnInit {

  listadoCompraAguja:DatosFormatoListadoCompraAguja[]=[];
  flagEspera:boolean=false;
  constructor(public _ProduccionService: ProduccionService) { }

  ngOnInit(): void {
    this.listadoComprasAguja();
  }


  listadoComprasAguja(){
    this.flagEspera = true;
    this._ProduccionService.listarSeguimientoCompraAguja().subscribe(
      (resp:any)=>{
            this.listadoCompraAguja = resp;
            this.flagEspera = false;
      },
      _=> this.flagEspera = false
    );
  }

}
