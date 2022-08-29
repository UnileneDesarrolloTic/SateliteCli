import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-seguimiento-orden-compra',
  templateUrl: './seguimiento-orden-compra.component.html',
  styleUrls: ['./seguimiento-orden-compra.component.css']
})
export class SeguimientoOrdenCompraComponent implements OnInit {
  filtrosForm: FormGroup;
  ListarSeguimientoItemOC:any[]=[];
  ListarDetalleSeguimientoItemOC:any[]=[];
  constructor(private _ProductoServices: ProduccionService) {

  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.BuscarPedido();
  }

  currentJustify = 'start';
  currentOrientation = 'horizontal';
  // tslint:disable-next-line: deprecation
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }

  inicializarFormulario() {
    this.filtrosForm = new FormGroup({
      Origen: new FormControl('TD'),
      Anio:new FormControl('2022')
    })

  }

  BuscarPedido(){
    this._ProductoServices.ListarItemOrdenCompra(this.filtrosForm.value).subscribe(
      resp=>{
          this.ListarSeguimientoItemOC=resp["calendario"];
          this.ListarDetalleSeguimientoItemOC=resp["detalleCalendario"];
      }
    );
  }

  Refrescar(valor:boolean){
    console.log("Se refresco");
    this.BuscarPedido();
  }

 

}
