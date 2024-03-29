import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosGuiaPorFacturarModel } from '@data/interface/Response/DatosGuiaPorFacturar.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-guias-por-facturar',
  templateUrl: './guias-por-facturar.component.html',
  styleUrls: ['./guias-por-facturar.component.css']
})
export class GuiasPorFacturarComponent implements OnInit {

  hoy = new Date()
  listarcliente:object[]=[];
  flagLoading: boolean =  false;
  ListarGuiasPorFacturar: DatosGuiaPorFacturarModel[]=[];
  TempListarGuiasPorFacturar:DatosGuiaPorFacturarModel[]=[];
  SeleccionArrayListar:object[]=[];
  form:FormGroup;
  MaestroSeleccion: boolean;
  botonestado:boolean=true;
  textFilterCtrl = new FormControl('');
  selected :any=[];
  activarFecha:boolean=true;
  disablecheckou:boolean=true;


  constructor(private _comercialService:ComercialService, private toastr: ToastrService, 
    private modalService: NgbModal, private _Cargarbase64Service:Cargarbase64Service) 
  {
    this.instanciarObservadoresFilter();
  }

  ngOnInit(): void {
    this.ListarCliente();
    this.crearFormulario();
  }

  getRowClass = (row) => {
   return {
     'row-color': row.comentariosEntrega
   };
  }

  crearFormulario(){
    this.form = new FormGroup({
      destinatario: new FormControl(''),
      cliente: new FormControl(''),
      Territorio: new  FormControl('N',Validators.required),
      FechaInicio: new FormControl('',),
      FechaFin: new FormControl('',),
      Tipo: new FormControl('GF',Validators.required)
    })
  }
  
  ActivaDesactivaFechas(){
    
    this.activarFecha=!this.activarFecha;
    if(this.activarFecha){
      this.form.get("FechaInicio").patchValue('');
      this.form.get("FechaFin").patchValue('');

      this.form.controls.FechaInicio.setValidators(null);
      this.form.controls.FechaFin.setValidators(null);
      this.form.controls.FechaInicio.updateValueAndValidity();
      this.form.controls.FechaFin.updateValueAndValidity();
    }else{
      this.form.get("FechaInicio").patchValue(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'));
      this.form.get("FechaFin").patchValue(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'));
  
      this.form.controls.FechaInicio.updateValueAndValidity();
      this.form.controls.FechaInicio.setValidators(Validators.required);
      this.form.controls.FechaFin.updateValueAndValidity();
      this.form.controls.FechaFin.setValidators(Validators.required);
    }
  }

  instanciarObservadoresFilter()
  {
    this.textFilterCtrl.valueChanges.pipe( debounceTime(900) ).subscribe( _ => 
      {
        if(this.textFilterCtrl.value.trim() == '')
          this.TempListarGuiasPorFacturar=this.ListarGuiasPorFacturar;

        if(this.textFilterCtrl.value != '')
        {
          const texto = this.textFilterCtrl.value.toLowerCase();
          this.TempListarGuiasPorFacturar = this.ListarGuiasPorFacturar.filter( x => x.guiaNumero?.toLowerCase().indexOf(texto) !== -1);
        }
      }
    )
  }

  ListarCliente()
  {
    this._comercialService.ListarClientes({}).subscribe ( resp => 
      {
        resp["success"] == true ? this.listarcliente = resp["content"] : this.listarcliente = [];
      }
    );
  } 

  openModalConsultaClientes()
  {
    const modalBusquedaCliente = this.modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => {  
        if(result!=undefined){
            this.form.get("destinatario").patchValue(result.persona);
            this.form.get("cliente").patchValue(result.nombreCompleto);
        }
		});
     
  }

  Filtrar()
  {
    this.ListarGuiasPorFacturar=[];
    this.TempListarGuiasPorFacturar=[];
    
    if(isNaN(parseInt(this.form.controls.destinatario.value)) && this.activarFecha)
      return this.toastr.warning("Debe Seleccionar un Cliente o en caso un rango de fecha");

    if(this.form.controls.Tipo.value!='G')
    {
      this.flagLoading=true;
      const dato = 
        {
          FechaFin: this.form.controls.FechaFin.value,
          FechaInicio: this.form.controls.FechaInicio.value,
          Territorio: this.form.controls.Territorio.value,
          destinatario: isNaN(parseInt(this.form.controls.destinatario.value))? 0 : parseInt(this.form.controls.destinatario.value),
          Tipo:this.form.controls.Tipo.value,
        }

      this._comercialService.ListarGuiaPorFacturar(dato).subscribe(
          (resp:any) => {
              this.ListarGuiasPorFacturar = resp;
              this.TempListarGuiasPorFacturar = resp;
              this.flagLoading = false;
          }
      )
    
    }
    else {
      this.ListarGuiasPorFacturar = [];
      this.TempListarGuiasPorFacturar = [];
    }
  }

  Exportar(){

    if(isNaN(parseInt(this.form.controls.destinatario.value)) && this.activarFecha){
      return this.toastr.warning("Debe Seleccionar un Cliente o en caso un rango de fecha");
    }

    const dato={
      FechaFin: this.form.controls.FechaFin.value,
      FechaInicio: this.form.controls.FechaInicio.value,
      Territorio: this.form.controls.Territorio.value,
      destinatario: isNaN(parseInt(this.form.controls.destinatario.value))? 0 : parseInt(this.form.controls.destinatario.value),
      Tipo:this.form.controls.Tipo.value,
    }
    
    const ModalCarga = this.modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._comercialService.ListarGuiaporFacturarExportar(dato).subscribe(
      resp =>
      {
        this._Cargarbase64Service.file(resp, 'ExportarListar', 'xlsx', ModalCarga);
      }
    )
  }
}