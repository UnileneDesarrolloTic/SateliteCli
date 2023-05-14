import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { comisionvendedorModel } from '@data/interface/Response/RRHH/DatosFormatoComisionvendedor.interface';
import { RRHHService } from '@data/services/backEnd/pages/rrhh.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comision-vendedor',
  templateUrl: './comision-vendedor.component.html',
  styleUrls: ['./comision-vendedor.component.css']
})
export class ComisionVendedorComponent implements OnInit {

  listarComisionVendedor: comisionvendedorModel[] = [];
  fechaconsulta = new FormControl(formatDate(new Date(), 'yyyy-MM', 'en'))
  flagInformacion:boolean = false;

  constructor(public _RRHHService : RRHHService, private _fullComponente: FullComponent,private _modalService: NgbModal,
    private _Cargarbase64Service:Cargarbase64Service, private _toastr: ToastrService) {
    this._fullComponente.options.sidebartype = 'mini-sidebar'
  }


  ngOnInit(): void {
  }

  buscar() {
    this.flagInformacion = true;
    const periodo = this.fechaconsulta.value.split("-");
    this._RRHHService.reporteComisionVendero(periodo[0] + periodo[1] + "01" ).subscribe(
      (resp:any)=>{
            this.listarComisionVendedor =  resp;
            this.flagInformacion = false 
      },
      _ => this.flagInformacion = false 
    )
  }

  exportarExcel(){
    const periodo = this.fechaconsulta.value.split("-");
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._RRHHService.exportarComisionVendero(periodo[0] + periodo[1] + "01" ).subscribe(
      (resp:any)=>{
        if(resp.success){
          this._Cargarbase64Service.file(resp.content,`ComisionVendedores`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this._toastr.info(resp.message);
        }
       
      },
      error=> {
            ModalCarga.close();
           
      }
    );
  }

}
