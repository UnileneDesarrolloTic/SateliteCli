import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ObtenerOrdneFabricacion } from '@data/interface/Response/Dispensacion/DatosFormatoObtenerOrdencompra.interface';
import { DispensacionService } from '@data/services/backEnd/pages/dispensacion.service';
import { FullComponent } from '@layout/full/full.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dispensacion-mp',
  templateUrl: './dispensacion-mp.component.html',
  styleUrls: ['./dispensacion-mp.component.css']
})
export class DispensacionMpComponent implements OnInit {

  formFiltros:FormGroup;
  listOrdeFabricacion: ObtenerOrdneFabricacion[]=[];
  activarCampo:boolean = false;
  loadingIndicator:boolean =  false;

  constructor(private _router: Router, private _DispensacionService:DispensacionService, private _fullcomponent: FullComponent, private toastr: ToastrService) { 
    this._fullcomponent.options.sidebartype = 'mini-sidebar'

  }

  ngOnInit(): void {
    this.formatoFiltroBusqueda();
    this.filtroBuscar();
  }

  formatoFiltroBusqueda(){
    this.formFiltros = new FormGroup({
      // fechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
      // fechaFinal: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
      fechaInicio: new FormControl('2023-01-03'),
      fechaFinal: new FormControl('2023-01-03'),
      lote: new FormControl(''),
      ordenFabricacion: new FormControl(''),
      estado: new FormControl('PD'),
    })
  }

  verDispensacion(fila:ObtenerOrdneFabricacion){
    this._router.navigate(['Logistica', 'Dispensacion','MateriaPrima', 'detalle', fila.ordenFabricacion]);
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

  activaDesactiva(){
      this.activarCampo =! this.activarCampo;

      if(this.activarCampo)
      {
        this.formFiltros.patchValue({
          fechaInicio: null,
          fechaFinal: null,
          lote: '',
          ordenFabricacion: '',
          estado: 'PD',
        })
       
      }
      else{
        this.formFiltros.patchValue({
          fechaInicio: '2023-01-03',
          fechaFinal: '2023-01-03',
          lote: '',
          ordenFabricacion: '',
          estado: 'PD',
        })

      }
  }
  
}
