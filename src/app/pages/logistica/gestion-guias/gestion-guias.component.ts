import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatosFormatoPlanOrdenServicosDModel } from '@data/interface/Response/DatosFormatoPlanOrdenServicosD.inteface';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-guias',
  templateUrl: './gestion-guias.component.html',
  styleUrls: ['./gestion-guias.component.css']
})
export class GestionGuiasComponent implements OnInit {
  NumeroGuia:string = '';
  Planservicios:FormGroup;
  
  constructor(private _ServiceLogistica:LogisticaService,
              private toastr: ToastrService,
              private _fb: FormBuilder,) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.Planservicios = this._fb.group({
      ListadoNumeroGuias: this._fb.array([]),
    });
  }

  Buscar(){
    if(this.NumeroGuia==''){
        return this.toastr.warning("Debe Ingresar Numero de la Guia");
    }
    this._ServiceLogistica.ObtenerNumeroGuia(this.NumeroGuia).subscribe(
      resp=>{
        this.ConstruirFormArray(resp);
      }
    );
  }

  ConstruirFormArray(formArrayResp:DatosFormatoPlanOrdenServicosDModel[]){
    const ArrayItem = this.Planservicios.controls.ListadoNumeroGuias as FormArray;
    ArrayItem.controls = [];

    formArrayResp.forEach((itemRow:DatosFormatoPlanOrdenServicosDModel)=>{
          const ItemFilaForm = this._fb.group({
            numeroGuia: [itemRow.numeroGuia],
            fechaDocumento: [itemRow.fechaDocumento],
            cliente: [itemRow.cliente],
            ordenServicios: [itemRow.ordenServicios],
            fechaRetorno:[itemRow.fechaRetorno]
          });
          this.ListadoServicios.push(ItemFilaForm);
      })
  }

  get ListadoServicios(){
    return this.Planservicios.controls['ListadoNumeroGuias'] as FormArray;
  }


  GuardarServicios(){

    this._ServiceLogistica.RegistarFechaRetorno(this.Planservicios.controls['ListadoNumeroGuias'].value).subscribe(
      (resp:any)=>{
              resp["success"] ? this.toastr.success(resp["content"]) : this.toastr.info(resp["content"]);
      }
    );
  }

}
