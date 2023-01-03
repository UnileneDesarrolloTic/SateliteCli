import { ToastrService } from 'ngx-toastr';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OnExit } from '@guard/confirm-exit.guard';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-prueba-defectos',
  templateUrl: './prueba-defectos.component.html',
  styleUrls: ['./prueba-defectos.component.css']
})
export class PruebaDefectosComponent implements OnInit, OnDestroy, OnExit {

  subscriptionRuta: Subscription
  codigoAnalisis:string = ""
  formulario: FormGroup
  cantidadMuestra: number = 0
  botonGuardarDisabled: boolean = false

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _analisisAgujaService: AnalisisAgujaService,
      private _commonService: GenericoService, private _toastr: ToastrService)
  {
    this.subscriptionRuta = this._activatedRoute.params.subscribe(param => this.codigoAnalisis = param['codAnalisis'])
  }


  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerDatosPruebaAspecto(this.codigoAnalisis)
  }

  inicializarFormulario(){
    this.formulario =  new FormGroup({
      pruebas: new FormArray([
        new FormGroup({ // Agujero centrado
          tipoRegistro : new FormControl(0, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
          tolerancia: new FormControl(0, [Validators.required, Validators.min(0)]),
          estado: new FormControl('R', Validators.required)
        }),
        new FormGroup({ // Agujero descentado
          tipoRegistro : new FormControl(1, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
          tolerancia: new FormControl(0, [Validators.required, Validators.min(0)])
        }),
        new FormGroup({ // Buen aspecto
          tipoRegistro : new FormControl(2, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
          tolerancia: new FormControl(0, [Validators.required, Validators.min(0)]),
          estado: new FormControl('R', Validators.required)
        }),
        new FormGroup({ // Marcas
          tipoRegistro : new FormControl(3, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
          tolerancia: new FormControl(0, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Porosidad
          tipoRegistro : new FormControl(4, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ //Mal pulido
          tipoRegistro : new FormControl(5, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Punta gato
          tipoRegistro : new FormControl(6, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Poca punta
          tipoRegistro : new FormControl(7, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Mal formada
          tipoRegistro : new FormControl(8, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // rebabas
          tipoRegistro : new FormControl(9, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Sin agujero
          tipoRegistro : new FormControl(10, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Total
          tipoRegistro : new FormControl(11, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(0, [Validators.required, Validators.min(0)]),
        }),
        new FormGroup({ // Poca profundida
          tipoRegistro : new FormControl(12, [Validators.required, Validators.min(0)]),
          cantidad : new FormControl(null, [Validators.required, Validators.min(0)]),
          porcentaje: new FormControl(null, [Validators.required, Validators.min(0)]),
        }),
      ]),
      observaciones: new FormControl(''),
      conclusion: new FormControl('', Validators.required)
    })
  }

  configurarObservablesCantidad(){
    this.agujeroCentrado.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( (cantidad)=> this.cambioCantidadPrimeraTable(cantidad ?? 0))
    this.buenAspecto.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.marcas.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.porosidad.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.malPulido.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.puntaGato.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.pocaPunta.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.malFormada.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.rebabas.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.sinAgujero.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
    this.pocaProfundidad.get('cantidad').valueChanges.pipe(debounceTime(300)).subscribe( ()=> this.cambioCantidadSegundaTable())
  }

  obtenerToleranciaConfiguracion(){
    this._commonService.ObtenerConfiguracion(6, 'AA_TOLERANCIA').subscribe( (result:any[]) =>{

      const toleranciaCentrado = result.find(x => x['valorTexto1'] == 'Centado')['valorDecimal1']
      const toleranciaDescentrado =  result.find(x => x['valorTexto1'] == 'Descentado')['valorDecimal1']
      const toleranciaAspecto =  result.find(x => x['valorTexto1'] == 'Aspecto')['valorDecimal1']
      const toleranciaMarcas =  result.find(x => x['valorTexto1'] == 'Marcas')['valorDecimal1']

      this.agujeroCentrado.patchValue({
        tolerancia: toleranciaCentrado
      })

      this.agujeroDescentrado.patchValue({
        tolerancia: toleranciaDescentrado
      })

      this.buenAspecto.patchValue({
        tolerancia: toleranciaAspecto
      })

      this.marcas.patchValue({
        tolerancia: toleranciaMarcas
      })

    })
  }

  cambioCantidadPrimeraTable(cantidad: number){

    if (cantidad > this.cantidadMuestra){

      this.agujeroCentrado.patchValue({
        estado: ''
      })

      this.agujeroDescentrado.patchValue({
        cantidad: 0,
        porciento: 0
      })

      return
    }

    const toleranciaAgujeroCentrado = this.agujeroCentrado.get('tolerancia').value
    const difereciaCantidad = this.cantidadMuestra - cantidad

    const porcentajeAgujaCentrado = this._commonService.RedondearDecimales((cantidad / (this.cantidadMuestra*1.0)) * 100, 2, false)
    const porcentajeAgujaDecentrado = this._commonService.RedondearDecimales((difereciaCantidad / this.cantidadMuestra) * 100, 2, false)

    const estadoPrimeraTabla = (cantidad / (this.cantidadMuestra*1.0)) * 100 >= toleranciaAgujeroCentrado ? 'A':'R'


    this.agujeroCentrado.patchValue({
      porcentaje: porcentajeAgujaCentrado,
      estado: estadoPrimeraTabla
    })

    this.agujeroDescentrado.patchValue({
      cantidad: difereciaCantidad,
      porcentaje: porcentajeAgujaDecentrado
    })

  }

  cambioCantidadSegundaTable(){

    const cantidadBuenAspecto = this.buenAspecto.get('cantidad').value ?? 0
    const cantidadMarcas = this.marcas.get('cantidad').value ?? 0
    const cantidadPorosidad = this.porosidad.get('cantidad').value ?? 0
    const cantidadMalPulido = this.malPulido.get('cantidad').value ?? 0
    const cantidadPuntaGato = this.puntaGato.get('cantidad').value ?? 0
    const cantidadPocaPunta = this.pocaPunta.get('cantidad').value ?? 0
    const cantidadMalFormada = this.malFormada.get('cantidad').value ?? 0
    const cantidadRebabas = this.rebabas.get('cantidad').value ?? 0
    const cantidadSinAgujero = this.sinAgujero.get('cantidad').value ?? 0
    const cantidadPocaProfundida = this.pocaProfundidad.get('cantidad').value ?? 0

    const total = cantidadBuenAspecto + cantidadMarcas + cantidadPorosidad + cantidadMalPulido
      + cantidadPuntaGato + cantidadPocaPunta + cantidadMalFormada + cantidadRebabas + cantidadSinAgujero + cantidadPocaProfundida


    this.buenAspecto.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadBuenAspecto / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.marcas.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadMarcas / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.porosidad.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadPorosidad / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.malPulido.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadMalPulido / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.puntaGato.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadPuntaGato / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.pocaPunta.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadPocaPunta / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.malFormada.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadMalFormada / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.rebabas.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadRebabas / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.sinAgujero.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadSinAgujero / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.pocaProfundidad.patchValue({
      porcentaje: this._commonService.RedondearDecimales((cantidadPocaProfundida / this.cantidadMuestra) * 100, 2, false) ?? 0
    })

    this.total.patchValue({
      cantidad: total
    })

    let estadoSegundaTabla = 'R'

    if(total > this.cantidadMuestra)
      estadoSegundaTabla = ''
    else
      estadoSegundaTabla = (this.buenAspecto.get('porcentaje').value ?? 0) >= (this.buenAspecto.get('tolerancia').value ?? 0) ? 'A' : 'R'

    this.buenAspecto.patchValue({
      estado: estadoSegundaTabla
    })

  }

  obtenerDatosGeneralesAnalisis(loteAnalisis: string){

    this._analisisAgujaService.ObtenerDatosGenerales(loteAnalisis).subscribe(
      result => {

        if (this.cantidadMuestra < 1)
          this.cantidadMuestra = result['undMuestrearIII']

        this.formulario.patchValue({
          observaciones: result['observaciones'],
          conclusion: result['conclusion']
        });
      }
    )
  }

  guardarPruebaAspecto(){

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando','Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    if(this.pruebas.invalid)
    {
      this._toastr.warning('Los datos del formulario son incorrectos.', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    if(this.formulario.pristine)
    {
      this._toastr.warning('No se ha realizado ningun cambio en el formulario', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    if(this.total.get('cantidad').value != this.cantidadMuestra)
    {
      this._toastr.warning('El total debe ser igual a la cantidad de la muestra: ' + this.cantidadMuestra.toString(), 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    this.botonGuardarDisabled = true


    const itemPruebaAspecto = this.pruebas.value.filter( item => item['tipoRegistro'] != 13).map( item =>
    {
      return { ...item, baseCalculoPorcentaje: this.cantidadMuestra, loteAnalisis: this.codigoAnalisis  }
    })

    const body = {
      pruebas : itemPruebaAspecto,
      observaciones: this.formulario.get('observaciones').value,
      conclusion: this.formulario.get('conclusion').value
    }    

    this._analisisAgujaService.GuardarPruebaAspecto(body).subscribe( response => {
      this._toastr.success(response['content'], 'Éxito !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      this.formulario.markAsPristine()
      this.botonGuardarDisabled = false
    },
    err => {
      this.botonGuardarDisabled = false
    }
    )

  }

  paginaAnterior(){
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'PruebaElasticidadPerforacion', this.codigoAnalisis ]);
  }

  obtenerDatosPruebaAspecto(loteAnalisis: string){
    this._analisisAgujaService.ObtenerPruebaAspecto(loteAnalisis).subscribe(result => {
      if(result['success'] == true){
        this.ingresarDatosPruebaAspecto(result['content'])
      } else{
        this.configurarObservablesCantidad()
        this.obtenerToleranciaConfiguracion()
      }
      this.obtenerDatosGeneralesAnalisis(loteAnalisis)
    })
  }

  ingresarDatosPruebaAspecto(detalle:any[])
  {

    this.cantidadMuestra =  detalle[0]['baseCalculoPorcentaje']
    const datosAgujeroCentado = detalle.find(x => x['tipoRegistro'] == 0)
    const datosAgujeroDescentrado = detalle.find(x => x['tipoRegistro'] == 1)
    const datosBuenAspecto = detalle.find(x => x['tipoRegistro'] == 2)
    const datosMarcas = detalle.find(x => x['tipoRegistro'] == 3)
    const datosPorosidad = detalle.find(x => x['tipoRegistro'] == 4)
    const datosMalPulido = detalle.find(x => x['tipoRegistro'] == 5)
    const datosPuntaGato = detalle.find(x => x['tipoRegistro'] == 6)
    const datosPocaPunta = detalle.find(x => x['tipoRegistro'] == 7)
    const datosMalFormada = detalle.find(x => x['tipoRegistro'] == 8)
    const datosRebabas = detalle.find(x => x['tipoRegistro'] == 9)
    const datosSinAgujero = detalle.find(x => x['tipoRegistro'] == 10)
    const datosPocaProfundidad = detalle.find(x => x['tipoRegistro'] == 12) 

    this.agujeroDescentrado.patchValue({
      tolerancia: datosAgujeroDescentrado['tolerancia'],
    })

    this.buenAspecto.patchValue({
      tolerancia: datosBuenAspecto['tolerancia'],
      cantidad: datosBuenAspecto['cantidad']
    })

    this.marcas.patchValue({
      tolerancia: datosMarcas['tolerancia'],
      cantidad: datosMarcas['cantidad']
    })

    this.porosidad.patchValue({
      cantidad:  datosPorosidad['cantidad']
    })

    this.malPulido.patchValue({
      cantidad: datosMalPulido['cantidad']
    })

    this.puntaGato.patchValue({
      cantidad: datosPuntaGato['cantidad']
    })

    this.pocaPunta.patchValue({
      cantidad: datosPocaPunta['cantidad']
    })

    this.malFormada.patchValue({
      cantidad: datosMalFormada['cantidad']
    })

    this.rebabas.patchValue({
      cantidad: datosRebabas['cantidad']
    })

    this.configurarObservablesCantidad()

    this.sinAgujero.patchValue({
      cantidad: datosSinAgujero['cantidad']
    })

    this.pocaProfundidad.patchValue({
      cantidad: (datosPocaProfundidad == undefined ? 0 : datosPocaProfundidad['cantidad'])
    })

    this.agujeroCentrado.patchValue({
      tolerancia: datosAgujeroCentado['tolerancia'],
      cantidad: datosAgujeroCentado['cantidad']
    })

  }

  ngOnDestroy(): void {
    this.subscriptionRuta.unsubscribe()
  }

  onExit() 
  {
    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando','Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return false
    }

    if(this.formulario.dirty)
    {
      const rpta = confirm("¿Está seguro de salir del formulario sin guardar?");
      return rpta;
    }

    return true;
  };

  get pruebas(){
    return this.formulario.get('pruebas') as FormArray
  }

  get agujeroCentrado(){
    return this.pruebas.controls[0] as FormGroup
  }

  get agujeroDescentrado(){
    return this.pruebas.controls[1] as FormGroup
  }

  get buenAspecto(){
    return this.pruebas.controls[2] as FormGroup
  }

  get marcas(){
    return this.pruebas.controls[3] as FormGroup
  }

  get porosidad(){
    return this.pruebas.controls[4] as FormGroup
  }

  get malPulido(){
    return this.pruebas.controls[5] as FormGroup
  }

  get puntaGato(){
    return this.pruebas.controls[6] as FormGroup
  }

  get pocaPunta(){
    return this.pruebas.controls[7] as FormGroup
  }

  get malFormada(){
    return this.pruebas.controls[8] as FormGroup
  }

  get rebabas(){
    return this.pruebas.controls[9] as FormGroup
  }

  get sinAgujero(){
    return this.pruebas.controls[10] as FormGroup
  }

  get total(){
    return this.pruebas.controls[11] as FormGroup
  }
  
  get pocaProfundidad(){
    return this.pruebas.controls[12] as FormGroup
  }

}
