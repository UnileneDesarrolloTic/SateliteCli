import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ProgramacionOperacionesOrdenFabricacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoProgramacionOperaciones.interface';
import { ProgramacionOperacionesService } from '@data/services/backEnd/pages/programacion-operaciones.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dividir-programacion',
  templateUrl: './dividir-programacion.component.html',
  styleUrls: ['./dividir-programacion.component.css']
})
export class DividirProgramacionComponent implements OnInit {
  @Input() paramentros: ProgramacionOperacionesOrdenFabricacion;
  form: FormGroup;
  items: FormArray;
  constructor(public activeModal: NgbActiveModal, 
              private _programacionOperacionesService: ProgramacionOperacionesService, 
              private _toastrService: ToastrService,
              private _fb:FormBuilder) { }

  ngOnInit(): void {
    
    this.crearFormulario();
  }

  crearFormulario() {
    this.form = new FormGroup({
      items: new FormArray([])
    })
  }

  createDivision(): FormGroup {
    return this._fb.group({
      cantidad: '',
      fecha: '',     
    });
  }

  agregarDivision(): void {
    console.log("agregarDivision");
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createDivision());
  }

}
