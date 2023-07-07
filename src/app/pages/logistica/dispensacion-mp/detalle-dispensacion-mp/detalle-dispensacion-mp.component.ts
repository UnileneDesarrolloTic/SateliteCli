import { Component, OnInit, OnDestroy, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetasDispensacion } from '@data/interface/Response/Dispensacion/DatosFormatoRecetas.interface';
import { DispensacionService } from '@data/services/backEnd/pages/dispensacion.service';
import { FullComponent } from '@layout/full/full.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-dispensacion-mp',
  templateUrl: './detalle-dispensacion-mp.component.html',
  styleUrls: ['./detalle-dispensacion-mp.component.css']
})
export class DetalleDispensacionMpComponent implements OnInit{
  subcripcion: Subscription;
  ordenFabricacion:string = '';
  detalleDispensacion : RecetasDispensacion[] = [];

  // detalleDispensacion:any = [
  //   { numero: 1 , item: 'MEVISB00003', descripcion: 'SOBRE DE PAPEL', um: 'UNI', cantidadPedida: 600, cantidadEntrega: 600, requision: '0000052', estado: 'Completado'},
  //   { numero: 2 , item: 'MVISC00026', descripcion: 'SACHET ALUPOL CON PEEL', um: 'UNI', cantidadPedida: 608, cantidadEntrega: 608, requision: '0000052', estado: 'Completado'},
  //   { numero: 3 , item: 'MBNL000025', descripcion: 'BOLSA TERMOENCOGIGLE', um: 'UNI', cantidadPedida: 50, cantidadEntrega: 50, requision: '0000052', estado: 'Completado'},
  //   { numero: 4 , item: 'MSTMK0001', descripcion: 'CAJA VETERINARY', um: 'UNI', cantidadPedida: 50, cantidadEntrega: 0, requision: '0000052', estado: 'Pendiente'}
  // ]
  formDetalle:FormGroup;
  dispensarTodo = new FormControl(false)
 

  constructor(private _fb:FormBuilder,
    private _router: Router,
    private activeroute:ActivatedRoute,
    private _DispensacionService: DispensacionService,
    private _fullcomponent: FullComponent,
    private toastr: ToastrService) { 
    this._fullcomponent.options.sidebartype = 'mini-sidebar'
    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.ordenFabricacion = params["ordenFabricacion"];
    });  
   

  }

  ngOnInit(): void {
    this.listadoMateriaPrimaRecetas();
    this.formularioDetalle();
    this.observableDispensarTodo();
  }

  ngOnDestroy() {
    this.subcripcion.unsubscribe();
  }

  listadoMateriaPrimaRecetas(){
    this._DispensacionService.obtenerRecetasOrdenFabricacion(this.ordenFabricacion).subscribe(
      (resp:any)=>{
        this.detalleDispensacion = resp;
        this.construirTabla(resp);
      }
    )
  }

  construirTabla(ItemMateriaPrima:RecetasDispensacion[]){
    const ArrayItem = this.formDetalle.controls.detalleDispensacion as FormArray;
    ArrayItem.controls = [];

    ItemMateriaPrima.forEach((itemRow:RecetasDispensacion)=>{
      const ItemFilaForm = this._fb.group({
        secuencia: [itemRow.secuencia],
        documento: [itemRow.documento ],
        itemInsumo: [itemRow.itemInsumo],
        descripcionLocal: [itemRow.descripcionLocal],
        itemTipo: [itemRow.itemTipo],
        unidadCodigo: [itemRow.unidadCodigo],
        cantidadGeneral: [itemRow.cantidadGeneral],
        tipoMP: [itemRow.tipoMP],
        cantidadSolicitada: [itemRow.cantidadSolicitada],
        cantidadDespachada: [itemRow.cantidadDespachada],
        cantidadIngresada: [itemRow.cantidadIngresada],
        lote: [itemRow.lote],
        entregadoPor: [itemRow.entregadoPor],
        recibidoPor: [itemRow.recibidoPor],
      });
      this.listarDetalleDispensacion.push(ItemFilaForm);
      //ItemFilaForm.get('cantidadEntrega').valueChanges.pipe(debounceTime(500)).subscribe(resp => this.cambiarEstado());
    })

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
          this.listarDetalleDispensacion.at(index).get("cantidadIngresada").patchValue(element.cantidadSolicitada - element.cantidadDespachada);
        });
      }
      else
      {
        this.listarDetalleDispensacion.value.forEach((element, index) => {
          this.listarDetalleDispensacion.at(index).get("cantidadIngresada").patchValue(0);
        });
      }
     
         
    })
  }

  get listarDetalleDispensacion(){
    return this.formDetalle.controls['detalleDispensacion'] as FormArray;
  }
  

  guardarEntrega()
  {
    let ArrayDispensacion =  this.listarDetalleDispensacion.value.filter((element:RecetasDispensacion, index)=> element.cantidadSolicitada < (element.cantidadDespachada + element.cantidadIngresada));
    
    if (ArrayDispensacion.length > 0)
    {
      this.toastr.warning("El valor del ingreso excede a la cantidad solicitada");
    }else
    { 
        this._DispensacionService.RegistrarDispensacion(this.formDetalle.controls.detalleDispensacion.value).subscribe(
            (resp:any)=>{
                if(resp["success"])
                {
                    this.toastr.success(resp["message"]);
                    this._router.navigate(['Logistica', 'Dispensacion','MateriaPrima']);
                }
            }
        )
    }
  
  }



}
