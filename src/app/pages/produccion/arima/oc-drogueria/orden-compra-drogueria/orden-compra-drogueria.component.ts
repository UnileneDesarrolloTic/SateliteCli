import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleOrdenCompraP, OrdeCompraSimulada } from '@data/interface/Response/OCDrogueria/DatosFormatoVisualizarOCSimulacion';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-orden-compra-drogueria',
  templateUrl: './orden-compra-drogueria.component.html',
  styleUrls: ['./orden-compra-drogueria.component.css']
})
export class OrdenCompraDrogueriaComponent implements OnInit {
  subcripcion : Subscription;
  informacionOrdenCompra:OrdeCompraSimulada;
  form:FormGroup;
  desactivarInput:boolean=true;
  idProveedor:number=0;
  flagGuardado:boolean=false;

  constructor(private _router: Router,
    private activeroute:ActivatedRoute,
    private _ProduccionService:ProduccionService, 
    private _genericoService : GenericoService,
    private _toastrService: ToastrService,
    private _decimalPipe: DecimalPipe,
    public fb : FormBuilder) {

    this.subcripcion=this.activeroute.params.subscribe(params=>{
       this.idProveedor = params["Proveedor"];
    });    
   }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatos(this.idProveedor);
    this.observableFormarray();
  }


  cargarDatos(Proveedor){
    this._ProduccionService.visualizarOrdenCompraPrevios(Proveedor).subscribe(
      (resp:any)=>{
        this.informacionOrdenCompra= resp;
        this.form.patchValue({
          codigo: this.informacionOrdenCompra.cabecera.Proveedor,
          fecha: this.formatoFecha(this.informacionOrdenCompra.cabecera.FechaPreparacion),
          estado: this.informacionOrdenCompra.cabecera.Estado,
          persona: this.informacionOrdenCompra.cabecera.Proveedor,
          proveedor: this.informacionOrdenCompra.cabecera.DescripcionProveedor,
          montoTotal: parseFloat(this.transformDecimal(this.informacionOrdenCompra.cabecera.MontoTotal)),
          moneda: this.informacionOrdenCompra.cabecera.MonedaCodigo,
          procedencia:  this.informacionOrdenCompra.cabecera.Procedencia,
          fechaPrometida: this.formatoFecha(this.informacionOrdenCompra.cabecera.FechaPrometida),
          diasespera: this.informacionOrdenCompra.cabecera.DiasEspera,
          viaEnvio: this.informacionOrdenCompra.cabecera.ViaEnvio,
          incoterms:this.informacionOrdenCompra.cabecera.Incoterms,
          paisOrigen: this.informacionOrdenCompra.cabecera.PaisOrigen,
          puertoSalida: this.informacionOrdenCompra.cabecera.PuertoSalida,
        })
        this.construirDetalle(this.informacionOrdenCompra.detalle)
      }
    );
  }

  observableFormarray() {
    this.form.get("detalle").valueChanges.subscribe((valor) => {
      this.form.controls.detalle.value.forEach((element) => {
        element.montototal = parseInt(element.cantidadpedida) * element.preciounitario;
      });
      this.montototalOrdenCompra();
    });
    
  }


  crearFormulario(){
    this.form = new FormGroup({
        // codigospring : new FormControl(null, Validators.required),
        codigo: new FormControl(null),
        fecha: new FormControl(null),
        estado: new FormControl(null),
        persona: new FormControl(0),
        proveedor: new FormControl(null),
        montoTotal: new FormControl(0),
        moneda: new FormControl(null),
        procedencia: new FormControl(null),
        diasespera:new FormControl(null),
        fechaPrometida:new FormControl(null),
        detalle: this.fb.array([])
    })
  }

  construirDetalle(detalle:DetalleOrdenCompraP[]){
    const detalleproducto = this.form.controls["detalle"] as FormArray;
    detalleproducto.controls = [];

    detalle.forEach((elemento:DetalleOrdenCompraP)=>{
      const ItemFilaForm = this.fb.group({
          proveedor: elemento.Proveedor,
          secuencia:elemento.Secuencia,
          item: elemento.Item,
          descripcion: elemento.Descripcion,
          presentacion: elemento.Presentacion,
          cantidadpedida: elemento.CantidadPedida,
          preciounitario: elemento.PrecioUnitario,
          montototal: elemento.MontoTotal,
          moneda: elemento.Moneda,
          estado: elemento.Estado,
          fechaprometida: elemento.FechaPrometida,
          colorVariacion:elemento.ColorVariacion,
          idGestionarColor:elemento.IdGestionarColor
      });
      // ItemFilaForm.controls["cantidadpedida"].valueChanges.pipe(debounceTime(600)).pipe(startWith(null), pairwise()).subscribe(
      //   ([prev,next]) => this.actualizarPrecio(prev,next)
      // );
      this.detalleOC.push(ItemFilaForm);
    });
  }
  
  montototalOrdenCompra(){
    const montoGeneralDetalle = this.detalleOC.value.map(detalle => detalle.montototal);    
    const respMontoGeneralCantidad = this.sumar(montoGeneralDetalle);
    this.form.get("montoTotal").patchValue(parseFloat(this._genericoService.RedondearDecimales(respMontoGeneralCantidad,2,false)));
  }

  sumar(ArrayItem) {
    return ArrayItem.reduce((prev, curren) => prev + curren, 0);
  }
  
  get detalleOC() {
    return this.form.controls['detalle'] as FormArray;
  }

  formatoFecha(Fecha){
    return  Fecha.split("T")[0] ;
  }

  transformDecimal(num) {
    return this._decimalPipe.transform(num, `1.2-2`);
  }

  eliminar(item:any,index:number){
      let respuesta =  confirm('¿Esta seguro que desea quitar el Item?');
      if(respuesta)
          this.detalleOC.removeAt(index);
  }

  save(){
    const validarEstado = this.detalleOC.value.filter(detalle => detalle.estado=='PE').map(resultado=> resultado.estado).length;
    if(validarEstado > 0)
        return this._toastrService.warning("No debe contar con estado pendiente en el detalle");

    if(this.detalleOC.length == 0)
        return this._toastrService.warning("Debe conter aunque sea un item en la orden de compra");

    this.flagGuardado=true;

    this._ProduccionService.registrarOrdenCompraDrogueria(this.form.value).subscribe(
      (resp:any)=>{
          if(resp["success"])
          {
            this._toastrService.success(resp["message"])
            this.flagGuardado=true;
            this._router.navigate(['Produccion', 'Arima', 'CompraDrogueria'])
          }else{
            this._toastrService.info(resp["message"])
            this.flagGuardado=false
          }
      },
      _=>this.flagGuardado=false
    );
  }

  cancel(){
    this._router.navigate(['Produccion', 'Arima', 'CompraDrogueria'])
  }

  ngOnDestroy(){
    this.subcripcion.unsubscribe();
  }
}
