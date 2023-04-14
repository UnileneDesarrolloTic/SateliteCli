import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFormatoListadoCompraAguja } from '@data/interface/Response/CompraAguja/DatosFormatoListadoCompraAguja.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compra-aguja',
  templateUrl: './compra-aguja.component.html',
  styleUrls: ['./compra-aguja.component.css']
})
export class CompraAgujaComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  listadoCompraAguja:DatosFormatoListadoCompraAguja[]=[];
  flagEspera: boolean = false;
  flagEsperaExcel:boolean=false;

  checkMostrarColumna = new FormControl(false);
  textFiltrar = new FormControl('');
  
  constructor(public _ProduccionService: ProduccionService,private _modalService: NgbModal,
    private _Cargarbase64Service:Cargarbase64Service, private _toastr: ToastrService,) { }

  ngOnInit(): void {
    this.listadoComprasAguja();
  }


  listadoComprasAguja(){
    this.flagEspera = true;
    this._ProduccionService.listarSeguimientoCompraAguja().subscribe(
      (resp:any)=>{
            this.listadoCompraAguja = resp;
            this.flagEspera = false;
      },
      _=> this.flagEspera = false
    );
  }


  exportarExcel() {
    this.flagEsperaExcel=true;
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._ProduccionService.exportarSeguimientoCompraAguja(this.checkMostrarColumna.value).subscribe(
      (resp:any)=>{
        if(resp.success){
          this._Cargarbase64Service.file(resp.content,`CompraAguja-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this._toastr.info(resp.message);
        }
        this.flagEsperaExcel=false;
      },
      error=> {
            ModalCarga.close();
            this.flagEsperaExcel=false;
      }
    );
  }

}
