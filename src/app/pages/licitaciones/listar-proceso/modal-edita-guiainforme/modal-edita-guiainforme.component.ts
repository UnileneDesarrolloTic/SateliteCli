import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-edita-guiainforme',
  templateUrl: './modal-edita-guiainforme.component.html',
  styleUrls: ['./modal-edita-guiainforme.component.css']
})
export class ModalEditaGuiainformeComponent implements OnInit {
  FormularioEditar:FormGroup;
  constructor(public activeModal: NgbActiveModal) { }

  @Input() fromParent;
  ngOnInit(): void {
    console.log(this.fromParent);
    this.CrearFormulario();
  }

  CrearFormulario(){
    this.FormularioEditar =  new FormGroup({
      Estado: new FormControl(''),
      Comentario: new FormControl(''),
    })
  }


  EstadoColor(Estado){
		let Color='';
		switch (Estado) {
			case '1':
				Color='green';
				break;
			case '2':
				Color='red';
				break;
			case '3':
				Color='blue';
			default:
				break;
		}
		return Color;
	}

  Guardar(){
      console.log(this.FormularioEditar.value);
  }

}
