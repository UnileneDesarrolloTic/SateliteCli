import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdministracionRoutes } from './administracion.routing';

import { ComponenteModule } from '@shared/components/componente.module';

import { ListarUsuarioComponent } from '@pages/administracion/usuario/listar-usuario/listar-usuario.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { ConfigCotizacionComponent } from './config-cotizacion/config-cotizacion.component';
import { EditarConfigCotizacionComponent } from './config-cotizacion/editar-config-cotizacion/editar-config-cotizacion.component';
import { AsignacionPersonalLaboralComponent } from './asignacion-personal-laboral/asignacion-personal-laboral.component';
import { AreaComponent } from './asignacion-personal-laboral/area/area.component';
import { ModalAsistenciaPersonaComponent } from './asignacion-personal-laboral/modal-asistencia-persona/modal-asistencia-persona.component';


@NgModule({
  declarations: [
    ListarUsuarioComponent,
    EditarUsuarioComponent,
    ConfigCotizacionComponent,
    EditarConfigCotizacionComponent,
    AsignacionPersonalLaboralComponent,
    AreaComponent,
    ModalAsistenciaPersonaComponent
  ],
  imports: [
    RouterModule.forChild(AdministracionRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    FormsModule,
  ],
  providers:[
    DatePipe
  ],
  exports: [
    ListarUsuarioComponent
  ]
})

export class AdministracionModule { }
