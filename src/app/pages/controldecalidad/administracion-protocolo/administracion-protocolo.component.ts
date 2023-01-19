import { Component, OnInit } from '@angular/core';
import { ProtocoloDescripcionModel } from '@data/interface/Response/DatosFormatoDescripcionProtocolo.interface';
import { GrupoModel } from '@data/interface/Response/DatosFormatoGrupo.interface';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-administracion-protocolo',
  templateUrl: './administracion-protocolo.component.html',
  styleUrls: ['./administracion-protocolo.component.css']
})
export class AdministracionProtocoloComponent implements OnInit {
  Listarmarcaprotocolo:ProtocoloDescripcionModel[]=[];
  Listarhebraprotocolo:ProtocoloDescripcionModel[]=[];
  ListarGrupo:GrupoModel[]=[];
  constructor(private _GenericoService:GenericoService) { }

  ngOnInit(): void {
    this.listarGrupo();
    this.ListarMarcaProtocolo();
    this.ListarHebraProtocolo();
  }

  listarGrupo(){
    this._GenericoService.ListarGrupo().subscribe(
      (resp:any)=>{
            if(resp["success"]){
              this.ListarGrupo=resp["content"];
            }
    })
  }

  ListarMarcaProtocolo(){
    this._GenericoService.ListarMarcaProtocolo('01','CAMPO01').subscribe(
      (resp:any)=>{
          if(resp["success"]){
            this.Listarmarcaprotocolo=resp["content"];
          }else{
            this.Listarmarcaprotocolo=[];
          }
      }
    )
  }

  ListarHebraProtocolo(){
    this._GenericoService.ListarMarcaProtocolo('01','CAMPO02').subscribe(
      (resp:any)=>{
          if(resp["success"]){
            this.Listarhebraprotocolo=resp["content"];
            // console.log("first")
          }else{
            this.Listarhebraprotocolo=[];
          }
      }
    )
  }

 

  
  
}
