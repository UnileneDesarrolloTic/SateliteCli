import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuInfo } from '@data/interface/menu.model';
import { MenuService } from '@shared/services/plantilla/menu.service';
import { Router } from '@angular/router';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';

declare var $: any;

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html'
})
export class VerticalSidebarComponent {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: MenuInfo[] = [];
  path = '';
  sesionUsuario: UsuarioSesionData;
  nombreUsuario: string = "";

  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();


  handleNotify() {
    this.notify.emit(!this.showClass);
  }

  constructor(private menuServise: MenuService, private router: Router, private _sesionService: SesionService, private _toast: ToastrService) {

    this.sesionUsuario = _sesionService.datosPersonales();
    this.nombreUsuario= this.sesionUsuario.nombres.split(" ",1) + ' ' + this.sesionUsuario.apellidoPaterno

    this.menuServise.obtenerMenuUsuarioSesion().subscribe( menuItems => {

      if(menuItems.length < 1) {
        _toast.warning('No cuenta con ningun permiso asignado.', 'Sin accesos.')
        _sesionService.cerrarSesion;
      }
      this.sidebarnavItems = menuItems;
      // Active menu
      this.sidebarnavItems.filter(m => m.subMenu.filter(
        (s) => {
          if (s.ruta === this.router.url) {
            this.path = m.titulo;
          }
        }
      ));
      this.addExpandClass(this.path);
    });

  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  cerrarSesion(){
    this._sesionService.cerrarSesion();
  }
}
