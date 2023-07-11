import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HistorialProgramacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoHistorialProgramacion';
import { ProgramacionOperacionesOrdenFabricacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoProgramacionOperaciones.interface';
import { ProgramacionOperacionesService } from '@data/services/backEnd/pages/programacion-operaciones.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-fecha-inicio-entrega',
  templateUrl: './registro-fecha-inicio-entrega.component.html',
  styleUrls: ['./registro-fecha-inicio-entrega.component.css']
})
export class RegistroFechaInicioEntregaComponent implements OnInit {
  @Input() paramentros : ProgramacionOperacionesOrdenFabricacion;
  form:FormGroup;
  fechaActual = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  listadoFechaProgramacion: HistorialProgramacion[] = [];

  constructor( public activeModal: NgbActiveModal,  private _programacionOperacionesService: ProgramacionOperacionesService,  private _toastrService: ToastrService,) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.form.patchValue({
      fechaInicio: this.paramentros.fechaProgramadaInicio == null ? null : formatDate(this.paramentros.fechaProgramadaInicio, 'yyyy-MM-dd', 'en'),
      fechaEntrega: this.paramentros.fechaEntrega == null ? null : formatDate(this.paramentros.fechaEntrega, 'yyyy-MM-dd', 'en')
    })
  }

  crearFormulario(){
    this.form = new FormGroup({
     fechaInicio:new FormControl(null),
     tipoFechaInicio: new FormControl('I'),
     fechaEntrega:new FormControl(null),
     tipoFechaEntrega: new FormControl('E'),
     comentarioInicio: new FormControl(''),
     comentarioEntrega: new FormControl(''),
    })
  }

  // registrarFechaInicio(){
    
  //     const dato = {
  //       fecha: this.form.controls.fechaInicio.value,
  //       tipoFecha: this.form.controls.tipoFechaInicio.value,
  //       comentario: this.form.controls.comentario.value,
  //       ordenFabricacion: this.paramentros.ordenFabricacion,
  //       programacionInicio: this.form.controls.fechaInicio.value,
  //       programacionEntrega: this.form.controls.fechaEntrega.value,
  //     }
      
  //     this._programacionOperacionesService.ActualizarFechaProgramada(dato).subscribe(
  //       (resp:any)=>{
  //           if(resp["success"])
  //           {
  //             this._toastrService.success(resp["message"]);
  //             this.form.get("comentario").patchValue("");
  //           }
  //           else
  //           {
  //             this._toastrService.info(resp["message"]);
  //           }
           
  //       }
  //     )
  //   }


    // registrarFechaEntrega(){
    //   const dato = {
    //     fecha: this.form.controls.fechaEntrega.value,
    //     tipoFecha: this.form.controls.tipoFechaEntrega.value,
    //     comentario: this.form.controls.comentario.value,
    //     ordenFabricacion: this.paramentros.ordenFabricacion,
    //     programacionInicio: this.form.controls.fechaInicio.value,
    //     programacionEntrega: this.form.controls.fechaEntrega.value,
    //   }
      
    //   this._programacionOperacionesService.ActualizarFechaProgramada(dato).subscribe(
    //     (resp:any)=>{
    //         if(resp["success"])
    //         {
    //           this._toastrService.success(resp["message"]);
    //           this.form.get("comentario").patchValue("");
    //         }
    //         else
    //         {
    //           this._toastrService.info(resp["message"]);
    //         }
           
    //     }
    //   )
    // }
    

    registrar (){
         const dato = {
          ...this.form.value,
          ordenFabricacion: this.paramentros.ordenFabricacion,
          programacionInicio: this.form.controls.fechaInicio.value,
          programacionEntrega: this.form.controls.fechaEntrega.value,
        }
        
           this._programacionOperacionesService.ActualizarFechaProgramada(dato).subscribe(
            (resp:any)=>{
                if(resp["success"])
                {
                  this._toastrService.success(resp["message"]);
                  this.form.get("comentarioInicio").patchValue("");
                  this.form.get("comentarioEntrega").patchValue("");
                  this.activeModal.close();

                }
                else
                {
                  this._toastrService.info(resp["message"]);
                }
              
            }
          )
    }

  cerrarModal(){
    this.activeModal.close();
  }
}
