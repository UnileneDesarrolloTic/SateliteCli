import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosClasificacionArea } from '@data/interface/Response/ClasificacionArea.interface';
import { DatosFormatoAreaPersonalModel } from '@data/interface/Response/DatosFormatoContarAreaPersonal.inteface';
import { DatosFormatoFiltrarAreaPersona } from '@data/interface/Response/DatosFormatoFiltrarAreaPersona.interface';
import { DatosFormatoListarLicitaciones } from '@data/interface/Response/DatosFormatoListarLicitaciones.interface';
import { DatosFormatoPersonaLaboralModel } from '@data/interface/Response/DatosFormatoPersonaLaboralModel.interface';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ModalAsistenciaPersonaComponent } from './modal-asistencia-persona/modal-asistencia-persona.component';

@Component({
  selector: 'app-asignacion-personal-laboral',
  templateUrl: './asignacion-personal-laboral.component.html',
  styleUrls: ['./asignacion-personal-laboral.component.css']
})
export class AsignacionPersonalLaboralComponent implements OnInit {
  MaestroSeleccion: boolean;
  ListarPersonaLaboral:DatosFormatoPersonaLaboralModel[]=[];
  TemporalListarPersonaLaboral:DatosFormatoPersonaLaboralModel[]=[];
  ListarAreaContar:DatosFormatoAreaPersonalModel[]=[];
  tempListarAreaContar:DatosFormatoAreaPersonalModel[]=[];
  cantidadAsistio:number = 0;
  cantidadFalto:number = 0;
  cantidadVacaciones:number = 0;
  cantidadPermiso:number = 0;
  cantidadInjustificado:number = 0;
  flagMostrarboton:boolean = false;
  ListarArea:any[]=[];
  ListarFiltrarAreaPersona:DatosFormatoFiltrarAreaPersona[]=[];
  TemporalListarFiltrarAreaPersona:DatosFormatoFiltrarAreaPersona[]=[];

  SeleccionArrayListar: any;
  botonestado:boolean=true;
  
  buscarnombrecompleto = new Subject<string>();
  buscarNombre:string="";
  idAreaPersonal:string="0";

  buscarPersonaAgregado = new Subject<string>();
  buscarpersonaArea:string="";
  idAreaPersonalFiltrada:string="0";
  idAreaClasificacion = new FormControl(0);
  
  FormRangoFechas: FormGroup;
  listadoClasificacionArea: DatosClasificacionArea[] = []

  constructor(private _UsuarioService:UsuarioService,
              private toastr: ToastrService,
              private modalService: NgbModal,
              private _GenericoServices: GenericoService,
              private servicebase64:Cargarbase64Service) { }

  ngOnInit(): void {
    this.CrearFormula();
    this.CargarInformacionPersonalLaboral();
    this.CargarInformacionArea();
    this.filtrarArea();
    this.clasificacionAreas();
    this.filtrarClasificacionArea();
    this.permisoBoton();
    
    //Bloque 1d
    this.buscarnombrecompleto.pipe(debounceTime(900)).subscribe(() => {
      if(this.buscarNombre.trim() == ''){
        this.ListarPersonaLaboral=this.TemporalListarPersonaLaboral;
      }else{
        this.ListarPersonaLaboral=this.TemporalListarPersonaLaboral.filter(x=>x.nombreCompleto.toLowerCase().indexOf(this.buscarNombre.toLowerCase().trim()) !== -1);
      }
    });

  } 

