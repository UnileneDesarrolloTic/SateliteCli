import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DetalleCotizacionExportaciones } from '@data/interface/Response/DatosFormatoDetalleCotizacionExportaciones.interface';
import { ExportacionesService } from '@data/services/backEnd/pages/exportaciones.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-modal-item-mast',
  templateUrl: './modal-item-mast.component.html',
  styleUrls: ['./modal-item-mast.component.css']
})
export class ModalItemMastComponent implements OnInit {
  FormFiltro:FormGroup;
  ListarItemMast:DetalleCotizacionExportaciones[]=[];
  ListarSeleccionadoItemMast:DetalleCotizacionExportaciones[]=[];
  constructor(public activeModal: NgbActiveModal,
              public _ExportacionesService:ExportacionesService,
              private _toastrService: ToastrService, ) { }

  ngOnInit(): void {
    this.crearFormularioFiltro();
  }
 
  crearFormularioFiltro(){
    this.FormFiltro = new FormGroup({
        Opcion : new FormControl(0),
        Descripcion : new FormControl(''),
    });
  }
  

  ObtenerInformacionItem(){
     this._ExportacionesService.ObtenerListaItemMaster(this.FormFiltro.controls.Opcion.value,this.FormFiltro.controls.Descripcion.value).
     subscribe(
        (resp:any)=>{
              if(resp["content"].length>0)
                this.ListarItemMast=resp["content"];
              else 
                (this.ListarItemMast=resp["content"],this._toastrService.warning("No se ha encontrado lo solicitado"));0
        },
        (error)=> this._toastrService.info("Comuniquese con sistema")
     )
  }
  
  Mover(Item:DetalleCotizacionExportaciones){
      this.ListarSeleccionadoItemMast.push(Item);
  }

  Eliminar(itemRow:DetalleCotizacionExportaciones,index:number){
      this.ListarSeleccionadoItemMast.splice(index,1)
  }

  GuardarAceptar(){
    this.activeModal.close(this.ListarSeleccionadoItemMast);
  }
  

}
