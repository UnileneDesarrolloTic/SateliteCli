import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';




@Component({
  selector: 'app-seguimiento-orden-compra',
  templateUrl: './seguimiento-orden-compra.component.html',
  styleUrls: ['./seguimiento-orden-compra.component.css']
})
export class SeguimientoOrdenCompraComponent implements OnInit {
  filtrosForm: FormGroup;
  ListarSeguimientoItemOC:any[]=[];
  ListarDetalleSeguimientoItemOC:any[]=[];
  PermisoAcceso:boolean=false;
  constructor(private _ProductoServices: ProduccionService,
              private _GenericoService : GenericoService) {

  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.accesosPermiso();
    this.isObservableAnio();
    this.filtrar()
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
      Anio:new FormControl('2023'),
    });
  }

  filtrar(){
    this.buscarPedido(this.filtrosForm.controls.Anio.value);
  }

  buscarPedido(Anio){
    this._ProductoServices.ListarItemOrdenCompra(Anio).subscribe(
      resp=>{
          this.ListarSeguimientoItemOC=resp["calendario"];
          this.ListarDetalleSeguimientoItemOC=resp["detalleCalendario"];
      }
    );
  }


  isObservableAnio(){
    this.filtrosForm.controls.Anio.valueChanges.subscribe((valor)=>{
        this.buscarPedido(valor);
    })
  }

  accesosPermiso(){
    this._GenericoService.AccesosPermiso('BTN0001').subscribe(
      (resp:any)=>{
          this.PermisoAcceso=resp["content"];
      }
    );
  }

  Refrescar(valor:boolean){
    this.buscarPedido(this.filtrosForm.controls.Anio.value);
  }

 

}
