import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosFormatoListarHorasExtras } from '@data/interface/Response/DatosFormatoListarHorasExtras.interfaces';
import { RRHHService } from '@data/services/backEnd/pages/rrhh.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@shared/services/comunes/file.service';
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
  flagExportarData: boolean = false;
  textfiltro = new FormControl('');
  fechaActual = new Date();
  modalReportesRef : NgbModalRef;
  reporteSeleccionado: string = ""

  constructor(private _router: Router,  private _RRHHService:RRHHService, private toastr: ToastrService, 
    private _fileService :FileService,  private _modalService: NgbModal) 
  { }

  ngOnInit(): void {
    this.crearFormulario();
    this.instanciarObservadoresFilter();
  }

  crearFormulario(){
    this.FiltroFormulario = new FormGroup({
        FechaInicio: new FormControl({value: '', disabled: true}),
        FechaFin: new FormControl({value: '', disabled: true}),
        Periodo: new FormControl(formatDate(this.fechaActual, 'yyyy-MM', 'en')),
        Estado: new FormControl('TD'),
    });
  }

  crear(Nuevo)
  {
    this._router.navigate(['RRHH', 'HorasExtras',Nuevo]);
  }

  Editar(idCabecera:number)
  {
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
    
    if(this.activarCampo)
    {
      this.FiltroFormulario.controls['Periodo'].disable();
      this.FiltroFormulario.controls['FechaInicio'].enable();
      this.FiltroFormulario.controls['FechaFin'].enable();

      let fecaFormato = formatDate(this.fechaActual, 'yyyy-MM-dd','en')
      this.FiltroFormulario.patchValue({
        FechaInicio: fecaFormato,
        FechaFin: fecaFormato,
        Periodo: '',
      });
      
    }
    else {
      this.FiltroFormulario.controls['Periodo'].enable();
      this.FiltroFormulario.controls['FechaInicio'].disable();
      this.FiltroFormulario.controls['FechaFin'].disable();

      this.FiltroFormulario.patchValue({
        FechaInicio: '',
        FechaFin: '',
        Periodo: formatDate(this.fechaActual, 'yyyy-MM', 'en')
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

  exportarDatos()
  {

    if(this.flagExportarData)
    {
      this.toastr.warning("Se está exportando la información", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar: true, tapToDismiss: true})
      return
    }
    
    if(this.reporteSeleccionado != "e" && this.reporteSeleccionado != "a")
    {
      this.toastr.warning("Seleccione un reporte, para la descarga", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar:true, tapToDismiss:true})
      return
    }
    const periodoSeleccionado = this.FiltroFormulario.get("Periodo").value

    if (periodoSeleccionado == undefined || periodoSeleccionado == null || periodoSeleccionado == ''  )
    {
      this.toastr.warning("Debe de seleccionar un periodo válido.",'Advertencia !!', {closeButton: true, timeOut: 3000, progressBar: true, tapToDismiss: true})
      return
    }
    
    this.flagExportarData = true;

    if(this.reporteSeleccionado == 'e')
    {
      this._RRHHService.ReporteHorasExtrasGeneradas_Excel(periodoSeleccionado).subscribe( resp => 
        {      
          this._fileService.decargarExcel_Base64(resp, "Rpt. Horas Extras Generadas " + periodoSeleccionado, "xlsx");
          setTimeout( () => this.flagExportarData = false, 1500)
        }, _ => this.flagExportarData = false );
    }
    
    if(this.reporteSeleccionado == 'a')
    {
      this._RRHHService.ReporteAutorizacionSobreTiempoPorPersona_PDF(periodoSeleccionado).subscribe( resp => 
        {
          if(resp['success'] == false)
          {
            this.toastr.warning(resp['message'], "Aviso !!", {closeButton: true, timeOut: 3000, progressBar: true, tapToDismiss: true})
            this.flagExportarData = false
          }
          else
          {
            this._fileService.decargarPDF_Base64(resp['content'], "Rpt. Autorización sobretiempo - " + periodoSeleccionado);
            setTimeout( () => this.flagExportarData = false, 1500)
          }
        }, _ => this.flagExportarData = false );
    }
  }

  exportarFormatoSobreTiempo(value: number)
  {
    console.log(value);
    this._RRHHService.ExportarFormatoAutorizacionSobreTiempo(value).subscribe(
      resp => {
        this._fileService.decargarPDF_Base64(resp, "Sobretimepo " + this.periodo);
      }
    )
    
  }

  modalReportes(modal:NgbModal)
  {
    this.modalReportesRef = this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
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
