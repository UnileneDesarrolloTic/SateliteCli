import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-avance',
  templateUrl: './avance.component.html'
})
export class AvanceComponent implements OnInit {
  
  etapaEncajado: number = 2

  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
  }

  abrirModalReporte(modal: NgbModal) {
    this._modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      scrollable: true
    });
  }

  cambiarEtapa(etapa: number){
    this.etapaEncajado = etapa
  }

}
