import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ControlCalidadRoutes } from './control-calidad.routing';

import { ComponenteModule } from '@shared/components/componente.module';

import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FrmControlAgujaComponent } from './agujas/frm-control-aguja/frm-control-aguja.component';

@NgModule({
  declarations: [
    CertificadoComponent,
    FrmControlAgujaComponent
  ],
  imports: [
    RouterModule.forChild(ControlCalidadRoutes),
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
    CertificadoComponent,
    FrmControlAgujaComponent
  ]
})

export class ControlCalidadModule { }
