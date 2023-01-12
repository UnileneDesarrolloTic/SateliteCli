import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cierre-contable',
  templateUrl: './cierre-contable.component.html',
  styleUrls: ['./cierre-contable.component.css']
})
export class CierreContableComponent implements OnInit {

  constructor(private _router: Router) { }
  textPeriodo= new FormControl('');
  
  ngOnInit(): void {
  }


  NuevoCierre(Nuevo){
    this._router.navigate(['Contabilidad', 'CierreContable',Nuevo]);
  }

}
