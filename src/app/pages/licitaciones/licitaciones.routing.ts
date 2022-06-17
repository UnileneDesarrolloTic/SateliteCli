import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ConfirmExitGuard } from "@guard/confirm-exit.guard";
import { DistribucionProcesoComponent } from "./distribucion-proceso/distribucion-proceso.component";
import { ListarProcesoComponent } from "./listar-proceso/listar-proceso.component";
import { NuevoProcesoComponent } from "./listar-proceso/nuevo-proceso/nuevo-proceso.component";
import { ProgramacionProcesoComponent } from "./listar-proceso/programacion-proceso/programacion-proceso.component";
import { ProcesoMuestraEnsayoComponent } from "./listar-proceso/proceso-muestra-ensayo/proceso-muestra-ensayo.component";

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
        path: 'programacion-proceso',
        component: ProgramacionProcesoComponent,
        data: {
          title: "Programación Proceso"
        }
      },
      {
        path: 'muestra-ensayo-proceso/:idproceso',
        canDeactivate: [ConfirmExitGuard],
        component: ProcesoMuestraEnsayoComponent,
        data: {
          title: "Muestra y Ensayo",
          urls: [
            { title: 'Proceso Muestra y Ensayo', url: '/Licitaciones/proceso/listar-proceso'},
            { title: 'Muestra y Ensayo' }
          ]
        },
      }
      
    ],
  },
  {
    path: 'distribucion-proceso',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'procesos',
        component: DistribucionProcesoComponent,
        data: {
          title: "Distribucion Procesos",
          
        }
      },
    ]
  },


]
