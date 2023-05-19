import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OCPendientesArimaNacionalImportado } from '@data/interface/Response/CompraNacionalImportada/DatosFormatoOCPendientesNacionalImportacion.interface';
import { DatosCompraNacionalImportada } from '@data/interface/Response/CompraNacionalImportada/DatosListadoCompraNacionalImportada.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-compra-nacional-importacion',
  templateUrl: './compra-nacional-importacion.component.html',
  styleUrls: ['./compra-nacional-importacion.component.css']
})
export class CompraNacionalImportacionComponent implements OnInit {
  listadoCompraNacionalImportada: DatosCompraNacionalImportada[]=[];
  templistadoCompraNacionalImportada : DatosCompraNacionalImportada[]=[];
  checkMostrarColumna = new FormControl(false);
  itemModal : string  = "";
  descripcionModal : string  = "";
  listaDettalleOC: OCPendientesArimaNacionalImportado [] = [];

  textFiltrarNacionalImportacion = new FormControl('');
  

  constructor(public _ProduccionService: ProduccionService,
    private _modalService: NgbModal,
    private _fullComponente: FullComponent,
    private _Cargarbase64Service:Cargarbase64Service,
    private _toastr: ToastrService) { 
      this._fullComponente.options.sidebartype = 'mini-sidebar';

  }

  ngOnInit(): void {
    this.listadoComprasAguja();
    this.isObservableFiltro();
  }


  listadoComprasAguja(){
    this._ProduccionService.seguimientoCompraNacionalImportacion().subscribe(
      (resp:any)=>{
            this.listadoCompraNacionalImportada = resp["content"];
            this.templistadoCompraNacionalImportada = resp ["content"];
      },
    );
  }


  isObservableFiltro(){
    this.textFiltrarNacionalImportacion.valueChanges.pipe(debounceTime(900)).subscribe(valorBusqueda=>{
          this.filtrar(valorBusqueda);
    });
  }

  filtrar(valorBusqueda){
    const inputText = valorBusqueda.toLowerCase().trim();
    this.listadoCompraNacionalImportada = this.templistadoCompraNacionalImportada.filter(element => element.itemFinal.toLowerCase().indexOf(inputText) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(inputText) !== -1 );
    
  }

  exportarExcel() {
   
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._ProduccionService.exportarseguimientoCompraNacionalImportacion(this.checkMostrarColumna.value).subscribe(
      (resp:any)=>{
        if(resp.success){
          this._Cargarbase64Service.file(resp.content,`CompraAguja-Nacional-Importada`,'xlsx',ModalCarga);
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


  abrirModalMostrarOC(modal: NgbModal,item:string, tipo:string , descripcion : string ){  

  this.itemModal = item;
  this.descripcionModal = descripcion;

  this._modalService.open(modal, {
    centered: true,
    backdrop: 'static',
    size: 'xl',
    scrollable: true
  });
  
  this._ProduccionService.mostrarOrdenCompraNacionalImportacion(item,tipo,2).subscribe(
    (resp:any) => {
      if(resp["success"]){
        this.listaDettalleOC=resp["content"];
      }else{
        this.listaDettalleOC=[];
      }
    }
  );

  }


}
