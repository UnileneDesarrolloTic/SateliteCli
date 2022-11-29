import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatoFormatoNumeroPedidoMateriaPrima } from '@data/interface/Response/DatosFormatoNumeroDocumentoLogisticaContizacion.Interface';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalDetalleRecetaComponent } from '../../../../shared/components/modal-detalle-receta/modal-detalle-receta.component';

@Component({
  selector: 'app-materia-prima-item',
  templateUrl: './materia-prima-item.component.html',
  styleUrls: ['./materia-prima-item.component.css']
})
export class MateriaPrimaItemComponent implements OnInit {
  ListarNumerodePedido:DatoFormatoNumeroPedidoMateriaPrima[]=[];
  FormFiltro:FormGroup;
  constructor(private _LogisticaService:LogisticaService,
               private modalService: NgbModal,
               private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.FormFiltro = new FormGroup({
      NumeroDocumento:new FormControl(''),
      Tipo:new FormControl('Pedido'),
    })
  }

  BuscarPedido(){
    if(this.FormFiltro.controls.NumeroDocumento.value==""){
      return this.toastr.info("Debe Ingresar el Numero de Documento");
    }
    this._LogisticaService.ListarNumeroDePedido(this.FormFiltro.controls.NumeroDocumento.value, this.FormFiltro.controls.Tipo.value).subscribe(
        (resp:any)=>{
            this.ListarNumerodePedido= resp;
        },
        (error)=>{
            this.toastr.info("Comuniquese con Sistema")
        }
        
    )
  }


  AbrirModalMP(item:DatoFormatoNumeroPedidoMateriaPrima){
    
      const modalRefDetalleReceta = this.modalService.open(ModalDetalleRecetaComponent, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        backdropClass: 'light-blue-backdrop',
        backdrop: 'static',
        size: 'lg',
        scrollable: true,
        keyboard: false
      });
  
      modalRefDetalleReceta.componentInstance.Item = item.itemCodigo;
      modalRefDetalleReceta.componentInstance.Cantidad = item.cantidadpedida;
      modalRefDetalleReceta.result.then((result) => {
        
      }, (reason) => {
       
      });
  }

}