  filtrarClasificacionArea(){
    this.idAreaClasificacion.valueChanges.subscribe((valor)=>{
      this.ListarAreaContar = this.tempListarAreaContar.filter((element:DatosFormatoAreaPersonalModel)=> (valor == 0) ? element.idClasificacionArea != 0 : element.idClasificacionArea == valor);
      this.cantidadAsistio = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.asistio ).reduce((a, b) => a + b, 0);
      this.cantidadFalto = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.falto ).reduce((a, b) => a + b, 0);
      this.cantidadVacaciones = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.vacaciones ).reduce((a, b) => a + b, 0);
      this.cantidadPermiso = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.permisos ).reduce((a, b) => a + b, 0);
      this.cantidadInjustificado = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.injustificados ).reduce((a, b) => a + b, 0);

      console.log(this.cantidadInjustificado);
    });
  }

  mostrarPersonaFaltante(areaFila:DatosFormatoAreaPersonalModel){
    const modalAsistencia = this.modalService.open(ModalAsistenciaPersonaComponent, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      windowClass: 'my-class',
      size: 'lg',
      scrollable: true,
      keyboard: false
      
    });

    modalAsistencia.componentInstance.areaFila = areaFila;
    modalAsistencia.result.then((result) => {
    }, (reason: any) => {
    });
  }

   //Bloque 1
  filtroNombreCompleto(){
    this.buscarnombrecompleto.next();
  }

  clasificacionAreas(){
    this._GenericoServices.clasificacionArea().subscribe(
        (resp:any)=>{
            this.listadoClasificacionArea = resp["content"];
        }
    )
  }

  CrearFormula(){
    this.FormRangoFechas = new FormGroup({
      fechainicio: new FormControl(''),
      fechafinal: new FormControl('')
    })
  }

  CargarInformacionPersonalLaboral(){
    this._UsuarioService.ListarPersonalLaboral().subscribe(
      (resp:any)=>{
        this.ListarPersonaLaboral=resp["personalLaboral"];
        this.TemporalListarPersonaLaboral=resp["personalLaboral"];
        this.ListarAreaContar=resp["contarArea"];
        this.tempListarAreaContar=resp["contarArea"];

        this.cantidadAsistio = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.asistio ).reduce((a, b) => a + b, 0);
        this.cantidadFalto = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.falto ).reduce((a, b) => a + b, 0);
        this.cantidadVacaciones = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.vacaciones ).reduce((a, b) => a + b, 0);
        this.cantidadPermiso = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.permisos ).reduce((a, b) => a + b, 0);
        this.cantidadInjustificado = this.ListarAreaContar.map((element:DatosFormatoAreaPersonalModel)=> element.injustificados ).reduce((a, b) => a + b, 0);

      }
    );
  }

  CargarInformacionArea(){
      this._UsuarioService.ListarPersonalArea().subscribe(
        (resp:any)=>{
          this.ListarArea=resp;
        }
      );
  }

  checkTodo() {
    for (var i = 0; i < this.ListarPersonaLaboral.length; i++) {
        this.ListarPersonaLaboral[i].isSelected=this.MaestroSeleccion;
    }
    this.SeleccionaTodo();
  }

  SeleccionaTodo() {
    this.SeleccionArrayListar=[];
    for (var i = 0; i < this.ListarPersonaLaboral.length; i++) {
     
      if (this.ListarPersonaLaboral[i].isSelected){
        this.SeleccionArrayListar.push({ idPersona : this.ListarPersonaLaboral[i].idEmpleado });
      }
        
     }
     this.SeleccionArrayListar.length > 0 ? this.botonestado=false : this.botonestado=true;
         
  }


  SeleccionaItem(rowItem:DatosFormatoPersonaLaboralModel){
    this.SeleccionArrayListar=[];

    for (var i = 0; i < this.TemporalListarPersonaLaboral.length; i++) {
        if(this.TemporalListarPersonaLaboral[i].idEmpleado==rowItem.idEmpleado && this.TemporalListarPersonaLaboral[i].idEmpleado==rowItem.idEmpleado){
          this.TemporalListarPersonaLaboral[i].isSelected=rowItem.isSelected;
        }
    }

    for (var i = 0; i < this.TemporalListarPersonaLaboral.length; i++) {
      if (this.TemporalListarPersonaLaboral[i].isSelected){
        this.SeleccionArrayListar.push({ idPersona : this.TemporalListarPersonaLaboral[i].idEmpleado });
      }
    }

    this.SeleccionArrayListar.length > 0 ? this.botonestado=false : this.botonestado=true;
  }

  Guardar(){
    if(this.idAreaPersonal=="0"){
        this.toastr.warning("Por favor deben seleccionar el Area");
        return ;
    }
    const DatosConst={
      ListaPersona:this.SeleccionArrayListar,
      IdArea:parseInt(this.idAreaPersonal)
    }
      this._UsuarioService.RegistrarPersonaMasiva(DatosConst).subscribe(
        (resp:any)=>{
          if (resp["success"])  {
              this.toastr.success(resp["content"]); 
              this.CargarInformacionPersonalLaboral();
              this.filtrarArea();
            }else{
                this.toastr.info(resp["content"]);
            }
            this.ListarPersonaLaboral=[];
            this.TemporalListarPersonaLaboral=[];
            this.SeleccionArrayListar=[];
            this.buscarNombre="";
            this.MaestroSeleccion=false;
            this.botonestado=true;
        },
        error=>{
            this.toastr.info(error.menssage);
        }
      )
  }

  filtrarArea(){
      this._UsuarioService.FiltrarAreaPersona(this.idAreaPersonalFiltrada,this.buscarpersonaArea).subscribe(
        (resp:any)=>{
            this.ListarFiltrarAreaPersona=resp;
            this.TemporalListarFiltrarAreaPersona=resp; 
        }
      )
    
  }

  LiberalPersona(fila){
      this._UsuarioService.LiberalPersona(fila.idAsignacion).subscribe(
        (resp:any)=>{
          if (resp["success"])  {
            this.toastr.success(resp["content"]); 
            this.CargarInformacionPersonalLaboral();
            this.filtrarArea();
          }else{
            this.toastr.info(resp["content"]);
          } 
        }
      );
  }

  ExportarExcel(){

      if(this.FormRangoFechas.controls.fechafinal.value < this.FormRangoFechas.controls.fechainicio.value){
           return this.toastr.warning("La fecha final deber ser mayor que la fecha inicio")
      }

      const ModalCarga = this.modalService.open(ModalCargarComponent, {
        centered: true,
        backdrop: 'static',
        size: 'sm',
        scrollable: true
      });
      ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";

      this._UsuarioService.ExportarExcelPersonaAsignacion(this.FormRangoFechas.controls.fechainicio.value,this.FormRangoFechas.controls.fechafinal.value)
      .subscribe( (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`ReporteAsignacion ${this.FormRangoFechas.controls.fechainicio.value} - ${this.FormRangoFechas.controls.fechafinal.value}`,'.xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      },
      (error)=>{
        ModalCarga.close();
      }
      )
  }


  recibirMensaje(respuesta:boolean){
      if(respuesta){
          this.CargarInformacionArea();
          this.CargarInformacionPersonalLaboral();
      }
  }

  RefrescarInformacion(respuesta:boolean){
      if(respuesta) {
        this.CargarInformacionPersonalLaboral();
        this.CargarInformacionArea();
        this.ListarFiltrarAreaPersona=[];
        this.TemporalListarFiltrarAreaPersona=[]; 
        this.idAreaPersonal="0";
      }
          
  }

  permisoBoton(){
    this._GenericoServices.AccesosPermiso('BTN003').subscribe(
      (resp:any)=>{
          if(resp["success"])
              this.flagMostrarboton = !resp["content"];
          else
              this.flagMostrarboton = false;
      }
    )
  }

 

}
