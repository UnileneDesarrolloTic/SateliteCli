import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CabeceraOrdenCompra } from '@data/interface/Response/DatosFormatosCabeceraOrdenCompra.interface';
import { DetalleOrdenCompra } from '@data/interface/Response/DatosFormatosDetalleOrdenCompra.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-visualizar-detalle-importacion',
  templateUrl: './modal-visualizar-detalle-importacion.component.html',
  styleUrls: ['./modal-visualizar-detalle-importacion.component.css']
})
export class ModalVisualizarDetalleImportacionComponent implements OnInit {
  @Input() fromParent;
  CabeceraOrdenCompra:CabeceraOrdenCompra;
  DetalleOrdenCompra:DetalleOrdenCompra []=[];
  OrdenCompraForm:FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private _fb:FormBuilder,
    private _ProduccionService:ProduccionService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.VisualizarOrdenCompra(this.fromParent.Detalle.numeroOrden);
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.OrdenCompraForm = new FormGroup({
      Documento: new FormControl({value:'',disabled:true}),
      Estado: new FormControl({value:'',disabled:true}),
      Proveedor: new FormControl({value:'',disabled:true}),
      FechaPreparacion: new FormControl({value:'',disabled:true}),
      FechaPrometida: new FormControl({value:'',disabled:true}),
      FechaLlegada:new FormControl({value:'', disabled:this.fromParent.Permiso}),
      Detalle: this._fb.array([]),
    })

  }

  VisualizarOrdenCompra(OrdenCompra){
    this._ProduccionService.VisualizarOrdenCompra(OrdenCompra).subscribe(
      (resp:any)=>{
          this.CabeceraOrdenCompra=resp["cabecera"];
          this.ConstruirFormArray(resp["detalle"]);
          let separadorFechaPreparacion = this.CabeceraOrdenCompra.FechaPreparacion.split('T');
          let separadorFechaPrometida = this.CabeceraOrdenCompra.FechaPrometida.split('T');
          let separadorFechaLlegada= this.CabeceraOrdenCompra.FechaEnvioProveedor == null ?  null : this.CabeceraOrdenCompra.FechaEnvioProveedor.split('T');

          this.OrdenCompraForm.get("Documento").patchValue(this.CabeceraOrdenCompra.NumeroOrden)
          this.OrdenCompraForm.get("Proveedor").patchValue(this.CabeceraOrdenCompra.Proveedor)
          this.OrdenCompraForm.get("FechaPreparacion").patchValue(separadorFechaPreparacion[0]);
          this.OrdenCompraForm.get("FechaPrometida").patchValue(separadorFechaPrometida[0]);
          this.OrdenCompraForm.get("FechaLlegada").patchValue(separadorFechaLlegada == null ? null : separadorFechaLlegada[0]);
          this.OrdenCompraForm.get("Estado").patchValue(this.CabeceraOrdenCompra.Estado);

          
      }
    )
  }

  ConstruirFormArray(formArrayResp:DetalleOrdenCompra[]){
    const ArrayItem = this.OrdenCompraForm.controls.Detalle as FormArray;
    ArrayItem.controls=[];

    formArrayResp.forEach((item:DetalleOrdenCompra)=>{
      let separarFecha=item.FechaPrometida.split("T");

      const FileForm= this._fb.group({
        NumeroOrden:[item.NumeroOrden],
        Descripcion:[item.Descripcion],
        UnidadCodigo:[item.UnidadCodigo],
        CantidadPedida:[item.CantidadPedida],
        CantidadRecibida:[item.CantidadRecibida],
        Estado:[item.Estado],
        FechaPrometida:[{value: separarFecha[0], disabled: this.fromParent.Permiso}],
        Item:[item.Item],
      });

      this.DetalleOC.push(FileForm);

    });

    
  }

  get DetalleOC(){
    return this.OrdenCompraForm.controls['Detalle'] as FormArray;
  }


  Actualizar(){
      
      const Dato = {
        ...this.OrdenCompraForm.value,
        Documento:this.OrdenCompraForm.controls.Documento.value
      }

      this._ProduccionService.ActualizarOrdenCompraMasiva(Dato).subscribe(
        (resp:any)=>{
          if(resp["success"]){
            this.toastr.success(resp["content"])
            this.activeModal.close(resp["success"]); 
          }
        }
      );
  }
}
