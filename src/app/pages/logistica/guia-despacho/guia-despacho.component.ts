import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DispensacionGuiaDespacho } from '@data/interface/Response/Dispensacion/DatosFormatoDispensacionGuiaDespacho.interface';
import { InformacionDispensacionGuiaDespacho } from '@data/interface/Response/Dispensacion/DatosFormatoMostrarGuiaDespacho.interfaces';
import { DispensacionService } from '@data/services/backEnd/pages/dispensacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPdfComponent } from '@shared/components/modal-pdf/modal-pdf.component';

@Component({
  selector: 'app-guia-despacho',
  templateUrl: './guia-despacho.component.html',
  styleUrls: ['./guia-despacho.component.css']
})
export class GuiaDespachoComponent implements OnInit {
  flagLoadingLista: boolean = false;
  formFiltros: FormGroup;
  guiaDespacho: DispensacionGuiaDespacho[] = [];
  informacionGuiaDespacho: InformacionDispensacionGuiaDespacho[] = [];
  generadorCodigo: SafeResourceUrl;

  constructor(private _DispensacionService: DispensacionService, private _modalService: NgbModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarDespacho();

  }

  crearFormulario() {
    this.formFiltros = new FormGroup({
      fechaInicio: new FormControl(null),
      fechaFin: new FormControl(null)
    })
  }

  listarDespacho() {
    this._DispensacionService.dispensacionGuiaDespacho(this.formFiltros.value).subscribe(
      (resp: any) => {
        this.guiaDespacho = resp;
      }
    )
  }

  modalverDispensacion(modal: NgbModal, fila: DispensacionGuiaDespacho) {
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
      scrollable: true,
      windowClass: 'my-class',
    });

    this._DispensacionService.mostrarDispensacionGuiaDespacho(fila.id).subscribe(
      (resp: any) => {
        this.informacionGuiaDespacho = resp;
      }
    )
  }


  imprimir(fila: DispensacionGuiaDespacho) {
    this._DispensacionService.generacionCodigoBarra(fila.id).subscribe(
      (resp: any) => {
          if(resp["success"]){
            const modalCodigoBarra = this._modalService.open(ModalPdfComponent, {
              ariaLabelledBy: 'modal-basic-title',
              centered: true,
              backdropClass: 'light-blue-backdrop',
              backdrop: 'static',
              size: 'dm',
              scrollable: true,
              keyboard: false
            });
        
            modalCodigoBarra.componentInstance.base = resp["content"];
            modalCodigoBarra.componentInstance.estilo = "width:100%; height: 400px;";
            modalCodigoBarra.componentInstance.titulo = "Generación Código Barra";
            modalCodigoBarra.result.then((result) => {
              
            }, (reason) => {
             
            });
          }
      }
    );


  }
}
