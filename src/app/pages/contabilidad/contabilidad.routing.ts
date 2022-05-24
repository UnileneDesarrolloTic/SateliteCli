import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
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
    ]
  },


]
