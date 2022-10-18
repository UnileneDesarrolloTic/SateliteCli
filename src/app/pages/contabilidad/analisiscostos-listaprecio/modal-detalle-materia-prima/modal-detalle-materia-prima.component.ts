import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoProductoCostoBaseModel } from '@data/interface/Response/DatosFormatoProductoCostoBase.interface';
import { DatosFormatoRecetaItemComponenteModel } from '@data/interface/Response/DatosFormatoRecetaItemComponente.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalItemCostoComponent } from '@shared/components/modal-item-costo/modal-item-costo.component';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-detalle-materia-prima',
  templateUrl: './modal-detalle-materia-prima.component.html',
  styleUrls: ['./modal-detalle-materia-prima.component.css']
})
export class ModalDetalleMateriaPrimaComponent implements OnInit {
  ResumenFormulario:FormGroup;
  @Input()  itemRow : DatosFormatoProductoCostoBaseModel ;

  constructor( public activeModal: NgbActiveModal,
              private _fb : FormBuilder,
              private _ContabilidadService:ContabilidadService,
              private toastr: ToastrService,
              private _GenericoService:GenericoService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.InformacionItem(this.itemRow);
  }

  
  crearFormulario(){
    this.ResumenFormulario = new FormGroup({
          ArrayMateriaPrima: this._fb.array([]),
          CostoTotal: new FormControl(0),
          ManoObra: new FormControl(0),
          Cif: new FormControl(0),
          CostoUnitario : new FormControl(0),
          RentEsperada : new FormControl(0),
          PreUnitario : new FormControl(0),
    });
  }


  InformacionItem(item:DatosFormatoProductoCostoBaseModel){
    let FechaDocumento = item.ultFechaDoc.split("T")[0];
    let codigoItem = item.codigoItem;
    this._ContabilidadService.ConsultarRecetaItemComponente(codigoItem,FechaDocumento).subscribe(
      (resp:any)=>{
          if(resp.length>0)
            this.construirMateriaPrima(resp); 
          else
            this.toastr.warning(`Codigo: ${ codigoItem }  - Fecha Documento: ${ FechaDocumento }`,`No hay informacion`);
      },
      (error)=>{
          this.toastr.info("Comunicarse con sistemas");
      }
    )
  }

  
  construirMateriaPrima(ItemReceta:DatosFormatoRecetaItemComponenteModel[]){
    const ArrayItem = this.ResumenFormulario.controls.ArrayMateriaPrima as FormArray;
    ArrayItem.controls = [];
    var sumar = 0;

    ItemReceta.forEach((itemRow:DatosFormatoRecetaItemComponenteModel)=>{
        const ItemFilaForm = this._fb.group({
          periodo: [itemRow.periodo],
          item: [itemRow.item],
          nombreProducto: [itemRow.nombreProducto],
          numeroDeParte: [itemRow.numeroDeParte],
          secuencia: [itemRow.secuencia],
          itemcomponente: [itemRow.itemcomponente],
          cantidad: [itemRow.cantidad],
          costoUnitarioSoles: [itemRow.costoUnitarioSoles],
          material: [itemRow.material],
        });
        this.ListadoMateriaPrima.push(ItemFilaForm);
    })

    this.ResumenFormulario.controls.ArrayMateriaPrima.value.forEach((element:DatosFormatoRecetaItemComponenteModel) => {
      sumar = sumar + element.costoUnitarioSoles
    });
    console.log(sumar , "Final");

    this.ResumenFormulario.get("CostoTotal").patchValue(this._GenericoService.RedondearDecimales(sumar,2,false) );
  }

   
  get ListadoMateriaPrima(){
    return this.ResumenFormulario.controls['ArrayMateriaPrima'] as FormArray;
  }


  OpenModalItem(item:DatosFormatoRecetaItemComponenteModel){
    const modalRefItem = this.modalService.open(ModalItemCostoComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});


		modalRefItem.result.then((result) => {
         
		}, (reason) => {

		});
  }


}
