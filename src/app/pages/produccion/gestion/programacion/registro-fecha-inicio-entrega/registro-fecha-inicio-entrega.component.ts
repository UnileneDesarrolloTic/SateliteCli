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
  @Input() paramentros: ProgramacionOperacionesOrdenFabricacion;
  form: FormGroup;
  fechaActual = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  listadoFechaProgramacion: HistorialProgramacion[] = [];

  constructor(public activeModal: NgbActiveModal, private _programacionOperacionesService: ProgramacionOperacionesService, private _toastrService: ToastrService,) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.form.patchValue({
      id: this.paramentros.id,
      fechaInicio: this.paramentros.fechaInicio == null ? null : formatDate(this.paramentros.fechaInicio, 'yyyy-MM-dd', 'en'),
      fechaEntrega: this.paramentros.fechaEntrega == null ? null : formatDate(this.paramentros.fechaEntrega, 'yyyy-MM-dd', 'en'),
      lote: this.paramentros.lote,
      cantidadPedida : this.paramentros.cantidadPedida,
      ordenFabricacion: this.paramentros.ordenFabricacion
    })
  }

  crearFormulario() {
    this.form = new FormGroup({
      id: new FormControl(null),
      lote: new FormControl(''),
      ordenFabricacion: new FormControl(''),
      cantidadPedida : new FormControl(0),
      fechaInicio: new FormControl(null),
      fechaEntrega: new FormControl(null),
      comentario: new FormControl(''),
    })
  }

  registrar() {
    if ((this.form.controls.fechaInicio.value == null || this.form.controls.fechaInicio.value == "") && (this.form.controls.fechaEntrega.value == null || this.form.controls.fechaEntrega.value == ""))
      return this._toastrService.warning("Debe ingresar la fecha de inicio o la fecha entrega", "Advertencia!!");


      
    this._programacionOperacionesService.ActualizarFechaProgramada(this.form.value).subscribe(
      (resp: any) => {
        if (resp["success"]) {
          this._toastrService.success(resp["message"]);
          this.form.get("comentario").patchValue("");
          this.activeModal.close();

        }
        else {
          this._toastrService.info(resp["message"]);
        }

      }
    )
  }

  cerrarModal() {
    this.activeModal.close();
  }
}
