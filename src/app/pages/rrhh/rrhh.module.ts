import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RRHHRoutes } from './rrhh.routing';

import { ComponenteModule } from '@shared/components/componente.module';

import { ReporteAsistenciaComponent } from '@pages/rrhh/reporteasistencia/reporteasistencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HorasextrasComponent } from './horasextras/horasextras.component';
import { ListarPersonaComponent } from './horasextras/listar-persona/listar-persona.component';

@NgModule({
  declarations: [
    ReporteAsistenciaComponent,
    HorasextrasComponent,
    ListarPersonaComponent
  ],
  imports: [
    RouterModule.forChild(RRHHRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  providers:[
    DatePipe
  ],
  exports: [
    ReporteAsistenciaComponent
  ]
})

export class RRHHModule { }
