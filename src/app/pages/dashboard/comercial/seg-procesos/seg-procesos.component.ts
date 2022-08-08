import { Component, OnInit } from '@angular/core';
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
  constructor(private _modalService: NgbModal,
              private _LicitacionesService:LicitacionesService,
              private toastr: ToastrService,
              private servicebase64:Cargarbase64Service,) { }

  ngOnInit(): void {
  }
  
  ExportarArchivo(){
      
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._LicitacionesService.ExportarDashboardLicitaciones().subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`DashboardLicitaciones-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );
  }
}
