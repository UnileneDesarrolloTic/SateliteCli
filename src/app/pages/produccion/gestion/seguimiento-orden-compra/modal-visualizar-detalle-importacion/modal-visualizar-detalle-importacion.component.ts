import { formatDate } from '@angular/common';
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
  MaestroSeleccion: boolean;
  botonestado:boolean=true;
  CabeceraOrdenCompra:CabeceraOrdenCompra;
  DetalleOrdenCompra:DetalleOrdenCompra []=[];
  // TempDetalleOrdenCompra:DetalleOrdenCompra[]=[];
  SeleccionArrayListar:any[]=[];
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
    })

  }

  VisualizarOrdenCompra(OrdenCompra){
    this._ProduccionService.VisualizarOrdenCompra(OrdenCompra).subscribe(
      (resp:any)=>{
          this.CabeceraOrdenCompra=resp["cabecera"];
          this.DetalleOrdenCompra=resp["detalle"];
          // this.TempDetalleOrdenCompra=resp["detalle"];

          let separadorFechaPreparacion = this.CabeceraOrdenCompra.FechaPreparacion.split('T');
          let separadorFechaPrometida = this.CabeceraOrdenCompra.FechaPrometida.split('T');
          // let separadorFechaLlegada= this.CabeceraOrdenCompra.FechaEnvioProveedor == null ?  null : this.CabeceraOrdenCompra.FechaEnvioProveedor.split('T');

          this.OrdenCompraForm.get("Documento").patchValue(this.CabeceraOrdenCompra.NumeroOrden)
          this.OrdenCompraForm.get("Proveedor").patchValue(this.CabeceraOrdenCompra.Proveedor)
          this.OrdenCompraForm.get("FechaPreparacion").patchValue(separadorFechaPreparacion[0]);
          this.OrdenCompraForm.get("FechaPrometida").patchValue(separadorFechaPrometida[0]);
          this.OrdenCompraForm.get("FechaLlegada").patchValue(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'));
          this.OrdenCompraForm.get("Estado").patchValue(this.CabeceraOrdenCompra.Estado);          
      }
    )
  }

  

  checkTodo() {
    for (var i = 0; i < this.DetalleOrdenCompra.length; i++) {
        this.DetalleOrdenCompra[i].isSelected=this.MaestroSeleccion;
    }
    this.SeleccionaTodo();
  }


  SeleccionaTodo() {
    this.SeleccionArrayListar=[];
    for (var i = 0; i < this.DetalleOrdenCompra.length; i++) {
     
      if (this.DetalleOrdenCompra[i].isSelected){
        this.SeleccionArrayListar.push(this.DetalleOrdenCompra[i]);
      }
        
     }
     this.SeleccionArrayListar.length > 0 ? this.botonestado=false : this.botonestado=true;
         
  }


  SeleccionaItem(rowItem:DetalleOrdenCompra){
    this.SeleccionArrayListar=[];

    // for (var i = 0; i < this.DetalleOrdenCompra.length; i++) {
    //     if(this.DetalleOrdenCompra[i].Item==rowItem.Item){
    //       this.DetalleOrdenCompra[i].isSelected=rowItem.isSelected;
    //     }
    // }

    for (var i = 0; i < this.DetalleOrdenCompra.length; i++) {
      if (this.DetalleOrdenCompra[i].isSelected){
        this.SeleccionArrayListar.push(this.DetalleOrdenCompra[i]);
      }
    }

    this.SeleccionArrayListar.length > 0 ? this.botonestado=false : this.botonestado=true;
  }

  get DetalleOC(){
    return this.OrdenCompraForm.controls['Detalle'] as FormArray;
  }


  Actualizar(){
      if(this.OrdenCompraForm.controls.FechaLlegada.value==null){
          return this.toastr.warning("Debe Ingresar la fecha de llegada");
      }

      const Dato = {
        Document:this.OrdenCompraForm.controls.Documento.value,
        FechaLlegada:this.OrdenCompraForm.controls.FechaLlegada.value,
        Detalle:this.SeleccionArrayListar,
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
