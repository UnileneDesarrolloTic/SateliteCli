import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { DetraccionesComponent } from "./detracciones/detracciones.component";

export const ContabilidadRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children : [
      {
        path: 'Detraccion',
        component: DetraccionesComponent,
        data: {
          title: "Detraccion",
          urls: [
            {title: 'Detraccion' }
          ]
        }
      },
    ]
  },
 

]
