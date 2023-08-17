import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalisisMateriaPrimaService } from '@data/services/backEnd/pages/analisis-materia-prima.service';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-analisis-hebra',
  templateUrl: './analisis-hebra.component.html'
})
export class AnalisisHebraComponent implements OnInit {

  subscriptionRuta: Subscription
  analisisForm: FormGroup;
  footerTable: FormGroup;
  formProtocolo: FormGroup;
  ordenCompra: string;
  numeroAnalisis: string;
  datosGeneralesForm: FormGroup;
  pruebaLongitud: Number = 0;
  pruebaDiametroMinimo: Number = 0;
  pruebaDiametroMaximo: Number = 0;
  pruebaTension: Number = 0;
  flagGuardando: boolean = false;
  flagRegistrarLongitud: boolean = true;
  listaPruebaProtocolo: any[] = []
  mensajeProtocolo: string = ""

  constructor(private _activatedRoute: ActivatedRoute, private _toastr: ToastrService, private _sesionService: SesionService,
    private _analisisMateriaPrimaService: AnalisisMateriaPrimaService, private _router: Router) {

    this.subscriptionRuta = this._activatedRoute.params.subscribe(param => {
      this.ordenCompra = param['controlNro'],
        this.numeroAnalisis = param['nroAnalisis']
    })

    this.subscriptionRuta.unsubscribe();
  }

  ngOnInit(): void {
    this.obtenerDatosGeneralesAnalisisHebra();
    this.inicializarForularios()
    
  }

  inicializarForularios() {
    this.formProtocolo = new FormGroup({
      pruebas: new FormArray([]),
      conclusion: new FormControl('', Validators.required),
      observaciones: new FormControl(null)
    })
    this.datosGeneralesForm = new FormGroup({
      producto: new FormControl({ value: '', disabled: true }),
      item: new FormControl({ value: '', disabled: true }),
      numeroDeParte: new FormControl({ value: '', disabled: true }),
      proveedor: new FormControl({ value: '', disabled: true }),
      lote: new FormControl({ value: '', disabled: true }),
      nroIngreso: new FormControl({ value: '', disabled: true }),
      fechaIngreso: new FormControl({ value: '', disabled: true }),
      ordCompra: new FormControl({ value: '', disabled: true }),
      analisis: new FormControl({ value: '', disabled: true })

    })

    this.footerTable = new FormGroup({
      promedio: new FormGroup({
        numero: new FormControl({ value: "Promedio", disabled: false }),
        longitud: new FormControl({ value: 0, disabled: false }),
        diametro: new FormControl({ value: 0, disabled: false }),
        tension: new FormControl({ value: 0, disabled: false }),
        porcentaje: new FormControl({ value: 0, disabled: false })
      })
    })

    this.analisisForm = new FormGroup({
      dimensiones: new FormArray([]),
      resumen: new FormGroup({
        certificado: new FormControl('', Validators.required),
        quimica: new FormControl('', Validators.required),
        conclusion: new FormControl('', Validators.required),
        observaciones: new FormControl(null, Validators.maxLength(100)),
        fechaAnalisis: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required),
        color: new FormControl(null, Validators.required),
        balanza: new FormControl('CCBA-06', Validators.required),
        estufa: new FormControl('CCES-06', Validators.required),
        micrometro: new FormControl('CCMI-06', Validators.required),
        regla: new FormControl('RM-10', Validators.required),
        dinamometro: new FormControl('CCTE-', Validators.required),
        soporte: new FormControl('CCSV-04', Validators.required),
      })
    })   

    for (let i = 1; i <= 20; i++) {
      const prueba = new FormGroup({
        numero: new FormControl({ value: i, disabled: true }, Validators.required),
        longitud: new FormControl(null),
        diametro: new FormControl(null, Validators.required),
        tension: new FormControl(null, Validators.required),
        porcentaje: new FormControl(null, Validators.required),
      });

      prueba.get('longitud').valueChanges.pipe(debounceTime(500)).subscribe(_ => this.actualizarLongitud());
      prueba.get('diametro').valueChanges.pipe(debounceTime(500)).subscribe(_ => this.actualizarDiametro());
      prueba.get('tension').valueChanges.pipe(debounceTime(500)).subscribe(_ => this.actualizarTension(i));

      this.pruebasDimensiones.push(prueba);
    }

