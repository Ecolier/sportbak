import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ClickOutsideModule} from 'ng-click-outside';
import {InViewportModule} from 'ng-in-viewport';
import {ChartsModule} from 'ng2-charts';
import {ButtonComponent} from './components/button/button.component';
import {CardComponent} from './components/card/card.component';
import {DialogHeaderComponent} from './components/dialog-header/dialog-header.component';
import {DialogComponent, DialogContentDirective} from './components/dialog/dialog.component';
import {LabelAutoadjustComponent} from './components/label-autoadjust/label-autoadjust.component';
import {NavBarComponent} from './components/nav-tab/nav-bar.component';
import {SectionDropdownComponent} from './components/section-dropdown/section-dropdown.component';
import {SpinningLoaderComponent} from './components/spinning-loader/spinning-loader.component';
import {TabBarComponent} from './components/tab-bar/tab-bar.component';
import {TabBodyComponent} from './components/tab-bar/tab-body.component';
import {TabComponent} from './components/tab-bar/tab.component';
import {ToastComponent} from './components/toast/toast.component';
import {ToggleButtonComponent} from './components/toggle-button/toggle-button.component';
import {DateAgoPipe} from './services/date-ago.directive';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {OfferComponent} from './components/offer/offer.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {DefaultImageDirective} from './services/default-image.directive';
import {DropdownMenuComponent} from './components/dropdown-menu/dropdown-menu.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ClickOutsideModule,
    ChartsModule,
    InViewportModule,
    SlickCarouselModule,
  ],
  declarations: [
    ButtonComponent,
    TabBodyComponent,
    CardComponent,
    DropdownMenuComponent,
    TabComponent,
    DialogComponent,
    DialogContentDirective,
    DialogHeaderComponent,
    LabelAutoadjustComponent,
    NavBarComponent,
    SpinningLoaderComponent,
    TabBarComponent,
    ToastComponent,
    ToggleButtonComponent,
    SectionDropdownComponent,
    DateAgoPipe,
    DatePickerComponent,
    OfferComponent,
    DefaultImageDirective,
  ],
  exports: [
    ButtonComponent,
    DropdownMenuComponent,
    TabBodyComponent,
    CardComponent,
    SectionDropdownComponent,
    TabComponent,
    DialogComponent,
    DialogContentDirective,
    DialogHeaderComponent,
    LabelAutoadjustComponent,
    NavBarComponent,
    SpinningLoaderComponent,
    TabBarComponent,
    ToastComponent,
    ToggleButtonComponent,
    DateAgoPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ClickOutsideModule,
    ChartsModule,
    InViewportModule,
    DatePickerComponent,
    OfferComponent,
    DefaultImageDirective,
  ],
})
export class SharedModule {}
