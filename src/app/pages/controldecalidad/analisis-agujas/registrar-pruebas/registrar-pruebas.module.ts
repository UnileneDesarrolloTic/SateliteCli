import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RegistrarPruebasComponent } from './registrar-pruebas.component';
import { PruebaFlexionComponent } from '@pages/controldecalidad/analisis-agujas/registrar-pruebas/prueba-flexion/prueba-flexion.component';
import { NavbarPruebasComponent } from '@pages/controldecalidad/analisis-agujas/registrar-pruebas/navbar-pruebas/navbar-pruebas.component';
import { DatosGeneralesComponent } from '@pages/controldecalidad/analisis-agujas/registrar-pruebas/datos-generales/datos-generales.component';
import { PruebasAgujasRoutes } from '@pages/controldecalidad/analisis-agujas/registrar-pruebas/registrar-pruebas.routing';
import { PruebaDimensionalComponent } from './prueba-dimensional/prueba-dimensional.component';
import { PruebaElasticidadPerforacionComponent } from './prueba-elasticidad-perforacion/prueba-elasticidad-perforacion.component';
import { PruebaDefectosComponent } from './prueba-defectos/prueba-defectos.component';

@NgModule({
  declarations: [
    RegistrarPruebasComponent,
    PruebaFlexionComponent,
    NavbarPruebasComponent,
    DatosGeneralesComponent,
    PruebaDimensionalComponent,
    PruebaElasticidadPerforacionComponent,
    PruebaDefectosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PruebasAgujasRoutes),
    RouterModule,
    ReactiveFormsModule
  ],
  bootstrap: [
    RegistrarPruebasComponent
  ]
})
export class RegistrarPruebasModule { }
