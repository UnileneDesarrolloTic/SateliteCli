import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-maestro-item',
  templateUrl: './modal-maestro-item.component.html',
  styleUrls: ['./modal-maestro-item.component.css']
})
export class ModalMaestroItemComponent implements OnInit {
  @Input() fromParent;
  form:FormGroup;
  ListarArraySubFamilia:ListaFamiliaMaestroItem[]=[];

  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.ListarArraySubFamilia=this.fromParent["Familia"];
    this.CrearFormulario();
  }

  CrearFormulario(){
    this.form = new FormGroup({
      codsut: new FormControl('',[ Validators.required, Validators.minLength(21), Validators.maxLength(21),Validators.pattern("^[a-zA-Z0-9]+$")]),
      familia:  new FormControl(null, Validators.required),
    })
  }

  Guardar(){
    console.log(this.form.value)
  }
}
