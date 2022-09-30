import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { TablaDescripcionModel } from '@data/interface/Response/DatosFormatoTablaDescripcion.interfaces';
import { TablaLeyendaModel } from '@data/interface/Response/DatosFormatoTablaLeyenda.interfaces';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leyenda-nuevo-editar',
  templateUrl: './leyenda-nuevo-editar.component.html',
  styleUrls: ['./leyenda-nuevo-editar.component.css']
})
export class LeyendaNuevoEditarComponent implements OnInit {
  @Input() ListarMarca:ProtocoloDescripcionModel[]=[];
  @Input() ListarHebra:ProtocoloDescripcionModel[]=[];
  @Input() formulario:TablaLeyendaModel;
  @Input() Tipo:boolean;
  Titulo:string="";
  FormularioLeyenda:FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private _ControlcalidadService:ControlcalidadService,
    private _fb:FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearFormulario();
    if(this.Tipo){
      this.Titulo='Nuevo';
      
    }else{
      this.Titulo='Actualizar';
      this.FormularioLeyenda.get("IdLeyenda").patchValue(this.formulario.iD_LEYENDA);
      this.FormularioLeyenda.get("RegistroSanitario").patchValue(this.formulario.nuM_REGISTRO);
      this.FormularioLeyenda.get("Marca").patchValue(this.formulario.iD_MARCA);
      this.FormularioLeyenda.get("Hebra").patchValue(this.formulario.iD_HEBRA);
      this.FormularioLeyenda.get("TecnicaEspaniol").patchValue(this.formulario.tecnica);
      this.FormularioLeyenda.get("TecnicaIngles").patchValue(this.formulario.tecnicA_INGLES);
      this.FormularioLeyenda.get("MetodoEspaniol").patchValue(this.formulario.metodo);
      this.FormularioLeyenda.get("MetodoIngles").patchValue(this.formulario.metodO_INGLES);
      this.FormularioLeyenda.get("DetalleEspaniol").patchValue(this.formulario.detalle);
      this.FormularioLeyenda.get("DetalleIngles").patchValue(this.formulario.detallE_INGLES);

    }
  }

  crearFormulario(){
    this.FormularioLeyenda = this._fb.group({
      IdLeyenda:new FormControl(0),
      RegistroSanitario:new FormControl('',Validators.required),
      Marca: new FormControl(null,Validators.required),
      Hebra: new  FormControl(null,Validators.required),
      TecnicaEspaniol : new FormControl(),
      TecnicaIngles: new FormControl(),
      MetodoEspaniol: new FormControl(),
      MetodoIngles: new FormControl(),
      DetalleEspaniol: new FormControl(),
      DetalleIngles: new FormControl(),
    });
  }

  save(){
      // if(this.Tipo){
      //   console.log(this.FormularioLeyenda.value);
      // }else{
      //   console.log(this.FormularioLeyenda.value);
      // }
      this._ControlcalidadService.RegistrarLeyendaDT(this.FormularioLeyenda.value).subscribe(
        (resp:any)=>{
          if (resp["success"]){
              this.toastr.success(resp["content"]);
              this.activeModal.close(true)
            }else{
              this.toastr.info(resp["content"]);
            } 
        }
      );
  }
  
  

  

}
