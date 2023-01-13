import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  ListarHorasExtras:DatosFormatoListarHorasExtras[] = [];
  TempListarHorasExtras:DatosFormatoListarHorasExtras[] = [];
  activarCampo:boolean = false;
  flagProcesar:boolean = false;
  flagListar:boolean = false;
  textfiltro = new FormControl('');
  constructor(private _router: Router,  private _RRHHService:RRHHService, private toastr: ToastrService) 
  { }

  ngOnInit(): void {
    this.crearFormulario();
    this.instanciarObservadoresFilter();
  }

  crearFormulario(){
    this.FiltroFormulario = new FormGroup({
        FechaInicio: new FormControl({value: '', disabled: true}),
        FechaFin: new FormControl({value: '', disabled: true}),
        Periodo: new FormControl('2023-01'),
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
    this.textfiltro.valueChanges.pipe( debounceTime(900) ).subscribe( _ => 
    {
      if(this.textfiltro.value.trim() == '')
      {
        this.ListarHorasExtras=this.TempListarHorasExtras;
      }

      if(this.textfiltro.value != '')
      {
        const texto = this.textfiltro.value.toLowerCase();
        this.ListarHorasExtras = this.TempListarHorasExtras.filter( x => x.nombreArea?.toLowerCase().indexOf(texto) !== -1);
      }
    })
  }

  filtrar()
  {
    this.flagListar=true;

    if (this.activarCampo && (this.fechaInicio == '' || this.fechaFin == ''))
    {
      this.toastr.warning("Las fechas seleccionadas no son válidas.", "Advertencia !!", {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true}) 
      this.flagListar=false
      return
    }
    
    if (this.activarCampo && this.fechaInicio > this.fechaFin)
    {
      this.toastr.warning("La fecha de inicio debe ser menor a la fecha final", "Advertencia !!", {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true}) 
      this.flagListar=false
      return
    }
    
    if (!this.activarCampo && this.periodo == '')
    {
      this.toastr.warning("El periodo no es válido", "Advertencia !!", {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      this.flagListar=false
      return
    }

    this.ListarHorasExtras=[];

    const filtros={
        ...this.FiltroFormulario.value,
    }

    this._RRHHService.ListarHoraExtras(filtros).subscribe((resp:any)=>
      {
        this.TempListarHorasExtras=resp
        this.ListarHorasExtras= resp
        this.flagListar=false
      },
      _ => this.flagListar=false
    )
  }

  activaDesactiva()
  {
    this.activarCampo=!this.activarCampo;
    console.log('Desactivado');
    
    if(this.activarCampo)
    {
      this.FiltroFormulario.controls['Periodo'].disable();
      this.FiltroFormulario.controls['FechaInicio'].enable();
      this.FiltroFormulario.controls['FechaFin'].enable();
      this.FiltroFormulario.patchValue({
        Periodo: '',
      })
    }
    else {
      this.FiltroFormulario.controls['Periodo'].enable();
      this.FiltroFormulario.controls['FechaInicio'].disable();
      this.FiltroFormulario.controls['FechaFin'].disable();

      this.FiltroFormulario.patchValue({
        FechaInicio: '',
        FechaFin: '',
      })
    }
    
  }
  
  procesar()
  {
    if(!this.periodo || this.FiltroFormulario.get('Periodo').invalid ||this.periodo == '')
    {
      this.toastr.warning('El periodo no es válido','Advertencia !!', {closeButton: true, timeOut: 3000, progressBar: true});
      return
    }

    let confirmacion = confirm("¿ Seguro de procesar horas extras para el periodo " + this.periodo);

    if(!confirmacion)
      return

    this.flagProcesar=true;

    this._RRHHService.ProcesarHorasExtrasPlanilla(this.periodo).subscribe(_=> 
      {
        this.flagProcesar = false;
        this.toastr.success('Se ha procesado la información correctamente','Éxito !!', {closeButton: true, timeOut: 3000, progressBar: true});
      }, _ => this.flagProcesar = false )
  }

  get fechaInicio() 
  {
    return this.FiltroFormulario.get('FechaInicio').value
  }
  
  get fechaFin() 
  {
    return this.FiltroFormulario.get('FechaFin').value
  }

  get periodo()
  {
    return this.FiltroFormulario.get('Periodo').value
  }

}
