import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { GestionGuiasComponent } from "./gestion-guias/gestion-guias.component";
import { MaestroItemComponent } from "./maestro-item/maestro-item.component";

export const LogisticaRoutes: Routes = [
  {
    path: 'MaestroItems',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'listar',
        component: MaestroItemComponent,
        data: {
          title: "Maestro de Item",
          urls: [
            { title: 'Maestro de Items' },
            { title: 'Logistica' }
            
          ]
        }
      },
      
    ]
  },
  {
    path: 'Gestion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'guias',
        component: GestionGuiasComponent,
        data: {
          title: "Gestión de guias",
          urls: [
            { title: 'Gestión de guias' },
            { title: 'Logistica' }
            
          ]
        }
      },
      
    ]
  },


]
