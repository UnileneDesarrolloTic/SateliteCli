import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-elegir-documento',
  templateUrl: './modal-elegir-documento.component.html',
  styleUrls: ['./modal-elegir-documento.component.css']
})
export class ModalElegirDocumentoComponent implements OnInit {
  Documento = new FormControl(true);
  constructor(public activeModal: NgbActiveModal,
    private _toastrService: ToastrService,) { }

  ngOnInit(): void {
  }


  SeleccionarDocumento(){
      this.activeModal.close(this.Documento.value);
  }
}
