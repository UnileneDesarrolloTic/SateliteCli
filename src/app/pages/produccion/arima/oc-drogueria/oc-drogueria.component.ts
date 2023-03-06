import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MostrarOrdenCompraDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarOrdenCompra.interface';
import { MostrarProveedorDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoMostrarProveedor.interface';
import { ModelSeguimientoDrogueria } from '@data/interface/Response/OCDrogueria/DatosFormatoSeguimientoDrogueria.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ModalOcVencidasComponent } from '@shared/components/modal-oc-vencidas/modal-oc-vencidas.component';
import { Toast, ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
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

  abrirModalMostrarOC(modal: NgbModal, fila: ModelSeguimientoDrogueria) {
    this.obtenerOrdenCompra(fila.item);
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: false
    });
  }

  mostrarProveedor() {
    this._ProduccionService.mostrarProveedores().subscribe(
      (resp: any) => {
        this.proveedores = resp["content"];
      }
    )
  }

  obtenerOrdenCompra(Item) {
    this.itemModalOC = Item;
    this._ProduccionService.mostarOrdenCompraItem(Item).subscribe(
      (resp: any) => {
        this.listarOrdenCompraDrogueria = resp["content"];
      }
    )
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
      error=> {
            ModalCarga.close();
            this.flagEsperaExcel=false;
      }
    );
  }

  // accesosPermiso(){
  //   this._GenericoService.AccesosPermiso('BTN0002').subscribe(
  //     (resp:any)=>{
  //         this.PermisoAcceso=resp["content"];
  //     },
  //     _=>{
  //         this._toastr.error("Error al validar el permiso por boton")
  //     }
  //   );
  // }


  verTransito(){
    this.listarOrdenCompraDrogueria=[];
    const ModalTransito = this._modalService.open(ModalOcVencidasComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: true
    });

    ModalTransito.result.then((result) => 
    {
      
    }, (reason) => {
       
    });
  }

  quitarTransito(ordenItem:MostrarOrdenCompraDrogueria){
    let rpta:boolean=true;
    rpta = confirm(`¿Esta seguro de quitar del transito la ${ordenItem.numeroOrden} con el Item ${ this.itemModalOC} ? `);

    if (rpta)
    {
      let comentario = prompt(`Por favor, el motivo por qué desea quitar la ${ordenItem.numeroOrden} con el Item ${this.itemModalOC}`,'');
      const datos = 
      {
        numeroOrden: ordenItem.numeroOrden,
        item : this.itemModalOC,
        comentario: comentario
      }

      this._ProduccionService.GuardarOrdenCompraVencida(datos).subscribe(
          (resp:any)=>{
            if(resp["success"]){
              this.listarOrdenCompraDrogueria = this.listarOrdenCompraDrogueria.filter((filacompra:MostrarOrdenCompraDrogueria) => (filacompra.numeroOrden != ordenItem.numeroOrden))
              this._toastr.success(resp["message"],"Guardado", { timeOut: 4000, closeButton: true });
            }
          }
      ) 
    }
    
  }

}
