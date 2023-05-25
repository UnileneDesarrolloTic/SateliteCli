import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfigComodity } from '@data/interface/Response/CompraAguja/DatosFormatoListadoCommodity.interface';
import { OCPendientesArimaNacionalImportado } from '@data/interface/Response/CompraNacionalImportada/DatosFormatoOCPendientesNacionalImportacion.interface';
import { DatosCompraNacionalImportada } from '@data/interface/Response/CompraNacionalImportada/DatosListadoCompraNacionalImportada.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { FullComponent } from '@layout/full/full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { FileService } from '@shared/services/comunes/file.service';
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
  material = new FormControl('1');
  itemModal : string  = "";
  descripcionModal : string  = "";
  listaDettalleOC: OCPendientesArimaNacionalImportado [] = [];
  flagEspera:boolean = false;
  flagExcel:boolean = false;
  textFiltrarNacionalImportacion = new FormControl('');
  reporteArima = new FormControl('ambas')
  

  constructor(public _ProduccionService: ProduccionService,
    private _modalService: NgbModal,
    private _fullComponente: FullComponent,
    private _FileService: FileService,
    private _toastr: ToastrService) { 
      this._fullComponente.options.sidebartype = 'mini-sidebar';

  }

  ngOnInit(): void {
    this.listadoComprasAguja();
    this.isObservableFiltro();
  }


  listadoComprasAguja(){
    this.flagEspera = true;
    if(this.material.value == '3')
    {
      this._ProduccionService.seguimientoCompraCommodity().subscribe(
          (resp:any)=>{
              this.listadoCompraNacionalImportada = resp["content"];
              this.templistadoCompraNacionalImportada = resp ["content"];
              this.flagEspera = false;
          },
          _ => { this.flagEspera = false}
      )

    }else
    {
      this._ProduccionService.seguimientoCompraNacionalImportacion(this.material.value).subscribe(
        (resp:any)=>{
              this.listadoCompraNacionalImportada = resp["content"];
              this.templistadoCompraNacionalImportada = resp ["content"];
              this.flagEspera = false;
        },
        _ => { this.flagEspera = false}
      );
    }
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


  exportarExcel(modal: NgbModal) {
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

  }

  aceptarDescarga() {
    
    this.flagExcel = true;
    this._ProduccionService.exportarseguimientoCompraNacionalImportacion(this.checkMostrarColumna.value, this.reporteArima.value).subscribe(
      (resp:any)=>{
        if(resp.success){
          this._FileService.decargarExcel_Base64(resp.content,`CompraAguja-Nacional-Importada`,'xlsx');
        }else{
          this._toastr.info(resp.message);
        }
        this.flagExcel = false;
      },
      _=>this.flagExcel = false    
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
  
  this._ProduccionService.mostrarOrdenCompraNacionalImportacion(item,tipo,this.material.value).subscribe(
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
