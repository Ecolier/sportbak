import {NgModule} from '@angular/core';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {LeaguesModule} from '../manager/leagues/leagues.module';
import {SafePipe} from '../manager/shared/pipes/safe.pipe';
import {SharedModule} from '../shared/shared.module';
import {ComplexCompetitionComponent} from './complex/complex-competition/complex-competition.component';
import {ComplexLeagueComponent} from './complex/complex-competition/complex-league/complex-league.component';
import {ComplexCtnComponent} from './complex/complex-ctn/complex-ctn.component';
import {ComplexInfoComponent} from './complex/complex-info/complex-info.component';
import {ComplexVideoComponent} from './complex/complex-video/complex-video.component';
import {HomeRoutingModule} from './home-routing.module';
import {ApplicationCardComponent} from './main-page/application-services/application-card/application-card.component';
import {ApplicationServicesComponent} from './main-page/application-services/application-services.component';
import {HomeCommunityComponent} from './main-page/home-community/home-community.component';
import {HomeContactUsComponent} from './main-page/home-contact-us/home-contact-us.component';
import {HomeContactComponent} from './main-page/home-contact/home-contact.component';
import {HomeHeaderComponent} from './main-page/home-header/home-header.component';
import {HomeMapComponent} from './main-page/home-map/home-map.component';
import {HomePhoneDeviceCompetitionsComponent} from './main-page/home-phone-device-competitions/home-phone-device-competitions.component';
import {HomePhoneDeviceHistoryComponent} from './main-page/home-phone-device-history/home-phone-device-history.component';
import {HomeReviewComponent} from './main-page/home-review/home-review.component';
import {HomeSocialComponent} from './main-page/home-social/home-social.component';
import {InstagramCardComponent} from './main-page/home-social/instagram-card/instagram-card.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MyComplexComponent} from './my-complex/my-complex.component';
import {FormContactComponent} from './partials/form-contact/form-contact.component';
import {MapComponent} from './partials/map/map.component';
import {HomeSharedModule} from './shared/home-shared.module';

@NgModule({
  imports: [
    HomeSharedModule,
    HomeRoutingModule,
    LeaguesModule,
    SlickCarouselModule,
  ],
  declarations: [
    ComplexLeagueComponent,
    ComplexCompetitionComponent,
    ComplexCtnComponent,
    ComplexInfoComponent,
    ComplexVideoComponent,
    ApplicationServicesComponent,
    ApplicationCardComponent,
    HomeCommunityComponent,
    HomeContactComponent,
    HomeContactUsComponent,
    HomeHeaderComponent,
    HomeMapComponent,
    HomePhoneDeviceCompetitionsComponent,
    HomePhoneDeviceHistoryComponent,
    HomeReviewComponent,
    HomeSocialComponent,
    InstagramCardComponent,
    MainPageComponent,
    MyComplexComponent,
    FormContactComponent,
    MapComponent,
    SafePipe,
  ],
  exports: [
    LeaguesModule,
    HomeSharedModule,
    ComplexLeagueComponent,
    ComplexCompetitionComponent,
    ComplexCtnComponent,
    ComplexInfoComponent,
    ComplexVideoComponent,
    ApplicationServicesComponent,
    ApplicationCardComponent,
    HomeCommunityComponent,
    HomeContactComponent,
    HomeContactUsComponent,
    HomeHeaderComponent,
    HomeMapComponent,
    HomePhoneDeviceCompetitionsComponent,
    HomePhoneDeviceHistoryComponent,
    HomeReviewComponent,
    HomeSocialComponent,
    InstagramCardComponent,
    MainPageComponent,
    MyComplexComponent,
    FormContactComponent,
    MapComponent,
  ],
})
export class HomeModule {}
