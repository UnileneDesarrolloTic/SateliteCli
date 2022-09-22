import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProtocoloMetodologiaModel } from '@data/interface/Response/DatosFormatoMetodologiaProtocolo.interfaces';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {
  Listarmetodologia:ProtocoloMetodologiaModel[]=[];
  FiltrarPruebas:FormGroup;
  constructor(private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    this.crearformulario();
    this.ListarMetodologia();
  }

  crearformulario(){
    this.FiltrarPruebas = new FormGroup({
      Metodologia:new FormControl('%')
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

  }

}
