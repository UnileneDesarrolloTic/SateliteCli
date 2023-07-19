import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HistorialDispensacion } from '@data/interface/Response/Dispensacion/DatosFormatoListadoHistorial.interfaces';
import { ObtenerOrdneFabricacion } from '@data/interface/Response/Dispensacion/DatosFormatoObtenerOrdencompra.interface';
import { DispensacionService } from '@data/services/backEnd/pages/dispensacion.service';
import { FullComponent } from '@layout/full/full.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dispensacion-mp',
  templateUrl: './dispensacion-mp.component.html',
  styleUrls: ['./dispensacion-mp.component.css']
})
export class DispensacionMpComponent implements OnInit {

  formFiltros:FormGroup;
  formHistorial:FormGroup;
  listOrdeFabricacion: ObtenerOrdneFabricacion[]=[];
  historialDispensacion: HistorialDispensacion[]=[];

  activarCampo:boolean = false;
  loadingIndicator:boolean =  false;

  constructor(private _router: Router, private _DispensacionService:DispensacionService, private _fullcomponent: FullComponent, private toastr: ToastrService) { 
    this._fullcomponent.options.sidebartype = 'mini-sidebar'

  }

  ngOnInit(): void {
    this.formatoFiltroBusqueda();
    this.formatoFiltroHistorial();
    this.filtroBuscar();
  }

  formatoFiltroBusqueda(){
    this.formFiltros = new FormGroup({
      fechaInicio: new FormControl(null),
      fechaFinal: new FormControl(null),
      lote: new FormControl(''),
      ordenFabricacion: new FormControl('')
    })
  }
  
  formatoFiltroHistorial(){
    this.formHistorial = new FormGroup({
      ordenFabricacionHistoria : new FormControl(''),
      loteHistoria : new FormControl('')
    })
  }

  verDispensacion(fila:ObtenerOrdneFabricacion){
     this._router.navigate(['Logistica', 'Dispensacion','MateriaPrima', 'detalle', fila.ordenFabricacion, fila.item, fila.secuencia ]);
  }

  filtroBuscar(){
    this.loadingIndicator = true;
    this._DispensacionService.obtenerOrdenFabricacion(this.formFiltros.value).subscribe(
      (resp)=>{
          this.loadingIndicator = false;
          if(resp["success"])
          {
            this.listOrdeFabricacion = resp["content"]
          }else
          {
            this.toastr.info(resp["message"])
            this.listOrdeFabricacion = resp["content"];
          }
      },
      _=> this.loadingIndicator = false
    )
  }


  filtroHistorial(){
    this._DispensacionService.historialDispensacion(this.formHistorial.controls.ordenFabricacionHistoria.value, this.formHistorial.controls.loteHistoria.value).subscribe(
      (resp:any)=>{
            this.historialDispensacion = resp;
      }
    );
  }
  
  
}
