import { Component, Input, OnInit } from '@angular/core';
import { MostrarOrdenCompraDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarOrdenCompra.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-ver-transito',
  templateUrl: './modal-ver-transito.component.html',
  styleUrls: ['./modal-ver-transito.component.css']
})
export class ModalVerTransitoComponent implements OnInit {
  listarOrdenCompraDrogueria: MostrarOrdenCompraDrogueria[] = [];
  contar:number=0;
  flagEspera:boolean=true;
  @Input() Item:string = '';
  @Input() mostrarBotonTransito:boolean = false;
  
  constructor( public activeModal: NgbActiveModal,
               public _ProduccionService: ProduccionService,
               private _toastr: ToastrService ) { }

  ngOnInit(): void {
    this.obtenerOrdenCompra(this.Item);
  }


  
  obtenerOrdenCompra(Item:string){
    this._ProduccionService.mostarOrdenCompraItem(Item).subscribe(
      (resp: any) => {
        this.flagEspera=false;
        this.listarOrdenCompraDrogueria = resp["content"];
      }
    )
  }

  quitarTransito(ordenItem:MostrarOrdenCompraDrogueria,index:number){
    let rpta:boolean=true;
    rpta = confirm(`¿Esta seguro de quitar del transito la ${ ordenItem.numeroOrden } con el Item ${ ordenItem.itemFinal } ? `);

    if (rpta)
    {
      let comentario = prompt(`Por favor, el motivo por qué desea quitar la ${ ordenItem.numeroOrden } con el Item ${ ordenItem.itemFinal }`,'');
      if (comentario === null) {
        return;
    }
      const datos = 
      {
        numeroOrden: ordenItem.numeroOrden,
        item : ordenItem.itemFinal,
        comentario: comentario
      }

      this._ProduccionService.guardarOrdenCompraVencida(datos).subscribe(
          (resp:any)=>{
            if(resp["success"]){
              this.listarOrdenCompraDrogueria = this.listarOrdenCompraDrogueria.filter((filacompra:MostrarOrdenCompraDrogueria) => `${filacompra.numeroOrden}-${filacompra.itemFinal}` != `${ordenItem.numeroOrden}-${ordenItem.itemFinal}` )
              this._toastr.success(resp["message"],"Guardado", { timeOut: 4000, closeButton: true });
              this.contar = this.contar + 1;
            }
          }
      ) 
    }
    
  }

  CerrarModalTransito(){
    this.activeModal.dismiss(this.contar)
  }
}
