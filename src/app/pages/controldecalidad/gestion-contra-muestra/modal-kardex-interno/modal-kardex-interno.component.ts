import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-kardex-interno',
  templateUrl: './modal-kardex-interno.component.html',
  styleUrls: ['./modal-kardex-interno.component.css']
})
export class ModalKardexInternoComponent implements OnInit {
  form:FormGroup;
  @Input() fromParent;
  constructor( public activeModal: NgbActiveModal,
                private fb:FormBuilder,) {

    this.form=this.fb.group({
      SeleccionFormato:[null,[Validators.required]]
    });

   }

  ngOnInit(): void {
    console.log(this.fromParent);
  }

  save(){}
}
