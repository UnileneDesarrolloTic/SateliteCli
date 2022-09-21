import { Component, OnInit } from '@angular/core';
import { GrupoModel } from '@data/interface/Response/DatosFormatoGrupo.interface';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-administracion-protocolo',
  templateUrl: './administracion-protocolo.component.html',
  styleUrls: ['./administracion-protocolo.component.css']
})
export class AdministracionProtocoloComponent implements OnInit {

  ListarGrupo:GrupoModel[]=[];
  constructor(private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    this.listarGrupo();
  }

  listarGrupo(){
    this._GenericoService.ListarGrupo().subscribe(
      (resp:any)=>{
            if(resp["success"]){
              console.log(resp["content"]);
              this.ListarGrupo=resp["content"];
            }
    })
  }

 

  
  
}
