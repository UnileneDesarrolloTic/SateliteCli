import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NumeroLoteProtocoloModel } from '@data/interface/Response/DatosFormatoNumeroLoteProtocolo.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formato-protocolo',
  templateUrl: './formato-protocolo.component.html',
  styleUrls: ['./formato-protocolo.component.css']
})
export class FormatoProtocoloComponent implements OnInit {
  InformacionProducto: NumeroLoteProtocoloModel;
  FormProtocolo:FormGroup;
  TablaControlProducto:Array<number>=[1,2,3,4,5,6,7,8,9,10];
  TablaControlProceso:Array<number>=[1,2,3,4,5];
  constructor(private _ControlcalidadService:ControlcalidadService,
              private toastr: ToastrService,
              private _fb:FormBuilder) { }

  ngOnInit(): void {
    this.crearFormularioProtocolo();
  }

  crearFormularioProtocolo(){
    this.FormProtocolo = this._fb.group({
      Numerolote:new FormControl('10225225'),
      itemdescripcion: new FormControl(''),
      numerodeparte: new FormControl(''),
      fechaanalisis: new FormControl(null),
      presentacion: new FormControl(''),
      fechaproduccion: new FormControl(''), //fecha de fabricacion 
      cantidadproducida: new FormControl(''), // cantidadproducida 
      fechaexpiracion: new FormControl(''), // 
      marca: new FormControl(''), // 
      dMinimo : new FormControl({value:0,disabled:true}),
      dMaximo : new FormControl({value:0,disabled:true}),
      r_PromedioMinimo : new FormControl({value:0,disabled:true}),
      r_individualMinimo : new FormControl({value:0,disabled:true}),
      s_PromedioMinimo : new FormControl({value:0,disabled:true}),
      s_individualMinimo : new FormControl({value:0,disabled:true}  ),
      deC_DMinimo : new FormControl(0),
      deC_DMaximo : new FormControl(0),
      deC_R_PromedioMinimo : new FormControl(0),
      deC_R_IndividualMinimo : new FormControl(0),
      deC_S_PromedioMinimo : new FormControl(0),
      deC_S_IndividualMinimo : new FormControl(0),
      longitud:new FormControl({value:0,disabled:true}),
      
      //CAMPOS QUE ESTA DE BAJO DE LA TABLA LONGITUD
      TablaLongitud: this._fb.array([]),
      PromLongitud:new FormControl(0),
      CampoVacio1Longitud: new FormControl(0),
      CampoVacio2Longitud: new FormControl(0),
      CampoVacio3Longitud: new FormControl(0),


      //CAMPOS QUE ESTA DE BAJO DE LA TABLA RESISTENCIA
      TablaResistencia: this._fb.array([]),
      PromResistencia:new FormControl(0),
      CampoVacio1Resistencia:new FormControl(0),
      CampoVacio2Resistencia:new FormControl(0),
      CampoVacio3Resistencia:new FormControl(0),
      CampoVacio4Resistencia:new FormControl(0),
      CampoVacio5Resistencia:new FormControl(0),


      //CAMPOS QUE ESTA DE BAJO DE LA TABLA LONGITUD CONTROL DE PROCESO
      TablaLongitudCP:this._fb.array([]),
      CampoPromvacioCP:new FormControl(0),
      CampoPromvacio1CP:new FormControl(0),
      CampoPromvacio2CP:new FormControl(0),
      CampoPromvacio3CP:new FormControl(0),


      TablaResistenciaCP:this._fb.array([]),
      CampoPromvacioRCP:new FormControl(0),
      CampoPromvacio1RCP:new FormControl(0),
      CampoPromvacio2RCP:new FormControl(0),
      CampoPromvacio3RCP:new FormControl(0),
      CampoPromvacio4CP:new FormControl(0),
      CampoPromvacio5RCP:new FormControl(0),



    })
  }

  Edimir(){
    console.log(this.FormProtocolo.value);
    console.log(this.FormProtocolo.controls.s_individualMinimo.value);
  }

  BuscarinformacionProductoProtocolo(){
    if(this.FormProtocolo.controls.Numerolote.value.trim()==''){
        return this.toastr.warning("Debe colocar el numero de lote");
    }
    
    this._ControlcalidadService.BuscarNumeroLoteProtocolo(this.FormProtocolo.controls.Numerolote.value).subscribe(
        (resp:any)=>{
              if(resp["success"]){
                  this.InformacionProducto=resp["content"];
                  this.FormProtocolo.get("itemdescripcion").patchValue(this.InformacionProducto.itemdescripcion);
                  this.FormProtocolo.get("numerodeparte").patchValue(this.InformacionProducto.numerodeparte);
                  this.FormProtocolo.get("fechaanalisis").patchValue(this.formatoFecha(this.InformacionProducto.fechaanalisis));
                  this.FormProtocolo.get("presentacion").patchValue(this.InformacionProducto.presentacion);
                  this.FormProtocolo.get("fechaproduccion").patchValue(this.InformacionProducto.fechaproduccion);
                  this.FormProtocolo.get("cantidadproducida").patchValue(this.InformacionProducto.cantidadproducida);
                  this.FormProtocolo.get("fechaexpiracion").patchValue(this.formatoFecha(this.InformacionProducto.fechaexpiracion));
                  this.FormProtocolo.get("marca").patchValue(this.InformacionProducto.marca);

                  this.FormProtocolo.get("dMinimo").patchValue(this.InformacionProducto.dMinimo);
                  this.FormProtocolo.get("dMaximo").patchValue(this.InformacionProducto.dMaximo);
                  this.FormProtocolo.get("r_PromedioMinimo").patchValue(this.InformacionProducto.r_PromedioMinimo);
                  this.FormProtocolo.get("r_individualMinimo").patchValue(this.InformacionProducto.r_individualMinimo);
                  this.FormProtocolo.get("s_PromedioMinimo").patchValue(this.InformacionProducto.s_PromedioMinimo);
                  this.FormProtocolo.get("s_individualMinimo").patchValue(this.InformacionProducto.s_individualMinimo);
                  this.FormProtocolo.get("deC_DMinimo").patchValue(this.InformacionProducto.deC_DMinimo);
                  this.FormProtocolo.get("deC_DMaximo").patchValue(this.InformacionProducto.deC_DMaximo);
                  this.FormProtocolo.get("deC_R_PromedioMinimo").patchValue(this.InformacionProducto.deC_R_PromedioMinimo);
                  this.FormProtocolo.get("deC_R_IndividualMinimo").patchValue(this.InformacionProducto.deC_R_IndividualMinimo);
                  this.FormProtocolo.get("deC_S_PromedioMinimo").patchValue(this.InformacionProducto.deC_S_PromedioMinimo);
                  this.FormProtocolo.get("deC_S_IndividualMinimo").patchValue(this.InformacionProducto.deC_S_IndividualMinimo);
                  this.FormProtocolo.get("longitud").patchValue(this.CalcularLongitud(this.InformacionProducto.numerodeparte));

              }else{
                  this.InformacionProducto=null;
              }
        }
    )
  }

  formatoFecha(Fecha){
    return  Fecha!=null ? Fecha.split("T")[0] : null;
  }
  
  CalcularLongitud(NumeroParte){
    if (NumeroParte=='457') {
      NumeroParte = (500) * 0.95;
    } else if (NumeroParte=='50y') {
        NumeroParte = (50) * 0.95;
    } else if (NumeroParte == '910') {
        NumeroParte = (100) * 0.95;
    } else {
        NumeroParte = ((NumeroParte).substr(12, 3)) * 0.95;
    }
    return NumeroParte;
  }
  

 

}
