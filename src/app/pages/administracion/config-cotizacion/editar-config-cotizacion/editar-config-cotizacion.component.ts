import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editar-config-cotizacion',
  templateUrl: './editar-config-cotizacion.component.html',
  styleUrls: ['./editar-config-cotizacion.component.css']
})
export class EditarConfigCotizacionComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  @Input() fromParent;
  ngOnInit(): void {
    console.log(this.fromParent);
    
  }

}
