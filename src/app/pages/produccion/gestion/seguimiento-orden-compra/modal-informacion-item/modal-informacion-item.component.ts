import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatoFormatoInformacionItemOC } from '@data/interface/Response/DatosFormatoInformacionItemOC.interfaces';
import { DatoFormatoOrdenCompraItem } from '@data/interface/Response/DatosFormatoOrdenCompraItem.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-informacion-item',
  templateUrl: './modal-informacion-item.component.html',
  styleUrls: ['./modal-informacion-item.component.css']
})
export class ModalInformacionItemComponent implements OnInit {

  @Input() fromParent;
  FormTableItem:FormGroup;
  ListarInformacionItem:DatoFormatoInformacionItemOC[]=[];
  ListarDetalle:any[]=[];
  constructor(public activeModal: NgbActiveModal,
              private _fb:FormBuilder,
              private toastr: ToastrService,
              private _ProduccionService:ProduccionService) { }

  ngOnInit(): void {
 
    this.InformacionOrdenCompra(this.fromParent.item.item,this.fromParent.Anio);
    this.crearFormulario();
  }

  crearFormulario(){
    this.FormTableItem = this._fb.group({
        ListarOrdenCompra: this._fb.array([]),
    })
  }
  
  InformacionOrdenCompra(Item,Anio){
    this._ProduccionService.BuscarItemOrdenCompra(Item,Anio).subscribe(
      resp=>{
          this.ListarInformacionItem=resp["informacionItem"];
          this.ListarDetalle=resp["detalle"];
          this.ConstruirFormArray(resp["listaOrdenCompra"]);
      }
    );
  }

  ConstruirFormArray(formArrayResp:DatoFormatoOrdenCompraItem[]){
      const ArrayItem = this.FormTableItem.controls.ListarOrdenCompra as FormArray;
      ArrayItem.controls=[];

      formArrayResp.forEach((pedido:DatoFormatoOrdenCompraItem)=>{
        let separarFecha=pedido.fechaPrometida.split("T");

        const FileForm= this._fb.group({
          numeroOrden:[pedido.numeroOrden],
          nombreCompleto:[pedido.nombreCompleto],
          documento:[pedido.documento],
          cantidadPedida:[pedido.cantidadPedida],
          cantidadRecibida:[pedido.cantidadRecibida],
          fechaPrometida:[{value:separarFecha[0],disabled:this.fromParent.Permiso}],
          item:[pedido.item],
        });

        this.ListadoOC.push(FileForm);

      });

  }

  get ListadoOC(){
    return this.FormTableItem.controls['ListarOrdenCompra'] as FormArray;
  }

  GuardarFechaPrometida(filaOrdenCompra){
      this._ProduccionService.ActualizarFechaPrometida(filaOrdenCompra).subscribe(
          (resp:any)=>{
                if(resp["success"]){
                    this.toastr.success(resp["content"]);
                    this.activeModal.close(resp["success"]); 
                }
          },
      )
  }



}
