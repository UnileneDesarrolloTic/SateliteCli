import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosFormatoListarHorasExtras } from '@data/interface/Response/DatosFormatoListarHorasExtras.interfaces';
import { RRHHService } from '@data/services/backEnd/pages/rrhh.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horasextras',
  templateUrl: './horasextras.component.html',
  styleUrls: ['./horasextras.component.css']
})
export class HorasextrasComponent implements OnInit {

  FiltroFormulario:FormGroup;
  ListarHorasExtras:DatosFormatoListarHorasExtras[]=[];
  constructor(private _router: Router,
              private _RRHHService:RRHHService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.FiltroFormulario = new FormGroup({
        FechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
        FechaFin: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
        Estado: new FormControl('TD'),
    });
  }

  crear(Nuevo){
    this._router.navigate(['RRHH', 'HorasExtras',Nuevo]);
  }

  Editar(horasextras:DatosFormatoListarHorasExtras){
    this._router.navigate(['RRHH', 'HorasExtras',horasextras.idCabecera]);
  }

  filtrar(){
      if (this.FiltroFormulario.controls.FechaInicio.value > this.FiltroFormulario.controls.FechaFin.value){
          return this.toastr.warning("La fecha de inicio es mayor que la fecha final");
      }
      
      this._RRHHService.ListarHoraExtras(this.FiltroFormulario.value).subscribe(
        (resp:any)=>{
               resp.length > 0 ?  this.ListarHorasExtras= resp : this.toastr.warning("No hay dato");
        }
      )
  }
  
}