    this.promedioTable.get('tension').valueChanges.pipe(debounceTime(500)).subscribe(x => this.actualizarTensionFooter(x))

  }

  get pruebasProtocolo() {
    return this.formProtocolo.controls['pruebas'] as FormArray;
  }

  get pruebasDimensiones() {
    return this.analisisForm.controls['dimensiones'] as FormArray;
  }

  get resumen() {
    return this.analisisForm.controls['resumen'] as FormGroup;
  }

  get promedioTable() {
    return this.footerTable.controls['promedio'] as FormGroup;
  }

  get valorPruebaTension(): number {
    return +this.pruebaTension == 0 ? 1 : +this.pruebaTension
  }

  private obtenerPromedio(columna: string): number{
    let sumaTotal: number = 0;

    this.pruebasDimensiones.controls.forEach((x: FormArray) => {
      sumaTotal = sumaTotal + (+x.controls[columna].value)
    })

    return sumaTotal/20;
  }

  actualizarLongitud() {
    this.promedioTable.patchValue({
      longitud: this.obtenerPromedio('longitud')
    })

  }

  actualizarDiametro() {
    this.promedioTable.patchValue({
      diametro: this.obtenerPromedio('diametro')
    })

  }

  actualizarTension(indice: number) {

    let porcentajeCalculado = ((this.pruebasDimensiones.controls[indice - 1].get('tension').value / this.valorPruebaTension) - 1) * 100;

    this.pruebasDimensiones.controls[indice - 1].patchValue({
      porcentaje: porcentajeCalculado
    });

    this.promedioTable.patchValue({
      tension:this.obtenerPromedio('tension')
    })
  }

  actualizarTensionFooter(nuevoValor: number) {

    let porcentajeCalculado = ((nuevoValor / this.valorPruebaTension) - 1) * 100

    this.promedioTable.patchValue({
      porcentaje: porcentajeCalculado
    })
  }

  guardarAnalisis() {
    if (this.analisisForm.invalid) {
      this.analisisForm.markAllAsTouched();
      this._toastr.warning('Ingrese los datos requeridos.', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

      return
    }

    if (this.flagGuardando)
      return this._toastr.warning('Se esta guardando la informacion...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    this.flagGuardando = true;

    const usuario: string = this._sesionService.datosPersonales().usuario;

    let detalleAnalisis = this.pruebasDimensiones.getRawValue().map(prueba => {
      return {
        ordenCompra: this.ordenCompra,
        numeroAnalisis: this.numeroAnalisis,
        numero: +prueba.numero,
        longitud: +prueba.longitud,
        diametro: +prueba.diametro,
        tension: +prueba.tension
      }
    })

    const body = {
      cabecera: {
        ...this.resumen.getRawValue(),
        ordenCompra: this.ordenCompra,
        numeroAnalisis: this.numeroAnalisis,
        fechaAnalisis: this.resumen.get('fechaAnalisis').value,
        usuarioRegistro: usuario,
        usuarioModificacion: usuario,
        fechaRegistro: new Date()
      },
      detalle: detalleAnalisis,
      item: this.datosGeneralesForm.get('item').value,
      numeroLote: this.numeroAnalisis,
      numeroDeParte: this.datosGeneralesForm.get('numeroDeParte').value,
      longitud: this.obtenerPromedio('longitud'),
      diametro: this.obtenerPromedio('diametro'),
      tension: this.obtenerPromedio('tension'),
    }

    this._analisisMateriaPrimaService.guardarAnalisisHebra(body).subscribe(
      x => {
        this.flagGuardando = false
        this._toastr.success(x['content'], 'Éxito !!', { closeButton: true, timeOut: 3000, progressBar: true })
      },
      _ => this.flagGuardando = false)


  }

  guardarProtocolo() {

    if (this.flagGuardando)
      return this._toastr.warning('Se esta guardando la informacion...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })


    if (this.pruebasProtocolo.invalid) {
      this.pruebasProtocolo.markAllAsTouched();
      this._toastr.warning('Ingrese los datos requeridos.', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })
      return
    }

    this.flagGuardando = true;

    const usuarioSesion: string = this._sesionService.datosPersonales().usuario;
    const conclusion: string = this.formProtocolo.get("conclusion").value;
    const observaciones: string = this.formProtocolo.get("observaciones").value;

    const body = this.pruebasProtocolo.getRawValue().map(x => {
      return {
        item: this.datosGeneralesForm.get('item').value,
        numeroLote: this.numeroAnalisis,
        itemNumeroDeParte: this.datosGeneralesForm.get('numeroDeParte').value,
        ...x,
        secuencia: x['secuencia'].value,
        conclusion: conclusion,
        observaciones: observaciones,
        usuario: usuarioSesion
      }
    })

    this._analisisMateriaPrimaService.guardarDatosProtocoloMateriaPrima(body).subscribe(x => {
      this.flagGuardando = false
      this._toastr.success('Se guardo los datos del protocolo', 'Éxito !!', { closeButton: true, timeOut: 3000, progressBar: true })
    },
      _ => this.flagGuardando = false
    );
  }

  deshabilitarInputLongitud() {
    this.pruebasDimensiones.controls.forEach(control => {
      control.get("longitud").disable()
    });
  }

  obtenerDatosGeneralesAnalisisHebra() {

    this._analisisMateriaPrimaService.datosGeneralesAnalisisHebra(this.ordenCompra, this.numeroAnalisis)
      .subscribe(
        datos => {

          if (!datos.datos.registroLongitud ?? false)
            this.deshabilitarInputLongitud();
          this.datosGeneralesForm.patchValue({
            ...datos.datos,
            fechaIngreso: formatDate(datos.datos['fechaIngreso'], 'yyyy-MM-dd', 'en')
          })     

          this.pruebaLongitud = datos.datos.longitud
          this.pruebaDiametroMinimo = datos.datos.minimoDiametro
          this.pruebaDiametroMaximo = datos.datos.maximoDiametro
          this.pruebaTension = datos.datos.tension

          if(datos.cabecera.ordenCompra != null && datos.cabecera.ordenCompra != undefined)
          {
            this.resumen.patchValue({
              ...datos.cabecera,
              fechaAnalisis: formatDate(datos.cabecera.fechaAnalisis, 'yyyy-MM-dd', 'en')
            })
  
            this.pruebasDimensiones.patchValue(datos.detalle)
          }
        })
  }

  obtenerDatosProtocolo() {
    const ordenCompra = this.ordenCompra
    const numeroAnalisis = this.numeroAnalisis

    this._analisisMateriaPrimaService.datosProtocolo(ordenCompra, numeroAnalisis).subscribe(
      x => {
        if(x['success'] == true){
          this.mensajeProtocolo = ''
          this.inicializarFormProtocolo(x['content'])

        }else{
          this.mensajeProtocolo = x['message']
        }
      },
      _ => this.mensajeProtocolo = ''
    );

  }

  inicializarFormProtocolo(listaProtocolo: any[]) {
    
    this.formProtocolo.patchValue({
      conclusion: listaProtocolo[0]['conclusionFlag'],
      observaciones : listaProtocolo[0]['comentarios']
    })

    listaProtocolo.forEach(
      x => {
        const prueba = new FormGroup({
          secuencia: new FormControl({ value: x.secuencia, disable: true }, Validators.required),
          prueba: new FormControl(x.prueba, Validators.required),
          especificacion: new FormControl(x.especificacion, Validators.required),
          valor: new FormControl(x.valor, Validators.required),
          metodologia: new FormControl(x.metodologia, Validators.required),
          tipoDato: new FormControl(x.tipoDato, Validators.required),
          minimo: new FormControl(x.minimo, Validators.required),
          maximo: new FormControl(x.maximo, Validators.required),
          rechazado: new FormControl(x.rechazado, Validators.required),
          aprobado: new FormControl(x.aprobado, Validators.required)
        })

        this.pruebasProtocolo.push(prueba);

      }
    )
  }

  cancelar() {

    if (this.flagGuardando)
      return this._toastr.warning('Se esta guardando la informacion...', 'Advertencia !!', { closeButton: true, timeOut: 3000, progressBar: true })

    this._router.navigate(['ControlCalidad/AnalisisMP/lista']);
  }

  eventoTab ($event: any){

    this.formProtocolo.controls['pruebas'] = new FormArray([])

    if($event.nextId == 'protocolo' )
      this.obtenerDatosProtocolo()
    
      
  }

  


}
''