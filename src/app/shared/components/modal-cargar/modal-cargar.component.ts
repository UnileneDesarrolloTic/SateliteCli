import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-cargar',
  templateUrl: './modal-cargar.component.html',
  styleUrls: ['./modal-cargar.component.css']
})
export class ModalCargarComponent implements OnInit {
  

  @Input() fromParent;
  Frase:string="";
 

  constructor(private modalService: NgbModal,
            public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
      this.Frase=this.fromParent;
  }
  

}
