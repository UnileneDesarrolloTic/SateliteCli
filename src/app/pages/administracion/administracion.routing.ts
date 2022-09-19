import { Title } from '@angular/platform-browser';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ListarUsuarioComponent } from "@pages/administracion/usuario/listar-usuario/listar-usuario.component";
import { ConfigCotizacionComponent } from './config-cotizacion/config-cotizacion.component';
import { AsignacionPersonalLaboralComponent } from './asignacion-personal-laboral/asignacion-personal-laboral.component';

export const AdministracionRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'usuarios',
        component: ListarUsuarioComponent,
        data: {
          title: "Mantenimiento de usuario",
          urls: [
            {title: 'Mantenimiento usuario' }
          ]
        },
        children: [
          {
            path:"edit",
            component: EditarUsuarioComponent,
            data: {
              Title:" Editar usuario"
            }
          }
        ]
      },
      {
        path: 'configcotizacion',
        component: ConfigCotizacionComponent,
        data: {
          title: "Config Cotizacion",
          urls: [
            {title: 'Configuracion Cotizacion' }
          ]
        },
      },
      {
        path: 'AsignacionPersonaLaboral',
        component: AsignacionPersonalLaboralComponent,
        data: {
          title: "Asig. Persona Laboral",
          urls: [
            {title: 'Asiginación Persona Laboral' }
          ]
        },
      },
    ]
  },
]
