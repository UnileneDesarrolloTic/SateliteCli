import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOrdenCompraComponent } from './modal-orden-compra/modal-orden-compra.component';

@Component({
  selector: 'app-listar-proceso',
  templateUrl: './listar-proceso.component.html',
  styleUrls: ['./listar-proceso.component.css']
})
export class ListarProcesoComponent implements OnInit {
  @Input() idProceso:number;

  ListarProceso:DatosListarProceso[]=[];
  nombreProceso:string;
  constructor(private _activatedRoute : ActivatedRoute,
              private _router: Router,
              private _modalService: NgbModal,
              private _licitacionesServices:LicitacionesService,
              ) { 
               
              }

  ngOnInit(): void {
    this.ListarProcesoTabla()
    
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


  ListarProcesoTabla(){
    this._licitacionesServices.ListarProceso().subscribe(
      (resp:any)=>{
        this.ListarProceso=resp;
      }
    );
  }

  
  



}
