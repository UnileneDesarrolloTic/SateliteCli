import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { DetalleProcesoComponent } from "./listar-proceso/detalle-proceso/detalle-proceso.component";
import { DistribucionProcesoComponent } from "./listar-proceso/distribucion-proceso/distribucion-proceso.component";
import { ListarProcesoComponent } from "./listar-proceso/listar-proceso.component";
import { NuevoProcesoComponent } from "./listar-proceso/nuevo-proceso/nuevo-proceso.component";

export const LicitacionesRoutes: Routes = [
  

  {
    path: 'proceso',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'listar-proceso',
        component: ListarProcesoComponent,
        data: {
          title: "Listar Proceso"
        }
      },
      {
        path: 'nuevo-proceso',
        component: NuevoProcesoComponent,
        data: {
          title: "Nuevo Proceso"
        }
      },
      {
        path: 'detalle-proceso',
        component: DetalleProcesoComponent,
        data: {
          title: "Detalle Proceso"
        }
      },
      {
        path: 'distribucion-proceso',
        component: DistribucionProcesoComponent,
        data: {
          title: "Distribuccion Proceso"
        }
      },
      
    ],
  },


]
