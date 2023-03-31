import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoPlanOrdenServicosDModel } from '@data/interface/Response/DatosFormatoPlanOrdenServicosD.inteface';
import { TransportistaModel } from '@data/interface/Response/Generico/DatosFormatoTransportista.interface';
import { DatosListarRetornoGuia } from '@data/interface/Response/GestionGuia/DatosFormatoListarRetornoGuia.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { FileService } from '@shared/services/comunes/file.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-guias',
  templateUrl: './gestion-guias.component.html',
  styleUrls: ['./gestion-guias.component.css']
})
export class GestionGuiasComponent implements OnInit {
  form:FormGroup;
  formulario:FormGroup;
  flagEsperaExcel:boolean=false;
  informacionGuiaListar:DatosFormatoPlanOrdenServicosDModel[] = [];
  listadoTransportista: TransportistaModel [] = [];
  activarInputDateFecha: boolean = true;
  fechaActual: Date = new Date;
  listarRetornoGuia: DatosListarRetornoGuia[] = [];
  flagLoading:boolean =  false;
  listarcliente:object[]=[];
  flagDescargandoReporte: boolean = false

  reporteRetornoGuia = new FormControl('general');

  constructor(private _ServiceLogistica:LogisticaService,
              private _comercialService:ComercialService,
              private _modalService: NgbModal,
              private toastr: ToastrService,
              private _FileService: FileService,
              private _GenericoService: GenericoService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.transportista();
    this.ListarCliente();
    this.observableActivarFecha();
  }

  crearFormulario(){
    this.form = new FormGroup({ 
      numero : new FormControl ('')
    });

    this.formulario = new FormGroup({
      idcliente: new FormControl(''),
      cliente: new FormControl(''),
      destino: new FormControl(''),
      transportista: new FormControl(0),
      fechaInicio: new FormControl(null),
      fechaFin: new FormControl(null),
      activarFecha: new FormControl(false),
    });
  }

  buscar(){
    this.informacionGuiaListar = [];
    if(this.form.controls.numero.value == ''){
        return this.toastr.warning("Debe Ingresar Numero de la Guia o la serie");
    }

    this._ServiceLogistica.ObtenerNumeroGuia(this.form.controls.numero.value.trim()).subscribe(
      (resp:any)=>{
        
        if(resp.success)
        {
          this.informacionGuiaListar.push(resp.content);
          this.guardarServicios(resp.content)
        }else
        {
          this.toastr.warning(resp.message + this.form.controls.numero.value);
        }
        
      }
    );
  }

  guardarServicios(informacion:DatosFormatoPlanOrdenServicosDModel){
    this._ServiceLogistica.RegistarFechaRetorno(informacion).subscribe(
      (resp:any)=>{
              resp["success"] ? this.toastr.success(resp["content"]) : this.toastr.info(resp["content"]);
      }
    );
    
  }

  transportista(){
    this._GenericoService.transportista().subscribe(
      (resp:any)=>{
          this.listadoTransportista =  resp["content"];
      },
      _=> this.toastr.info("Ocurrio un error en la información de transportista")
    );
  }
 
  buscarInformacionExportacion(){
    /*if(this.formulario.controls.cliente.value == '' && this.formulario.controls.destino.value == '' && this.formulario.controls.transportista.value == 0 && this.formulario.controls.activarFecha.value == false)
        return this.toastr.warning("Debe ingresar un valor para lograr la busqueda");*/
    
    if(this.formulario.controls.activarFecha.value == true)
      if(this.formulario.controls.fechaInicio.value == null || this.formulario.controls.fechaFin.value == null || this.formulario.controls.fechaInicio.value == '' || this.formulario.controls.fechaFin.value == '')
          return this.toastr.warning("Debe ingresar las dos fechas: inicio y fin");

    this.listarRetornoGuia = [];
    this.flagLoading = true;
    const envioDato = {
        ...this.formulario.value,
        idcliente : this.formulario.controls.idcliente.value,
        transportista : parseInt(this.formulario.controls.transportista.value),
        fechaInicio :  this.formulario.controls.fechaInicio.value ,
        fechaFin : this.formulario.controls.fechaFin.value 
    }
        
    this._ServiceLogistica.listadoRetornoGuia(envioDato).subscribe(
      (resp:any)=>{
          if(resp.success)
          {
            this.listarRetornoGuia = resp.content
          }
          else
          {
            this.toastr.info(resp.message);
          }
          this.flagLoading = false;
      },
      _=> this.flagLoading = false
    )
  }

  observableActivarFecha(){
    this.formulario.controls.activarFecha.valueChanges.subscribe(
        activar=>{
           this.activarInputDateFecha = !activar;
             if(activar)
             {
                this.formulario.get("fechaInicio").patchValue(formatDate(this.fechaActual, 'yyyy-MM-dd', 'en'));
                this.formulario.get("fechaFin").patchValue(formatDate(this.fechaActual, 'yyyy-MM-dd', 'en'));
             }else
             {
                this.formulario.get("fechaInicio").patchValue(null);
                this.formulario.get("fechaFin").patchValue(null);
             }
        }
    )
  }

  excelInformacionExportacion(modal:NgbModal){
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

  }

  ListarCliente(){
    const body = {};
    this._comercialService.ListarClientes(body).subscribe((resp) => {
      resp["success"] == true ? this.listarcliente = resp["content"] : this.listarcliente = [];
    });
  } 


  openModalConsultaClientes(){
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => {  
        if(result!=undefined)
        {
            this.formulario.get("idcliente").patchValue(result.persona);
            this.formulario.get("cliente").patchValue(result.nombreCompleto);
        }
		});
     
  }

  Reset(){
    this.formulario.get("idcliente").patchValue('');
    this.formulario.get("cliente").patchValue('');
  }

  aceptarDescargaExcel(){
    this.flagDescargandoReporte = true;
      const envioInformacion = {
        ...this.formulario.value,
        idcliente : this.formulario.controls.idcliente.value,
        transportista : parseInt(this.formulario.controls.transportista.value),
        fechaInicio :  this.formulario.controls.fechaInicio.value,
        fechaFin : this.formulario.controls.fechaFin.value,
        exportar: this.reporteRetornoGuia.value
      }

      this._ServiceLogistica.exportarExcelRetornoGuia(envioInformacion).subscribe(
        (resp:any)=>{
          if(resp['success'] == false)
          {
            this.toastr.warning(resp['message'], "Adventencia !!",{timeOut: 5000, closeButton: true});
            this.flagDescargandoReporte = false
            return
          }

          this._FileService.decargarExcel_Base64(resp['content'],  "Reporte " + this.reporteRetornoGuia.value ,'xlsx')
          this.flagDescargandoReporte = false
        },
        _=>  this.flagDescargandoReporte = false
        
      )


  }
}
