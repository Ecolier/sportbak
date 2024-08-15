import {Component, ElementRef, ViewChild} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';


declare const $: any;

@Component({
  selector: 'home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent extends FBKComponent {
  @ViewChild('presentationText') presentationText:ElementRef ;
  @ViewChild('imagePhone') imagePhone;
  isMenuDisplayed: boolean = false;
  isLoading = false;
  changeSize: any;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {
    setTimeout(() =>{
      this.isLoading = true;
      clearInterval(this.changeSize);
    }, 2000);
    if (this.isLoading != true) {
      this.changeSize = setInterval(() => {
        this.resizePhoneImage();
      }, 200);
    }
  }

  resizePhoneImage() {
    const top = this.presentationText.nativeElement.offsetTop + 10;
    const height = this.presentationText.nativeElement.offsetHeight + this.presentationText.nativeElement.offsetTop + 10;
    if (window.innerWidth <= 1000) {
      this.imagePhone.nativeElement.style.height = (window.innerHeight - height) + 'px';
      this.imagePhone.nativeElement.style.maxHeight = (window.innerHeight - height) + 'px';
    } else {
      this.imagePhone.nativeElement.style.height = 'auto';
      this.imagePhone.nativeElement.style.maxHeight = '80vh';
    }
  }
}
