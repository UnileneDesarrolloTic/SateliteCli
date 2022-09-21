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
import { ModalKardexInternoComponent } from './gestion-contra-muestra/modal-kardex-interno/modal-kardex-interno.component';
import { ControlLotesComponent } from './control-lotes/control-lotes.component';
import { AdministracionProtocoloComponent } from './administracion-protocolo/administracion-protocolo.component';
import { NumeroParteComponent } from './administracion-protocolo/numero-parte/numero-parte.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
    CertificadoComponent,
    ImprimirAnalisisComponent,
    RegistrarAnalisisComponent,
    GestionContraMuestraComponent,
    ModalKardexInternoComponent,
    ControlLotesComponent,
    AdministracionProtocoloComponent,
    NumeroParteComponent
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
    NgxDatatableModule,
  ],
  exports: [
    CertificadoComponent,
    GestionContraMuestraComponent
  ]
})

export class ControlCalidadModule { }
