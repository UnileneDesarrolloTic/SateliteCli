import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { MenuInfo } from '@data/interface/menu.model';
import { MENU_DATA } from '@data/mocks/menu-data';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public screenWidth: any;
  public collapseSidebar: boolean = false;
  public fullScreen: boolean = false;

  MENUITEMS: MenuInfo[] = MENU_DATA;

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient){}

  items = new BehaviorSubject<MenuInfo[]>(this.MENUITEMS);

  obtenerMenuUsuarioSesion(){
    return this._http.get<MenuInfo[]>(this.url+"/api/Common/ObtenerMenuUsuarioSesion").pipe(
      catchError( () => throwError("Error al obtener el menú") )
    );
  }

}
