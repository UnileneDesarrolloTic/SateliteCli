import { Component, Input, OnInit } from '@angular/core';
import { OrdenCompraPrevio } from '@data/interface/Response/OCDrogueria/DatosFormatoOrdenCompraPrevio.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-listar-orden-compra-previo',
  templateUrl: './listar-orden-compra-previo.component.html',
  styleUrls: ['./listar-orden-compra-previo.component.css']
})
export class ListarOrdenCompraPrevioComponent implements OnInit {
  flagEsperaOC:boolean = false;
  @Input() ordenCompraPrevio:OrdenCompraPrevio[]=[];
  constructor(private _modalService: NgbModal, private _router: Router, private _ProduccionService:ProduccionService, private  _ToastrService:ToastrService) { }

  ngOnInit(): void {
  }

  verDetalle(ordenCompra:OrdenCompraPrevio){
    this._router.navigate(['Produccion', 'Arima', 'CompraDrogueria', ordenCompra.proveedor]);
  }

  getRowClass = (row:OrdenCompraPrevio) => {
    return {
      'row-amarillo': row.idGestionarColor > 0 ? true : false 
    };
   }


   generarOrdenCompra(){
    this.flagEsperaOC=true;
    this._ProduccionService.generarOrdenCompraDrogueria().subscribe(
        (resp:any)=>{
              this.flagEsperaOC=false;
              if(resp["success"])
              {
                this._ToastrService.success(resp["message"])
                this.listadoOrdenCompra();
              }
        },
        _=>{
          this.flagEsperaOC=false;
        }
    );
   }

   listadoOrdenCompra(){
    this._ProduccionService.generarOrdenCompraPrevios().subscribe(
      (resp:any)=>{
          this.ordenCompraPrevio=resp["content"];
      },
    
    )
  }
}
