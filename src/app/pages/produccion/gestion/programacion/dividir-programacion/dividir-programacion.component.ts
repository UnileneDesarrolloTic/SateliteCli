import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramacionOperacionesOrdenFabricacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoProgramacionOperaciones.interface';
import { ProgramacionOperacionesService } from '@data/services/backEnd/pages/programacion-operaciones.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dividir-programacion',
  templateUrl: './dividir-programacion.component.html',
  styleUrls: ['./dividir-programacion.component.css']
})
export class DividirProgramacionComponent implements OnInit {
  @Input() paramentros: ProgramacionOperacionesOrdenFabricacion;
  form: FormGroup;
  divisionProgramacion: FormArray;

  mostrarMensaje: boolean = false;
  mensaje:string = '';
  flagEspera:boolean = false;
  
  constructor(public activeModal: NgbActiveModal, 
              private _programacionOperacionesService: ProgramacionOperacionesService, 
              private _toastrService: ToastrService,
              private _fb:FormBuilder) { }

  ngOnInit(): void {
    
    this.crearFormulario();
    this.form.patchValue({
      ordenFabricacion: this.paramentros.ordenFabricacion,
      cantidadProgramada: this.paramentros.cantidadProgramada,
      lote: this.paramentros.lote
    });
  }

  crearFormulario() {
    this.form = new FormGroup({
      ordenFabricacion: new FormControl('',Validators.required),
      cantidadProgramada: new FormControl('',Validators.required),
      lote: new FormControl('',Validators.required),
      divisionProgramacion: new FormArray([])
    })
  }

  createDivision(): FormGroup {
    return this._fb.group({
      cantidad: [0,Validators.required],
    });
  }

  agregarDivision(): void {
    this.divisionProgramacion = this.form.get('divisionProgramacion') as FormArray;
    this.divisionProgramacion.push(this.createDivision());
  }
  

  registrarDivisionProgramacion(){
    this.mostrarMensaje = false;
    this.flagEspera = true;
    if(this.sumarArrayForm != this.paramentros.cantidadProgramada)
    {
      this.mostrarMensaje = true;
      this.mensaje="La cantidad programada debe ser igual que la suma de la cantidad dividida";
      return ;
    }

    const encontrarNegativo:[] = this.form.controls.divisionProgramacion.value.filter((elemento)=> elemento.cantidad <= 0);

    if(encontrarNegativo.length>0)
    {
      this.mostrarMensaje = true;
      this.mensaje="No puede ingresar cantidad menores a 1";
      return ;
    }

    const dato =
    {
      ...this.form.value,
      divisionProgramacion: this.form.controls.divisionProgramacion.value.map((elemento,index)=>({ correlactivo: index +1 , cantidad: elemento.cantidad }))
    }
    
    this._programacionOperacionesService.registrarProgramacionDivida(dato).subscribe(
      (resp:any)=>{
        if(resp["success"])
        {
          this._toastrService.success(resp["message"]);
          this.activeModal.close();
        }
        else
        {
          this._toastrService.info(resp["message"]);
        }
        this.flagEspera = false;
      },
      (_)=>this.flagEspera = false
    )
  }

  formItemDividir():FormArray {
    return this.form.get('divisionProgramacion') as FormArray;
  }

  get sumarArrayForm(){
      let sumar:[] = this.form.get('divisionProgramacion').value.map((elementosArray)=> elementosArray.cantidad);
      return sumar.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  eliminacionDivision(index:number) {
    this.formItemDividir().removeAt(index);
  }
  

}
