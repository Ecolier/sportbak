import {Directive, Input} from '@angular/core';

@Directive({
  selector: 'img',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src',
  },
})
export class DefaultImageDirective {
  @Input() src: string;
  @Input() default = 'assets/img/not-available.png';

  updateUrl() {
    this.src = this.default;
  }
}
