import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {HomeFooterComponent} from './components/home-footer/home-footer.component';
import {HomeNavigationComponent} from './components/home-navigation/home-navigation.component';
import {SocialPanelComponent} from './components/social-panel/social-panel.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    HomeNavigationComponent,
    HomeFooterComponent,
    SocialPanelComponent,
  ],
  exports: [
    HomeNavigationComponent,
    HomeFooterComponent,
    SocialPanelComponent,
    SharedModule,
  ],
})
export class HomeSharedModule {}
