import { ReporteAsistenciaComponent } from '@pages/rrhh/reporteasistencia/reporteasistencia.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";

export const RRHHRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children : [
      {
        path: 'ReporteAsistencia',
        component: ReporteAsistenciaComponent,
        data: {
          title: "Reporte Asistencia",
          urls: [
            {title: 'Reporte Asistencia' }
          ]
        }
      },
    ]
  },
]
