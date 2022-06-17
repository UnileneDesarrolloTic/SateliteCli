import { ToastrService } from 'ngx-toastr';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { debounceTime } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '@guard/confirm-exit.guard';

@Component({
  selector: 'app-prueba-elasticidad-perforacion',
  templateUrl: './prueba-elasticidad-perforacion.component.html',
  styleUrls: ['./prueba-elasticidad-perforacion.component.css']
})
export class PruebaElasticidadPerforacionComponent implements OnInit, OnExit, OnDestroy {

  subscriptionRuta: Subscription
  codigoAnalisis:string = ""
  formulario: FormGroup
  botonGuardarDisabled: boolean = false

  constructor(private _activatedRoute: ActivatedRoute, private _analisisAgujaService: AnalisisAgujaService, private _toastr: ToastrService, private _router: Router)
  {
    this.subscriptionRuta = this._activatedRoute.params.subscribe(param => this.codigoAnalisis = param['codAnalisis'])
    this.inicializarFormulario()
  }

  ngOnInit(): void {
    this.obtenerPruebaElasticidadPerforacion(this.codigoAnalisis);
    this.subcripcionInputCantidades()
  }

  inicializarFormulario(){
    this.formulario = new FormGroup({
      pruebasAguja: new FormArray([
        new FormGroup({
          loteAnalisis: new FormControl(this.codigoAnalisis, [Validators.required, Validators.min(0)]),
          tipoRegistro: new FormControl(1, [Validators.required, Validators.min(0)]),
          uno: new FormControl('', [Validators.required, Validators.min(0)]),
          dos: new FormControl('', [Validators.required, Validators.min(0)]),
          tres: new FormControl('', [Validators.required, Validators.min(0)]),
          cuatro: new FormControl('', [Validators.required, Validators.min(0)]),
          cinco: new FormControl('', [Validators.required, Validators.min(0)]),
          promedio: new FormControl(0, [Validators.required, Validators.min(0)]),
          fuerzaPerforacion: new FormControl(null),
          estado: new FormControl('', [Validators.required, Validators.min(0)])
        }),
        new FormGroup({
          loteAnalisis: new FormControl(this.codigoAnalisis, [Validators.required, Validators.min(0)]),
          tipoRegistro: new FormControl(2, [Validators.required, Validators.min(0)]),
          uno: new FormControl('', [Validators.required, Validators.min(0)]),
          dos: new FormControl('', [Validators.required, Validators.min(0)]),
          tres: new FormControl('', [Validators.required, Validators.min(0)]),
          cuatro: new FormControl('', [Validators.required, Validators.min(0)]),
          cinco: new FormControl('', [Validators.required, Validators.min(0)]),
          promedio: new FormControl(0, [Validators.required, Validators.min(0)]),
          fuerzaPerforacion: new FormControl(0, [Validators.required, Validators.min(0)]),
          estado: new FormControl('', [Validators.required, Validators.min(0)])
        })
      ])
    })
  }

  get pruebasAguja (){
    return this.formulario.controls['pruebasAguja'] as FormArray
  }

  get pruebaElasticidad(){
    return this.pruebasAguja.controls[0] as FormGroup
  }

  get pruebaPerforacion(){
    return this.pruebasAguja.controls[1] as FormGroup
  }

  subcripcionInputCantidades(){
    this.pruebaElasticidad.controls['uno'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaElasticidad())
    this.pruebaElasticidad.controls['dos'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaElasticidad())
    this.pruebaElasticidad.controls['tres'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaElasticidad())
    this.pruebaElasticidad.controls['cuatro'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaElasticidad())
    this.pruebaElasticidad.controls['cinco'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaElasticidad())

    this.pruebaPerforacion.controls['uno'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaPerforacion())
    this.pruebaPerforacion.controls['dos'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaPerforacion())
    this.pruebaPerforacion.controls['tres'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaPerforacion())
    this.pruebaPerforacion.controls['cuatro'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaPerforacion())
    this.pruebaPerforacion.controls['cinco'].valueChanges.pipe(debounceTime(200)).subscribe( () => this.cambioCantidadPruebaPerforacion())
  }

  guardarPruebas(){

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando.', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    if(this.pruebasAguja.invalid)
    {
      this._toastr.warning('Los datos del formulario no son válidos.', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    if(this.pruebasAguja.pristine)
    {
      this._toastr.warning('No se ha realizado ningun cambio en el formulario', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    this.botonGuardarDisabled = true

    const body = this.pruebasAguja.value

    this._analisisAgujaService.GuardarPruebaElasticidadPerforacion(body).subscribe(
      result => {
        this._toastr.success(result['content'], 'Éxito !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
        this.formulario.markAsPristine()
      },
      err => {},
      () => this.botonGuardarDisabled = false
    )

  }

  obtenerPruebaElasticidadPerforacion (loteAnalisis: string){
    this._analisisAgujaService.ObtenerPruebaElasticidadPerforacion(loteAnalisis).subscribe( response => {

      if(response['success'] == true){

        const datosElasticidad =  response['content'].find(x=> x['tipoRegistro'] == 1)
        const datosPerforacion =  response['content'].find(x=> x['tipoRegistro'] == 2)

        this.pruebaElasticidad.patchValue({
          ...datosElasticidad
        })

        this.pruebaPerforacion.patchValue({
          ...datosPerforacion
        })

      }
      else{
        this.obtenerDatosGeneralesAnalisis(this.codigoAnalisis);
      }
    })
  }

  obtenerDatosGeneralesAnalisis(loteAnalisis: string){

    this._analisisAgujaService.ObtenerDatosGenerales(loteAnalisis).subscribe(
      result => {
        this.pruebaPerforacion.patchValue({
          fuerzaPerforacion: result['fuerzaPerforacion']
        })
      }
    )
  }

  cambioCantidadPruebaElasticidad(){

    const uno = this.pruebaElasticidad.get('uno').value ?? 0
    const dos = this.pruebaElasticidad.get('dos').value ?? 0
    const tres = this.pruebaElasticidad.get('tres').value ?? 0
    const cuatro = this.pruebaElasticidad.get('cuatro').value ?? 0
    const cinco = this.pruebaElasticidad.get('cinco').value ?? 0
    const promedio: number = (uno + dos + tres + cuatro + cinco) / 5

    this.pruebaElasticidad.patchValue({
      promedio: promedio
    })

  }

  cambioCantidadPruebaPerforacion(){
    const uno = this.pruebaPerforacion.get('uno').value ?? 0
    const dos = this.pruebaPerforacion.get('dos').value ?? 0
    const tres = this.pruebaPerforacion.get('tres').value ?? 0
    const cuatro = this.pruebaPerforacion.get('cuatro').value ?? 0
    const cinco = this.pruebaPerforacion.get('cinco').value ?? 0
    const promedio: number = (uno + dos + tres + cuatro + cinco) / 5
    const fuerzaPerforacion= this.pruebaPerforacion.get('fuerzaPerforacion').value

    const estado: string = promedio >= fuerzaPerforacion? 'A' : 'R'

    this.pruebaPerforacion.patchValue({
      promedio: promedio,
      estado: estado
    })

  }

  onExit() {

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando.', 'Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return false
    }

    if(this.pruebasAguja.dirty){
      const rpta = confirm("¿Está seguro de salir del formulario sin guardar?")
      return rpta
    }

    return true

  };

  paginaAnterior(){
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'PruebaDimensional', this.codigoAnalisis ]);
  }

  paginaSiguiente(){
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'PruebaDefectos', this.codigoAnalisis ]);
  }

  ngOnDestroy(): void {
    this.subscriptionRuta.unsubscribe();
  }

}
