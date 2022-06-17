import { OnExit } from '@guard/confirm-exit.guard';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.css']
})
export class DatosGeneralesComponent implements OnInit, OnExit {

  codigoAnalisis:string = ""
  subscriptionRuta: Subscription
  datosGeneralesForm : FormGroup
  botonGuardarDisabled: boolean = false

  constructor(private _activatedRoute: ActivatedRoute, private _analisisAgujaService: AnalisisAgujaService,
    private _toastr: ToastrService, private _router: Router) {
    this.subscriptionRuta = this._activatedRoute.params.subscribe(param => this.codigoAnalisis = param['codAnalisis'])
  }

  ngOnInit(): void {
    this.inicializarFormulario()
    this.obtenerDatosFormularioEditar(this.codigoAnalisis)
    this.obtenerPlanMuestreoGuardado(this.codigoAnalisis)
    this.obtenerResultadosAnalisisFlexion()
  }

  inicializarFormulario(){
    this.datosGeneralesForm =  new FormGroup({
      tipo: new FormControl({value: '', disabled: true}, Validators.required),
      longitud: new FormControl({value: '', disabled: true}, Validators.required),
      broca: new FormControl({value: '', disabled: true}, Validators.required),
      alambre: new FormControl({value: '', disabled: true}, Validators.required),
      serie: new FormControl({value: '', disabled: true}, Validators.required),
      ordenCompra: new FormControl({value: '', disabled: true}, Validators.required),
      controlNumero: new FormControl({value: '', disabled: true}, Validators.required),
      proveedor: new FormControl({value: '', disabled: true}, Validators.required),
      cantidad: new FormControl({value: 0, disabled: true}, Validators.required),
      undMuestrear: new FormControl({value: 0, disabled: true}, Validators.required),
      undMuestrearI: new FormControl({value: 0, disabled: true}, Validators.required),
      undMuestrearIII: new FormControl({value: 0, disabled: true}, Validators.required),
      cajasMuestrear: new FormControl(null, [Validators.required, Validators.min(1)]),
      undPorCaja: new FormControl({value: 0, disabled: true}, Validators.required),
      resumenFlexion: new FormArray([]),
      statusFlexion: new FormControl('', Validators.required)
    });

    this.datosGeneralesForm.controls['cajasMuestrear'].valueChanges.subscribe((event)=> this.cambioValorCajasMuestrear(event));

  }

  cambioValorCajasMuestrear(event: number)
  {
    const undMuestrearIII = this.datosGeneralesForm.controls['undMuestrearIII'].value
    let unidadesPorCaja:number = 0

    if (event > 0)
      unidadesPorCaja = Math.ceil(undMuestrearIII/event)

    this.datosGeneralesForm.patchValue({
      undPorCaja: unidadesPorCaja
    })

  }

  obtenerPlanMuestreoGuardado(loteAnalisis: string){

    this._analisisAgujaService.ObtenerPlanMuestreo(loteAnalisis).subscribe(
      result => {

        if( result['success'] == true)

          this.datosGeneralesForm.patchValue({
            ...result['content']
          })

      }
    )

  }

  obtenerDatosFormularioEditar(loteAnalisis: string){
    this._analisisAgujaService.ObtenerDatosGenerales(loteAnalisis).subscribe(
      result => {
        this.datosGeneralesForm.patchValue({
          ...result
        })
      }
    )
  }

  guardarDatosGenerales(){

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando','Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return
    }

    if (this.datosGeneralesForm.invalid)
    {
      this._toastr.warning("Los datos del formulario no son válidos", "Advertencia !!", { timeOut: 4000, closeButton: true })
      return
    }

    if(this.datosGeneralesForm.pristine)
    {
      this._toastr.warning("No se ha realizado ninguna modificación en el formulario", "Advertencia !!", { timeOut: 4000, closeButton: true })
      return
    }

    this.botonGuardarDisabled = true;

    const datosFormulario = this.datosGeneralesForm.getRawValue();

    const body = {
      loteAnalisis: this.codigoAnalisis,
      cantidad: datosFormulario['cantidad'],
      undMuestrear: datosFormulario['undMuestrear'],
      undMuestrearI: datosFormulario['undMuestrearI'],
      undMuestrearIII: datosFormulario['undMuestrearIII'],
      cajasMuestrear: datosFormulario['cajasMuestrear'],
      statusFlexion: datosFormulario['statusFlexion']
    }

    this._analisisAgujaService.GuardarPlanMuestreo(body).subscribe((result) => {
      if(result['success'] == true){
        this._toastr.success(result['content'], "Éxito !!", { timeOut: 4000, closeButton: true })
        this.datosGeneralesForm.markAsPristine();
      }
    },
    err =>{},
    () => {
      this.botonGuardarDisabled = false
    })

  }

  paginaAnterior()
  {
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'PruebaFlexion', this.codigoAnalisis], { skipLocationChange: true });
  }

  paginaSiguiente()
  {
    this._router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codigoAnalisis, 'PruebaDimensional', this.codigoAnalisis], { skipLocationChange: true });
  }

  onExit() {

    if(this.botonGuardarDisabled)
    {
      this._toastr.warning('Los datos del formulario se estan guardando','Advertencia !!', {timeOut: 3000, closeButton: true, tapToDismiss: true})
      return false
    }

    if(this.datosGeneralesForm.dirty){
      const rpta = confirm("¿Está seguro de salir del formulario sin guardar?");
      return rpta;
    }

    return true;

  };

  obtenerResultadosAnalisisFlexion(){
    this._analisisAgujaService.DatosAnalisisAgujaFlexion(this.codigoAnalisis)
      .subscribe( resp => this.crearControlPruebaFlexion(resp['detalle']));
  }

  crearControlPruebaFlexion(detalle:{}[])
  {
    const listaResumen = detalle.filter(x => x['tipoRegistro'] == 2)

    if (listaResumen.length < 1)
      return

    listaResumen.forEach(resumen => {

      const groupResultForm = new FormGroup({
        ciclo: new FormControl({value: resumen['llave'], disabled : true}),
        porcentaje: new FormControl({value: resumen['valor'], disabled : true})
      });

      this.resumenFlexion.push(groupResultForm);

    })

  }

  get resumenFlexion(){
    return this.datosGeneralesForm.controls['resumenFlexion'] as FormArray
  }

  get tipo (){
    return this.datosGeneralesForm.controls['tipo'].value
  }

  get longitud (){
    return this.datosGeneralesForm.controls['longitud'].value
  }

  get broca (){
    return this.datosGeneralesForm.controls['broca'].value
  }

  get alambre (){
    return this.datosGeneralesForm.controls['alambre'].value
  }

  get serie (){
    return this.datosGeneralesForm.controls['serie'].value
  }

  get ordenCompra (){
    return this.datosGeneralesForm.controls['ordenCompra'].value
  }

  get controlNumero (){
    return this.datosGeneralesForm.controls['controlNumero'].value
  }

  get proveedor (){
    return this.datosGeneralesForm.controls['proveedor'].value
  }

  get cantidad (){
    return this.datosGeneralesForm.controls['cantidad'].value
  }

}
