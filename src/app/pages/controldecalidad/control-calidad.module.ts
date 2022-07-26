import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlCalidadRoutes } from './control-calidad.routing';
import { ComponenteModule } from '@shared/components/componente.module';
import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImprimirAnalisisComponent } from './analisis-agujas/imprimir-analisis/imprimir-analisis.component';
import { RegistrarAnalisisComponent } from './analisis-agujas/registrar-analisis/registrar-analisis.component';
import { GestionContraMuestraComponent } from './gestion-contra-muestra/gestion-contra-muestra.component';



@NgModule({
  declarations: [
    CertificadoComponent,
    ImprimirAnalisisComponent,
    RegistrarAnalisisComponent,
    GestionContraMuestraComponent
  ],
  imports: [
    RouterModule.forChild(ControlCalidadRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule,
  ],
  exports: [
    CertificadoComponent,
    GestionContraMuestraComponent
  ]
})

export class ControlCalidadModule { }
