import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProtocoloMetodologiaModel } from '@data/interface/Response/DatosFormatoMetodologiaProtocolo.interfaces';
import { TablaPruebasModel } from '@data/interface/Response/DatosFormatoTablaPruebas.interfaces';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {
  Listarmetodologia:ProtocoloMetodologiaModel[]=[];
  ListarTablaPrueba:TablaPruebasModel[]=[];
  FiltrarPruebas:FormGroup;
  constructor(private _GenericoService:GenericoService,private _ControlcalidadService: ControlcalidadService) { }

  ngOnInit(): void {
    this.crearformulario();
    this.ListarMetodologia();
  }

  crearformulario(){
    this.FiltrarPruebas = new FormGroup({
      Metodologia:new FormControl(1)
    })
  }
  ListarMetodologia(){
    this._GenericoService.ListarMetodologia().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.Listarmetodologia=resp["content"];
        }else{
          this.Listarmetodologia=[];
        }
      }
    )
  }

  Filtrar(){
    this._ControlcalidadService.ListarTablaPrueba(this.FiltrarPruebas.controls.Metodologia.value).subscribe(
        (resp:any)=>{
              this.ListarTablaPrueba=resp
        }
    )
  }

}
