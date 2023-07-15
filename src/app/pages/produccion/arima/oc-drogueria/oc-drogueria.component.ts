import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MostrarOrdenCompraDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarOrdenCompra.interface';
import { MostrarProveedorDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarProveedor.interface';
import { OrdenCompraPrevio } from '@data/interface/Response/OCDrogueria/DatosFormatoOrdenCompraPrevio.interface';
import { ModelSeguimientoDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoSeguimientoDrogueria.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { ModalVerTransitoComponent } from '@shared/components/modal-ver-transito/modal-ver-transito.component';
import { FullComponent } from '@layout/full/full.component';
import { FileService } from '@shared/services/comunes/file.service';
import { GenericoService } from '@shared/services/comunes/generico.service';

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
  ordenCompraPrevio: OrdenCompraPrevio[] = [];

  itemModalOC: string = "";
  formularioFiltro: FormGroup;
  flagEspera: boolean = false;
  flagEsperaExcel: boolean = false;

  checkMostrarColumna = new FormControl(false);
  textFiltrar = new FormControl('');
  reporteDrogueria = new FormControl('sinGrupo');
  flagEsperaExcelAgrupador: boolean = false;
  flagMostrarBotontransito: boolean = false;
  flagMostrarColumnatransito:boolean = false;

  constructor(private _ProduccionService: ProduccionService,
    private _modalService: NgbModal,
    private _toastr: ToastrService,
    private _FileService: FileService,
    private _fullcomponent: FullComponent,
    private _GenericoService: GenericoService) {
    this._fullcomponent.options.sidebartype = 'mini-sidebar'

  }

  ngOnInit(): void {
    // this.accesosPermiso();

    this.filtroFormulario();
    this.mostrarProveedor();
    this.reporteSeguimientoDrogueria();
    this.isObservableFiltro();
    this.generarOrdenCompra();
    this.generarOC();

    this.permisoBotonTransito();
    this.permisoColumnaTransito();
  }

  ngAfterViewInit() {

  }

  filtroFormulario() {
    this.formularioFiltro = new FormGroup({
      idproveedor: new FormControl(null),
    })
  }

  isObservableFiltro() {
    this.textFiltrar.valueChanges.pipe(debounceTime(900)).subscribe(valorBusqueda => {
      this.filtrar(valorBusqueda);
    })
  }

  filtrar(valorBusqueda) {
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
          this.templistarItemDrogueria = resp["content"];          
        } else {
          this.listarItemDrogueria = resp["content"];
          this.templistarItemDrogueria = resp["content"];
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

  abrirModalMostrarOC(Item: string) {
    const ModalTransito = this._modalService.open(ModalVerTransitoComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
    ModalTransito.componentInstance.Item = Item;
    ModalTransito.componentInstance.mostrarBotonTransito= this.flagMostrarBotontransito;
    ModalTransito.result.then((result) => {

    }, (refrescado) => {
      if (refrescado > 0) {
        this.reporteSeguimientoDrogueria();
      }
    });
  }


  generarOrdenCompra() {
    this._ProduccionService.generarOrdenCompraPrevios().subscribe(
      (resp: any) => {
        this.ordenCompraPrevio = resp["content"];
      },

    )
  }


  verTransito() {
    this.listarOrdenCompraDrogueria = [];
    const ModalTransito = this._modalService.open(ModalVerTransitoComponent, {
      windowClass: 'my-class',
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });

    ModalTransito.componentInstance.Item = '';
    ModalTransito.componentInstance.mostrarBotonTransito= this.flagMostrarBotontransito;
    ModalTransito.componentInstance.flagMostrarColumnatransito= this.flagMostrarColumnatransito;
    ModalTransito.result.then((result) => {

    }, (refrescado) => {
      if (refrescado > 0) {
        this.reporteSeguimientoDrogueria();
      }
    });
  }


  generarOC() {
    this._ProduccionService.generarOrdenCompraDrogueria().subscribe(
      (resp: any) => {
        if (resp["success"]) {
          this._toastr.success(resp["message"])
          this.listadoOrdenCompra();
        }
      }
    );
  }


  listadoOrdenCompra() {
    this._ProduccionService.generarOrdenCompraPrevios().subscribe(
      (resp: any) => {
        this.ordenCompraPrevio = resp["content"];
      },

    )
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
    this.flagEsperaExcelAgrupador = true;

    this._ProduccionService.exportarCompraDrogueria(this.formularioFiltro.controls.idproveedor.value, this.checkMostrarColumna.value, this.reporteDrogueria.value).subscribe(
      (resp: any) => {
        if (resp.success) {
          this._FileService.decargarExcel_Base64(resp.content, `CompraDrogueria-${this.hoy}`, 'xlsx');
        } else {
          this._toastr.info(resp.message);
        }
        this.flagEsperaExcelAgrupador = false;
      },
      _ => this.flagEsperaExcelAgrupador = false
    );
  }

  
  getRowClass = (row:ModelSeguimientoDrogueria) => {
    if (row.idGestionarColor == 0)
    {
       return {'row-color-gestioncompra': true  };
    }

    if (row.idGestionarColor == 1)
    {
      return {'row-color-nocomprar': true};
    }

    if (row.idGestionarColor == 2)
    {
      return {'row-color-comercial': true};
    }
  }

  permisoBotonTransito(){
    this._GenericoService.AccesosPermiso('BTN002').subscribe(
      (resp:any)=>{
          if(resp["success"])
              this.flagMostrarBotontransito = resp["content"];
          else
              this.flagMostrarBotontransito = false;
      }
    )
  }

  permisoColumnaTransito(){
    this._GenericoService.AccesosPermiso('CLN002').subscribe(
      (resp:any)=>{
          if(resp["success"])
              this.flagMostrarColumnatransito = resp["content"];
          else
              this.flagMostrarColumnatransito = false;
      }
    )
  }

}
