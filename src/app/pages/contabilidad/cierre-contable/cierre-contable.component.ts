import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosFormatoListadoTransaccionKardex } from '@data/interface/Response/DatosFormatoListadoTransaccionKardex.interfaces';
import { DatosFormatoListaReporteCierreContable } from '@data/interface/Response/DatosFormatoListaReporteCierreContable.interfaces';
import { MostrarDetalleReporteCierre } from '@data/interface/Response/FormatoDatosMostraDetalleReporteCierre.interfaces';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cierre-contable',
  templateUrl: './cierre-contable.component.html',
  styleUrls: ['./cierre-contable.component.css']
})
export class CierreContableComponent implements OnInit {
  ListarReporteCierreContable: DatosFormatoListaReporteCierreContable[] = [];
  ListarDetalleReporte: MostrarDetalleReporteCierre[] = [];
  flagLoading: boolean = false;
  flagBuscar: boolean = false;
  NombreEjecucion: string = "";
  SeleccionadoPeriodo: string = "";
  CambioInput: boolean = true;
  constructor(private _router: Router,
    private _ContabilidadService: ContabilidadService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  Periodo = new FormControl('', Validators.required);
  Anio = new FormControl('', Validators.required);
  nuevoCierre(Nuevo) {
    this._router.navigate(['Contabilidad', 'CierreContable', Nuevo]);
  }

  buscarReporteCierre() {
    this.ListarDetalleReporte = [];
    if (this.CambioInput)
      this.buscarReporteCierrePeriodo();
    else
      this.buscarReporteCierreAnio();

  }

  buscarReporteCierrePeriodo() {
    if (!this.Periodo.valid) {
      this.Periodo.markAllAsTouched();
      return this.toastr.warning("Debe ingresar el periodo", "Advertencia");
    }


    this.flagBuscar = true;
    this._ContabilidadService.ListarReporteCierrePeriodo(this.Periodo.value.replace("-", "")).subscribe(
      (resp: any) => {
        if (resp["success"])
          this.ListarReporteCierreContable = resp["content"];
        else
          this.toastr.info(resp["message"]);

        this.flagBuscar = false;
      },
      _ => this.flagBuscar = false
    )
  }

  buscarReporteCierreAnio() {
    if (!this.Anio.valid)
      return this.toastr.warning("Ingresar el Año correctamente", "Advertencia");

    this.flagBuscar = true;
    this._ContabilidadService.ListarReporteCierreAnio(this.Anio.value).subscribe(
      (resp: any) => {
        if (resp["success"])
          this.ListarReporteCierreContable = resp["content"];
        else
          this.toastr.info(resp["message"]);

        this.flagBuscar = false;
      },
      _ => this.flagBuscar = false
    )
  }

  cambiarInput() {
    this.CambioInput = !this.CambioInput;
    this.ListarDetalleReporte = [];
    this.ListarReporteCierreContable = [];
    if (this.CambioInput) {
      this.Anio.clearValidators();
      this.Anio.setValue(null);
      this.Periodo.setValidators(Validators.required,);
      this.Periodo.updateValueAndValidity();
    }
    else {
      this.Periodo.clearValidators();
      this.Periodo.setValue(null);
      this.Anio.setValidators([Validators.required]);
      this.Anio.updateValueAndValidity();
    }
  }

  verReporteDetalle(documento: DatosFormatoListaReporteCierreContable) {
    this.NombreEjecucion = documento.tipo == 'TR' ? 'TRANSACCION' : 'KARDEX';
    this.SeleccionadoPeriodo = documento.periodo;
    this.flagLoading = true;
    this.ListarDetalleReporte = [];
    this._ContabilidadService.ListarDetalleReporteCierre(documento.id, documento.periodo, documento.tipo)
      .subscribe(
        (resp: any) => {
          if (resp["success"]) {
            this.ListarDetalleReporte = resp["content"];
          }
          else {
            this.toastr.info(resp["message"]);
          }


          this.flagLoading = false;
        },
        _ => this.flagLoading = false
      );
  }

  anularReporteHistorico(documento: DatosFormatoListaReporteCierreContable, index: number) {
    let respuesta = confirm(`¿Está seguro que desea eliminar?`);
    //flag 
    if (respuesta) {
      this._ContabilidadService.AnularReporteCierre(documento.id).subscribe(
        (resp: any) => {
          this.toastr.success(resp["content"]);
          this.ListarReporteCierreContable = this.ListarReporteCierreContable.filter((x: DatosFormatoListaReporteCierreContable) => x.id != documento.id);
        },
      );
    }

  }

  restablecer() {
    let respuesta = confirm(`¿Desea Restablecer el periodo ${this.SeleccionadoPeriodo} Tipo: ${this.NombreEjecucion} ?`);

    if (respuesta) {
      const datos = {
        Tipo: this.NombreEjecucion,
        Periodo: this.SeleccionadoPeriodo,
        Detalle: this.ListarDetalleReporte,
      }
      this.flagLoading = true;
      this._ContabilidadService.RestablecerCierre(datos)
        .subscribe(
          (resp: any) => {
            if (resp["success"]) 
              this.toastr.success(resp["content"]);
            else
              this.toastr.info(resp["content"]);

            this.ListarDetalleReporte = [];
            this.ListarReporteCierreContable = [];
            this.flagLoading = false;
          },
          _ => this.flagLoading = false
        );

    }
  }

}
