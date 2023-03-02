import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrdenCompraPrevio } from '@data/interface/Response/OCDrogueria/DatosFormatoOrdenCompraPrevio.interface';
import { DetalleOrdenCompraP, OrdeCompraSimulada } from '@data/interface/Response/OCDrogueria/DatosFormatoVisualizarOCSimulacion';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';

@Component({
  selector: 'app-modal-orden-compra-previo',
  templateUrl: './modal-orden-compra-previo.component.html',
  styleUrls: ['./modal-orden-compra-previo.component.css']
})  
export class ModalOrdenCompraPrevioComponent implements OnInit {
  @Input() ordenCompra: OrdenCompraPrevio;
  informacionOrdenCompra:OrdeCompraSimulada;
  form:FormGroup;
  desactivarInput:boolean=true;
  constructor(private _ProduccionService:ProduccionService , public activeModal: NgbActiveModal, public fb : FormBuilder) { 
    
  }

  ngOnInit(): void {
    this.crearFormulario();
    this._ProduccionService.visualizarOrdenCompraPrevios(this.ordenCompra.proveedor).subscribe(
      (resp:any)=>{
        this.informacionOrdenCompra= resp;
        this.form.patchValue({
          codigo: this.informacionOrdenCompra.cabecera.Proveedor,
          fecha: this.formatoFecha(this.informacionOrdenCompra.cabecera.FechaPreparacion),
          estado: this.informacionOrdenCompra.cabecera.Estado,
          persona: this.informacionOrdenCompra.cabecera.Proveedor,
          proveedor: this.informacionOrdenCompra.cabecera.DescripcionProveedor,
          montoTotal: this.informacionOrdenCompra.cabecera.MontoTotal,
          moneda: this.informacionOrdenCompra.cabecera.MonedaCodigo,
          procedencia:  this.informacionOrdenCompra.cabecera.Procedencia
        })
        
        this.construirDetalle(this.informacionOrdenCompra.detalle)
      }
    )
  }

  crearFormulario(){
    this.form = new FormGroup({
        codigospring : new FormControl(null, Validators.required),
        codigo: new FormControl(null),
        fecha: new FormControl(null),
        estado: new FormControl(null),
        persona: new FormControl(0),
        proveedor: new FormControl(null),
        montoTotal: new FormControl(0),
        moneda: new FormControl(null),
        procedencia: new FormControl(null),
        detalle: this.fb.array([])
    })
  }

  construirDetalle(detalle:DetalleOrdenCompraP[]){

    const detalleproducto = this.form.controls["detalle"] as FormArray;
    detalleproducto.controls = [];

    detalle.forEach((elemento:DetalleOrdenCompraP)=>{
      const ItemFilaForm = this.fb.group({
          proveedor: elemento.proveedor,
          secuencia:elemento.Secuencia,
          item: elemento.Item,
          descripcion: elemento.Descripcion,
          presentacion: elemento.Presentacion,
          cantidadpedida: elemento.CantidadPedida,
          preciounitario: elemento.PrecioUnitario,
          montototal: elemento.MontoTotal,
          moneda: elemento.Moneda,
          estado: elemento.Estado,
          fechaprometida: elemento.FechaPrometida
      });

      this.DetalleOC.push(ItemFilaForm);
    });
  }


  get DetalleOC() {
    return this.form.controls['detalle'] as FormArray;
  }

  formatoFecha(Fecha){
    return  Fecha.split("T")[0] ;
  }

  save(){
    this.form.markAsTouched();
  }

}
