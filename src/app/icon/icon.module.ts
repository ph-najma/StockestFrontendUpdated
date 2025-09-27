import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TrendingUp, TrendingDown, Star, MoreVertical } from 'lucide-angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonModule,
    LucideAngularModule.pick({
      TrendingUp,
      TrendingDown,
      Star,
      MoreVertical,
    }),
  ],
  exports: [LucideAngularModule],
})
export class IconModule {}
