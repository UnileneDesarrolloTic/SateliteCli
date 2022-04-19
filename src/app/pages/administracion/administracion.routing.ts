import { Title } from '@angular/platform-browser';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ListarUsuarioComponent } from "@pages/administracion/usuario/listar-usuario/listar-usuario.component";
import { ConfigCotizacionComponent } from './config-cotizacion/config-cotizacion.component';

export const AdministracionRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
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
    ]
  },
]
