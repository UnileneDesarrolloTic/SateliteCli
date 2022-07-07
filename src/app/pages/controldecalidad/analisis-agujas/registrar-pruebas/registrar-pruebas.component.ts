import { FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-pruebas',
  templateUrl: './registrar-pruebas.component.html',
  styleUrls: ['./registrar-pruebas.component.css']
})
export class RegistrarPruebasComponent implements OnInit {

  private codAnalisis:string ="";
  pruebaFlexionForm: FormArray;

  constructor(private _activatedRoute : ActivatedRoute, private router: Router)
  {
    this._activatedRoute.params.subscribe( param => this.codAnalisis = param['codAnalisis'])
  }

  ngOnInit(): void {
    this.router.navigate(['ControlCalidad/analisis-agujas/pruebas-agujas', this.codAnalisis, 'PruebaDimensional', this.codAnalisis], { skipLocationChange: true });

  }

  InicialiazarFormularios()
  {
    this.pruebaFlexionForm = new FormArray([]);
  }

}
