import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent implements OnInit {
  @Input() fromParent;
  ListaClientes:Object[]=[];
  TempListaClientes:Object[]=[];
  textFilterCliente = new FormControl('');

  constructor(public activeModal: NgbActiveModal) {
      
   }

  ngOnInit(): void {
    this.ListaClientes=this.TempListaClientes=this.fromParent.listarclientes;
    this.instanciarObservadoresFilter();
  }

  instanciarObservadoresFilter() {
    this.textFilterCliente.valueChanges.pipe(debounceTime(900)).subscribe(_ => {
      this.filtroItem();
    });
  }

  filtroItem() {
    if (this.textFilterCliente.value != '') {
      this.ListaClientes = this.TempListaClientes.filter((element:any) => element.nombreCompleto.toUpperCase().indexOf(this.textFilterCliente.value.toUpperCase()) !== -1);
    } else {
      this.ListaClientes = this.TempListaClientes
    }
  }

    
  ObtenerCliente(itemCliente){
      this.activeModal.close(itemCliente);
  }


}
