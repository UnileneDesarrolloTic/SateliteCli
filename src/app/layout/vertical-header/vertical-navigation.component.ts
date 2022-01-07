import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';
import { SesionService } from './../../shared/services/comunes/sesion.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  templateUrl: './vertical-navigation.component.html'
})
export class VerticalNavigationComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  sesionUsuario: UsuarioSesionData;

  nombreUsuario: string = "";

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  constructor(private _sesionService: SesionService) {
    this.sesionUsuario = _sesionService.datosPersonales();
    this.nombreUsuario = this.sesionUsuario.nombres.split(" ",1) + ' ' + this.sesionUsuario.apellidoPaterno
  }

  cerrarSesion(){
    this._sesionService.cerrarSesion();
  }
}
