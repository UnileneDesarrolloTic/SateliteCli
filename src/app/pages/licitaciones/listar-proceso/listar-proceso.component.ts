import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';

@Component({
  selector: 'app-listar-proceso',
  templateUrl: './listar-proceso.component.html',
  styleUrls: ['./listar-proceso.component.css']
})
export class ListarProcesoComponent implements OnInit {
  @Input() idProceso:number;

  ListarProceso:DatosListarProceso[]=[];
  constructor(private _activatedRoute : ActivatedRoute,
              private _router: Router,
              private _licitacionesServices:LicitacionesService,
              private _ServiceGenerico:GenericoService
              ) { }

  ngOnInit(): void {
    this.ListarProcesoTabla()
  }

  NuevoProceso(){
    this._router.navigate(['Licitaciones','proceso','nuevo-proceso']);
  }

  DetalleProceso(){
    this._router.navigate(['Licitaciones','proceso','programacion-proceso']);
  }


  AbrirModuloMuestrayEnsayo(idproceso: number){
    this._ServiceGenerico.idParams.emit({
        data:idproceso
    });
    this._router.navigate(['Licitaciones', 'proceso', 'muestra-ensayo-proceso', ':idproceso'],
                          { state: { idproceso: idproceso } }
                           );
  }

  AbrirModuloGuias(idproceso:number){
    this._router.navigate(['Licitaciones', 'proceso', 'estado-guia', ':idproceso'],
                          { state: { idproceso: idproceso } }
                           );
  }
  

  ListarProcesoTabla(){
    this._licitacionesServices.ListarProceso().subscribe(
      (resp:any)=>{
        this.ListarProceso=resp;
      }
    );
  }

  
  



}
