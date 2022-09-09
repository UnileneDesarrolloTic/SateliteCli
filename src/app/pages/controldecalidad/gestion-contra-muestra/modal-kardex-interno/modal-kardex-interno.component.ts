import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
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
                private fb:FormBuilder,
                public _ControlcalidadService:ControlcalidadService) {

    this.form=this.fb.group({
      SeleccionFormato:[null,[Validators.required]]
    });

   }

  ngOnInit(): void {
    console.log(this.fromParent.lote);
    this.ListarKardexInternoGCM();
  }

  ListarKardexInternoGCM(){
    this._ControlcalidadService.ListarKardexInternoGCM(this.fromParent.lote).subscribe(
      (resp:any)=>{
        console.log(resp);
      }
    )
  }

  save(){}
}
