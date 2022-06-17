import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ConfirmExitGuard } from "@guard/confirm-exit.guard";
import { RegistrarPruebasComponent } from "@pages/controldecalidad/analisis-agujas/registrar-pruebas/registrar-pruebas.component";
import { PruebaFlexionComponent } from "@pages/controldecalidad/analisis-agujas/registrar-pruebas/prueba-flexion/prueba-flexion.component";
import { DatosGeneralesComponent } from "./datos-generales/datos-generales.component";
import { PruebaDimensionalComponent } from "@pages/controldecalidad/analisis-agujas/registrar-pruebas/prueba-dimensional/prueba-dimensional.component";
import { PruebaElasticidadPerforacionComponent } from "@pages/controldecalidad/analisis-agujas/registrar-pruebas/prueba-elasticidad-perforacion/prueba-elasticidad-perforacion.component";
import { PruebaDefectosComponent } from "@pages/controldecalidad/analisis-agujas/registrar-pruebas/prueba-defectos/prueba-defectos.component";

export const PruebasAgujasRoutes: Routes = [

  {
    path: '',
    component: RegistrarPruebasComponent,
    data: {
      tile:"ngx-pruebas"
    },
    children : [
      {
        path: 'PruebaFlexion/:codAnalisis',
        canDeactivate: [ConfirmExitGuard],
        component: PruebaFlexionComponent,
        data: {
          pruebaTitle: "Flexión"
        }
      },
      {
        path: 'DatosGenerales/:codAnalisis',
        canDeactivate: [ConfirmExitGuard],
        component: DatosGeneralesComponent,
        data: {
          pruebaTitle: "DatosGenerales"
        }
      },
      {
        path: 'PruebaDimensional/:codAnalisis',
        canDeactivate: [ConfirmExitGuard],
        component: PruebaDimensionalComponent,
        data: {
          pruebaTitle: "PruebaDimensional"
        }
      },
      {
        path: 'PruebaElasticidadPerforacion/:codAnalisis',
        canDeactivate: [ConfirmExitGuard],
        component: PruebaElasticidadPerforacionComponent,
        data: {
          pruebaTitle: "PruebaElasticidadPerforacion"
        }
      },
      {
        path: 'PruebaDefectos/:codAnalisis',
        canDeactivate: [ConfirmExitGuard],
        component: PruebaDefectosComponent,
        data: {
          pruebaTitle: "PruebaDefectos"
        }
      },
    ]
  },
]
