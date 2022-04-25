import { Component, OnInit } from '@angular/core';
import { ListarFormatoCotizacion } from '@data/interface/Response/ListarFormatoCotizacion.interface';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarConfigCotizacionComponent } from './editar-config-cotizacion/editar-config-cotizacion.component';

@Component({
  selector: 'app-config-cotizacion',
  templateUrl: './config-cotizacion.component.html',
  styleUrls: ['./config-cotizacion.component.css']
})
export class ConfigCotizacionComponent implements OnInit {

  ListarFormatoCotizacion:ListarFormatoCotizacion[]=[];

  constructor(
    private _CotizacionService:CotizacionService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.ListarFormatoCotizaciones();
  }

  ListarFormatoCotizaciones(){
    this._CotizacionService.ListarFormatoCotizaciones().subscribe((resp:any) => {
          this.ListarFormatoCotizacion = resp;
    });
  }


  EditarFormato(cotizacionItems){
      

      const modalRef = this.modalService.open(EditarConfigCotizacionComponent, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'dark-modal',
        backdropClass: 'light-blue-backdrop',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
  
      modalRef.componentInstance.fromParent = cotizacionItems;
      modalRef.result.then((result) => {
        
       
      }, (reason) => {
        // console.log("salir2", reason)
      });

  }


}
