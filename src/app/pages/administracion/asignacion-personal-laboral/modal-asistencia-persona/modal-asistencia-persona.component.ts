import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFormatoAreaPersonalModel } from '@data/interface/Response/DatosFormatoContarAreaPersonal.inteface';
import { PersonaAsistencia } from '@data/interface/Response/DatosPersonaAsistencia.interfaces';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-modal-asistencia-persona',
  templateUrl: './modal-asistencia-persona.component.html',
  styleUrls: ['./modal-asistencia-persona.component.css']
})
export class ModalAsistenciaPersonaComponent implements OnInit {
  @Input() areaFila:DatosFormatoAreaPersonalModel;
  listaPersonaAsistencia:PersonaAsistencia[]=[];
  tempListaPersonaAsistencia:PersonaAsistencia[]=[];
  asistencia = new FormControl('Todos');

  constructor( public activeModal: NgbActiveModal,
                public _UsuarioService: UsuarioService) { }
  
  ngOnInit(): void {
      this.listarPersonaAreaAsistencia(this.areaFila); 
      this.observableTipo();
  }


  observableTipo(){
    this.asistencia.valueChanges.subscribe((check)=>{
      if(check == 'Asistieron')
        this.listaPersonaAsistencia = this.tempListaPersonaAsistencia.filter((element=>  element.asistencia == true ));
      else if (check == 'Justificaciones')
        this.listaPersonaAsistencia = this.tempListaPersonaAsistencia.filter((element=>  element.justificaciones == true ));
      else if (check == 'Vacaciones')
        this.listaPersonaAsistencia = this.tempListaPersonaAsistencia.filter((element=>  element.vacaciones == true ));
      else if (check == 'Injustificado')
        this.listaPersonaAsistencia = this.tempListaPersonaAsistencia.filter((element=>  element.injustificado == true ));
      else
        this.listaPersonaAsistencia = this.tempListaPersonaAsistencia;
    })
  }

  listarPersonaAreaAsistencia(areaFila: DatosFormatoAreaPersonalModel){
      this._UsuarioService.listarPersonaAsistencia(areaFila.idArea).subscribe(
          (resp:any)=>{
            this.listaPersonaAsistencia = resp;
            this.tempListaPersonaAsistencia = resp;
          }
      )
  }

}
