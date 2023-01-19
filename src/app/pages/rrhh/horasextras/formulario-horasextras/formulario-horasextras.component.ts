import { formatDate } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosFormatoCabeceraHoraExtras } from '@data/interface/Response/DatosFormatoCabeceraHorasExtras.interfaces';
import { DatosFormatoDetalleHoraExtras } from '@data/interface/Response/DatosFormatoDetalleHorasExtras.interfaces';
import { PersonaRelacionaArea } from '@data/interface/Response/DatosFormatoPersonaRespArea.interfaces';
import { DatosFormatoPersonaTecnico } from '@data/interface/Response/DatosFormatoPersonaTecnica.interfaces';
import { RRHHService } from '@data/services/backEnd/pages/rrhh.service';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogIn } from 'angular-feather/icons';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ListarPersonaComponent } from '../listar-persona/listar-persona.component';

@Component({
  selector: 'app-formulario-horasextras',
  templateUrl: './formulario-horasextras.component.html',
  styleUrls: ['./formulario-horasextras.component.css']
})
export class FormularioHorasextrasComponent implements OnInit {

  hoy = new Date();
  subcripcion: Subscription;
  codigo:string="";
  
  HorasExtrasCabecera:DatosFormatoCabeceraHoraExtras;
  HorasExtrasDetalle:DatosFormatoDetalleHoraExtras[]=[];
  flagDescargarLista:boolean=false;

  constructor(private _UsuarioService:UsuarioService, private _fb:FormBuilder, private _router: Router,
              private modalService: NgbModal, private activeroute: ActivatedRoute, private _RRHHService:RRHHService,
              private toastr: ToastrService) 
  { 
    this.subcripcion = this.activeroute.params.subscribe(params => {
      this.codigo = params["Codigo"];
    });
  }

  ListarArea:Object[]=[];
  CrearFormulario: FormGroup;

  ngOnInit(): void {
    this.cargarInformacionArea();
    this.creacionFormulario();
    this.isObservableArea();
    
    if(this.codigo=="Nuevo"){
      this.CrearFormulario.controls.Estado.disable(); 
    }else{
      this.encontrarHorasExtras(this.codigo);
    }
  }

  ngOnDestroy() {
    this.subcripcion.unsubscribe();
  }


  creacionFormulario(){
      this.CrearFormulario =  new FormGroup({
        idCodigo:new FormControl(0),
        Area:new FormControl(null,Validators.required),
        FechaRegistro: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
        Persona: new FormControl('O',Validators.required),
        Justificacion: new FormControl('',Validators.required),
        Estado: new FormControl('GE'),
        ListaPersona: this._fb.array([])
      })
  }

  isObservableArea(){
    this.CrearFormulario.get('Area').valueChanges.subscribe((valorArea)=>{
        if(this.codigo=="Nuevo")
          this.filtrarAreaPersonal(valorArea);
    })
  }

  cargarInformacionArea(){
    this._UsuarioService.ListarPersonalArea().subscribe(
      (resp:any)=>{
        this.ListarArea=resp;
      }
    );
  }

  filtrarAreaPersonal(valorArea:number){
    this._UsuarioService.ListarPersonaPorArea(valorArea).subscribe(
      (resp:any)=>{
          this.tablaListarPersonal(resp);
      }
    );
  }

  encontrarHorasExtras(Codigo){
    this._RRHHService.InformacionHorasExtrasCabecera(Codigo).subscribe(
      (resp:any) => 
      {
          this.HorasExtrasCabecera=resp["cabecera"];
          this.HorasExtrasDetalle=resp["detalle"];

          this.CrearFormulario.patchValue({
            idCodigo:this.HorasExtrasCabecera.idCabecera,
            Area:this.HorasExtrasCabecera.idArea,
            FechaRegistro:formatDate(new Date(this.HorasExtrasCabecera.fechaRegistro), 'yyyy-MM-dd', 'en') ,
            Persona:this.HorasExtrasCabecera.tipoPersona,
            Justificacion: this.HorasExtrasCabecera.justificacion,
            Estado:this.HorasExtrasCabecera.estado
          });

          if(this.CrearFormulario.controls.Estado.value=='AP')
            this.CrearFormulario.controls.Estado.disable();
          
          this.tablaListarPersonalModificacion(this.HorasExtrasDetalle)
      }
    )
  }

  tablaListarPersonalModificacion(HorasExtrasDetalle:DatosFormatoDetalleHoraExtras[]){
    const ArrayArea = this.CrearFormulario.controls.ListaPersona as FormArray;
    ArrayArea.controls=[];

    HorasExtrasDetalle.forEach((elementArea:DatosFormatoDetalleHoraExtras)=>{
        const PersonaFormArray= this._fb.group({
          persona:elementArea.idPersona,
          nombreCompleto:elementArea.nombrePersona,
          documento:elementArea.documento,
          horasextras:[elementArea.horasextras, Validators.required]
        });

        this.listadoPersonal.push(PersonaFormArray);
    })
  }

