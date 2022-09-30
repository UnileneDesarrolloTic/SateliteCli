import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalibrePruebaModel } from '@data/interface/Response/DatosFormatoCalibrePrueba.interface';
import { ProtocoloMetodologiaModel } from '@data/interface/Response/DatosFormatoMetodologiaProtocolo.interfaces';
import { TablaPruebasModel } from '@data/interface/Response/DatosFormatoTablaPruebas.interfaces';
import { AgrupadorHebrasModel } from '@data/interface/Response/DatosFormularioAgrupadorHebra.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prueba-nuevo-edit',
  templateUrl: './prueba-nuevo-edit.component.html',
  styleUrls: ['./prueba-nuevo-edit.component.css']
})
export class PruebaNuevoEditComponent implements OnInit {
  @Input() Tipo:boolean;
  @Input() Listarmetodologia: ProtocoloMetodologiaModel[]=[];
  @Input() ListarCalibrePrueba: CalibrePruebaModel[]=[];
  @Input() ListarAgrupadorHebras: AgrupadorHebrasModel[]=[];
  @Input() formulario: TablaPruebasModel;
  CrearFormularioPrueba:FormGroup;
 
  Titulo:string="";
  constructor(public activeModal: NgbActiveModal,
    private _ControlcalidadService:ControlcalidadService,
    private _fb:FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearFormulario();
    // console.log(this.ListarCalibrePrueba);
    if(this.Tipo){
        this.Titulo='Nuevo';
      
    }else{
        this.Titulo='Actualizar';
        this.CrearFormularioPrueba.get("IdMedologia").patchValue(this.formulario.iD_METODOLOGIA);
        this.CrearFormularioPrueba.get("IdAgrupadoHebra").patchValue(this.formulario.iD_AGRUPADOR_HEBRA);
        this.CrearFormularioPrueba.get("IdCalibre").patchValue(this.formulario.calibrE_USP);
        this.CrearFormularioPrueba.get("IdUnidadMedida").patchValue(this.formulario.unidaD_MEDIDA);
        this.CrearFormularioPrueba.get("valor").patchValue(this.formulario.valor);
        this.CrearFormularioPrueba.get("DescripcionLocal").patchValue(this.formulario.descripcionlocal);
        this.CrearFormularioPrueba.get("DescripcionIngle").patchValue(this.formulario.descripcioningles);
        this.CrearFormularioPrueba.get("EspecificacionLocal").patchValue(this.formulario.especifficacioningles);
        this.CrearFormularioPrueba.get("EspecificacionIngles").patchValue(this.formulario.especifficacionlocal);
    }
  }

  crearFormulario(){
    this.CrearFormularioPrueba = this._fb.group({
      IdMedologia :  new FormControl(null,Validators.required),
      IdAgrupadoHebra : new FormControl(null,Validators.required),
      IdCalibre: new FormControl('0'),
      IdUnidadMedida: new FormControl('0'),
      valor:new FormControl(''),
      DescripcionLocal: new FormControl(''),
      DescripcionIngle: new  FormControl(''),
      EspecificacionLocal: new  FormControl(''),
      EspecificacionIngles: new FormControl(''),
    })
  }




  save(){
      console.log(this.CrearFormularioPrueba.value);
  }

}
