import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatosFormatorLoteEstadoModel } from '@data/interface/Response/CabeceraLoteinterface';
import { DatosFormatoOrdenFabricacionEtiquetasModel } from '@data/interface/Response/DatosFormatoOrdenFabricacionEtiquetas.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.css']
})
export class EtiquetasComponent implements OnInit {
  ListadoOrdenFabricacion:FormGroup;
  ObjectOrdenFabricacion:DatosFormatoOrdenFabricacionEtiquetasModel;
  ListarLoteEstado:DatosFormatorLoteEstadoModel[]=[];
  Codlote : string = '';
  ActivarCheckout:boolean=true;
  constructor(private toastr: ToastrService,
              private _fb: FormBuilder,
              private _ProduccionService:ProduccionService) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.ListarLoteEstadoArray();
  }
  

  GuardarOrdenFabricacion(){
      this._ProduccionService.RegistrarLoteFabricacionEtiquetas(this.ListadoOrdenFabricacion.controls['Muestras'].value).subscribe(
        (resp)=>{
             if(resp["success"]){
                this.Codlote="";
                this.ActivarCheckout=true;
                const ArrayItem = this.ListadoOrdenFabricacion.controls.Muestras as FormArray;
                ArrayItem.controls = [];
                this.toastr.success(resp["content"]);
                this.ListarLoteEstadoArray();
             }else{
              this.toastr.info(resp["content"]);
             }
        }
      );

  }


  crearFormulario(){
    this.ListadoOrdenFabricacion = this._fb.group({
      Muestras: this._fb.array([]),
    });
  }

  ListarLoteEstadoArray(){
    this._ProduccionService.ListarLoteEstado().subscribe(
      (resp)=>{
            this.ListarLoteEstado=resp;
      }
    );
  }


  Buscar(){
    if(this.Codlote==''){
      return this.toastr.warning("Debe colocar el lote de fabricación");
    }
      this._ProduccionService.LoteFabricacionEtiquetas(this.Codlote).subscribe(
          (resp)=>{
            resp["success"] ? this.ObjectOrdenFabricacion = resp["content"]: {};
            this.MuestraArray(this.ObjectOrdenFabricacion);
          }
      );
  }

  
  MuestraArray(item:DatosFormatoOrdenFabricacionEtiquetasModel){
    this.ActivarCheckout= item.transferidoflag == 'N'? true : false; 
    const ArrayItem = this.ListadoOrdenFabricacion.controls.Muestras as FormArray;
    ArrayItem.controls = [];

    const ItemFilaForm = this._fb.group({
      fechaProduccion: [item.fechaProduccion],
      item: [item.item],
      numeroParte: [item.numeroParte],
      marca: [item.marca],
      descripcionLocal:[item.descripcionLocal],
      cliente: [item.cliente],
      lote: [item.lote],
      ordenFabricacion: [item.ordenFabricacion],
      transferidoflag: [item.transferidoflag],
    });
    
    this.Muestreo.push(ItemFilaForm);

  }


  ActivarInactivar(row){
        this._ProduccionService.ModificarLoteEstado(row).subscribe(
          (resp)=>{
            if(resp["success"]){
              this.toastr.success(resp["content"]);
              this.ListarLoteEstado=this.ListarLoteEstado.filter(element=> element.id!=row.id)
            }else{
              this.toastr.warning(resp["content"]);
            }
              
          }
      );
  }

  get Muestreo(){
    return this.ListadoOrdenFabricacion.controls['Muestras'] as FormArray;
  }
}
