import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatProgressSpinnerModule],
  exports: [MatToolbarModule, MatProgressSpinnerModule],
  providers: [],
})
export class AngularMaterialModule {}
