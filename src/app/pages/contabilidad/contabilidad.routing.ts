import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { AnalisiscostosListaprecioComponent } from "./analisiscostos-listaprecio/analisiscostos-listaprecio.component";
import { DetraccionesComponent } from "./detracciones/detracciones.component";

export const ContabilidadRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'Detraccion',
        component: DetraccionesComponent,
        data: {
          title: "Declaración de detracción al: "+ (new Date().toLocaleString("es-Cl")).substring(0,10) ,
          urls: [
            {title: 'Detracción' }
          ]
        }
      },
      {
        path: 'AnalisisCosto',
        component: AnalisiscostosListaprecioComponent,
        data: {
          title: "Análisis de Costo y Lista de Precios",
          urls: [
            {title: 'Detracción' }
          ]
        }
      },
    ]
  },


]
