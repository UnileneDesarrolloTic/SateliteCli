import { DecimalPipe } from '@angular/common';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InformacionTablaModel } from '@data/interface/Response/DatosFormatoInformacionResultado.interfaces';
import { NumeroLoteProtocoloModel } from '@data/interface/Response/DatosFormatoNumeroLoteProtocolo.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-control-proceso',
  templateUrl: './control-proceso.component.html',
  styleUrls: ['./control-proceso.component.css']
})
export class ControlProcesoComponent implements OnInit,OnDestroy {

  hoy = new Date().toLocaleDateString();
  InformacionProducto: NumeroLoteProtocoloModel;
  TablaControlProceso:Array<number>=[1,2,3,4,5];
  FormProtocolo:FormGroup;
  subcripcion : Subscription
  NumeroLote:string;
  ListarTablaA:InformacionTablaModel[]=[];
  ListarTablaB:InformacionTablaModel[]=[];
  flagGuardado:boolean=false;

  constructor(private _router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private _ControlcalidadService:ControlcalidadService,
    private _GenericoService:GenericoService,
    private activeroute:ActivatedRoute,
    private _modalService: NgbModal,
    private servicebase64:Cargarbase64Service,
    private _decimalPipe: DecimalPipe) { 
    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.NumeroLote=params["NumeroLote"];
    });

  }

  async ngOnInit() {
    this.crearFormularioProtocolo();
    
    const { content } = await this.BuscarinformacionProductoProtocolo(); 
    await this.ColocarVariableFormulario(content);
    const tabla= await this.BuscarInformacionRespuesta();
    this.ListarTablaA = tabla.filter((element:InformacionTablaModel)=> (element.tabla=='A'));
    this.ListarTablaB = tabla.filter((element:InformacionTablaModel)=> (element.tabla=='B'));
    await this.ConstruirTabla1(this.TablaControlProceso , this.ListarTablaA );
    await this.ConstruirTabla2(this.TablaControlProceso , this.ListarTablaB );
    this.isObservableTablaLongitud();
    this.isObservableTablaResistencia();
  }

  crearFormularioProtocolo(){
    this.FormProtocolo = this._fb.group({
      Numerolote:new FormControl(''),
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
    })
  }



  formatoFecha(Fecha){
    return  Fecha!=null ? Fecha.split("T")[0] : '1990-01-01';
  }
  
  BuscarinformacionProductoProtocolo(){
     return this._ControlcalidadService.BuscarNumeroLoteProtocolo(this.NumeroLote,1).toPromise();
  }

  ColocarVariableFormulario(InformacionProducto){
    this.FormProtocolo.get("itemdescripcion").patchValue(InformacionProducto.itemdescripcion);
    this.FormProtocolo.get("Numerolote").patchValue(this.NumeroLote);
    this.FormProtocolo.get("numerodeparte").patchValue(InformacionProducto.numerodeparte);
    this.FormProtocolo.get("fechaanalisis").patchValue(this.formatoFecha(InformacionProducto.fechaanalisis));
    this.FormProtocolo.get("presentacion").patchValue(InformacionProducto.presentacion);
    this.FormProtocolo.get("fechaproduccion").patchValue(InformacionProducto.fechaproduccion);
    this.FormProtocolo.get("cantidadproducida").patchValue(InformacionProducto.cantidadproducida);
    this.FormProtocolo.get("fechaexpiracion").patchValue(this.formatoFecha(InformacionProducto.fechaexpiracion));
    this.FormProtocolo.get("marca").patchValue(InformacionProducto.marca);

    this.FormProtocolo.get("dMinimo").patchValue(InformacionProducto.dMinimo);
    this.FormProtocolo.get("dMaximo").patchValue(InformacionProducto.dMaximo);
    this.FormProtocolo.get("r_PromedioMinimo").patchValue(InformacionProducto.r_PromedioMinimo);
    this.FormProtocolo.get("r_individualMinimo").patchValue(InformacionProducto.r_individualMinimo);
    this.FormProtocolo.get("s_PromedioMinimo").patchValue(InformacionProducto.s_PromedioMinimo);
    this.FormProtocolo.get("s_individualMinimo").patchValue(InformacionProducto.s_individualMinimo);
    this.FormProtocolo.get("deC_DMinimo").patchValue(InformacionProducto.deC_DMinimo);
    this.FormProtocolo.get("deC_DMaximo").patchValue(InformacionProducto.deC_DMaximo);
    this.FormProtocolo.get("deC_R_PromedioMinimo").patchValue(InformacionProducto.deC_R_PromedioMinimo);
    this.FormProtocolo.get("deC_R_IndividualMinimo").patchValue(InformacionProducto.deC_R_IndividualMinimo);
    this.FormProtocolo.get("deC_S_PromedioMinimo").patchValue(InformacionProducto.deC_S_PromedioMinimo);
    this.FormProtocolo.get("deC_S_IndividualMinimo").patchValue(InformacionProducto.deC_S_IndividualMinimo);
    this.FormProtocolo.get("longitud").patchValue(this.CalcularLongitud(InformacionProducto.numerodeparte));
  }


  BuscarInformacionRespuesta(){
    return this._ControlcalidadService.BusquedaInformacionResultado(this.NumeroLote).toPromise();
    
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

  ngOnDestroy(){
    this.subcripcion.unsubscribe();
  }

  ConstruirTabla1(PlantillaTabla,ContenidoTabla:InformacionTablaModel[]) {
    // console.log(PlantillaTabla,ContenidoTabla)
    const ArrayItem = this.FormProtocolo.controls.TablaLongitud as FormArray;
    ArrayItem.controls = [];

      if(ContenidoTabla.length > 0){
        ContenidoTabla.forEach((itemrow:InformacionTablaModel)=>{
              if(itemrow.secuencia<= PlantillaTabla.length){
                const ItemFilaForm = this._fb.group({
                  LongitudD: [this.transformDecimal(itemrow.coL_1,1)],
                  DiametroD: [this.transformDecimal(itemrow.coL_2,this.FormProtocolo.controls.deC_DMinimo.value)]
                });
                this.ListTabla1.push(ItemFilaForm);
              }
        });
           //Calculos Tabla 1 
           this.FormProtocolo.get("PromLongitud").patchValue(ContenidoTabla[5].coL_1);
           this.FormProtocolo.get("CampoVacio1Longitud").patchValue(ContenidoTabla[5].coL_2);
           this.FormProtocolo.get("CampoVacio2Longitud").patchValue(ContenidoTabla[6].coL_1);
           this.FormProtocolo.get("CampoVacio3Longitud").patchValue(ContenidoTabla[6].coL_2);
      }else{
        PlantillaTabla.forEach((itemRow: any) => {
          const ItemFilaForm = this._fb.group({
            LongitudD: [],
            DiametroD: []
          });
          this.ListTabla1.push(ItemFilaForm);
        });
      }

  }

  ConstruirTabla2(PlantillaTabla,ContenidoTabla:InformacionTablaModel[]) {
    const ArrayItem = this.FormProtocolo.controls.TablaResistencia as FormArray;
    ArrayItem.controls = [];

    if(ContenidoTabla.length > 0){
        ContenidoTabla.forEach((itemrow:InformacionTablaModel)=>{
          if(itemrow.secuencia<= PlantillaTabla.length){
            const ItemFilaForm = this._fb.group({
              TensionNewtons: [this.transformDecimal(itemrow.coL_1,this.FormProtocolo.controls.deC_R_PromedioMinimo.value)],
              AgujasNewtons: [this.transformDecimal(itemrow.coL_2,this.FormProtocolo.controls.deC_S_IndividualMinimo.value)]
            });
            this.ListTabla2.push(ItemFilaForm);
          }
        });
     //Calculos Tabla 1 
     this.FormProtocolo.get("PromResistencia").patchValue(ContenidoTabla[5].coL_1);
     this.FormProtocolo.get("CampoVacio1Resistencia").patchValue(ContenidoTabla[5].coL_2);
     this.FormProtocolo.get("CampoVacio2Resistencia").patchValue(ContenidoTabla[6].coL_1);
     this.FormProtocolo.get("CampoVacio3Resistencia").patchValue(ContenidoTabla[6].coL_2);
     this.FormProtocolo.get("CampoVacio4Resistencia").patchValue(ContenidoTabla[7].coL_1);
     this.FormProtocolo.get("CampoVacio5Resistencia").patchValue(ContenidoTabla[7].coL_2);

    }else{
      PlantillaTabla.forEach((itemRow: any) => {
        const ItemFilaForm = this._fb.group({
          TensionNewtons: [],
          AgujasNewtons: []
        });
        this.ListTabla2.push(ItemFilaForm);
      });
    }
  }

  transformDecimal(num,decimal) {
    return this._decimalPipe.transform(num, `1.${decimal}-${decimal}`);
  }

  get ListTabla1() {
    return this.FormProtocolo.controls['TablaLongitud'] as FormArray;
  }

  get ListTabla2() {
    return this.FormProtocolo.controls['TablaResistencia'] as FormArray;
  }

  //PRIMERA TABLA
  PromedioLongitud2(index: number) {
    const myForm = this.FormProtocolo.controls.TablaLongitud.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    let D1 = 0;
    let D2 = 0;
    let desv = 0;

    

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(+element.LongitudD) ? 0 : +element.LongitudD);
      if (element.LongitudD == null || +element.LongitudD == 0 || Number.isNaN(+element.LongitudD))
        cn = cn;
      else
        cn = cn + 1;
    });

    promedio = (PL_Suma / cn);
    this.FormProtocolo.get("PromLongitud").patchValue(promedio);

    myForm.forEach((element: any) => {
      let valor = (isNaN(+element.LongitudD) ? 0 : +element.LongitudD) * 1;

      if (valor != 0)
        D1 = Math.pow(valor - promedio, 2) + D1;
    });

    D2 = D1 / (cn - 1);
    desv = Math.pow(D2, 0.5);
    this.FormProtocolo.get("CampoVacio2Longitud").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv), 4));

  }

  PromedioDiametro2(index) {
    const myForm = this.FormProtocolo.controls.TablaLongitud.value;
    let D_Min = this.FormProtocolo.controls.dMinimo.value;
    let D_Max = this.FormProtocolo.controls.dMaximo.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    let D1 = 0;
    let D2 = 0;
    let desv = 0;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(+element.DiametroD) ? 0 : +element.DiametroD);
      if (+element.DiametroD == null || +element.DiametroD == 0 || Number.isNaN(+element.DiametroD))
        cn = cn;
      else
        cn = cn + 1;

      promedio = (PL_Suma / cn);
    });

    this.FormProtocolo.get("CampoVacio1Longitud").patchValue(this._GenericoService.NumberTwoDecimal(isNaN(promedio) ? 0 : promedio,4));

    myForm.forEach((element: any) => {
      let valor = (isNaN(+element.DiametroD) ? 0 : +element.DiametroD) * 1;

      if (valor != 0)
        D1 = Math.pow(valor - promedio, 2) + D1;

    });

    D2 = D1 / (cn - 1);
    desv = Math.pow(D2, 0.5);
    this.FormProtocolo.get("CampoVacio3Longitud").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv), 4));

  }

  //FIN PRIMERA TABLA

  // SEGUNDA TABLA 
  PromedioResistencia2(index: number) {
  
    const myForm = this.FormProtocolo.controls.TablaResistencia.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    var D1 = 0;
    var D2 = 0;
    let desv = 0;
    let Min = 1000;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(+element.TensionNewtons) ? 0 : +element.TensionNewtons);
      if (+element.TensionNewtons == null || +element.TensionNewtons == 0 || Number.isNaN(+element.TensionNewtons))
        cn = cn;
      else
        cn = cn + 1;

      promedio = (PL_Suma / cn);
    });

    this.FormProtocolo.get("PromResistencia").patchValue(promedio);
    myForm.forEach((element: any) => {
      let v1 = (isNaN(+element.TensionNewtons) ? 0 : +element.TensionNewtons) * 1;
        if(v1!=0){
          if (v1 < Min) {
            Min = v1;
          } else {
            Min = Min;
          }
        }
    });
    
    this.FormProtocolo.get("CampoVacio2Resistencia").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(Min) ? 0 : Min), 4));

    myForm.forEach((element: any) => {
      let D_Min = this.FormProtocolo.controls.r_individualMinimo.value;
      // console.log(D_Min)
      let D_PromMinimo = this.FormProtocolo.controls.r_PromedioMinimo.value;
      // console.log(isNaN(element.DiametroD))
      let v1 = (isNaN(+element.TensionNewtons) ? 0 : +element.TensionNewtons) * 1;
      // console.log(v1);
      if (v1 != 0) {
        D1 = Math.pow(v1 - promedio, 2) + D1;
      }
    });

    D2 = D1 / (cn - 1);
    desv = Math.pow(D2, 0.5);
    this.FormProtocolo.get("CampoVacio4Resistencia").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv), 4));

  }

  
  PromedioUnion2(index:number){
    const myForm = this.FormProtocolo.controls.TablaResistencia.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    var D1 = 0;
    var D2 = 0;
    let desv = 0;
    let Min = 1000;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(+element.AgujasNewtons) ? 0 : +element.AgujasNewtons);
      if (+element.AgujasNewtons == null || +element.AgujasNewtons == 0 || Number.isNaN(+element.AgujasNewtons))
        cn = cn;
      else
        cn = cn + 1;

      promedio = (PL_Suma / cn);
    });

    this.FormProtocolo.get("CampoVacio1Resistencia").patchValue(this._GenericoService.NumberTwoDecimal(isNaN(promedio) ? 0 : promedio,4));
    
    myForm.forEach((element: any) => {
      let v1 = (isNaN(+element.AgujasNewtons) ? 0 : +element.AgujasNewtons) * 1;
        if(v1!=0){
          if (v1 < Min) {
            Min = v1;
          } else {
            Min = Min;
          }
        }
    });
    this.FormProtocolo.get("CampoVacio3Resistencia").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(Min) ? 0 : Min) , 4));


    myForm.forEach((element:any) => {
      let v1 = (isNaN(+element.AgujasNewtons) ? 0 : +element.AgujasNewtons) * 1;
      if(v1!=0){
        D1=Math.pow(v1-promedio,2)+D1;
      }



    });

    D2=D1/(cn-1);
    desv= Math.pow(D2,0.5);
    this.FormProtocolo.get("CampoVacio5Resistencia").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv),4));




  }
  // FIN DE TABLA 
  formarrayTabla1(){
   return this.FormProtocolo.controls.TablaLongitud as FormArray;
  }

  isObservableTablaLongitud(){
    this.FormProtocolo.controls.TablaLongitud.valueChanges.pipe(debounceTime(1500)).subscribe(((valor)=>{
           this.FormProtocolo.controls.TablaLongitud.value.forEach(((element,index)=>{
            this.formarrayTabla1().at(index).get("LongitudD").patchValue(this.transformDecimal(element.LongitudD,1));
            this.formarrayTabla1().at(index).get("DiametroD").patchValue(this.transformDecimal(element.DiametroD,this.FormProtocolo.controls.deC_DMinimo.value));
           }))
    }));
  } 

  formarrayTabla2(){
    return this.FormProtocolo.controls.TablaResistencia as FormArray;
   }


  isObservableTablaResistencia(){
    this.FormProtocolo.controls.TablaResistencia.valueChanges.pipe(debounceTime(1500)).subscribe(((valor)=>{
      this.FormProtocolo.controls.TablaResistencia.value.forEach(((element,index)=>{
       this.formarrayTabla2().at(index).get("TensionNewtons").patchValue(this.transformDecimal(element.TensionNewtons,this.FormProtocolo.controls.deC_R_PromedioMinimo.value));
       this.formarrayTabla2().at(index).get("AgujasNewtons").patchValue(this.transformDecimal(element.AgujasNewtons,this.FormProtocolo.controls.deC_S_IndividualMinimo.value));
      }))
    }));
  }

  save() {
    this.flagGuardado=true;
    const ArrayLongitud = this.FormProtocolo.controls.TablaLongitud.value.map((elemen)=>({
      LongitudD:elemen.LongitudD==null ? 0: +elemen.LongitudD,
      DiametroD:elemen.DiametroD==null ? 0: +elemen.DiametroD,
    }));
    ArrayLongitud.push({'LongitudD': this.FormProtocolo.controls.PromLongitud.value, 'DiametroD': this.FormProtocolo.controls.CampoVacio1Longitud.value});
    ArrayLongitud.push({'LongitudD': this.FormProtocolo.controls.CampoVacio2Longitud.value, 'DiametroD': this.FormProtocolo.controls.CampoVacio3Longitud.value});
    
    const ArrayResistencia = this.FormProtocolo.controls.TablaResistencia.value.map((elemen)=>({
      TensionNewtons:elemen.TensionNewtons==null ? 0: +elemen.TensionNewtons,
      AgujasNewtons:elemen.AgujasNewtons==null ? 0: +elemen.AgujasNewtons,
    }));

    ArrayResistencia.push({'TensionNewtons': this.FormProtocolo.controls.PromResistencia.value, 'AgujasNewtons': this.FormProtocolo.controls.CampoVacio1Resistencia.value});
    ArrayResistencia.push({'TensionNewtons': this.FormProtocolo.controls.CampoVacio2Resistencia.value, 'AgujasNewtons': this.FormProtocolo.controls.CampoVacio3Resistencia.value});
    ArrayResistencia.push({'TensionNewtons': this.FormProtocolo.controls.CampoVacio4Resistencia.value, 'AgujasNewtons': this.FormProtocolo.controls.CampoVacio5Resistencia.value});
    

    const Datos={
      Numerolote: this.FormProtocolo.controls.Numerolote.value,
      fechaanalisis:this.FormProtocolo.controls.fechaanalisis.value,
      TablaLongitud:ArrayLongitud,
      TablaResistencia:ArrayResistencia
    }


    this._ControlcalidadService.RegistrarControlProcesoProtocolo(Datos).subscribe(
      resp=>{
          if(resp["success"]){
              this.toastr.success(resp["content"]);
          }
          this.flagGuardado=false;
      },
      error=>{
          this.flagGuardado=false;
      }
  )

  }

  Cancelar()
  {
    this._router.navigate(['ControlCalidad', 'Protocolo','principal',this.NumeroLote])
  }


  trackFn(index) {
    return index;
  }

  Imprimir(){
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

    ModalCarga.componentInstance.fromParent = "Generando el Formato pdf";
    this._ControlcalidadService.ImprimirControlProcesoInterno(this.NumeroLote).subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`Control-Proceso-Interno-${this.NumeroLote}-${this.hoy}`,'pdf',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.content);
        }
      }
    );
  }
}
