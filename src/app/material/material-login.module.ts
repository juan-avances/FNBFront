import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatGridListModule, MatInputModule, MatIconModule, MatTooltipModule],
  exports: [MatButtonModule, MatCheckboxModule, MatGridListModule, MatInputModule, MatIconModule, MatTooltipModule]
})
export class MaterialLoginModule {}
