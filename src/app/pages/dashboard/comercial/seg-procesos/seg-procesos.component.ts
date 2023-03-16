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
  filtroAnio = new FormControl(2018);

  constructor(private _modalService: NgbModal,
              private _LicitacionesService:LicitacionesService,
              private toastr: ToastrService,
              private servicebase64:Cargarbase64Service,) { }

  ngOnInit(): void {
  }
  
  exportar(opcion:string, anio:String ,titulo:string){
    const modalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    modalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._LicitacionesService.exportarDashboardLicitaciones(opcion,anio).subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`${titulo}-${this.hoy}`,'xlsx',modalCarga);
        }else{
          modalCarga.close();
          this.toastr.info(resp.message);
        }
      },
      _=>{modalCarga.close()}
    );
  }

  exportarArchivo(modal:NgbModal){
  
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

    }

    aceptarDescarga(){
      if(this.reporteDashboard.value != 'facturacion' && this.reporteDashboard.value != 'resumen')
      {
        this.toastr.warning("Seleccione una opción para la descarga", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar:true, tapToDismiss:true})
        return
      }

      if(this.reporteDashboard.value == 'facturacion')
      {
         if(this.filtroAnio.value > 2017)
         {
          let titulo = 'DashboardLicitacionesDetalleFacturacion';
          this.exportar(this.reporteDashboard.value, this.filtroAnio.value, titulo);
         }
         else
         {
          this.toastr.warning("Debe ser apartir del 2018", "Aviso !!", {timeOut: 3000, closeButton: true, progressBar:true, tapToDismiss:true})
          return
         }
           
      }
      else
      {
        let titulo = 'DashboardLicitacionesResumenProceso';
        this.exportar(this.reporteDashboard.value, this.filtroAnio.value, titulo);
      }

    }


 
    
}
