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


@NgModule({
  declarations: [
    ListarUsuarioComponent,
    EditarUsuarioComponent
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
