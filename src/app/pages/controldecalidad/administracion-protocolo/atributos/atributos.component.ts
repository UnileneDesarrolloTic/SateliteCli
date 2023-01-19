import { Component, OnInit } from '@angular/core';
import { TablaAbributoModel } from '@data/interface/Response/DatosFormatoTablaAtributos.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.css']
})
export class AtributosComponent implements OnInit {
  ListarTablaAtributos:TablaAbributoModel[]=[];
  constructor(private _ControlcalidadService:ControlcalidadService) { }

  ngOnInit(): void {
    this.ListarAtributo();
  }

  ListarAtributo(){
    this._ControlcalidadService.ListarTablaAtributo().subscribe(
      (resp:any)=>{
          // console.log(resp);
          this.ListarTablaAtributos=resp;
      }
    )
  }

}
