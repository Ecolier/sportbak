import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ManagerLayoutModule} from './manager/layout/manager-layout.module';
import {SharedModule} from './shared/shared.module';
import {AuthInterceptor} from './shared/services/authinterceptor';

export function HttpLoaderFactory(httpClient: HttpClient) {
  const customHash = new Date().getTime();
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json?hash=' + customHash);
}

@NgModule({
  imports: [
    ManagerLayoutModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
