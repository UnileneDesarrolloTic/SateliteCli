import { debounceTime, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { ToastrService } from 'ngx-toastr';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-prueba-flexion',
  templateUrl: './prueba-flexion.component.html'
})
export class PruebaFlexionComponent implements OnInit {

  codigoAnalisis:string = ""
  gruposCiclos:[] = []
  datosAnalisisForm:FormGroup
  resultAnalisis: FormGroup
  listaGruposCiclos: number[]

  constructor(private _activatedRoute : ActivatedRoute, private _analisisAgujaServices : AnalisisAgujaService, private _toastr: ToastrService,  private _router: Router, private _fb: FormBuilder)
  {
    this._activatedRoute.params.subscribe( param => this.codigoAnalisis = param['codAnalisis'])
    this.InicializarFormulario()
    this.ObtenerDatosDelAnalisis(this.codigoAnalisis)
  }

  ngOnInit(): void {}

  InicializarFormulario(){
    this.datosAnalisisForm = this._fb.group({
      analisis : [{ value: this.codigoAnalisis, disabled : true}, Validators.required],
      pruebas : [{ value: 0, disabled : true}, Validators.required],
      item : [{ value: '', disabled : true}, Validators.required],
      proveedor: [{ value: '', disabled: true}, Validators.required]
    })

    this.resultAnalisis = this._fb.group({
      ciclosFlexion: this._fb.array([]),
      resumenFlexion: this._fb.array([])
    })

  }

  CrearCicloForm(cantidad:number)
  {
    for(let i = 0; i < cantidad; i++)
    {
      const groupCicloForm = this._fb.group({
        posicion: [i],
        valor: ['', [Validators.min(0)]]
      });

      groupCicloForm.valueChanges.pipe(debounceTime(500)).pipe(startWith(null), pairwise()).subscribe
      (
        ([prev, next]) => this.ActualizarResultado(prev,next)
      )

      this.ciclosFlexion.push(groupCicloForm);
    }
  }

  get ciclosFlexion(){
    return this.resultAnalisis.controls['ciclosFlexion'] as FormArray;
  }

  get resumenFlexion(){
    return this.resultAnalisis.controls['resumenFlexion'] as FormArray;
  }

  ObtenerDatosDelAnalisis(loteAnalisis: string)
  {

    this._analisisAgujaServices.ObtenerAnalisisAguja(loteAnalisis).subscribe(
      result => {

        if(result['controlNumero'] == undefined || result['controlNumero'] == "" || result['cantidadPruebas'] < 1){
          this._toastr.error("Error al validar los datos del análisis", "Error en el servidor!!", {timeOut: 3000, closeButton: true})
          this._router.navigate(['ControlCalidad','analisis-agujas','registrar-analisis']);
        }

        this.listaGruposCiclos = this.CrearDatosArreglo(result['cantidadPruebas'])

        this.datosAnalisisForm.patchValue(
          {
            pruebas: result['cantidadPruebas'],
            item: result['descripcionItem'],
            proveedor: result['proveedor']
          }
        )

        this.CrearCicloForm(result['cantidadPruebas'])

      }, err => {
        this._toastr.error("Error al obtener datos del análisis", "Error en el servidor!!", {timeOut: 3000, closeButton: true})
        this._router.navigate(['ControlCalidad','analisis-agujas','registrar-analisis']);
      }
    )
  }

  CrearDatosArreglo(numero: number):number[]
  {
    const lista:number[] = []
    numero -= 10
    lista.push(0)

    for(let i= 10; i <= numero; i += 10)
      lista.push(i)

    return lista
  }

  prueba(){
    console.log(this.resultAnalisis.value)
  }

  ActualizarResultado(anterior:any, actual:any)
  {

    const listaCiclosAnalisis = this.ciclosFlexion.value;
    const listaResumenAnalisis = this.resumenFlexion.value;

    if ( (anterior && actual) && anterior['valor'] == actual['valor'])
      return

    if (anterior && anterior['valor'] != 0 && anterior['valor'] != undefined && anterior['valor'] != null)
    {
      const indiceCiclo:number = listaCiclosAnalisis.findIndex(x => x['valor'] == anterior['valor'])

      if(indiceCiclo == -1)
      {
        const indiceResumen:number = listaResumenAnalisis.findIndex(x => x['ciclo'] == anterior['valor'])

        if ( indiceResumen != -1)
          this.resumenFlexion.removeAt(indiceResumen);
      }
    }

    if (actual && actual['valor'] != 0 && actual['valor'] != undefined && actual['valor'] != null)
    {

      const indiceResumen:number = listaResumenAnalisis.findIndex(x => x['ciclo'] == actual['valor'])

      if (indiceResumen == -1){
          const groupResultForm = this._fb.group(
            {
              ciclo: [{value: actual['valor'], disabled : false},[]],
              porcentaje: [0]
            });

        this.resumenFlexion.push(groupResultForm);
      }
    }

    this.ActualizarValorResumen()
  }

  ActualizarValorResumen()
  {
    const listaResumenAnalisis = this.resumenFlexion.value;
    const listaCiclosAnalisis = this.ciclosFlexion.value;

    const ciclosRegistrado = listaCiclosAnalisis.filter(x => x['valor'] != '' && x['valor'] != 0 && x['valor'] != undefined && x['valor'] != null ).length

    listaResumenAnalisis.forEach(element => {

      const elementosPorCiclos = listaCiclosAnalisis.filter(x => x['valor'] == element['ciclo']).length
      const porcientoCiclo = (100 * elementosPorCiclos)/ciclosRegistrado
      const indiceResumenElemento = listaResumenAnalisis.findIndex( x => x['ciclo'] == element['ciclo'])

      this.resumenFlexion.at(indiceResumenElemento).patchValue({porcentaje: porcientoCiclo});

    });

  }

}
