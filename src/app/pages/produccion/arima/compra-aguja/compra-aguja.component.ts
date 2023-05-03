import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFormatoListadoCompraAguja } from '@data/interface/Response/CompraAguja/DatosFormatoListadoCompraAguja.interface';
import { OCPendientesArima } from '@data/interface/Response/CompraAguja/DatosFormatoOCPendientes.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-compra-aguja',
  templateUrl: './compra-aguja.component.html',
  styleUrls: ['./compra-aguja.component.css']
})
export class CompraAgujaComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  listadoCompraAguja:DatosFormatoListadoCompraAguja[]=[];
  templistadoCompraAguja:DatosFormatoListadoCompraAguja[]=[];
  listaDettalleCC:OCPendientesArima[]=[];
  flagEspera: boolean = false;
  flagEsperaExcel:boolean=false;

  checkMostrarColumna = new FormControl(false);
  textFiltrarAgujas = new FormControl('');
  
  constructor(public _ProduccionService: ProduccionService,private _modalService: NgbModal,
    private _Cargarbase64Service:Cargarbase64Service, private _toastr: ToastrService, private _fullComponente: FullComponent) { 
        this._fullComponente.options.sidebartype = 'mini-sidebar';
    }

  ngOnInit(): void {
    this.listadoComprasAguja();
    this.isObservableFiltro();
  }


  listadoComprasAguja(){
    this.flagEspera = true;
    this._ProduccionService.listarSeguimientoCompraAguja().subscribe(
      (resp:any)=>{
            this.listadoCompraAguja = resp;
            this.templistadoCompraAguja = resp;
            this.flagEspera = false;
      },
      _=> this.flagEspera = false
    );
  }

  isObservableFiltro(){
    this.textFiltrarAgujas.valueChanges.pipe(debounceTime(900)).subscribe(valorBusqueda=>{
          this.filtrar(valorBusqueda);
    })
  }

  filtrar(valorBusqueda){
    const inputText = valorBusqueda.toLowerCase().trim();
    this.listadoCompraAguja = this.templistadoCompraAguja.filter(element => element.itemFinal.toLowerCase().indexOf(inputText) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(inputText) !== -1 );
    // this.listarItemDrogueria = this.templistarItemDrogueria.filter(element => element.item.toLowerCase().indexOf(inputText) !== -1 || element.descProveedor?.toLowerCase().indexOf(inputText) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(inputText) !== -1);
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


  abrirModalMostrarOC(modal: NgbModal,item:string){  
    console.log(item);
    
  this._modalService.open(modal, {
    centered: true,
    backdrop: 'static',
    size: 'xl',
    scrollable: true
  });

  this._ProduccionService.mostrarOrdenCompraArima(item).subscribe(
    (resp:any) => {
      if(resp["success"]){
        this.listaDettalleCC=resp["content"];
      }else{
        this.listaDettalleCC=[];
      }

      console.log(this.listaDettalleCC);
      
        
    }
  )
   
  }

}
