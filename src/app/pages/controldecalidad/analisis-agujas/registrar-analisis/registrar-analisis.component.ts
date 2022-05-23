import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-analisis',
  templateUrl: './registrar-analisis.component.html'
})
export class RegistrarAnalisisComponent {

  listaOrdenesCompra: Object[] = []
  cargandoCantidadFlexion: boolean = true
  filtroOrdenCompra: FormGroup
  formRegristrarAnalisis: FormGroup
  spinnerGuardarAnalisis: boolean = false

  constructor(private _modalService: NgbModal, private _esterilizacionService: AnalisisAgujaService, private _fb: FormBuilder, private _toastr: ToastrService, private _router: Router) {
    this.InicializarFormulario();
  }


  InicializarFormulario(){

    this.filtroOrdenCompra = this._fb.group({
      for: ['']
    });

    this.formRegristrarAnalisis = this._fb.group({
      item:[{value: '', disabled : true}, Validators.required],
      controlNumero:[{value: '', disabled : false}, Validators.required],
      secuencia:[{value: '', disabled : false}, Validators.required],
      descripcionItem:[{value: '', disabled : true}, Validators.required],
      cantidadRecibida:[{value: 0, disabled : true}, Validators.required],
      cantidadPruebas:[{value: 0, disabled : true}, Validators.required],
      fechaVencimiento: ['', Validators.required]
    })

    this.filtroOrdenCompra.valueChanges.pipe(debounceTime(750)).subscribe(
      filtro => this.ListarOrdenCompra(filtro)
    );
  }

  ListarOrdenCompra(filtro: object) {

    if(filtro['for'] == undefined || filtro['for'] == ''){
      this.listaOrdenesCompra = []
      return
    }

    this._esterilizacionService.ListarOrdenesCompra(filtro['for'])
      .subscribe((data: any) => {
        this.listaOrdenesCompra = data;
        if (this.listaOrdenesCompra.length == 0)
          this._toastr.warning("No se encontro la orden de compra", "Adventencia !!", { timeOut: 2000, closeButton: true })
      }
    );
  }

  AbrirAnalisis(modal: NgbModal, controlNumero: string,  secuencia: number)
  {

    let itemSeleccionado = this.listaOrdenesCompra.find( x => x['controlNumero'] == controlNumero && x['secuencia'] == secuencia)

    if (itemSeleccionado['loteAprobado'] == undefined || itemSeleccionado['loteAprobado']  == ""){

      this.cargandoCantidadFlexion = true;

      this.formRegristrarAnalisis.reset({
        controlNumero: controlNumero,
        secuencia: secuencia,
        item: itemSeleccionado['item'],
        descripcionItem: itemSeleccionado['descripcionItem'],
        cantidadRecibida: itemSeleccionado['cantidadRecibida'],
        cantidadPruebas: 0,
        fechaVencimiento: new Date().toISOString().slice(0, 10)
      });


      this._esterilizacionService.CantidadPruebasFlexionPorItem(itemSeleccionado['controlNumero'], itemSeleccionado['secuencia'])
        .subscribe((result : any) => {
          this.formRegristrarAnalisis.patchValue({cantidadPruebas: result['content']})
          this.cargandoCantidadFlexion = false;
        }, err => {
          this._toastr.error("Error al obtener la cantidad de pruebas", "Error en el servidor!!", {timeOut: 3000, closeButton: true})
          this.cargandoCantidadFlexion = false;
          this.formRegristrarAnalisis.patchValue({cantidadPruebas: 0})
        });

      this.AbrirModalRegistrarAnalisis(modal)
    }
    else
      this.ValidarLoteAnalisisCreado(controlNumero, secuencia, itemSeleccionado['loteAprobado'])
  }

  AbrirModalRegistrarAnalisis(modal:NgbModal){

    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });

  }

  RegistrarAnalisis(){

    this.spinnerGuardarAnalisis = true

    if (this.formRegristrarAnalisis.invalid || this.formRegristrarAnalisis.get('cantidadPruebas').value == 0)
    {
      this._toastr.error("El datos ingresados no son válidos","Error de datos !!", {timeOut: 3000, tapToDismiss:true})
      this.spinnerGuardarAnalisis = false
      return
    }

    const requesBody = {
      controlNumero: this.formRegristrarAnalisis.get('controlNumero').value,
      secuencia: this.formRegristrarAnalisis.get('secuencia').value,
      cantidadPruebas: this.formRegristrarAnalisis.get('cantidadPruebas').value,
      fechaVencimiento : this.formRegristrarAnalisis.get('fechaVencimiento').value,
      codUsuarioSesion: 0
    }

    this._esterilizacionService.RegistrarAnalisisAguja(requesBody).subscribe(
      (result: any) => {

        const numeroAnalisis:string = result['content']['numeroAnalisis'];
        this._toastr.success("Se registro el análisis N° " + numeroAnalisis,"Éxito !!", {tapToDismiss:true})
        this.spinnerGuardarAnalisis = false
        this.CerrarModal()
        this.AbrirModuloPruebaFlexion(numeroAnalisis)
      }, err => {
        this._toastr.error("Error al guardar el análisis", "Error en el servidor!!", {timeOut: 3000, tapToDismiss:true})
        this.spinnerGuardarAnalisis = false
      }
    );
  }

  ValidarLoteAnalisisCreado(controlNumero: string, secuencia: number, loteAnalisis: string){

    this._esterilizacionService.ValidarLoteCreado(controlNumero, secuencia).subscribe(
      result => {
        if(result['success'])
          this.AbrirModuloPruebaFlexion(loteAnalisis)
      },
      err => this._toastr.error("Error al validar el lote de analisis", "Error en el servidor!!", {timeOut: 3000, tapToDismiss:true})
    )
  }

  AbrirModuloPruebaFlexion(codigoAnalisis: string){
    this._router.navigate(['ControlCalidad', 'analisis-agujas', 'prueba-flexion', codigoAnalisis]);
  }

  CerrarModal() {
    this._modalService.dismissAll();
  }

}
