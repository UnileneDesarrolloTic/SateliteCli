import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ItemComponenteUnitarioModel } from '@data/interface/Response/DatosFormatoItemComponent.interface';
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
  FechaItemProductoTerminado:string='';
  @Input()  itemRow : DatosFormatoProductoCostoBaseModel ;
  ListarPrecioCostoItemComponente:DatosFormatoRecetaItemComponenteModel[]=[];

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
    this.ResumenFormulario = this._fb.group({
          // ArrayMateriaPrima: this._fb.array([]),
          CostoTotal: new FormControl(0),
          ManoObra: new FormControl(0),
          Cif: new FormControl(0),
          CostoUnitario : new FormControl(0),
          // RentEsperada : new FormControl(0),
          // PreUnitario : new FormControl(0),
    });
  }


  InformacionItem(item:DatosFormatoProductoCostoBaseModel){
    let FechaDocumento = item.ultFechaDoc.split("T")[0];
    this.FechaItemProductoTerminado = item.ultFechaDoc.split("T")[0];
    let codigoItem = item.codigoItem;
    this.ResumenFormulario.get("ManoObra").patchValue(item.costoManoObra);
    this.ResumenFormulario.get("Cif").patchValue(item.costoCIF);

    this._ContabilidadService.ConsultarRecetaItemComponente(codigoItem,FechaDocumento).subscribe(
      (resp:any)=>{
          if(resp.length>0){
            this.ListarPrecioCostoItemComponente=resp;
            this.SumaTotal();
          }else{
            this.toastr.warning(`No hay informacion`);
          } 
      },
      (error)=>{
          this.toastr.info("Comunicarse con sistemas");
      }
    )
  }

  

  SumaTotal(){
    var sumar = 0;
    let CostoUnitarioBaseGeneral=0;
    this.ListarPrecioCostoItemComponente.forEach((element:DatosFormatoRecetaItemComponenteModel) => {
      sumar = sumar + element.costoUnitarioDolares
    });
    this.ResumenFormulario.get("CostoTotal").patchValue(this._GenericoService.RedondearDecimales(sumar,2,false) );
    CostoUnitarioBaseGeneral = parseFloat(this.ResumenFormulario.controls.CostoTotal.value) +  parseFloat(this.ResumenFormulario.controls.ManoObra.value) + parseFloat(this.ResumenFormulario.controls.Cif.value);
    this.ResumenFormulario.get("CostoUnitario").patchValue(this._GenericoService.RedondearDecimales(CostoUnitarioBaseGeneral,2,false));
  }
   

  OpenModalItem(item:DatosFormatoRecetaItemComponenteModel,index){
    // console.log(index);
    const modalRefItem = this.modalService.open(ModalItemCostoComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});

    modalRefItem.componentInstance.ItemComponente =item;
    // modalRefItem.componentInstance.FechaItemProductoTerminado =this.FechaItemProductoTerminado;
		modalRefItem.result.then((result:ItemComponenteUnitarioModel) => {
     this.ListarPrecioCostoItemComponente.forEach((element:DatosFormatoRecetaItemComponenteModel,position)=>{
          if(index==position){
               element.itemComponente=result.itemComponente;
               element.nombreProducto=result.descripcionLocal;
               element.costoUnitarioSoles=result.costoUnitarioSoles;
               element.costoUnitarioDolares=result.costoUnitarioDolares;
               element.costoUnitario=element.cantidad / result.costoUnitarioDolares;
          }
          
    })
    
    this.SumaTotal();
		}, (reason) => {
      // console.log(reason,"sali sadsad")
		});

    // this.ResumenFormulario.value;
  }


}
