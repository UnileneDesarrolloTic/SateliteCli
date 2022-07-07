import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';

@Component({
  selector: 'app-listar-proceso',
  templateUrl: './listar-proceso.component.html',
  styleUrls: ['./listar-proceso.component.css']
})
export class ListarProcesoComponent implements OnInit {
  @Input() idProceso:number;

  ListarProceso:DatosListarProceso[]=[];
  nombreProceso:string;
  constructor(private _activatedRoute : ActivatedRoute,
              private _router: Router,
              private _licitacionesServices:LicitacionesService,
              ) { 
               
              }

  ngOnInit(): void {
    this.ListarProcesoTabla()
    
  }

  NuevoProceso(){
    this._router.navigate(['Licitaciones','proceso','nuevo-proceso']);
  }

  DetalleProceso(){
    this._router.navigate(['Licitaciones','proceso','programacion-proceso']);
  }

  AbrirModuloMuestrayEnsayo(proceso: any){
    this.nombreProceso=proceso.descripcionProceso;
    this._router.navigate(['Licitaciones', 'proceso', 'muestra-ensayo-proceso', proceso.idProceso]);
  }

  AbrirModuloContrato(idproceso: number){
    
    this._router.navigate(['Licitaciones', 'proceso', 'contrato', idproceso]);
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
