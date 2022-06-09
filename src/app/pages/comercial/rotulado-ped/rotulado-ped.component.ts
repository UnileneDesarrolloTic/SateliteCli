import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosDocumentosPedido } from '@data/interface/Response/DatosDocumentoPedido.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rotulado-ped',
  templateUrl: './rotulado-ped.component.html',
  styleUrls: ['./rotulado-ped.component.css']
})
export class RotuladoPEDComponent implements OnInit {
  NumeroPedido:string="";
  DatosNumeroPedido:DatosDocumentosPedido;
  form:FormGroup;
  botonDeshabilitar:boolean=true;
  constructor(
    private _ComercialService:ComercialService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.CrearFormulario();
  }
  CrearFormulario(){
    this.form = new FormGroup({
      numeroDocumento: new FormControl('', Validators.required),
      rInterno:  new FormControl('', Validators.required),
      rExterno:  new FormControl('', Validators.required),
    })

  }

  FiltrarPedido(){
    this._ComercialService.BuscarDocumentoPedido(this.NumeroPedido.trim()).subscribe(
      (resp:any)=>{

          if(resp["success"]){
            this.DatosNumeroPedido=resp["content"];
            this.form.patchValue({
              numeroDocumento: this.DatosNumeroPedido.numeroDocumento,
              rInterno: this.DatosNumeroPedido.rInterno,
              rExterno: this.DatosNumeroPedido.rExterno
            })
            this.botonDeshabilitar=false;
          }else{
            this.toastr.info(resp["message"])
            this.limpiarCampos();
          }
         
      }
    );
  }

  Guardar(){
    this._ComercialService.GuardarRotuladoPedido(this.form.value).subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.toastr.success("Guardado con exito");
          }else{
            this.toastr.info("Datos Erroneos");
          }
          this.limpiarCampos();
      }
    );
     
  }

  limpiarCampos(){
           this.DatosNumeroPedido=Object();
            this.form.reset();
            this.botonDeshabilitar=true;
  }
}
