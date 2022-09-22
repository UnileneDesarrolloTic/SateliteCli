import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';

@Component({
  selector: 'app-descripcion-nuevo-editar',
  templateUrl: './descripcion-nuevo-editar.component.html',
  styleUrls: ['./descripcion-nuevo-editar.component.css']
})
export class DescripcionNuevoEditarComponent implements OnInit {
  FormDescripcion:FormGroup;

  @Input() Marca:ProtocoloDescripcionModel[]=[];
  @Input() Hebra:ProtocoloDescripcionModel[]=[];
  @Input() formulario;
  constructor() { }

  ngOnInit(): void {  
    
  }

  crearformulario(){
    this.FormDescripcion = new FormGroup({
      
    })
  }

  

}
