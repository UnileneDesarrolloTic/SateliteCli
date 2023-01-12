import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosFormatoListarHorasExtras } from '@data/interface/Response/DatosFormatoListarHorasExtras.interfaces';
import { RRHHService } from '@data/services/backEnd/pages/rrhh.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-horasextras',
  templateUrl: './horasextras.component.html',
  styleUrls: ['./horasextras.component.css']
})
export class HorasextrasComponent implements OnInit {

  FiltroFormulario:FormGroup;
  ListarHorasExtras:DatosFormatoListarHorasExtras[]=[];
  TempListarHorasExtras:DatosFormatoListarHorasExtras[]=[];
  activarCampo:boolean=false;
  flagProcesar:boolean=false;
  flagListar:boolean=false;
  textfiltro=new FormControl('');
  constructor(private _router: Router,
              private _RRHHService:RRHHService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.instanciarObservadoresFilter();
  }

  crearFormulario(){
    this.FiltroFormulario = new FormGroup({
        FechaInicio: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
        FechaFin: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
        Periodo: new FormControl('',[Validators.maxLength(7)]),
        Estado: new FormControl('TD'),
    });
  }

  crear(Nuevo){
    this._router.navigate(['RRHH', 'HorasExtras',Nuevo]);
  }

  Editar(idCabecera:number){
    console.log(idCabecera);
    this._router.navigate(['RRHH', 'HorasExtras',idCabecera]);
  }

  getRowClass = (row:DatosFormatoListarHorasExtras) => {
    return {
      'row-color': row.estado=='APROBADO'
    };
   }

  instanciarObservadoresFilter(){
    this.textfiltro.valueChanges.pipe( debounceTime(900) ).subscribe( _ => {
      // console.log(this._Cargarbase64Service.zfill(this.textFilterCtrl.value,10));
      if(this.textfiltro.value.trim() == '')
      {
        const texto = this.textfiltro.value.toLowerCase();
        this.ListarHorasExtras=this.TempListarHorasExtras;
        
      }

      if(this.textfiltro.value != '')
      {
        const texto = this.textfiltro.value.toLowerCase();
        this.ListarHorasExtras = this.TempListarHorasExtras.filter( x => x.nombreArea?.toLowerCase().indexOf(texto) !== -1);
      }
    })
  }

  filtrar(){
      let simbolo = this.FiltroFormulario.controls.Periodo.value.substring(4,5)=="-";
      this.flagListar=true;

      if (this.activarCampo==false)
        if (this.FiltroFormulario.controls.FechaInicio.value > this.FiltroFormulario.controls.FechaFin.value)
            return (this.toastr.warning("La fecha de inicio es mayor que la fecha final", "Advertencia" ,{timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true}), this.flagListar=false);
      
      if (this.activarCampo==true)
        if((!simbolo) && (!this.FiltroFormulario.controls.Periodo.invalid))
            return (this.toastr.warning("Ingrese bien el formato Correcto: YYYY-MM ", "Advertencia", {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true}),this.flagListar=false);

     
      const Datos={
          ...this.FiltroFormulario.value,
          TipoFiltro:this.activarCampo
      }
  

      this._RRHHService.ListarHoraExtras(Datos).subscribe(
        (resp:any)=>{
               this.flagListar=false
               this.ListarHorasExtras=[];
               resp.length > 0 ?  (this.ListarHorasExtras= resp, this.TempListarHorasExtras=resp) : this.toastr.warning("No hay dato");
         
        },
        error=>{
            this.flagListar=false
        }
      )
  }

  activaDesactiva(){
    this.activarCampo=!this.activarCampo;
  }
  
  Procesar(){
      this.flagProcesar=true;
  }

}
