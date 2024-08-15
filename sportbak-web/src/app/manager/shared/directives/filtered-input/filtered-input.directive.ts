import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[regexFilter]',
})
export class FilterDirective {
  @Input() regexFilter: string;
  @Input() validKeys: string[];

  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.validate(event.key)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData.getData('text');
    [...clipboardData].forEach((char) => {
      if (!this.validate(char)) {
        event.stopPropagation();
        event.preventDefault();
      }
    });
  }

  validate(char: string): boolean {
    return (new RegExp(this.regexFilter).test(char)) || (this.validKeys.find((validKey) => validKey === char) !== undefined);
  }
}
