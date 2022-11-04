import { Component, Input, OnInit,EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoProductoCostoBaseModel } from '@data/interface/Response/DatosFormatoProductoCostoBase.interface';
import { DatosFormatoRecetaItemComponenteModel } from '@data/interface/Response/DatosFormatoRecetaItemComponente.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalItemCostoComponent } from '@shared/components/modal-item-costo/modal-item-costo.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ModalDetalleMateriaPrimaComponent } from '../modal-detalle-materia-prima/modal-detalle-materia-prima.component';

@Component({
  selector: 'app-tag-resumen',
  templateUrl: './tag-resumen.component.html',
  styleUrls: ['./tag-resumen.component.css']
})
export class TagResumenComponent implements OnInit {
  @Input() ListarProductoCostoBase: DatosFormatoProductoCostoBaseModel[] = [];
  @Input() Tmp_ListarProducto:any[]=[];
  @Output() ItemEventButtonRefrescar = new EventEmitter<boolean>();

  ListarItemComponente: DatosFormatoRecetaItemComponenteModel[] = [];
  ResumenFormulario: FormGroup;
  Todos:boolean=false;

  MaestroSeleccion: boolean;
  TipoAguja = new FormControl(null);

  constructor(private _fb: FormBuilder,
    private _ContabilidadService: ContabilidadService,
    private toastr: ToastrService,
    private modalService: NgbModal,) { }



  ngOnInit(): void {
    // this.Tmp_ListarProducto=this.ListarProductoCostoBase;
    // console.log(this.Tmp_ListarProducto)
    this.isObservableComboTipoAgujas();
  }

  isObservableComboTipoAgujas(){
      this.TipoAguja.valueChanges.subscribe(valor=>{
            let separador = valor.split('-');
    
            this.ListarProductoCostoBase.forEach((element:DatosFormatoProductoCostoBaseModel)=>{
                  if(element.isSelected && element.tipoAguja!=separador[1]){
                    element.costoMateriaPrima=element.costoMateriaPrima - element.itemComponenteCostoDolares;
                    element.tipoAguja=separador[1];
                    element.itemComponenteCostoDolares= parseFloat(separador[0]);
                    element.costoMateriaPrima=element.costoMateriaPrima + element.itemComponenteCostoDolares;
                    element.costoUnitarioBase= element.costoMateriaPrima + element.costoManoObra +  element.costoCIF ;
                  }
            })
      })
  }

  // public set TipoAguja(tipo: string) {
  //   let separador = tipo.split('-');
    
  //   this.ListarProductoCostoBase.forEach((element:DatosFormatoProductoCostoBaseModel)=>{
  //         if(element.isSelected && element.tipoAguja!=separador[1]){
  //           element.costoMateriaPrima=element.costoMateriaPrima - element.itemComponenteCostoDolares;
  //           element.tipoAguja=separador[1];
  //           element.itemComponenteCostoDolares= parseFloat(separador[0]);
  //           element.costoMateriaPrima=element.costoMateriaPrima + element.itemComponenteCostoDolares;
  //           element.costoUnitarioBase= element.costoMateriaPrima + element.costoManoObra +  element.costoCIF ;
  //         }
  //   })
  // }


  OpenModalDetalleMP(item: DatosFormatoProductoCostoBaseModel) {
    // console.log(item);
    if (item.ultFechaDoc == '1900-01-01T00:00:00') {
      return this.toastr.warning("Contiene costo Base", "Información");
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

    modalRefGenerarCotizacion.componentInstance.itemRow = item;
    modalRefGenerarCotizacion.result.then((result) => {

    }, (reason) => {

    });
  }

  OpenModalItem(item: any, index) {
    // console.log(item,"item")
    const modalRefItem = this.modalService.open(ModalItemCostoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
      keyboard: false
    });

    modalRefItem.componentInstance.ItemComponente = item;
    modalRefItem.result.then((result: any) => {
      // console.log(result,"componente");
      // console.log("position",index);
      if(this.Todos){
            this.ListarProductoCostoBase.forEach((element:DatosFormatoProductoCostoBaseModel)=>{
                element.costoMateriaPrima=element.costoMateriaPrima - element.itemComponenteCostoDolares;
                element.itemComponente=result.itemComponente;
                element.descripcionLocalItemComponente=result.descripcionLocal;
                element.itemComponenteCostUnitario=result.costoUnitarioSoles;
                element.itemComponenteCostoDolares=result.costoUnitarioDolares;
                element.costoMateriaPrima=element.costoMateriaPrima + result.costoUnitarioDolares;
            });
      }else{
          this.ListarProductoCostoBase.forEach((element:DatosFormatoProductoCostoBaseModel,position)=>{
            if(index==position){
              element.costoMateriaPrima=element.costoMateriaPrima - element.itemComponenteCostoDolares;
              element.itemComponente=result.itemComponente;
              element.descripcionLocalItemComponente=result.descripcionLocal;
              element.itemComponenteCostUnitario=result.costoUnitarioSoles;
              element.itemComponenteCostoDolares=result.costoUnitarioDolares;
              element.costoMateriaPrima=element.costoMateriaPrima + result.costoUnitarioDolares;
            }
          });
      }
        

      // console.log(this.Tmp_ListarProducto)
    },(reason) => {
        
		});
  }

  get SumaTotalMateriaPrima(){
    var sumar = 0;
    this.ListarProductoCostoBase.forEach((element:DatosFormatoProductoCostoBaseModel) => {
      sumar = sumar + element.costoMateriaPrima
    });
    return sumar;
  }

  get SumaTotalCUBase(){
    var sumar = 0;
    this.ListarProductoCostoBase.forEach((element:DatosFormatoProductoCostoBaseModel) => {
      sumar = sumar + element.costoUnitarioBase
    });
    return sumar;
  }

  RefrescarCostoBase(valor){
    this.MaestroSeleccion=false;
    this.ItemEventButtonRefrescar.emit(valor)
  }

  checkTodo() {
    for (var i = 0; i < this.ListarProductoCostoBase.length; i++) {
        this.ListarProductoCostoBase[i].isSelected=this.MaestroSeleccion;
    } 
  }

  SeleccionaItem(rowItem:DatosFormatoProductoCostoBaseModel){
   
    for (var i = 0; i < this.ListarProductoCostoBase.length; i++) {
        if(this.ListarProductoCostoBase[i].codigoItem==rowItem.codigoItem){
          this.ListarProductoCostoBase[i].isSelected=rowItem.isSelected;
        }
    }

  }

}
