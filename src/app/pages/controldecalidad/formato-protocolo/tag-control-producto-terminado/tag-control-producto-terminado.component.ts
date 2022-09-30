import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-tag-control-producto-terminado',
  templateUrl: './tag-control-producto-terminado.component.html',
  styleUrls: ['./tag-control-producto-terminado.component.css']
})
export class TagControlProductoTerminadoComponent implements OnInit {
  @Input() Form: FormGroup;
  @Input() Tabla: Array<number>;
  condicionTabla1: boolean = false;
  condicionTabla2: boolean = false;
  // Tabla1:Array<number>=[1,2,3,4,5,6,7,8,9,10];

  constructor(private _fb: FormBuilder,
    private _GenericoService: GenericoService) { }

  ngOnInit(): void {
    console.log(this.Form.value);

    this.ConstruirTabla1(this.Tabla);
    this.ConstruirTabla2(this.Tabla);
  }

  ConstruirTabla1(Tabla) {
    const ArrayItem = this.Form.controls.TablaLongitud as FormArray;
    ArrayItem.controls = [];
    Tabla.forEach((itemRow: any) => {
      const ItemFilaForm = this._fb.group({
        LongitudD: [],
        DiametroD: []
      });
      this.ListTabla1.push(ItemFilaForm);
    })
  }

  ConstruirTabla2(Tabla) {
    const ArrayItem = this.Form.controls.TablaResistencia as FormArray;
    ArrayItem.controls = [];
    Tabla.forEach((itemRow: any) => {
      const ItemFilaForm = this._fb.group({
        TensionNewtons: [],
        AgujasNewtons: []
      });
      this.ListTabla2.push(ItemFilaForm);
    })

  }

  get ListTabla1() {
    return this.Form.controls['TablaLongitud'] as FormArray;
  }

  get ListTabla2() {
    return this.Form.controls['TablaResistencia'] as FormArray;
  }

