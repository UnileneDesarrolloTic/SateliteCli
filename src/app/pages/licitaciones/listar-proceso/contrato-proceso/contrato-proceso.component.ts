import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DatosContratoProcesos } from '@data/interface/Response/Agrupados/Licitaciones.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contrato-proceso',
  templateUrl: './contrato-proceso.component.html',
  styleUrls: ['./contrato-proceso.component.css']
})
export class ContratoProcesoComponent implements OnInit,OnDestroy 
{
  idProceso:number;
  subcripcion : Subscription
  listaContratosProceso: DatosContratoProcesos[] = [];
  flagLoading: boolean = false;
  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado procesos',
    'totalMessage': 'Procesos'
  }
  
  constructor(private _router: Router,
              private _LicitacionesServices:LicitacionesService,
              private toastr: ToastrService,
              private activeroute:ActivatedRoute) 
  {
    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.idProceso=params["idproceso"];
    });
  }

  ngOnInit(): void {  
    this.Listar();
  }

  Listar(){
    this._LicitacionesServices.ListarContratoProceso(this.idProceso).subscribe(
        resp=> this.listaContratosProceso = resp
    )
  }

  Salir()
  {
    this._router.navigate(['Licitaciones', 'proceso','listar-proceso'])
  }

  ngOnDestroy(){
    this.subcripcion.unsubscribe();
  }

  updateValue(event, rowIndex) {
    this.listaContratosProceso[rowIndex].numeroContrato = event.target.value ?? "";
  }

  guardarContratos()
  {
    if(this.flagLoading)
    {
      this.toastr.warning("Se esta registrando la información","Advertencia !!", {closeButton: true, progressBar: true, timeOut: 3000})
      return
    }

    this.flagLoading = true;

    const body = this.listaContratosProceso.map(elem => (
      {idproceso: elem.idproceso, tipodeusuario: elem.tipodeusuario, numeroitem: elem.numeroitem, numeroContrato: elem.numeroContrato}
    ));

    this._LicitacionesServices.RegistrarContratoProceso(body).subscribe(
      _ => {
        this.toastr.success("Se ha registrado correctamente.","Éxito !!", {closeButton: true, progressBar: true, timeOut: 3000})
        this.flagLoading = false;
      }, 
      _ => this.flagLoading = false
    )
  }

}
