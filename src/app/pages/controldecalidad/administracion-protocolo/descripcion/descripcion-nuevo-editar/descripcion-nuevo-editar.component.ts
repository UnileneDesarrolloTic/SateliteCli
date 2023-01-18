import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { TablaAgujasDescripcionModel } from '@data/interface/Response/DatosFormatoObtenerAgujasDescripcion.interfaces';
import { TablaAgujasDescripcionNuevoModel } from '@data/interface/Response/DatosFormatoObtenerAgujasDescripcionNuevo.interfaces';
import { TablaDescripcionModel } from '@data/interface/Response/DatosFormatoTablaDescripcion.interfaces';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-descripcion-nuevo-editar',
  templateUrl: './descripcion-nuevo-editar.component.html',
  styleUrls: ['./descripcion-nuevo-editar.component.css']
})
export class DescripcionNuevoEditarComponent implements OnInit {
  FormDescripcion:FormGroup;

  @Input() ListarMarca:ProtocoloDescripcionModel[]=[];
  @Input() ListarHebra:ProtocoloDescripcionModel[]=[];
  @Input() formulario:TablaDescripcionModel;
  @Input() Tipo:boolean;
  ListarTablaAguja:TablaAgujasDescripcionModel[]=[];
  ListarTablaAgujaNuevo:TablaAgujasDescripcionNuevoModel[]=[];
  Titulo:string="";
  constructor(public activeModal: NgbActiveModal,
              private _ControlcalidadService:ControlcalidadService,
              private _fb:FormBuilder,
              private toastr: ToastrService,) { 
    this.crearformulario();
  }

  ngOnInit(): void { 

    
      if(this.Tipo){
        this.Titulo='Nuevo';
        // console.log("entre",this.formulario);
        this.FormDescripcion.get("IdDescripcion").patchValue(0);
        this.FormDescripcion.get("Marca").patchValue(null);
        this.FormDescripcion.get("Hebra").patchValue(null);
        this.FormDescripcion.get("DescripcionLocal").patchValue('');
        this.FormDescripcion.get("DescripcionIngles").patchValue('');
        this.ObtenerListadoAgujaNuevo();
      }else{
        this.Titulo='Actualizar';
        this.FormDescripcion.get("IdDescripcion").patchValue(this.formulario.iD_DESCRIPCION)
        this.FormDescripcion.get("Marca").patchValue(this.formulario.iD_MARCA);
        this.FormDescripcion.get("Hebra").patchValue(this.formulario.iD_HEBRA);
        this.FormDescripcion.get("DescripcionLocal").patchValue(this.formulario.descripcionlocal);
        this.FormDescripcion.get("DescripcionIngles").patchValue(this.formulario.descripcioningles);
        this.ObtenerListadoAgujas(this.formulario.iD_DESCRIPCION);
      }
  } 



  crearformulario(){
    this.FormDescripcion = this._fb.group({
      IdDescripcion: new FormControl(0),
      Marca : new FormControl('',Validators.required),
      Hebra: new  FormControl('',Validators.required),
      DescripcionLocal: new FormControl(''),
      DescripcionIngles: new FormControl(''),
      DetalleAgujas:this._fb.array([])
    });
  }

  save(){
        if(this.Tipo){
          this.Nuevo();
        }else{
          this.Actualizar()
        }
  }

  Nuevo(){
    this._ControlcalidadService.NuevoDescripcionDT(this.FormDescripcion.value).subscribe(
      (resp:any)=>{
        if (resp["success"]){
            this.toastr.success(resp["content"]);
            this.activeModal.close(true)
          }else{
            this.toastr.info(resp["content"]);
          } 
      }
    )
  }

  Actualizar(){
    this._ControlcalidadService.ActualizarDescripcionDT(this.FormDescripcion.value).subscribe(
      (resp:any)=>{
        if (resp["success"]){
            this.toastr.success(resp["content"]);
            this.activeModal.close(true)
          }else{
            this.toastr.info(resp["content"]);
          } 
      }
    )
  }

  ObtenerListadoAgujaNuevo(){
    this._ControlcalidadService.ListarObtenerAgujasDescripcionNuevo().subscribe(
      (resp:any)=>{
            this.ConstruirTablaAgujasNuevo(resp);
      }
    );
  }

  ConstruirTablaAgujasNuevo(ArrayTablaAgujaNuevo){
    const ArrayItem = this.FormDescripcion.controls.DetalleAgujas as FormArray;
    ArrayItem.controls = [];

    ArrayTablaAgujaNuevo.forEach(element => {
      const lessForm = this._fb.group({
        iD_AGUJA:[element.iD_AGUJA],
        descripcionaguja:[element.descripcionlocal],
        descripcionlocal:[''],
        descripcioningles:[''],
      })
      this.DetalleTablaAguja().push(lessForm);
    });
    
  }

  ObtenerListadoAgujas(idDescripcion){
    this._ControlcalidadService.ListarObtenerListadoAgujasDescripcion(idDescripcion).subscribe(
      (resp:any)=>{
            this.ListarTablaAguja=resp;
            this.ConstruirTablaAgujasActualizar(resp);
      }
    );
  }

  ConstruirTablaAgujasActualizar(ArrayTablaAguja){
    const ArrayItem = this.FormDescripcion.controls.DetalleAgujas as FormArray;
    ArrayItem.controls = [];

    ArrayTablaAguja.forEach(element => {
      const lessForm = this._fb.group({
        iD_AGUJA:[element.iD_AGUJA],
        descripcionaguja:[element.descripcionaguja],
        descripcionlocal:[element.descripcionlocal],
        descripcioningles:[element.descripcioningles],
      })
      this.DetalleTablaAguja().push(lessForm);
    });
    
  }

  

  DetalleTablaAguja() : FormArray {
    return this.FormDescripcion.get("DetalleAgujas") as FormArray
  }


  

}
