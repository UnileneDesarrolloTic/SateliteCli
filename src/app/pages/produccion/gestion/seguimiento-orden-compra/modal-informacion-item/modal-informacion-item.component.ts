import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatoFormatoInformacionItemOC } from '@data/interface/Response/DatosFormatoInformacionItemOC.interfaces';
import { DatoFormatoOrdenCompraItem } from '@data/interface/Response/DatosFormatoOrdenCompraItem.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-informacion-item',
  templateUrl: './modal-informacion-item.component.html',
  styleUrls: ['./modal-informacion-item.component.css']
})
export class ModalInformacionItemComponent implements OnInit {

  @Input() fromParent;
  FormTableItem:FormGroup;
  ListarInformacionItem:DatoFormatoInformacionItemOC[]=[];
  constructor(public activeModal: NgbActiveModal,
              private _fb:FormBuilder,
              private _ProduccionService:ProduccionService) { }

  ngOnInit(): void {
    console.log(this.fromParent);
    this.InformacionOrdenCompra(this.fromParent.Item);
    this.crearFormulario();
  }

  crearFormulario(){
    this.FormTableItem = this._fb.group({
        ListarOrdenCompra: this._fb.array([]),
    })
  }
  
  InformacionOrdenCompra(Item){
    this._ProduccionService.BuscarItemOrdenCompra(Item).subscribe(
      resp=>{
          this.ListarInformacionItem=resp["informacionItem"]
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
          fechaPrometida:[separarFecha[0]],
          item:[pedido.item],
        });

        this.ListadoOC.push(FileForm);

      });

  }

  get ListadoOC(){
    return this.FormTableItem.controls['ListarOrdenCompra'] as FormArray;
  }

  GuardarFechaPrometida(filaOrdenCompra){

      console.log(filaOrdenCompra);
  }



}
