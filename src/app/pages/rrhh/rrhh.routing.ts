import { ReporteAsistenciaComponent } from '@pages/rrhh/reporteasistencia/reporteasistencia.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { HorasextrasComponent } from './horasextras/horasextras.component';

export const RRHHRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
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
      {
        path: 'HorasExtras',
        component: HorasextrasComponent,
        data: {
          title: "Horas Extras",
          urls: [
            {title: 'Formulario Horas Extras' }
          ]
        }
      },
    ]
  },
]
