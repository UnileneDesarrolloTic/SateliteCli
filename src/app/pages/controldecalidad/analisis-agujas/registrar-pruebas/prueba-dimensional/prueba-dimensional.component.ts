import { GenericoService } from '@shared/services/comunes/generico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { OnExit } from '@guard/confirm-exit.guard';

@Component({
  selector: 'app-prueba-dimensional',
  templateUrl: './prueba-dimensional.component.html',
  styleUrls: ['./prueba-dimensional.component.css']
})
export class PruebaDimensionalComponent implements OnInit, OnDestroy, OnExit {

  subscriptionRuta: Subscription
  codigoAnalisis:string = ""
  pruebaDimensional: FormGroup
  botonGuardarDisabled: boolean = false
  private baseCalculoProcentajeLongitud: number = 0
  private baseCalculoProcentajeDiametro: number = 0

  procentajeAuxLongitud: string = '0'
  procentajeAuxDiametro: string = '0'
  procentajeAuxAlambre: string = '0'

  constructor(private _activatedRoute: ActivatedRoute, private _analisisAgujaService: AnalisisAgujaService,
    private _toastr: ToastrService, private _router: Router, private _commonServices: GenericoService) {

      this.subscriptionRuta = this._activatedRoute.params.subscribe(param => this.codigoAnalisis = param['codAnalisis'])
      this.inicializarFormulario()
      this.subcripcionCambioCantidad()

  }

  ngOnInit(): void {
    this.obtenerDetalleDatosGenerales(this.codigoAnalisis);
    this.obtenerPruebaDimensional(this.codigoAnalisis);
  }

  inicializarFormulario(){
    this.pruebaDimensional = new FormGroup({
      pruebasAguja: new FormArray([
        new FormGroup({
          tipoRegistro: new FormControl(1, Validators.required),
          descripcion: new FormControl('', Validators.required),
          cantidad: new FormControl('', [Validators.required, Validators.min(0)]),
          porciento: new FormControl(0, Validators.required),
          tolerancia: new FormControl(0, Validators.required),
          estado: new FormControl('R', Validators.required),
          descripcionAux: new FormControl(null),
          cantidadAux: new FormControl(null),
          descripcionAux_2: new FormControl(null),
          cantidadAux_2: new FormControl(null)
        }),
        new FormGroup({
          tipoRegistro: new FormControl(2, Validators.required),
          descripcion: new FormControl('', Validators.required),
          cantidad: new FormControl('', [Validators.required, Validators.min(0)]),
          porciento: new FormControl(0, Validators.required),
          tolerancia: new FormControl(0, Validators.required),
          estado: new FormControl('R', Validators.required),
          descripcionAux: new FormControl(null),
          cantidadAux: new FormControl(null),
          descripcionAux_2: new FormControl(null),
          cantidadAux_2: new FormControl(null)
        }),
        new FormGroup({
          tipoRegistro: new FormControl(3, Validators.required),
          descripcion: new FormControl('', Validators.required),
          cantidad: new FormControl('', [Validators.required, Validators.min(0)]),
          porciento: new FormControl(0, Validators.required),
          tolerancia: new FormControl(0, Validators.required),
          estado: new FormControl('R', Validators.required),
          descripcionAux: new FormControl(null),
          cantidadAux: new FormControl(null),
          descripcionAux_2: new FormControl(null),
          cantidadAux_2: new FormControl(null)
        }),
        new FormGroup({
          tipoRegistro: new FormControl(4, Validators.required),
          descripcion: new FormControl('', Validators.required),
          cantidad: new FormControl('', [Validators.required, Validators.min(0)]),
          porciento: new FormControl(0, Validators.required),
          tolerancia: new FormControl(0, Validators.required),
          estado: new FormControl('R', Validators.required)
        })
      ])

    })
  }

  get pruebasAguja(){
    return this.pruebaDimensional.controls['pruebasAguja'] as FormArray;
  }

  get pruebaLongitud(){
    return this.pruebasAguja.controls[0] as FormGroup;
  }

  get pruebaDiametroBroca(){
    return this.pruebasAguja.controls[1] as FormGroup;
  }

  get pruebaDiametroAlambre(){
    return this.pruebasAguja.controls[2] as FormGroup;
  }

  get pruebaCorrosion(){
    return this.pruebasAguja.controls[3] as FormGroup;
  }

  subcripcionCambioCantidad(){

    this.pruebaLongitud.get('cantidad').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaLongitud()
    )

