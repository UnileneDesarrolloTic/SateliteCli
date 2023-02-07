import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModelSeguimientoDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoSeguimientoDrogueria.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';

@Component({
  selector: 'app-oc-drogueria',
  templateUrl: './oc-drogueria.component.html',
  styleUrls: ['./oc-drogueria.component.css']
})
export class OcDrogueriaComponent implements OnInit {

  listarProductoDrogueria:any;
  listarItemDrogueria:ModelSeguimientoDrogueria[]=[];
  
  checkMostrarColumna=new FormControl(false);


  constructor(private _ProduccionService:ProduccionService) { }

  ngOnInit(): void {
    this.isObservableCheck();
  } 

  isObservableCheck(){
    this.checkMostrarColumna.valueChanges.subscribe(valor=>{
          console.log(valor);
    });
  }

  reporteSeguimientoDrogueria(){
      this._ProduccionService.ReporteSeguimientoDrogueria().subscribe(
        (resp:any)=>{
            this.listarItemDrogueria=resp["content"];
        },
        error=>{ }
      )
  }
}
