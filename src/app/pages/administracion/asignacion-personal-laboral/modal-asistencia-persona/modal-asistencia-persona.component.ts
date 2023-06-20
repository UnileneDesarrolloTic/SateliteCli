import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFormatoAreaPersonalModel } from '@data/interface/Response/DatosFormatoContarAreaPersonal.inteface';
import { PersonaAsistencia } from '@data/interface/Response/DatosPersonaAsistencia.interfaces';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-asistencia-persona',
  templateUrl: './modal-asistencia-persona.component.html',
  styleUrls: ['./modal-asistencia-persona.component.css']
})
export class ModalAsistenciaPersonaComponent implements OnInit {
  @Input() areaFila:DatosFormatoAreaPersonalModel;
  listaPersonaAsistencia:PersonaAsistencia[]=[];
  tempListaPersonaAsistencia:PersonaAsistencia[]=[];
  asistencia = new FormControl('Todos')

  constructor( public activeModal: NgbActiveModal,
                public _UsuarioService: UsuarioService) { }
  
  ngOnInit(): void {
      this.listarPersonaAreaAsistencia(this.areaFila); 
      this.observableFiltrar();
  }

  observableFiltrar(){
    this.asistencia.valueChanges.subscribe((check)=>{
        if(check != 'Todos')
          this.listaPersonaAsistencia = this.tempListaPersonaAsistencia.filter((element=> check == 'Asistieron' ? element.lectora > 0 :  element.lectora == 0 ));
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
