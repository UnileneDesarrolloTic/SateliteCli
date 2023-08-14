import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DispensacionDetalleGlobal } from '@data/interface/Response/Dispensacion/DatosFormatoDetalleDispensacionGlobal.interface';
import { HistorialDispensacion } from '@data/interface/Response/Dispensacion/DatosFormatoListadoHistorial.interfaces';
import { ObtenerOrdneFabricacion } from '@data/interface/Response/Dispensacion/DatosFormatoObtenerOrdencompra.interface';
import { SubFamilia } from '@data/interface/Response/Dispensacion/DatosFormatoSubFamilia.interfaces';
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
  dispensacionGlobal: DispensacionDetalleGlobal[]=[];
  tempDispensacionGlobal: DispensacionDetalleGlobal[]=[];
  subFamilia: SubFamilia[] = [];

  activarCampo:boolean = false;
  loadingIndicator:boolean =  false;
  
  loadingDipensacion:boolean = false;
  flagEsperarEntregar:boolean = false;
  tipo = new FormControl('TD')


  constructor(private _router: Router, private _DispensacionService:DispensacionService, private _fullcomponent: FullComponent, private toastr: ToastrService) { 
    this._fullcomponent.options.sidebartype = 'mini-sidebar'

  }

  ngOnInit(): void {
    this.formatoFiltroBusqueda();
    this.formatoFiltroHistorial();
    this.filtroBuscar();
    this.listadoDispensacionGlobal();
    this.observacionTipo();
  }

  //PRINCIPAL
    formatoFiltroBusqueda(){
      this.formFiltros = new FormGroup({
        fechaInicio: new FormControl(null),
        fechaFinal: new FormControl(null),
        lote: new FormControl(''),
        ordenFabricacion: new FormControl('')
      })
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


    verDispensacion(fila:ObtenerOrdneFabricacion){
      this._router.navigate(['Logistica', 'Dispensacion','MateriaPrima', 'detalle', fila.ordenFabricacion, fila.item, fila.secuencia ]);
    }

  //PRINCIPAL FINAL

  //DETALLE 
  listadoDispensacionGlobal(){
    this.loadingDipensacion = true;
    this._DispensacionService.dispensacionRecetaGlobal().subscribe(
      (resp:any)=>{
          this.loadingDipensacion = false;
          this.dispensacionGlobal = resp["detalleDispensacion"];
          this.tempDispensacionGlobal = resp["detalleDispensacion"];
          this.subFamilia = resp["subFamilia"]
      }
    )
  }

  updateValue(row:DispensacionDetalleGlobal, event, rowIndex) {
    this.dispensacionGlobal.forEach((x:DispensacionDetalleGlobal) => {
      if(x.ordenFabricacion == row.ordenFabricacion && x.numeroLote == row.numeroLote && x.itemTerminado == row.itemTerminado && x.secuencia == row.secuencia && x.lote == row.lote)
      {
        x.cantidadIngresada = parseFloat(event.target.value);
      }});
    //this.dispensacionGlobal[rowIndex].cantidadIngresada = parseFloat(event.target.value) ?? 0;

    this.tempDispensacionGlobal.forEach((x:DispensacionDetalleGlobal) => {
      if(x.ordenFabricacion == row.ordenFabricacion && x.numeroLote == row.numeroLote && x.itemTerminado == row.itemTerminado && x.secuencia == row.secuencia && x.lote == row.lote)
      {
        x.cantidadIngresada = parseFloat(event.target.value);
      }});
  }

  observacionTipo()
  {
    this.tipo.valueChanges.subscribe((valorTipo)=>
    {
       if(valorTipo != 'TD')
       {
        this.dispensacionGlobal = this.tempDispensacionGlobal.filter((x:DispensacionDetalleGlobal)=> x.codigoSubFamilia == valorTipo)
       }
       else
       {
        this.dispensacionGlobal = this.tempDispensacionGlobal;
       }
    }
    );
  }


  guardarEntrega(){
    let validacionCantidad =  this.tempDispensacionGlobal.filter((element:DispensacionDetalleGlobal)=> element.cantidadSolicitada < (element.cantidadDespachada + element.cantidadIngresada));
    if(validacionCantidad.length > 0 )
       return this.toastr.warning("El valor del ingreso excede a la cantidad solicitada");

    const datos = this.tempDispensacionGlobal.filter((x: DispensacionDetalleGlobal) => x.cantidadIngresada > 0)

    if(datos.length == 0)
       return this.toastr.warning("No hay información para registrar");

    this.flagEsperarEntregar = true;
    this._DispensacionService.dispensacionRegistrarDispensacionGeneral(datos).subscribe(
      (resp:any)=>{
            if(resp["success"])
            {
              this.toastr.success(resp["message"]);
              this.tipo.patchValue('TD');
              this.listadoDispensacionGlobal();
            }
            else{
              this.toastr.info(resp["message"])
            }
            this.flagEsperarEntregar = false;
      },
      (_) => this.flagEsperarEntregar = false
    )
   

  
    
    
  }



  // DETALLE FINAL

 

  // HISTORIAL
  formatoFiltroHistorial(){
    this.formHistorial = new FormGroup({
      ordenFabricacionHistoria : new FormControl(''),
      loteHistoria : new FormControl('')
    })
  }

  filtroHistorial(){
    this._DispensacionService.historialDispensacion(this.formHistorial.controls.ordenFabricacionHistoria.value, this.formHistorial.controls.loteHistoria.value).subscribe(
      (resp:any)=>{
            this.historialDispensacion = resp;
      }
    );
  }
  
  //HISTORIAL FINAL

  
}
