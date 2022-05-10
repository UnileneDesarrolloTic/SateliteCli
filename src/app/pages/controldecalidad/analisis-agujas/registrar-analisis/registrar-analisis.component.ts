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

  constructor(private _modalService: NgbModal, private _esterilizacionService: AnalisisAgujaService, private _fb: FormBuilder, private _toastr: ToastrService,) {
    this.InicializarFormulario();
  }

  ngOnInit(): void {

    this.ListarOrdenCompra({for:'FOR001630'});
  }

  InicializarFormulario(){

    this.filtroOrdenCompra = this._fb.group({
      for: ['']
    });

    this.formRegristrarAnalisis = this._fb.group({
      item:['', [Validators.required]],
      descripcionItem:['', [Validators.required]],
      cantidadRecibida:[0, [Validators.required]],
      cantidadPruebas:[0, [Validators.required]],
      fechaVencimiento: ['', [Validators.required]]
    })

    this.filtroOrdenCompra.valueChanges.pipe(debounceTime(700)).subscribe(
      filtro => this.ListarOrdenCompra(filtro)
    );

    this.formRegristrarAnalisis.controls['item'].disable();
    this.formRegristrarAnalisis.controls['descripcionItem'].disable();
    this.formRegristrarAnalisis.controls['cantidadRecibida'].disable();
    this.formRegristrarAnalisis.controls['cantidadPruebas'].disable();
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

    console.log(itemSeleccionado)

    if (itemSeleccionado['analisis'] == undefined || itemSeleccionado['analisis']  == ""){

      this.cargandoCantidadFlexion = true;

      this.formRegristrarAnalisis.reset({cantidadPruebas: 0})

      this.formRegristrarAnalisis.reset({
        item: itemSeleccionado['item'],
        descripcionItem: itemSeleccionado['descripcionItem'],
        cantidadRecibida: itemSeleccionado['cantidadRecibida'],
        fechaVencimiento: new Date().toISOString().slice(0, 10)
      });


      this._esterilizacionService.CantidadPruebasFlexionPorItem(itemSeleccionado['controlNumero'], itemSeleccionado['secuencia'])
        .subscribe((result : any) => {
          this.formRegristrarAnalisis.patchValue({cantidadPruebas: result['content']})
          this.cargandoCantidadFlexion = false;
        }, err => {
          this._toastr.error("Error al obtener la cantidad de pruebas", "Error Servidor!!", {timeOut: 3000})
          this.cargandoCantidadFlexion = false;
          this.formRegristrarAnalisis.patchValue({cantidadPruebas: 0})
        });

      console.log({itemSeleccionado})

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
    console.log('SUBMIT')
  }

  CerrarModal() {
    this._modalService.dismissAll();
  }

}
