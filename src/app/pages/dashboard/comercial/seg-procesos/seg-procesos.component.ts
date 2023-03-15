import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seg-procesos',
  templateUrl: './seg-procesos.component.html'
})
export class SegProcesosComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  reporteDashboard = new FormControl('a');
  

  constructor(private _modalService: NgbModal,
              private _LicitacionesService:LicitacionesService,
              private toastr: ToastrService,
              private servicebase64:Cargarbase64Service,) { }

  ngOnInit(): void {
  }
  
  exportarPaginatres(opcion:string){
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._LicitacionesService.exportarDashboardLicitaciones(opcion).subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`DashboardLicitaciones-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      },
      _=>{ModalCarga.close()}
    );
  }

  exportarPaginacinco(opcion:string){
    const ModalCargaPaginacinco = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCargaPaginacinco.componentInstance.fromParent = "Generando el Formato Excel";
    this._LicitacionesService.exportarDashboardLicitaciones(opcion).subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`DashboardLicitacionesResumenProcesoPagina5-${this.hoy}`,'xlsx',ModalCargaPaginacinco);
        }else{
          ModalCargaPaginacinco.close();
          this.toastr.info(resp.message);
        }
      },
      _=>{ModalCargaPaginacinco.close()}
    );

  }


  exportarArchivopaginacinco(modal:NgbModal){
  
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

    }

    aceptarDescarga(){
      if(this.reporteDashboard.value != 'a' && this.reporteDashboard.value != 'b')
      {
        this.toastr.warning("Seleccione uno para la descarga", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar:true, tapToDismiss:true})
        return
      }

      if(this.reporteDashboard.value=='a')
      {
        this.exportarPaginatres(this.reporteDashboard.value);
      }
      else
      {
        this.exportarPaginatres(this.reporteDashboard.value);
      }

    }


 
    
}
