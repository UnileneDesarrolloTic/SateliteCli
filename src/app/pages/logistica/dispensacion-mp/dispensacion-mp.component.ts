import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dispensacion-mp',
  templateUrl: './dispensacion-mp.component.html',
  styleUrls: ['./dispensacion-mp.component.css']
})
export class DispensacionMpComponent implements OnInit {
  listLote:any=[{
    lote: 20203563,
    ordeFabricacion: 20203563,
    tipo: 'NOR',
    item: 'PSTAP00125',
    descripcion: 'Acido Poliglicoloco 3/0 MR 30',
    cantidad: 1200,
    requemiento: '30/06/2023',
    entrega: 80
  }];

  formFiltros:FormGroup;


  constructor(private _router: Router, ) { }

  ngOnInit(): void {
    this.filtroBusqueda();
  }

  filtroBusqueda(){
    this.formFiltros = new FormGroup({
      fechainicio: new FormControl(''),
      fechafinal: new FormControl(''),
      lote: new FormControl(''),
      ordenFabricacion: new FormControl(''),
      estado: new FormControl('PD'),
    })
  }

  verDispensacion(fila:any){
    this._router.navigate(['Logistica', 'Dispensacion','MateriaPrima', 'detalle', fila.lote]);
  }

}
