import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedComponent } from '../feed/feed.component';
import { FeedService } from '../feed/feed.service';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';

@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
  ],
  declarations: [
    MenuComponent,
    FeedComponent,
  ],
  providers: [FeedService]
})
export class MenuModule { }