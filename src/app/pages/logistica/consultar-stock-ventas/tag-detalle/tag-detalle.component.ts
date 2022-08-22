import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetalleItemVentasModel } from '@data/interface/Response/DatosFormatosItemVentasDetalle.interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { debounceTime } from 'rxjs/operators';
import { ModalDetalleComprometidoComponent } from '../modal-detalle-comprometido/modal-detalle-comprometido.component';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tag-detalle',
  templateUrl: './tag-detalle.component.html',
  styleUrls: ['./tag-detalle.component.css']
})
export class TagDetalleComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  @Input() ListarItemDetalle:DetalleItemVentasModel[]=[];
  @Input() ListarItemDetalleTemporal:DetalleItemVentasModel[]=[];
  @Input() periodo:string;

  textFilterCtrl = new FormControl('');

  constructor(private _modalService: NgbModal,
              private _LogisticaService: LogisticaService,
              private servicebase64:Cargarbase64Service,
              private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.ListarItemDetalleTemporal=this.ListarItemDetalle;
    this.instanciarObservadoresFilter();
  }

  instanciarObservadoresFilter(){
    this.textFilterCtrl.valueChanges.pipe(debounceTime(900)).subscribe(_ => {
      this.filtroItem();
    })
  }

  filtroItem(){
    if (this.textFilterCtrl.value != '') {
      const TextFiltro = this.textFilterCtrl.value.toLowerCase().trim();
      this.ListarItemDetalle = this.ListarItemDetalleTemporal.filter(element => element.item.toLowerCase().indexOf(TextFiltro) !== -1 || element.descripcionItem?.toLowerCase().indexOf(TextFiltro) !== -1 );
    } else {
      this.ListarItemDetalle = this.ListarItemDetalleTemporal;
    }
  }

  abrirModal(row:DetalleItemVentasModel){
    
    const modalRef = this._modalService.open(ModalDetalleComprometidoComponent, {
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
    this._LogisticaService.ListarItemVentasDetalleExportar().subscribe(
      (resp:any)=>{
        if(resp.success){
          this.servicebase64.file(resp.content,`ReporteItemventasDetalle-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );
  }

}
