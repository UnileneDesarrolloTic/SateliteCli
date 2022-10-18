import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoProductoCostoBaseModel } from '@data/interface/Response/DatosFormatoProductoCostoBase.interface';
import { DatosFormatoRecetaItemComponenteModel } from '@data/interface/Response/DatosFormatoRecetaItemComponente.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ModalDetalleMateriaPrimaComponent } from '../modal-detalle-materia-prima/modal-detalle-materia-prima.component';

@Component({
  selector: 'app-tag-resumen',
  templateUrl: './tag-resumen.component.html',
  styleUrls: ['./tag-resumen.component.css']
})
export class TagResumenComponent implements OnInit {
  @Input() ListarProductoCostoBase: DatosFormatoProductoCostoBaseModel[]=[];
  ListarItemComponente:DatosFormatoRecetaItemComponenteModel[]=[];
  ResumenFormulario:FormGroup;
  
  constructor(private _fb : FormBuilder,
              private _ContabilidadService:ContabilidadService,
              private toastr: ToastrService,
              private modalService: NgbModal,) { }



  ngOnInit(): void {   
  }


  OpenModalDetalleMP(item:DatosFormatoProductoCostoBaseModel){
    console.log(item);
    if(item.ultFechaDoc=='1900-01-01T00:00:00'){
        return this.toastr.warning("Contiene costo Base","Información");
    }
    const modalRefGenerarCotizacion = this.modalService.open(ModalDetalleMateriaPrimaComponent, {
			ariaLabelledBy: 'modal-basic-title',
      windowClass: 'my-class',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});

    modalRefGenerarCotizacion.componentInstance.itemRow =item;
		modalRefGenerarCotizacion.result.then((result) => {
         
		}, (reason) => {

		});
  }


}
