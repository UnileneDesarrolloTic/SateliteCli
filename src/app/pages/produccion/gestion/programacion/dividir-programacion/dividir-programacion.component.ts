import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.form.patchValue({
      ordenFabricacion: this.paramentros.ordenFabricacion
    })
  }

  crearFormulario() {
    this.form = new FormGroup({
      ordenFabricacion: new FormControl('',Validators.required),
      items: new FormArray([this.createDivision()])
    })
  }

  createDivision(): FormGroup {
    return this._fb.group({
      cantidad: [0,Validators.required],
      fecha: [null,Validators.required],     
    });
  }

  agregarDivision(): void {
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createDivision());
  }
  

  registrarDivisionProgramacion(){
     console.log(this.form.value);
  }

  formItemDividir():FormArray {
    return this.form.get('items') as FormArray;
  }

  eliminacionDivision(index:number) {
    const itemDividir =  this.form.get('items') as FormArray;
    itemDividir.removeAt(index);
  }

}