  //PRIMERA TABLA
  PromedioLongitud2(index: number) {
    // const myForm = (<FormArray>this.Form.get("TablaLongitud")).at(index);
    // console.log(myForm)
    const myForm = this.Form.controls.TablaLongitud.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    let D1 = 0;
    let D2 = 0;
    let desv = 0;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(element.LongitudD) ? 0 : element.LongitudD);
      if (element.LongitudD == null || element.LongitudD == 0 || element.LongitudD == NaN)
        cn = cn;
      else
        cn = cn + 1;
    });

    promedio = (PL_Suma / cn);
    this.Form.get("PromLongitud").patchValue(promedio);

    myForm.forEach((element: any) => {
      let valor = (isNaN(element.LongitudD) ? 0 : element.LongitudD) * 1;

      if (valor != 0)
        D1 = Math.pow(valor - promedio, 2) + D1;

      // if (valor< this.Form.controls.longitud.value)
      //     this.condicionTabla1=true;
      // else
      //     this.condicionTabla1=false;
    });

    D2 = D1 / (cn - 1);
    desv = Math.pow(D2, 0.5);
    this.Form.get("CampoVacio2Longitud").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv), 4));

  }

  PromedioDiametro2(index) {
    const myForm = this.Form.controls.TablaLongitud.value;
    let D_Min = this.Form.controls.dMinimo.value;
    let D_Max = this.Form.controls.dMaximo.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    let D1 = 0;
    let D2 = 0;
    let desv = 0;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(element.DiametroD) ? 0 : element.DiametroD);
      if (element.DiametroD == null || element.DiametroD == 0 || element.DiametroD == NaN)
        cn = cn;
      else
        cn = cn + 1;

      promedio = (PL_Suma / cn);
    });

    this.Form.get("CampoVacio1Longitud").patchValue(promedio);

    myForm.forEach((element: any) => {
      let valor = (isNaN(element.DiametroD) ? 0 : element.DiametroD) * 1;

      if (valor != 0)
        D1 = Math.pow(valor - promedio, 2) + D1;

      // if (valor< D_Min || valor>D_Max)
      //     this.condicionTabla2=true;
      // else
      //     this.condicionTabla2=false;
    });

    D2 = D1 / (cn - 1);
    desv = Math.pow(D2, 0.5);
    console.log(desv);
    this.Form.get("CampoVacio3Longitud").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv), 4));

  }

  //FIN PRIMERA TABLA

  // SEGUNDA TABLA 
  PromedioResistencia2(index: number) {
  
    const myForm = this.Form.controls.TablaResistencia.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    var D1 = 0;
    var D2 = 0;
    let desv = 0;
    let Min = 1000;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(element.TensionNewtons) ? 0 : element.TensionNewtons);
      if (element.TensionNewtons == null || element.TensionNewtons == 0 || element.TensionNewtons == NaN)
        cn = cn;
      else
        cn = cn + 1;

      promedio = (PL_Suma / cn);
    });

    this.Form.get("PromResistencia").patchValue(promedio);
    myForm.forEach((element: any) => {
      let v1 = (isNaN(element.TensionNewtons) ? 0 : element.TensionNewtons) * 1;
        if(v1!=0){
          if (v1 < Min) {
            Min = v1;
          } else {
            Min = Min;
          }
        }
    });
    
    this.Form.get("CampoVacio2Resistencia").patchValue(this._GenericoService.NumberTwoDecimal(Min, 4));

    myForm.forEach((element: any) => {
      let D_Min = this.Form.controls.r_individualMinimo.value;
      // console.log(D_Min)
      let D_PromMinimo = this.Form.controls.r_PromedioMinimo.value;
      // console.log(isNaN(element.DiametroD))
      let v1 = (isNaN(element.TensionNewtons) ? 0 : element.TensionNewtons) * 1;
      // console.log(v1);
      if (v1 != 0) {
        D1 = Math.pow(v1 - promedio, 2) + D1;
      }
      // let Border = document.getElementById(`Resistencia-${index}`);
      // Border.removeAttribute("style");

      // if (D_Min == 0) {
      //   if (v1 < D_PromMinimo) {
      //     Border.setAttribute("style", "border-color: red !important");
      //   } else {
      //     Border.setAttribute("style", "border-color: green !important");
      //   }
      // } else {
      //   console.log("entre ac............a");
      //   if (v1 < D_Min) {
      //     Border.setAttribute("style", "border-color: red !important");
      //   } else {
      //     console.log("cambio de border");
      //     Border.setAttribute("style", "border-color: blue !important");
      //   }
      // }

     
    });

    D2 = D1 / (cn - 1);
    desv = Math.pow(D2, 0.5);
    this.Form.get("CampoVacio4Resistencia").patchValue(this._GenericoService.NumberTwoDecimal((isNaN(desv) ? 0 : desv), 4));

  }

  
  PromedioUnion2(index:number){
    const myForm = this.Form.controls.TablaResistencia.value;
    let PL_Suma = 0;
    let cn = 0;
    let promedio = 0;
    var D1 = 0;
    var D2 = 0;
    let desv = 0;
    let Min = 1000;

    myForm.forEach((element: any) => {
      PL_Suma = PL_Suma + (isNaN(element.AgujasNewtons) ? 0 : element.AgujasNewtons);
      if (element.AgujasNewtons == null || element.AgujasNewtons == 0 || element.AgujasNewtons == NaN)
        cn = cn;
      else
        cn = cn + 1;

      promedio = (PL_Suma / cn);
    });

    this.Form.get("CampoVacio1Resistencia").patchValue(promedio);
    
    myForm.forEach((element: any) => {
      let v1 = (isNaN(element.AgujasNewtons) ? 0 : element.AgujasNewtons) * 1;
        if(v1!=0){
          if (v1 < Min) {
            Min = v1;
          } else {
            Min = Min;
          }
        }
    });
    this.Form.get("CampoVacio3Resistencia").patchValue(this._GenericoService.NumberTwoDecimal(Min, 4));


    myForm.forEach((element:any) => {
      let v1 = (isNaN(element.AgujasNewtons) ? 0 : element.AgujasNewtons) * 1;
      if(v1!=0){
        D1=Math.pow(v1-promedio,2)+D1;
      }



    });

    D2=D1/(cn-1);
    desv= Math.pow(D2,0.5);
    this.Form.get("CampoVacio5Resistencia").patchValue(this._GenericoService.NumberTwoDecimal(desv,4));




  }
  // FIN DE TABLA 


  save() {
    console.log(this.Form.value);
  }



  trackFn(index) {
    return index;
  }

  

}
