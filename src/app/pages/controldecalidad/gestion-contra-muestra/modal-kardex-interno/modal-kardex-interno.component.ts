import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KardexInternoGCM } from '@data/interface/Response/KardexInternoGCM.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-kardex-interno',
  templateUrl: './modal-kardex-interno.component.html',
  styleUrls: ['./modal-kardex-interno.component.css']
})
export class ModalKardexInternoComponent implements OnInit {
  form:FormGroup;
  @Input() fromParent;
  ListarKardexInterno:KardexInternoGCM[]=[];
  KardexInterno:FormGroup;
  FormularioKardexInterno:FormGroup;

  constructor( public activeModal: NgbActiveModal,
                private _fb:FormBuilder,
                private toastr: ToastrService,
                public _ControlcalidadService:ControlcalidadService) {
                  this.FormularioKardexInterno = new FormGroup({
                    Lote:new FormControl('',Validators.required),
                    OrdenFabricacion:new FormControl('',Validators.required),
                    Transaccion:new FormControl('NS',Validators.required),
                    Cantidad:new FormControl('',Validators.required),
                    Comentario:new FormControl(''),
                  });
                  this.KardexInterno = this._fb.group({
                    ListadoKardexInterno: this._fb.array([]),
                  });
   }

  ngOnInit(): void {
    console.log(this.fromParent);
    this.FormularioKardexInterno.get("Lote").patchValue(this.fromParent.lote);
    this.FormularioKardexInterno.get("OrdenFabricacion").patchValue(this.fromParent.ordenFabricacion);
    this.FormularioKardexInterno.controls.Lote.disable();
    this.FormularioKardexInterno.controls.OrdenFabricacion.disable();
    this.ListarKardexInternoGCM();
  }

  ListarKardexInternoGCM(){
    this._ControlcalidadService.ListarKardexInternoGCM(this.fromParent.lote).subscribe(
      (resp:any)=>{
          this.ListarKardexInterno=resp;
          this.MuestraArrayKardex(this.ListarKardexInterno);
      }
    )
  }

  RegistrarKardexInternoGCM(){
    const dato={
      ...this.FormularioKardexInterno.value,
      Lote:this.FormularioKardexInterno.controls.Lote.value,
      OrdenFabricacion:this.FormularioKardexInterno.controls.OrdenFabricacion.value
    }

    this._ControlcalidadService.RegistrarKardexInternoGCM(dato).subscribe(
      (resp:any)=>{
        if(resp["success"]) {
          this.toastr.success(resp["content"]) ;
          this.ListarKardexInternoGCM()
        } else{
          this.toastr.info(resp["content"]);
        } 
      }
    )
  }

  MuestraArrayKardex(formArrayResp:KardexInternoGCM[]){
    const ArrayItem = this.KardexInterno.controls.ListadoKardexInterno as FormArray;
    ArrayItem.controls = [];

    formArrayResp.forEach((itemRow:KardexInternoGCM)=>{
        const ItemFilaForm = this._fb.group({
          idKardex: [itemRow.idKardex],
          numeroLote: [itemRow.numeroLote],
          ordenFabricacion: [itemRow.ordenFabricacion],
          tipoTransaccion: [itemRow.tipoTransaccion],
          cantidad:[itemRow.cantidad],
          usuario:[itemRow.usuario],
          comentarios: [itemRow.comentarios],
          estado: [itemRow.estado],
        });
        this.ListadoKardex.push(ItemFilaForm);
    })
  }

  get ListadoKardex(){
    return this.KardexInterno.controls['ListadoKardexInterno'] as FormArray;
  }

  Actualizar(row:KardexInternoGCM){
    this._ControlcalidadService.ActualizarKardexInternoGCM(row.idKardex,row.comentarios).subscribe(
      (resp:any)=>{
        resp["success"] ? this.toastr.success(resp["content"]) : this.toastr.info(resp["content"]);
      }
    )
  }
}
