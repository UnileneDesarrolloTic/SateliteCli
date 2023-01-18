import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosFormatoListadoTransaccionKardex } from '@data/interface/Response/DatosFormatoListadoTransaccionKardex.interfaces';
import { DatosFormatoListaReporteCierreContable } from '@data/interface/Response/DatosFormatoListaReporteCierreContable.interfaces';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cierre-contable',
  templateUrl: './cierre-contable.component.html',
  styleUrls: ['./cierre-contable.component.css']
})
export class CierreContableComponent implements OnInit {
  ListarReporteCierreContable:DatosFormatoListaReporteCierreContable[]=[];
  ListarDetalleReporte:DatosFormatoListadoTransaccionKardex []=[];

  constructor(private _router: Router,
              private _ContabilidadService:ContabilidadService,
              private toastr: ToastrService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  Periodo = new FormControl('',Validators.required);
  NuevoCierre(Nuevo){
    this._router.navigate(['Contabilidad', 'CierreContable',Nuevo]);
  }

  buscarReporteCierre(){
      if(!this.Periodo.valid)
        return this.toastr.warning("Debe ingresar el periodo", "Advertencia");

      this._ContabilidadService.ListarReporteCierre(this.Periodo.value.replace("-","")).subscribe(
          (resp:any)=>{
              this.ListarReporteCierreContable=resp;
          }
      )
  }

  verReporteDetalle(documento:DatosFormatoListaReporteCierreContable){
    this.ListarDetalleReporte=[];
    this._ContabilidadService.ListarDetalleReporteCierre(documento.id,documento.periodo,documento.tipo)
    .subscribe(
      (resp:any)=>{
              this.ListarDetalleReporte=resp;
      },
      error=>{
        
      }
    );
  }

  anularReporteHistorico(documento:DatosFormatoListaReporteCierreContable,index:number){
   
    this._ContabilidadService.AnularReporteCierre(documento.id).subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.toastr.success(resp["content"]);
              this.ListarReporteCierreContable=this.ListarReporteCierreContable.filter((x:DatosFormatoListaReporteCierreContable)=>x.id!=documento.id);
          }else{
              this.toastr.warning(resp["content"]);
          }
      },
      error=>{

      }
    )
  }

}