  tablaListarPersonal(Listar:PersonaRelacionaArea[]){
    const ArrayArea = this.CrearFormulario.controls.ListaPersona as FormArray;
    ArrayArea.controls=[];

    Listar.forEach((elementArea:PersonaRelacionaArea)=>{
        const PersonaFormArray= this._fb.group({
          persona: [elementArea.persona],
          nombreCompleto: [elementArea.nombreCompleto],
          documento: [elementArea.documento],
          horasextras: [0, Validators.required]
        })

        this.listadoPersonal.push(PersonaFormArray);
    })
  }

  get listadoPersonal() {
    return this.CrearFormulario.controls['ListaPersona'] as FormArray;
  }

  formarrayPersonal() {
    return this.CrearFormulario.controls.ListaPersona as FormArray;
  }

  eliminarPersonal(index:number){

    if(this.HorasExtrasCabecera!=undefined)
      if (this.HorasExtrasCabecera.estado !== 'AG')
        return this.toastr.warning("Solo se puede modificar cuando se encuentre en estado 'Generado'", "Advertencia !!", {progressBar: true, timeOut: 3000, closeButton: true, tapToDismiss: true});

    this.formarrayPersonal().removeAt(index);
  }

  get estadoSolicitud ()
  {
    return this.HorasExtrasCabecera?.estado ?? 'GE'
  }

  AgregarPersona()
  {
    console.log(this.estadoSolicitud);
    
    if(this.estadoSolicitud != 'GE')
        return this.toastr.warning("La solicitud solo se puede modificar, cuando esta en estado 'GENERADO'", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});
    
    const modalRefAgregarPersona = this.modalService.open(ListarPersonaComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xl',
			scrollable: true,
			keyboard: false
		});

    modalRefAgregarPersona.result.then((listado) => {
		
      listado.forEach((element:DatosFormatoPersonaTecnico)=>{
        const PersonaFormArray= this._fb.group({
          persona:element.idEmpleado,
          nombreCompleto:element.nombreCompleto,
          documento:element.documento,
          horasextras:[0, [Validators.required, Validators.min(0.1)]]
        })
        
        this.listadoPersonal.push(PersonaFormArray);
      })
		});

  }

  Guardar(){

      if(this.estadoSolicitud != 'GE')
        return this.toastr.warning("La solicitud solo se puede modificar, cuando esta en estado 'GENERADO'", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});
      
      let rpta:boolean=true;

      if(this.HorasExtrasCabecera!=undefined)
        if(this.HorasExtrasCabecera.estado=='AP')
          return this.toastr.warning("No puede modificar,ya que se encuentra en estado APROBADO", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});

      if(this.CrearFormulario.controls.Area.invalid)
        return this.toastr.warning("Debe seleccionar el Area", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});

      if(this.CrearFormulario.controls.Persona.invalid)
        return this.toastr.warning("Debe seleccionar la Persona", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});

      // if((!simbolo) && (!this.CrearFormulario.controls.Periodo.invalid))
      //   return this.toastr.warning("Ingrese bien el formato Correcto: YYYY-MM ", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});

      if(this.CrearFormulario.controls.ListaPersona.invalid)
        return this.toastr.warning("Debe Completar los campos en blanco", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});

      if(this.CrearFormulario.controls.Justificacion.invalid)
        return this.toastr.warning("Debe ingresar la justificación", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});

      if(this.CrearFormulario.controls.ListaPersona.value.length == 0)
        return this.toastr.warning("Debe Agregar Personas a la Lista", "Advertencia", {timeOut: 1500, closeButton: true, tapToDismiss: true, progressBar: true});
      

      const dato={
          ...this.CrearFormulario.value,
          Area:parseInt(this.CrearFormulario.controls.Area.value),
          Estado:this.CrearFormulario.controls.Estado.value
      }
      
      if (this.CrearFormulario.controls.Estado.value=='AP'){
        rpta = confirm("¿Esta seguro que desea APROBAR?");
      }
     
      this.flagDescargarLista=true;

      if(rpta){
            this._RRHHService.RegistrarHoraExtras(dato).subscribe(
              resp =>{
                  if(resp["success"]){
                    this.flagDescargarLista=false;
                    this.toastr.success(resp['content'], 'Éxito !!', {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
                    this._router.navigate(['RRHH', 'HorasExtras']);
              }},
              error=>{
                    this.flagDescargarLista=false;
                }
            );
      }
  }

  cancelar(){

    if(!this.flagDescargarLista)    
      this._router.navigate(['RRHH', 'HorasExtras']);
  }
}
