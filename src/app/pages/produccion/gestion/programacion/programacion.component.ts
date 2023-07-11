
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgrupadorGerencia } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoAgrupadores.interface';
import { ProgramacionOperacionesOrdenFabricacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoProgramacionOperaciones.interface';
import { ProgramacionOperacionesService } from '@data/services/backEnd/pages/programacion-operaciones.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RegistroFechaInicioEntregaComponent } from './registro-fecha-inicio-entrega/registro-fecha-inicio-entrega.component';


@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})
export class ProgramacionComponent implements OnInit {


  formFiltros: FormGroup;
  listOrdeFabricacionProgramacion: ProgramacionOperacionesOrdenFabricacion[] = [];
  activarCampo: boolean = false;
  loadingTable: boolean = false;
  agrupadores: AgrupadorGerencia[] = [];

  constructor(private _router: Router, 
              private _programacionOperacionesService: ProgramacionOperacionesService,
              private _modalService: NgbModal, 
              private _fullcomponent: FullComponent, private toastr: ToastrService) {
    this._fullcomponent.options.sidebartype = 'mini-sidebar'

  }

  ngOnInit(): void {
    this.formatoFiltroBusqueda();
    this.agrupador();
    this.observacionEstado();
    this.observacionAgrupador();
  }

  formatoFiltroBusqueda() {
    this.formFiltros = new FormGroup({
      gerencia: new FormControl('Suturas'),
      agrupador: new FormControl('', Validators.required),
      lote: new FormControl(''),
      ordenFabricacion: new FormControl(''),
      venta: new FormControl('null'),
      estado: new FormControl('PR'),
      fechaInicio: new FormControl('2023-01-03'),
      fechaFinal: new FormControl('2023-01-03'),
    })
  }

  agrupador() {
    this._programacionOperacionesService.listarAgrupador(this.formFiltros.controls.gerencia.value)
      .subscribe((resp: any) => {
        this.agrupadores = resp;
    });
  }

  observacionAgrupador() {
    this.formFiltros.controls.gerencia.valueChanges.subscribe((valor) => {
        this.agrupador();
    });
  }

  filtroBuscar() {

    this.listOrdeFabricacionProgramacion=[];
    this.loadingTable = true;
    this._programacionOperacionesService.obtenerProgramacionOrdenFabricacion(this.formFiltros.value).subscribe(
      (resp) => {
        this.loadingTable = false;
        if (resp["success"]) {
          this.listOrdeFabricacionProgramacion = resp["content"];
        } else {
          this.toastr.info(resp["message"])
          this.listOrdeFabricacionProgramacion = resp["content"];
        }
      },
      _ => this.loadingTable = false
    )

  }

  observacionEstado() {
    this.formFiltros.controls.estado.valueChanges.subscribe(estado => {

      if (estado == 'PR') {
        this.activarCampo = false;
        this.formFiltros.patchValue({
          fechaInicio: '2023-01-03',
          fechaFinal: '2023-01-03',
          lote: this.formFiltros.controls.lote.value,
          ordenFabricacion: this.formFiltros.controls.ordenFabricacion.value,
          venta: this.formFiltros.controls.venta.value,
        });

      }
      else {
        this.activarCampo = true
        this.formFiltros.patchValue({
          fechaInicio: null,
          fechaFinal: null,
          lote: this.formFiltros.controls.lote.value,
          ordenFabricacion: this.formFiltros.controls.ordenFabricacion.value,
          venta: this.formFiltros.controls.venta.value,
        });
        
      }
    });
    
  }

  abrirComentario(filaOrdenFabricacion:ProgramacionOperacionesOrdenFabricacion){

    const ModalTransito = this._modalService.open(RegistroFechaInicioEntregaComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'md',
      scrollable: true
    });
    ModalTransito.componentInstance.paramentros = filaOrdenFabricacion;
    ModalTransito.result.then((result) => {
      this.filtroBuscar();
    }, (refrescado) => {
      // this.filtroBuscar();
    });

  }



}
