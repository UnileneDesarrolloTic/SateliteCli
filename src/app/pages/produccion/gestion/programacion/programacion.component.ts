
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgrupadorGerencia } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoAgrupadores.interface';
import { ProgramacionOperacionesOrdenFabricacion } from '@data/interface/Response/ProgramacionOperaciones/DatosFormatoProgramacionOperaciones.interface';
import { ProgramacionOperacionesService } from '@data/services/backEnd/pages/programacion-operaciones.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RegistroFechaInicioEntregaComponent } from './registro-fecha-inicio-entrega/registro-fecha-inicio-entrega.component';
import { DividirProgramacionComponent } from './dividir-programacion/dividir-programacion.component';


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

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idAgrupador',
      textField: 'agrupador',
      unSelectAllText: 'Todos',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      maxHeight:150
    };

    this.observacionEntrega();
  }

  formatoFiltroBusqueda() {
    this.formFiltros = new FormGroup({
      gerencia: new FormControl('Suturas'),
      agrupador: new FormControl([], Validators.required),
      lote: new FormControl(''),
      ordenFabricacion: new FormControl(''),
      venta: new FormControl('null'),
      estado: new FormControl('PR'),
      fechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
      fechaFinal: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
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
    if(this.formFiltros.controls.agrupador.value.length == 0 )
    {
      this.formFiltros.markAsPending();
      this.toastr.warning("Seleccionar uno o varios agrupador")
      return ;
    }

    const datos = {
        ...this.formFiltros.value,
        agrupador: this.formFiltros.controls.agrupador.value.map((itemAgrupador:any)=> (itemAgrupador.idAgrupador))
    }

    this.listOrdeFabricacionProgramacion=[];
    this.loadingTable = true;


    this._programacionOperacionesService.obtenerProgramacionOrdenFabricacion(datos).subscribe(
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
          fechaInicio: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
          fechaFinal: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
          lote: '',
          ordenFabricacion: '',
          venta: this.formFiltros.controls.venta.value,
        });

      }
      else {
        this.activarCampo = true
        this.formFiltros.patchValue({
          fechaInicio: null,
          fechaFinal: null,
          lote: '',
          ordenFabricacion: '',
          venta: this.formFiltros.controls.venta.value,
        });
        
      }

      this.filtroBuscar();
    });

 
    
  }


  abrirComentario(filaOrdenFabricacion:ProgramacionOperacionesOrdenFabricacion){

    const ModalTransito = this._modalService.open(RegistroFechaInicioEntregaComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'dm',
      scrollable: true
    });
    ModalTransito.componentInstance.paramentros = filaOrdenFabricacion;
    ModalTransito.result.then((result) => {
      this.filtroBuscar();
    }, (refrescado) => {
      // this.filtroBuscar();
    });

  }

  abrirModalDividirProgramacion(filaOrdenFabricacion:ProgramacionOperacionesOrdenFabricacion){
    const ModalTransito = this._modalService.open(DividirProgramacionComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'dm',
      scrollable: true
    });
    ModalTransito.componentInstance.paramentros = filaOrdenFabricacion;
    ModalTransito.result.then((result) => {
      this.filtroBuscar();
    }, (refrescado) => {
      // this.filtroBuscar();
    });
  }

  observacionEntrega(){
    this.formFiltros.controls.gerencia.valueChanges.subscribe((_)=>{
        this.formFiltros.get("agrupador").patchValue([]);
    })
  }

}
