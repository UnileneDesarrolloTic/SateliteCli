import { Component, OnInit } from '@angular/core';
import { DatosFormatoPersonaTecnico } from '@data/interface/Response/DatosFormatoPersonaTecnica.interfaces';
import { UsuarioService } from '@data/services/backEnd/pages/usuario.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-listar-persona',
  templateUrl: './listar-persona.component.html',
  styleUrls: ['./listar-persona.component.css']
})
export class ListarPersonaComponent implements OnInit {
  buscarNombre:string="";
  ListarDatosFormatoPersonaTecnico:DatosFormatoPersonaTecnico[]=[];
  TmpListarDatosFormatoPersonaTecnico:DatosFormatoPersonaTecnico[]=[];
  SeleccionArrayListar:DatosFormatoPersonaTecnico[]=[];
  constructor(public activeModal: NgbActiveModal,
              private _UsuarioService:UsuarioService,
              private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    console.log(this._GenericoService.RedondearDecimales("SADSAD",2,false))
    this.listarPersona();
  }

  listarPersona(){
     
      this._UsuarioService.ListarPersonaTecnica().subscribe(
        (resp:any)=>{
              this.ListarDatosFormatoPersonaTecnico=resp;
              this.TmpListarDatosFormatoPersonaTecnico= resp;
        }
      )
  }


  SeleccionaItem(rowItem:DatosFormatoPersonaTecnico){
    this.SeleccionArrayListar=[];

  

  
  }

}
