import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { ModalOrdenCompraComponent } from './modal-orden-compra/modal-orden-compra.component';

@Component({
  selector: 'app-listar-proceso',
  templateUrl: './listar-proceso.component.html',
  styleUrls: ['./listar-proceso.component.css']
})
export class ListarProcesoComponent implements OnInit {
  @Input() idProceso:number;
  Cliente: string = '';
  idCliente: string = '';
  listarcliente:object[]=[];

  ListarProceso:DatosListarProceso[]=[];
  nombreProceso:string;
  constructor(private _activatedRoute : ActivatedRoute,
              private _router: Router,
              private _modalService: NgbModal,
              private _comercialService:ComercialService,
              private _licitacionesServices:LicitacionesService,
              ) { 
               
              }

  ngOnInit(): void {
    this.Filtrar()
    this.ListarCliente();
  }

  NuevoProceso(){
    this._router.navigate(['Licitaciones','proceso','nuevo-proceso']);
  }

  DetalleProceso(){
    this._router.navigate(['Licitaciones','proceso','programacion-proceso']);
  }

  AbrirModuloMuestrayEnsayo(proceso: any){
    this.nombreProceso=proceso.descripcionProceso;
    this._router.navigate(['Licitaciones', 'proceso', 'muestra-ensayo-proceso', proceso.idProceso]);
  }

  AbrirModuloContrato(idproceso: number){
    
    this._router.navigate(['Licitaciones', 'proceso', 'contrato', idproceso]);
  }


  AbrirModuloGuias(idproceso:number){
    this._router.navigate(['Licitaciones', 'proceso', 'estado-guia', ':idproceso'],
                          { state: { idproceso: idproceso } }
                           );
  }
  
  AbrirOrdenCompra(proceso:DatosListarProceso){
    const modalRef = this._modalService.open(ModalOrdenCompraComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'dark-modal',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
      size:'20%'
    });

    modalRef.componentInstance.fromParent = proceso;
    modalRef.result.then((result) => {
      
    }, (reason) => {
      // console.log("salir2", reason)
    });
  }


  // ListarProcesoTabla(){
  //   this._licitacionesServices.ListarProceso().subscribe(
  //     (resp:any)=>{
  //       this.ListarProceso=resp;
  //     }
  //   );
  // }

  ListarCliente(){
    const body = {};
    this._comercialService.ListarClientes(body).subscribe((resp) => {
      resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[];
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
        if(result!=undefined){
            this.idCliente= result.persona;
            this.Cliente=result.nombreCompleto;
        }
		});
  }

  Filtrar(){
    this._licitacionesServices.ListarProceso(this.idCliente).subscribe(
      (resp:any)=>{
        this.ListarProceso=resp;
      }
    );
  }


  Reset(){
    this.idCliente='';
    this.Cliente='';
  }
  
  



}
