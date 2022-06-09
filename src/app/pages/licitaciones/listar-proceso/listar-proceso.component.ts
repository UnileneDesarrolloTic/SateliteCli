import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleProcesoComponent } from './detalle-proceso/detalle-proceso.component';

@Component({
  selector: 'app-listar-proceso',
  templateUrl: './listar-proceso.component.html',
  styleUrls: ['./listar-proceso.component.css']
})
export class ListarProcesoComponent implements OnInit {

  ListarProceso:object[]=[];
  constructor(private _activatedRoute : ActivatedRoute,
              private _router: Router,
              private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.ListarProceso=[{proceso:"Cenares Founder & CEO",Monto: 4000 , Estado:"Peldi", Avance:10 , Dist:"N",}]
  }

  NuevoProceso(){
    this._router.navigate(['Licitaciones','proceso','nuevo-proceso']);
  }

  DetalleProceso(){
    this._router.navigate(['Licitaciones','proceso','detalle-proceso']);
  }



}
