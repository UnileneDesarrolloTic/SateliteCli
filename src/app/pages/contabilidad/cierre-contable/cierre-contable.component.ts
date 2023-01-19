import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosFormatoListadoTransaccionKardex } from '@data/interface/Response/DatosFormatoListadoTransaccionKardex.interfaces';
import { DatosFormatoListaReporteCierreContable } from '@data/interface/Response/DatosFormatoListaReporteCierreContable.interfaces';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cierre-contable',
  templateUrl: './cierre-contable.component.html',
  styleUrls: ['./cierre-contable.component.css']
})
export class CierreContableComponent implements OnInit {
  ListarReporteCierreContable:DatosFormatoListaReporteCierreContable[]=[];
  ListarDetalleReporte:DatosFormatoListadoTransaccionKardex []=[];
  flagLoading:boolean=false;
  flagBuscar:boolean=false;
  constructor(private _router: Router,
              private _ContabilidadService:ContabilidadService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  Periodo = new FormControl('',Validators.required);
  nuevoCierre(Nuevo){
    this._router.navigate(['Contabilidad', 'CierreContable',Nuevo]);
  }

  buscarReporteCierre(){
      this.ListarDetalleReporte=[];
      if(!this.Periodo.valid)
        return this.toastr.warning("Debe ingresar el periodo", "Advertencia");

      this.flagBuscar=true;
      this._ContabilidadService.ListarReporteCierre(this.Periodo.value.replace("-","")).subscribe(
          (resp:any) => {
              this.ListarReporteCierreContable=resp;
              this.flagBuscar=false;
          },
          _ => this.flagBuscar=false
          
      )
  }

  verReporteDetalle(documento:DatosFormatoListaReporteCierreContable){
    this.flagLoading=true;
    this.ListarDetalleReporte=[];
    this._ContabilidadService.ListarDetalleReporteCierre(documento.id,documento.periodo,documento.tipo)
    .subscribe(
      (resp:any) => {
              this.ListarDetalleReporte=resp;
              this.flagLoading=false;
      },
      _ => this.flagLoading=false 
    );
  }

  anularReporteHistorico(documento:DatosFormatoListaReporteCierreContable,index:number){
    let respuesta = confirm(`¿Está seguro que desea eliminar?`);
    //flag 
    if(respuesta){
        this._ContabilidadService.AnularReporteCierre(documento.id).subscribe(
          (resp:any) => {
                  this.toastr.success(resp["content"]);
                  this.ListarReporteCierreContable=this.ListarReporteCierreContable.filter((x:DatosFormatoListaReporteCierreContable)=>x.id!=documento.id);
          },
        );
    }
   
  }

}
