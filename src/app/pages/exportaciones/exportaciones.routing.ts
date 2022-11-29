import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ConfirmExitGuard } from "@guard/confirm-exit.guard";
import { FormularioCotizacionComponent } from "./Cotizacion/formulario-cotizacion/formulario-cotizacion.component";
import { ListarCotizacionComponent } from "./Cotizacion/listar-cotizacion/listar-cotizacion.component";

export const ExportacionesRoutes: Routes = [
  {
    path: 'Cotizacion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'listar',
        component: ListarCotizacionComponent,
        data: {
          title: "Cotización",
          urls: [
            { title: 'Cotización' },
            { title: 'Exportaciones' }
            
          ]
        }
      },
      {
        path: ':codDocumento',
        canDeactivate: [ConfirmExitGuard],
        component: FormularioCotizacionComponent,
        data: {
          title: "Formulario Cotización",
          urls: [
            { title: 'Exportaciones', url: '/Exportaciones/Cotizacion/listar'},
            { title: 'Exportaciones' }
          ]
        },
      },
      
    ]
  },
]
