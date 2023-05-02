import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MostrarOrdenCompraDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarOrdenCompra.interface';
import { MostrarProveedorDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarProveedor.interface';
import { OrdenCompraPrevio } from '@data/interface/Response/OCDrogueria/DatosFormatoOrdenCompraPrevio.interface';
import { ModelSeguimientoDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoSeguimientoDrogueria.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ModalVerTransitoComponent } from '@shared/components/modal-ver-transito/modal-ver-transito.component';

@Component({
  selector: 'app-oc-drogueria',
  templateUrl: './oc-drogueria.component.html',
  styleUrls: ['./oc-drogueria.component.css']
})
export class OcDrogueriaComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  listarProductoDrogueria: any;
  listarItemDrogueria: ModelSeguimientoDrogueria[] = [];
  templistarItemDrogueria: ModelSeguimientoDrogueria[] = [];
  
  listarOrdenCompraDrogueria: MostrarOrdenCompraDrogueria[] = [];
  proveedores: MostrarProveedorDrogueria[] = [];
  ordenCompraPrevio:OrdenCompraPrevio[]=[];

  itemModalOC: string = "";
  formularioFiltro: FormGroup;
  flagEspera: boolean = false;
  flagEsperaExcel:boolean=false;
  
  checkMostrarColumna = new FormControl(false);
  textFiltrar = new FormControl('');


  constructor(private _ProduccionService: ProduccionService,
    private _modalService: NgbModal,
    private _toastr: ToastrService,
    private _Cargarbase64Service:Cargarbase64Service,
    private _GenericoService : GenericoService) { }

  ngOnInit(): void {
    // this.accesosPermiso();
    this.filtroFormulario();
    this.mostrarProveedor();
    this.reporteSeguimientoDrogueria();
    this.isObservableFiltro();
    this.generarOrdenCompra();
    this.generarOC();
  }

  filtroFormulario() {
    this.formularioFiltro = new FormGroup({
      idproveedor: new FormControl(null),
    })
  }

  isObservableFiltro(){
    this.textFiltrar.valueChanges.pipe(debounceTime(900)).subscribe(valorBusqueda=>{
          this.filtrar(valorBusqueda);
    })
  }

  filtrar(valorBusqueda){
    const inputText = valorBusqueda.toLowerCase().trim();
    this.listarItemDrogueria = this.templistarItemDrogueria.filter(element => element.item.toLowerCase().indexOf(inputText) !== -1 || element.descProveedor?.toLowerCase().indexOf(inputText) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(inputText) !== -1);
  }


  reporteSeguimientoDrogueria() {
    this.listarItemDrogueria = [];
    this.textFiltrar.patchValue('');
    this.flagEspera = true;
    this._ProduccionService.reporteSeguimientoDrogueria(this.formularioFiltro.controls.idproveedor.value).subscribe(
      (resp: any) => {
        if (resp["success"]) {
          this.listarItemDrogueria = resp["content"];
          this.templistarItemDrogueria=resp["content"];
        } else {
          this.listarItemDrogueria = resp["content"];
          this.templistarItemDrogueria=resp["content"];
          this._toastr.info(resp["message"]);
        }
        this.flagEspera = false;
      },
      error => { this.flagEspera = false }
    )
  }

  mostrarProveedor() {
    this._ProduccionService.mostrarProveedores().subscribe(
      (resp: any) => {
        this.proveedores = resp["content"];
      }
    )
  }

  abrirModalMostrarOC(Item : string) {
    const ModalTransito = this._modalService.open(ModalVerTransitoComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
    ModalTransito.componentInstance.Item = Item;
    ModalTransito.result.then((result) => 
    {
      
    }, (refrescado) => {
      if(refrescado > 0)
      {
        this.reporteSeguimientoDrogueria();
      }
    });
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
    this._ProduccionService.exportarCompraDrogueria(this.formularioFiltro.controls.idproveedor.value,this.checkMostrarColumna.value).subscribe(
      (resp:any)=>{
        if(resp.success){
          this._Cargarbase64Service.file(resp.content,`CompraDrogueria-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this._toastr.info(resp.message);
        }
        this.flagEsperaExcel=false;
      },
      _=> {
            ModalCarga.close();
            this.flagEsperaExcel=false;
      }
    );

    }

    generarOrdenCompra(){
      this._ProduccionService.generarOrdenCompraPrevios().subscribe(
        (resp:any)=>{
            this.ordenCompraPrevio=resp["content"];
        },
      
      )
    }
  

  verTransito(){
    this.listarOrdenCompraDrogueria=[];
    const ModalTransito = this._modalService.open(ModalVerTransitoComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });

    ModalTransito.componentInstance.Item = '';
    ModalTransito.result.then((result) => 
    {
      
    }, (refrescado) => {
      if(refrescado > 0)
      {
        this.reporteSeguimientoDrogueria();
      }
    });
  }


  generarOC(){
    this._ProduccionService.generarOrdenCompraDrogueria().subscribe(
        (resp:any)=>{
              if(resp["success"])
              {
                this._toastr.success(resp["message"])
                this.listadoOrdenCompra();
              }
        }
    );
   }


   listadoOrdenCompra(){
    this._ProduccionService.generarOrdenCompraPrevios().subscribe(
      (resp:any)=>{
          this.ordenCompraPrevio=resp["content"];
      },
    
    )
  }




}
