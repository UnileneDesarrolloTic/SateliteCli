import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalisisAgujaService } from '@data/services/backEnd/pages/analisis-aguja.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-analisis',
  templateUrl: './registrar-analisis.component.html'
})
export class RegistrarAnalisisComponent implements OnInit {

  listaOrdenesCompra: Object[] = []
  cargandoCantidadFlexion: boolean = true
  filtroOrdenCompra: FormGroup
  formRegristrarAnalisis: FormGroup
  spinnerGuardarAnalisis: boolean = false

  constructor(private _modalService: NgbModal, private _esterilizacionService: AnalisisAgujaService, private _fb: FormBuilder, private _toastr: ToastrService,) {
    this.InicializarFormulario();
  }

  ngOnInit(): void {
    this.filtroOrdenCompra.setValue({for: '1630'})
    this.ListarOrdenCompra({for:'FOR001630'}); // eliminar al final
  }

  InicializarFormulario(){

    this.filtroOrdenCompra = this._fb.group({
      for: ['']
    });

    this.formRegristrarAnalisis = this._fb.group({
      controlNumero:[{value: '', disabled : false}, Validators.required],
      secuencia:[{value: '', disabled : false}, Validators.required],
      item:[{value: '', disabled : false}, Validators.required],
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

    if (itemSeleccionado['analisis'] == undefined || itemSeleccionado['analisis']  == ""){

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
          this._toastr.error("Error al obtener la cantidad de pruebas", "Error en el servidor!!", {timeOut: 3000})
          this.cargandoCantidadFlexion = false;
          this.formRegristrarAnalisis.patchValue({cantidadPruebas: 0})
        });

      this.AbrirModalRegistrarAnalisis(modal)
    }
    else {
      console.log("SI TIENE ANALISIS")
    }
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
      this._toastr.error("El datos ingresados no son válidos","Error de datos !!")
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
        this._toastr.success("Se registro el análisis N° " + result['content']['numeroAnalisis'],"Éxito !!", {timeOut: 3000})
        this.spinnerGuardarAnalisis = false
        this.CerrarModal();
        this.ListarOrdenCompra(this.filtroOrdenCompra.value) // eliminar al final
      }, err => {
        this._toastr.error("Error al guardar el análisis", "Error en el servidor!!", {timeOut: 3000})
        this.spinnerGuardarAnalisis = false
      }
    );

  }

  CerrarModal() {
    this._modalService.dismissAll();
  }

}