    this.pruebaLongitud.get('cantidadAux').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaLongitud()
    )

    this.pruebaLongitud.get('cantidadAux_2').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaLongitud()
    )

    this.pruebaDiametroBroca.get('cantidad').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaDiametroBroca()
    )

    this.pruebaDiametroBroca.get('cantidadAux').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaDiametroBroca()
    )

    this.pruebaDiametroBroca.get('cantidadAux_2').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaDiametroBroca()
    )

    this.pruebaDiametroAlambre.get('cantidad').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaDiametroAlambre()
    )

    this.pruebaDiametroAlambre.get('cantidadAux').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaDiametroAlambre()
    )

    this.pruebaDiametroAlambre.get('cantidadAux_2').valueChanges.pipe(debounceTime(250)).subscribe(
      () => this.cambioCantidadPruebaDiametroAlambre()
    )

    this.pruebaCorrosion.get('cantidad').valueChanges.pipe(debounceTime(250)).subscribe(
      cantidad => this.cambioCantidadPruebaCorrosion(cantidad)
    )

  }

  guardarPruebasDimensionales()
  {
    if(!this.validarFormulario())
      return

    this.botonGuardarDisabled= true

    const body = this.pruebasAguja.getRawValue().map( prueba => {
      const pruebaMap = {
        loteAnalisis: this.codigoAnalisis,
        baseCalculoEstado: (prueba['tipoRegistro'] == 4 ?  0 : (prueba['tipoRegistro'] == 1 ? this.baseCalculoProcentajeLongitud : this.baseCalculoProcentajeDiametro)),
        ...prueba
      }
      return pruebaMap;
    })

    this._analisisAgujaService.GuardarPruebaDimensional(body).subscribe(
      response => {
        this._toastr.success(response['content'], 'Éxito !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
        this.pruebaDimensional.markAsPristine(),
        this.botonGuardarDisabled = false
    },
    err => {
      this.botonGuardarDisabled = false
    })

  }


  validarFormulario(): boolean
  {

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if(this.pruebasAguja.invalid)
    {
      this._toastr.warning('Los datos del formulario no son válidos', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if(this.pruebasAguja.pristine)
    {
      this._toastr.warning('No se ha realizado ninguna modificación en el formulario', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if((!this.validarValores(this.pruebaLongitud.get('descripcionAux').value) && this.validarValores(this.pruebaLongitud.get('cantidadAux').value)) || (this.validarValores(this.pruebaLongitud.get('descripcionAux').value) && !this.validarValores(this.pruebaLongitud.get('cantidadAux').value)))
    {
      this._toastr.warning('Inconsistencia en los datos adicionales de la prueba de longitud de aguja', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if((!this.validarValores(this.pruebaDiametroBroca.get('descripcionAux').value) && this.validarValores(this.pruebaDiametroBroca.get('cantidadAux').value)) || (this.validarValores(this.pruebaDiametroBroca.get('descripcionAux').value) && !this.validarValores(this.pruebaDiametroBroca.get('cantidadAux').value)))
    {
      this._toastr.warning('Inconsistencia en los datos adicionales de la prueba de diametro del agujero', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if((!this.validarValores(this.pruebaDiametroAlambre.get('descripcionAux').value) && this.validarValores(this.pruebaDiametroAlambre.get('cantidadAux').value)) || (this.validarValores(this.pruebaDiametroAlambre.get('descripcionAux').value) && !this.validarValores(this.pruebaDiametroAlambre.get('cantidadAux').value)))
    {
      this._toastr.warning('Inconsistencia en los datos adicionales de la prueba de diametro del alambre', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if (((this.pruebaLongitud.get('cantidad').value ?? 0) + (this.pruebaLongitud.get('cantidadAux').value ?? 0) + (this.pruebaLongitud.get('cantidadAux_2').value ?? 0)) !== this.baseCalculoProcentajeLongitud)
    {
      this._toastr.warning(`Las cantidades de la prueba de longitud deben sumar ${this.baseCalculoProcentajeLongitud} und`, 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if (((this.pruebaDiametroBroca.get('cantidad').value ?? 0) + (this.pruebaDiametroBroca.get('cantidadAux').value ?? 0) + (this.pruebaDiametroBroca.get('cantidadAux_2').value ?? 0)) != this.baseCalculoProcentajeDiametro)
    {
      this._toastr.warning(`Las cantidades de la prueba de diametro del agujero deben sumar ${this.baseCalculoProcentajeDiametro} und`, 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    if (((this.pruebaDiametroAlambre.get('cantidad').value ?? 0) + (this.pruebaDiametroAlambre.get('cantidadAux').value ?? 0) + (this.pruebaDiametroAlambre.get('cantidadAux_2').value ?? 0) ) != this.baseCalculoProcentajeDiametro)
    {
      this._toastr.warning(`Las cantidades de la prueba de diametro del alambre deben sumar ${this.baseCalculoProcentajeDiametro} und`, 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return false
    }

    return true
  }

  private validarValores(valor): boolean
  {
    if(valor === 0)
      return true

    if(typeof valor == 'string')
      valor= valor.trim()

    if(valor == undefined || valor == null || valor == '' )
      return false

    return true
  }


  obtenerPruebaDimensional(loteAnalisis:string){
    this._analisisAgujaService.ObtenerPruebaDimensional(loteAnalisis).subscribe(
      result => {

        if(result['success']== true)
          this.mostrarValoresGuardosFormulario(result['content'])
        else{
          this.obtenerValoresTolerancia()
          this.obtenerBaseParaCalculoDePorcentaje(this.codigoAnalisis)
        }

      }
    );
  }

  mostrarValoresGuardosFormulario(pruebaBD){

    const itemLongitud = pruebaBD.find(x => x['tipoRegistro'] == 1)

    this.baseCalculoProcentajeLongitud = itemLongitud['baseCalculoEstado']

    this.pruebaLongitud.patchValue({
      tipoRegistro: 1,
      tolerancia: itemLongitud['tolerancia'],
      cantidad: itemLongitud['cantidad'],
      descripcionAux: itemLongitud['descripcionAux'],
      cantidadAux: itemLongitud['cantidadAux'],
      descripcionAux_2: itemLongitud['descripcionAux_2'],
      cantidadAux_2: itemLongitud['cantidadAux_2']
    })

    const itemDiametroBroca = pruebaBD.find(x => x['tipoRegistro'] == 2)

    this.baseCalculoProcentajeDiametro = itemDiametroBroca['baseCalculoEstado']

    this.pruebaDiametroBroca.patchValue({
      tipoRegistro: 2,
      tolerancia: itemDiametroBroca['tolerancia'],
      cantidad: itemDiametroBroca['cantidad'],
      descripcionAux: itemDiametroBroca['descripcionAux'],
      cantidadAux: itemDiametroBroca['cantidadAux'],
      descripcionAux_2: itemLongitud['descripcionAux_2'],
      cantidadAux_2: itemLongitud['cantidadAux_2']
    })

    const itemDiametroAlambre = pruebaBD.find(x => x['tipoRegistro'] == 3)

    this.pruebaDiametroAlambre.patchValue({
      tipoRegistro: 3,
      tolerancia: itemDiametroAlambre['tolerancia'],
      cantidad: itemDiametroAlambre['cantidad'],
      descripcionAux: itemDiametroAlambre['descripcionAux'],
      cantidadAux: itemDiametroAlambre['cantidadAux'],
      descripcionAux_2: itemLongitud['descripcionAux_2'],
      cantidadAux_2: itemLongitud['cantidadAux_2']
    })

    const itemCorrosion = pruebaBD.find(x => x['tipoRegistro'] == 4)

    this.pruebaCorrosion.patchValue({
      tipoRegistro: 4,
      tolerancia: itemCorrosion['tolerancia'],
      cantidad: itemCorrosion['cantidad']
    })
  }


  obtenerValoresTolerancia(){

    this._commonServices.ObtenerConfiguracion(2, 'TOLERANCIA_AA').subscribe( result => {

      this.pruebaLongitud.patchValue({
        tolerancia: result[0]['valorEntero1']
      })

      this.pruebaDiametroBroca.patchValue({
        tolerancia: result[0]['valorEntero2']
      })

      this.pruebaDiametroAlambre.patchValue({
        tolerancia: result[0]['valorEntero3']
      })

      this.pruebaCorrosion.patchValue({
        tolerancia: result[0]['valorDecimal1']
      })
    })

  }

  obtenerBaseParaCalculoDePorcentaje(loteAnalisis: string){

    this._analisisAgujaService.ObtenerDatosGenerales(loteAnalisis).subscribe(
      result => {
        this.baseCalculoProcentajeLongitud = result['undMuestrearI']
        this.baseCalculoProcentajeDiametro = result['undMuestrear']
      }
    );

  }

  obtenerDetalleDatosGenerales(loteAnalisis: string){
    this._analisisAgujaService.ObtenerDatosGenerales(loteAnalisis).subscribe(
      result => {

        this.pruebaLongitud.patchValue({
          descripcion: result['longitud']
        })

        this.pruebaDiametroBroca.patchValue({
          descripcion: result['broca']
        })

        this.pruebaDiametroAlambre.patchValue({
          descripcion: result['alambre']
        })

        this.pruebaCorrosion.patchValue({
          descripcion: 'Presentan Corrosión'
        })
      }
    )
  }

  cambioCantidadPruebaLongitud()
  {
    const cantidadItemSolicitado = this.pruebaLongitud.get('cantidad').value ?? 0
    const cantidadItemAuxiliar = this.pruebaLongitud.get('cantidadAux').value ?? 0
    const cantidadItemAuxiliar_2 = this.pruebaLongitud.get('cantidadAux_2').value ?? 0

    if ((cantidadItemSolicitado + cantidadItemAuxiliar + cantidadItemAuxiliar_2) > this.baseCalculoProcentajeLongitud)
    {
      this.pruebaLongitud.patchValue({
        porciento: 0,
        estado: ''
      })

      this.procentajeAuxLongitud = '0'
      return
    }

    this.procentajeAuxLongitud = this._commonServices.RedondearDecimales(((cantidadItemAuxiliar + cantidadItemAuxiliar_2) * 100) / this.baseCalculoProcentajeLongitud, 2, false)

    const calculo = (cantidadItemSolicitado * 100) / this.baseCalculoProcentajeLongitud
    const calculoFormato= this._commonServices.RedondearDecimales(calculo, 2, false)
    const tolerancia = this.pruebaLongitud.get('tolerancia').value ?? 0

    const newStatus = (calculoFormato >= tolerancia ? 'A':'R')

    this.pruebaLongitud.patchValue({
      porciento: calculoFormato,
      estado: newStatus
    })

  }

  cambioCantidadPruebaDiametroBroca()
  {

    const cantidadItemSolicitado = this.pruebaDiametroBroca.get('cantidad').value ?? 0
    const cantidadItemAuxiliar = this.pruebaDiametroBroca.get('cantidadAux').value ?? 0
    const cantidadItemAuxiliar_2 = this.pruebaDiametroBroca.get('cantidadAux_2').value ?? 0

    if ((cantidadItemSolicitado + cantidadItemAuxiliar) > this.baseCalculoProcentajeDiametro)
    {
      this.pruebaDiametroBroca.patchValue({
        porciento: 0,
        estado: ''
      })
      this.procentajeAuxDiametro = '0'
      return
    }

    this.procentajeAuxDiametro = this._commonServices.RedondearDecimales(((cantidadItemAuxiliar + cantidadItemAuxiliar_2) * 100) / this.baseCalculoProcentajeDiametro, 2, false)

    const calculo = (cantidadItemSolicitado * 100) / this.baseCalculoProcentajeDiametro
    const calculoFormato= this._commonServices.RedondearDecimales(calculo, 2, false)
    const tolerancia = this.pruebaDiametroBroca.get('tolerancia').value

    const newStatus = (calculo >= tolerancia ? 'A':'R')

    this.pruebaDiametroBroca.patchValue({
      porciento: calculoFormato,
      estado: newStatus
    })
  }

  cambioCantidadPruebaDiametroAlambre()
  {

    const cantidadItemSolicitado = this.pruebaDiametroAlambre.get('cantidad').value ?? 0
    const cantidadItemAuxiliar = this.pruebaDiametroAlambre.get('cantidadAux').value ?? 0
    const cantidadItemAuxiliar_2 = this.pruebaDiametroAlambre.get('cantidadAux_2').value ?? 0

    if ((cantidadItemSolicitado + cantidadItemAuxiliar) > this.baseCalculoProcentajeDiametro)
    {
      this.pruebaDiametroAlambre.patchValue({
        porciento: 0,
        estado: ''
      })

      this.procentajeAuxAlambre = '0'
      return
    }

    this.procentajeAuxAlambre = this._commonServices.RedondearDecimales(((cantidadItemAuxiliar + cantidadItemAuxiliar_2) * 100) / this.baseCalculoProcentajeDiametro, 2, false)

    const calculo = (cantidadItemSolicitado * 100) / this.baseCalculoProcentajeDiametro
    const calculoFormato= this._commonServices.RedondearDecimales(calculo, 2, false)
    const tolerancia = this.pruebaDiametroAlambre.get('tolerancia').value
    const newStatus = (calculoFormato >= tolerancia ? 'A':'R')

    this.pruebaDiametroAlambre.patchValue({
      porciento: calculoFormato,
      estado: newStatus
    })
  }

  cambioCantidadPruebaCorrosion(cantidad: number)
  {

    if (cantidad > this.baseCalculoProcentajeLongitud)
    {
      this.pruebaCorrosion.patchValue({
        porciento: 0,
        estado: ''
      })
      return
    }

    let porciento = 0

    if(cantidad > 0)
      porciento = 100

    const tolerancia = this.pruebaCorrosion.get('tolerancia').value
    const newStatus = (porciento > tolerancia ? 'R':'A')

    this.pruebaCorrosion.patchValue({
      porciento: porciento,
      estado: newStatus
    })
  }

  paginaAnterior(){
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'DatosGenerales', this.codigoAnalisis ]);
  }

  paginaSiguiente(){
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'PruebaElasticidadPerforacion', this.codigoAnalisis ]);
  }

  onExit() {

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando','Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return false
    }

    if(this.pruebasAguja.dirty)
    {
      const rpta = confirm("¿Está seguro de salir del formulario sin guardar?");
      return rpta;
    }

    return true;

  };


  ngOnDestroy(): void {
    this.subscriptionRuta.unsubscribe();
  }

}
