import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemVentasModel } from '@data/interface/Response/DatosFormatoItemsVentas.interfaces';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { DetalleItemVentasComponent } from '../detalle-item-ventas/detalle-item-ventas.component';

@Component({
  selector: 'app-tag-resumen',
  templateUrl: './tag-resumen.component.html',
  styleUrls: ['./tag-resumen.component.css']
})
export class TagResumenComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  @Input() ListarItem:ItemVentasModel[]=[];
  @Input() flagLoading:boolean;
  @Input() ObjectBusqueda:object;
  textFilterResumen = new FormControl('');
  ListarItemTemporal:ItemVentasModel[]=[];
  constructor(private _modalService: NgbModal,
              private _LogisticaService: LogisticaService,
              private servicebase64:Cargarbase64Service,
              private toastr: ToastrService ) { }

  
  ngOnInit(): void {
    this.ListarItemTemporal=this.ListarItem;
    this.instanciarObservadoresFilter();
  }

  instanciarObservadoresFilter(){
    this.textFilterResumen.valueChanges.pipe(debounceTime(900)).subscribe(_ => {
      this.filtroItem();
    })
  }

  filtroItem(){
    if (this.textFilterResumen.value != '') {
      const TextFiltro = this.textFilterResumen.value.toLowerCase().trim();
      this.ListarItem = this.ListarItemTemporal.filter(element => element.item.toLowerCase().indexOf(TextFiltro) !== -1 || element.descripcionLocal?.toLowerCase().indexOf(TextFiltro) !== -1 || element.numeroDeParte?.toLowerCase().indexOf(TextFiltro) !== -1);
    } else {
      this.ListarItem = this.ListarItemTemporal;
    }
  }

  abrirModal(row:ItemVentasModel){
    
    const modalRef = this._modalService.open(DetalleItemVentasComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'dark-modal',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });

    modalRef.componentInstance.fromParent = row;
    modalRef.result.then((result) => {
      
    }, (reason) => {
      // console.log("salir2", reason)
    });
  }


  ExportExcel(){
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._LogisticaService.ListarItemVentasExportar(this.ObjectBusqueda).subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`ReporteItemventas-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );
  }
}
