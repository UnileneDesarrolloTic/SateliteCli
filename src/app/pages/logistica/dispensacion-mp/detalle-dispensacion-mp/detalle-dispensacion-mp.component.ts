import { Component, OnInit, OnDestroy, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-dispensacion-mp',
  templateUrl: './detalle-dispensacion-mp.component.html',
  styleUrls: ['./detalle-dispensacion-mp.component.css']
})
export class DetalleDispensacionMpComponent implements OnInit{
  subcripcion: Subscription;

  detalleDispensacion:any = [
    { numero: 1 , item: 'MEVISB00003', descripcion: 'SOBRE DE PAPEL', um: 'UNI', cantidadPedida: 600, cantidadEntrega: 600, requision: '0000052', estado: 'Completado'},
    { numero: 2 , item: 'MVISC00026', descripcion: 'SACHET ALUPOL CON PEEL', um: 'UNI', cantidadPedida: 608, cantidadEntrega: 608, requision: '0000052', estado: 'Completado'},
    { numero: 3 , item: 'MBNL000025', descripcion: 'BOLSA TERMOENCOGIGLE', um: 'UNI', cantidadPedida: 50, cantidadEntrega: 50, requision: '0000052', estado: 'Completado'},
    { numero: 4 , item: 'MSTMK0001', descripcion: 'CAJA VETERINARY', um: 'UNI', cantidadPedida: 50, cantidadEntrega: 0, requision: '0000052', estado: 'Pendiente'}
  ]
  formDetalle:FormGroup;
  dispensarTodo = new FormControl(false)
 

  constructor(private _fb:FormBuilder) { }

  ngOnInit(): void {
    this.formularioDetalle();
    this.observableDispensarTodo();
    this.construirTabla();
  }

  ngOnDestroy() {
    this.subcripcion?.unsubscribe();
  }

  construirTabla(){
    const ArrayItem = this.formDetalle.controls.detalleDispensacion as FormArray;
    ArrayItem.controls = [];

    this.detalleDispensacion.forEach((itemRow:any)=>{
      const ItemFilaForm = this._fb.group({
        numero: [itemRow.numero],
        item: [itemRow.item ],
        descripcion: [itemRow.descripcion],
        um: [itemRow.um],
        cantidadPedida: [itemRow.cantidadPedida],
        cantidadEntrega: [itemRow.cantidadEntrega],
        requision: [itemRow.requision],
        estado: [itemRow.estado],
      });
      this.listarDetalleDispensacion.push(ItemFilaForm);
      //ItemFilaForm.get('cantidadEntrega').valueChanges.pipe(debounceTime(500)).subscribe(resp => this.cambiarEstado());
    })

  }

  formArrayEstado(){
    console.log("sssss");
    this.formDetalle.get("detalleDispensacion").valueChanges.pipe(debounceTime(500)).subscribe((valor) => {
      this.formDetalle.controls.detalleDispensacion.value.forEach((element: any) => {
        element.estado = (element.cantidadPedida != element.cantidadEntrega) ? 'Pendiente' : 'Completado';
      })
    });
  }

  formularioDetalle(){
    this.formDetalle=new FormGroup({
      detalleDispensacion:this._fb.array([])
    })
  }

  observableDispensarTodo(){
    this.dispensarTodo.valueChanges.pipe(debounceTime(500)).subscribe(dispensar=>{
      if(dispensar == true)
      {
        this.listarDetalleDispensacion.value.forEach((element, index) => {
          this.listarDetalleDispensacion.at(index).get("cantidadEntrega").patchValue(element.cantidadPedida);
          this.listarDetalleDispensacion.at(index).get("estado").patchValue('Completado');   
        });
      }
      else
      {
        this.listarDetalleDispensacion.value.forEach((element, index) => {
          this.listarDetalleDispensacion.at(index).get("cantidadEntrega").patchValue(0);
          this.listarDetalleDispensacion.at(index).get("estado").patchValue('Pendiente');   
        });
      }
     
         
    })
  }

  get listarDetalleDispensacion(){
    return this.formDetalle.controls['detalleDispensacion'] as FormArray;
  }
  



}
