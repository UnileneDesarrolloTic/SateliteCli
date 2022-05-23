import { debounceTime, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { ToastrService } from 'ngx-toastr';
import { pairwise, startWith } from 'rxjs/operators';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { DatosAnalisisAgujaFlexion } from '@data/interface/Response/DatosAnalisisAgujaFlexion.interface';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { OnExit } from '@guard/confirm-exit.guard'

@Component({
  selector: 'app-prueba-flexion',
  templateUrl: './prueba-flexion.component.html'
})
export class PruebaFlexionComponent implements OnInit , OnExit
{

  codigoAnalisis:string = ""
  gruposCiclos:[] = []
  datosAnalisisForm:FormGroup
  resultAnalisis: FormGroup
  listaGruposCiclos: number[]
  botonGuardarDisabled: boolean = false
  flagGuardarAnalisis:boolean = false

  constructor(private _activatedRoute : ActivatedRoute, private _analisisAgujaServices : AnalisisAgujaService, private _toastr: ToastrService,
      private _router: Router, private _fb: FormBuilder, private _genericoService : GenericoService, private _usuarioSesion: SesionService)
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

  CrearCicloForm(cantidad:number, detalle:any)
  {

    const ciclos = detalle.filter(x => x['tipoRegistro'] == 1)
    let valorCiclo;
    let cicloBD;

    for(let i = 0; i < cantidad; i++)
    {
      valorCiclo = ''
      cicloBD = ciclos.find(x => x['llave'] == i)

      if(cicloBD)
        valorCiclo = cicloBD['valor'];

      const groupCicloForm = this._fb.group({
        posicion: [i],
        valor: [valorCiclo, [Validators.min(0)]]
      });

      groupCicloForm.valueChanges.pipe(debounceTime(500)).pipe(startWith(null), pairwise()).subscribe
      (
        ([prev, next]) => this.ActualizarResultado(prev,next)

      )

      this.ciclosFlexion.push(groupCicloForm);
    }
  }

  CrearResumenForm(detalle:{}[])
  {

    const listaResumen = detalle.filter(x => x['tipoRegistro'] == 2)

    if (listaResumen.length < 1)
      return

    listaResumen.forEach(resumen => {

      const groupResultForm = this._fb.group({
          ciclo: [{value: resumen['llave'], disabled : true}],
          porcentaje: [{value: resumen['valor'], disabled : true}]
        });

      this.resumenFlexion.push(groupResultForm);

    })

  }

  get ciclosFlexion(){
    return this.resultAnalisis.controls['ciclosFlexion'] as FormArray;
  }

  get resumenFlexion(){
    return this.resultAnalisis.controls['resumenFlexion'] as FormArray;
  }

  ObtenerDatosDelAnalisis(loteAnalisis: string)
  {

    this._analisisAgujaServices.DatosAnalisisAgujaFlexion(loteAnalisis).subscribe(
      (result: DatosAnalisisAgujaFlexion) => {

        const cabeceraAnalisis = result.cabecera

        if(cabeceraAnalisis.controlNumero == undefined || cabeceraAnalisis.controlNumero == "" || cabeceraAnalisis.cantidadPruebas < 1){
          this._toastr.error("Error al validar los datos del análisis", "Error en el servidor!!", {timeOut: 3000, closeButton: true, tapToDismiss: true})
          this._router.navigate(['ControlCalidad','analisis-agujas','registrar-analisis']);
        }

        this.listaGruposCiclos = [0,10,20,30]// this.CrearDatosArreglo(cabeceraAnalisis.cantidadPruebas)

        this.datosAnalisisForm.patchValue(
          {
            pruebas: cabeceraAnalisis.cantidadPruebas,
            item: cabeceraAnalisis.descripcionItem,
            proveedor: cabeceraAnalisis.proveedor
          }
        )

        this.CrearCicloForm(cabeceraAnalisis.cantidadPruebas, result.detalle)
        this.CrearResumenForm(result.detalle)

      }, err => {
        this._toastr.error("Error al obtener datos del análisis", "Error en el servidor!!", {timeOut: 3000, closeButton: true, tapToDismiss: true})
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

    console.log(lista);


    return lista
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
              ciclo: [{value: actual['valor'], disabled : true}],
              porcentaje: [{value: 0, disabled : true}]
            });

        this.resumenFlexion.push(groupResultForm);
      }
    }

    this.ActualizarValorResumen()
  }

  ActualizarValorResumen()
  {
    let listaResumenAnalisis = this.resumenFlexion.value;
    const listaCiclosAnalisis = this.ciclosFlexion.value;

    const ciclosRegistrado = listaCiclosAnalisis.filter(x => x['valor'] != '' && x['valor'] != 0 && x['valor'] != undefined && x['valor'] != null ).length

    listaResumenAnalisis.forEach((element) => {

      const elementosPorCiclos = listaCiclosAnalisis.filter(x => x['valor'] == element['ciclo']).length
      const porcientoCiclo = (100 * elementosPorCiclos)/ciclosRegistrado
      const indiceResumenElemento = listaResumenAnalisis.findIndex( x => x['ciclo'] == element['ciclo'])
      const resultadoRedondeado = this._genericoService.RedondearDecimales(porcientoCiclo, 2, false)

      this.resumenFlexion.at(indiceResumenElemento).patchValue({porcentaje: resultadoRedondeado});

    });

    (this.resumenFlexion.value).forEach((resumen, index) => {
      if(resumen['porcentaje'] == 0)
        this.resumenFlexion.removeAt(index)
    });;


  }

  GuardarAnalisisAguja()
  {

    const resultCiclos = this.resultAnalisis.value['ciclosFlexion'].filter(x => x['valor'] != '' && x['valor'] != undefined && x['valor'] != null && x['valor'] != 0)


    if(!this.resultAnalisis.dirty || resultCiclos.length < 1 )
    {
      this._toastr.warning("No se ha realizado ningun cambio", "Aviso !!", {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }


    this.botonGuardarDisabled = true;

    const objetoGuardarBD:{}[] = []
    const resultResumen = this.resultAnalisis.getRawValue()['resumenFlexion']

    const datosAdicionales =
    {
      lote: this.datosAnalisisForm.value['analisis'],
      usuarioRegistro: this._usuarioSesion.datosPersonales()['codUsuario']
    }

    resultCiclos.forEach(ciclo => {

      const obj = {
        ...datosAdicionales,
        tipoRegistro: 1,
        llave: ciclo['posicion'],
        valor: ciclo['valor'],
      }

      objetoGuardarBD.push(obj);

    });

    resultResumen.forEach(resumen => {

      const obj = {
        ...datosAdicionales,
        tipoRegistro: 2,
        llave: resumen['ciclo'],
        valor: Number(resumen['porcentaje']),
      }

      objetoGuardarBD.push(obj);

    });

    this._analisisAgujaServices.GuardarEditarPruebaFlexionAguja(objetoGuardarBD).subscribe(
      result => {
        this._toastr.success(result['content'],'Éxito !!', {timeOut: 4000, closeButton: true, tapToDismiss: true})
        this.botonGuardarDisabled = false
        this.flagGuardarAnalisis = true
        this._router.navigate(['ControlCalidad', 'analisis-agujas', 'registrar-analisis']);
      },
      err => this._toastr.error("Error al guardar los datos de la prueba de flexión", "Error en el servidor!!", {timeOut: 4000, closeButton: true, tapToDismiss: true})
    );

  }

  Cancelar()
  {
    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('No se pudo cancelar la transacción','Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    this._router.navigate(['ControlCalidad', 'analisis-agujas', 'registrar-analisis']);
  }

  onExit() {

    if(this.resultAnalisis.dirty && !this.flagGuardarAnalisis){
      const rpta = confirm("¿Está seguro de salir del formulario sin guardar?");
      return rpta;
    }

    return true;

  };

}
