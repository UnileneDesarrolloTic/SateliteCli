import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensaje-advertencia',
  templateUrl: './mensaje-advertencia.component.html',
  styleUrls: ['./mensaje-advertencia.component.css']
})
export class MensajeAdvertenciaComponent implements OnInit {
  @Input() fromParent;
  Frase:string="";
 

  constructor(private modalService: NgbModal,
            public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
      this.Frase=this.fromParent;
  }

  submit(){
    this.activeModal.close(true);
  }
}
