import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramacionOperacionesOrdenFabricacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoProgramacionOperaciones.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro-fecha-inicio-entrega',
  templateUrl: './registro-fecha-inicio-entrega.component.html',
  styleUrls: ['./registro-fecha-inicio-entrega.component.css']
})
export class RegistroFechaInicioEntregaComponent implements OnInit {
  @Input() paramentros : ProgramacionOperacionesOrdenFabricacion;
  form:FormGroup;
  fechaActual = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');

  constructor( public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
    console.log(this.paramentros.ordenFabricacion);
    this.crearFormulario();
  }

  crearFormulario(){
    this.form = new FormGroup({
     fecha:new FormControl(null,Validators.required),
     tipoFecha: new FormControl(null,Validators.required),
     comentario: new FormControl('')
    })
  }

  registrarFecha(){
    
      const dato = {
        ...this.form.value,
        ordenFabricacion: this.paramentros.ordenFabricacion
      }
      console.log(dato);
    }

  cerrarModal(){
    this.activeModal.dismiss();
  }
}
