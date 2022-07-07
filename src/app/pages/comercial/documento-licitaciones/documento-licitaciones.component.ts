import { formatDate } from '@angular/common';
import {Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosFormatoListarLicitaciones } from '@data/interface/Response/DatosFormatoListarLicitaciones.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-documento-licitaciones',
  templateUrl: './documento-licitaciones.component.html',
  styleUrls: ['./documento-licitaciones.component.css'],
})
export class DocumentoLicitacionesComponent implements OnInit {
  hoy = new Date()
  listarcliente:object[]=[];
  MaestroSeleccion: boolean;
  SeleccionArrayListar: any;
  listarLicitaciones:DatosFormatoListarLicitaciones[];
  TemporalListarLicitaciones:DatosFormatoListarLicitaciones[]=[];
  botonestado:boolean=true;

  buscarnumeroguia:string="";
  buscarnumeroguiaCambio = new Subject<string>();
 
  form:FormGroup;
  constructor(private _comercialService:ComercialService,
              private toastr: ToastrService,
              private modalService: NgbModal,
              private _fb: FormBuilder,
              private servicebase64:Cargarbase64Service
              ) {
                this.crearFormulario();
                this.buscarnumeroguiaCambio.pipe(debounceTime(900)).subscribe(() => {
                  if(this.buscarnumeroguia.trim() == ''){
                    this.listarLicitaciones=this.TemporalListarLicitaciones;
                  }else{
                    this.listarLicitaciones=this.TemporalListarLicitaciones.filter(x=>x.guiaNumero.indexOf(this.buscarnumeroguia.trim()) !== -1);
                  }
                });
               }

  ngOnInit(): void {
    this.ListarCliente();
  }

  

  crearFormulario(){ 
    this.form = this._fb.group({
      idcliente:[2317,Validators.required],
      cliente: [ 2317,Validators.required],
      fechainicio: [, Validators.required],
      fechafinal: [, Validators.required],
    })
    this.form.reset({
      idcliente:'2317',
      cliente: '2317',
      fechainicio : formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en') ,
      fechafinal: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en') 
    })
   }

  ListarCliente(){
    const body = {};
    this._comercialService.ListarClientes(body).subscribe((resp) => {
      resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[];
    });
  }

  Filtrar(){
        
        if(this.form.controls.fechainicio.value <= this.form.controls.fechafinal.value){
            this.Buscar()
        }else{
            this.toastr.info("La fecha de inicion debe ser menor a la fecha final")
        }
  }

  openModalConsultaClientes(){
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
            this.form.get("idcliente").patchValue(result.persona);
            this.form.get("cliente").patchValue(result.nombreCompleto);
        }
		});
     
  }

  Buscar(){
      const dato ={
        ...this.form.value,
        idcliente: parseInt(this.form.controls.idcliente.value),
      }
      this._comercialService.ListarLicitaciones(dato).subscribe(
          (resp:any)=>{
              if(resp.length>0) {
                this.listarLicitaciones=resp.map(element=>(
                   { ...element,
                    isSelected:false}
                ));
                this.TemporalListarLicitaciones= this.listarLicitaciones;
                this.SeleccionArrayListar=[];
              }else{
                this.toastr.info("No se ha encontrado informacion");
                this.listarLicitaciones=[];
                this.TemporalListarLicitaciones=[];
                this.SeleccionArrayListar=[];
              }
              this.buscarnumeroguia="";
              this.MaestroSeleccion=false;
              this.botonestado=true;
          }
      )
  }

  filtroGuiaNumero(){
      this.buscarnumeroguiaCambio.next();
  }

  

  checkTodo() {
    for (var i = 0; i < this.listarLicitaciones.length; i++) {
        this.listarLicitaciones[i].isSelected=this.MaestroSeleccion;
    }
    this.SeleccionaTodo();
  }

  CheckSeleccion() {
    this.MaestroSeleccion = this.listarLicitaciones.every(function (item: any) {
        
      return item.isSelected == true;
    })
    
    console.log(this.MaestroSeleccion)


    this.SeleccionaTodo();
  }

  SeleccionaTodo() {
    this.SeleccionArrayListar=[];
    for (var i = 0; i < this.listarLicitaciones.length; i++) {
     
      if (this.listarLicitaciones[i].isSelected){
        console.log(this.listarLicitaciones[i])
        this.SeleccionArrayListar.push({ GuiasNumero :`${this.listarLicitaciones[i].serieNumero}-${this.listarLicitaciones[i].guiaNumero}`});
      }
        
     }
     this.SeleccionArrayListar.length > 0 ? this.botonestado=false : this.botonestado=true;
         
     console.log(this.SeleccionArrayListar);
  }


  SeleccionaItem(rowItem:DatosFormatoListarLicitaciones){
    this.SeleccionArrayListar=[];

    for (var i = 0; i < this.TemporalListarLicitaciones.length; i++) {
        if(this.TemporalListarLicitaciones[i].guiaNumero==rowItem.guiaNumero && this.TemporalListarLicitaciones[i].serieNumero==rowItem.serieNumero){
          this.TemporalListarLicitaciones[i].isSelected=rowItem.isSelected;
        }
    }

    for (var i = 0; i < this.TemporalListarLicitaciones.length; i++) {
      if (this.TemporalListarLicitaciones[i].isSelected){
        this.SeleccionArrayListar.push({ GuiasNumero :`${this.TemporalListarLicitaciones[i].serieNumero}-${this.TemporalListarLicitaciones[i].guiaNumero}`});
      }
    }

    this.SeleccionArrayListar.length > 0 ? this.botonestado=false : this.botonestado=true;

    
  }


  Imprimir(){
      const ModalCarga = this.modalService.open(ModalCargarComponent, {
        centered: true,
        backdrop: 'static',
        size: 'sm',
        scrollable: true
      });
      ModalCarga.componentInstance.fromParent = "Generando el Formato pdf";

      this._comercialService.GenerarPdfNumeroGuias(this.SeleccionArrayListar).subscribe(
        (resp:any)=>{
            if(resp.success){
              this.servicebase64.file(resp.content,'ListaLicitaciones','pdf',ModalCarga);
            }else{
              ModalCarga.close();
              this.toastr.info(resp.message);
            }
        }
      )
  }

  get listadoGuias(){
      return this.TemporalListarLicitaciones.length > 0 ?  false : true;
  }
 
}
