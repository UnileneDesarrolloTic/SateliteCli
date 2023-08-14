import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Empleado } from '@data/interface/Response/GestionEquipoEngaste/DatosFormatoEmpleado.interface';
import { GestionEquipoEngasteService } from '@data/services/backEnd/pages/gestion-equipo-engaste.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-modal-empleador',
  templateUrl: './modal-empleador.component.html',
  styleUrls: ['./modal-empleador.component.css']
})
export class ModalEmpleadorComponent implements OnInit {
  listadoempleado: Empleado[] = [];
  TempListaEmpleado : Empleado[] = [];
  textFilterEmpleado = new FormControl('');
  constructor(public activeModal: NgbActiveModal, private _GestionEquipoEngasteService: GestionEquipoEngasteService) { }

  ngOnInit(): void {
    this.listarEmpleado();
    this.instanciarObservadoresFilter();
  }

  instanciarObservadoresFilter() {
    this.textFilterEmpleado.valueChanges.pipe(debounceTime(900)).subscribe(_ => {
      this.filtroItem();
    });
  }

  filtroItem() {
    if (this.textFilterEmpleado.value != '') {
      this.listadoempleado = this.TempListaEmpleado.filter((element:any) => element.nombreCompleto.toUpperCase().indexOf(this.textFilterEmpleado.value.toUpperCase()) !== -1);
    } else {
      this.listadoempleado = this.TempListaEmpleado
    }
  }

  listarEmpleado(){
    this._GestionEquipoEngasteService.empleado().subscribe(
        (resp:any)=>{
            this.listadoempleado =  resp;
            this.TempListaEmpleado =  resp;
        }
    );
  }

    
  ObtenerCliente(itemCliente){
      this.activeModal.close(itemCliente);
  }

}
