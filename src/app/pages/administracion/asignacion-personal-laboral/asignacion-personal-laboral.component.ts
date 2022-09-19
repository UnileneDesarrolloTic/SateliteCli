import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatosFormatoAreaPersonalModel } from '@data/interface/Response/DatosFormatoContarAreaPersonal.inteface';
import { DatosFormatoFiltrarAreaPersona } from '@data/interface/Response/DatosFormatoFiltrarAreaPersona.interface';
import { DatosFormatoListarLicitaciones } from '@data/interface/Response/DatosFormatoListarLicitaciones.interface';
import { DatosFormatoPersonaLaboralModel } from '@data/interface/Response/DatosFormatoPersonaLaboralModel.interface';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  

  constructor(private _UsuarioService:UsuarioService,
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.CargarInformacionPersonalLaboral();
    this.CargarInformacionArea();
    this.filtrarArea();

    //Bloque 1d
    this.buscarnombrecompleto.pipe(debounceTime(900)).subscribe(() => {
      if(this.buscarNombre.trim() == ''){
        this.ListarPersonaLaboral=this.TemporalListarPersonaLaboral;
      }else{
        this.ListarPersonaLaboral=this.TemporalListarPersonaLaboral.filter(x=>x.nombreCompleto.toLowerCase().indexOf(this.buscarNombre.toLowerCase().trim()) !== -1);
      }
    });

    //Bloque 2 
    this.buscarPersonaAgregado.pipe(debounceTime(900)).subscribe(() => {
      if(this.buscarpersonaArea.trim() == ''){
        this.ListarFiltrarAreaPersona=this.TemporalListarFiltrarAreaPersona;
      }else{
        this.ListarFiltrarAreaPersona=this.TemporalListarFiltrarAreaPersona.filter(x=>x.nombreCompleto.toLowerCase().indexOf(this.buscarpersonaArea.toLowerCase().trim()) !== -1);
      }
    });
  }

   //Bloque 1
  filtroNombreCompleto(){
    this.buscarnombrecompleto.next();
  }

  //Bloque 2
  filtroNombreCompletoAgregado(){
    this.buscarPersonaAgregado.next();
  }


  CargarInformacionPersonalLaboral(){
    this._UsuarioService.ListarPersonalLaboral().subscribe(
      (resp:any)=>{
        this.ListarPersonaLaboral=resp["personalLaboral"];
        this.TemporalListarPersonaLaboral=resp["personalLaboral"];
        this.ListarAreaContar=resp["contarArea"];
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
    if(this.idAreaPersonalFiltrada!="0"){
      this._UsuarioService.FiltrarAreaPersona(this.idAreaPersonalFiltrada).subscribe(
        (resp:any)=>{
            this.ListarFiltrarAreaPersona=resp;
            this.TemporalListarFiltrarAreaPersona=resp; 
        }
      )
    } 
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

}
