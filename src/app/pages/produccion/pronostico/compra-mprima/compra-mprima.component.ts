import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compra-mprima',
  templateUrl: './compra-mprima.component.html',
  styleUrls: ['./compra-mprima.component.css']
})
export class CompraMPrimaComponent implements OnInit {
  formularioPeriodo:FormGroup;
  anio=new Date().getFullYear();

  constructor(private _modalService: NgbModal, private _fb: FormBuilder) { }
  ListarMeses=[
    {"codigo":`${this.anio}01`,"Descripcion":"ENERO"},
    {"codigo":`${this.anio}02`,"Descripcion":"FEBRERO"},
    {"codigo":`${this.anio}03`,"Descripcion":"MARZO"},
    {"codigo":`${this.anio}04`,"Descripcion":"ABRIL"},
    {"codigo":`${this.anio}05`,"Descripcion":"MAYO"},
    {"codigo":`${this.anio}06`,"Descripcion":"JUNIO"},
    {"codigo":`${this.anio}07`,"Descripcion":"JULIO"},
    {"codigo":`${this.anio}08`,"Descripcion":"AGOSTO"},
    {"codigo":`${this.anio}09`,"Descripcion":"SEPTIEMBRE"},
    {"codigo":`${this.anio}10`,"Descripcion":"OCTUBRE"},
    {"codigo":`${this.anio}11`,"Descripcion":"NOVIEMBRE"},
    {"codigo":`${this.anio}12`,"Descripcion":"DICIEMBRE"},

  ]



  ngOnInit(): void {
    this.formularioPeriodo =  this._fb.group({
      periodo: ['', Validators.required],
    })

    console.log();

  }



  filtrarPeriodo(){
    console.log(this.formularioPeriodo.value)
  }




}
