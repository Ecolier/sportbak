import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, HostBinding, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'input[sbk-text-field-input]',
  encapsulation: ViewEncapsulation.None,
  template: ''
})
export class TextFieldInputDirective {
  constructor(public elementRef: ElementRef) {}
}

@Component({
  selector: 'sbk-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  exportAs: 'sbkTextField',
  encapsulation: ViewEncapsulation.None
})
export class TextFieldComponent implements AfterContentChecked, AfterViewInit {
  @Input() placeholder = '';
  @ContentChild(TextFieldInputDirective) input!: TextFieldInputDirective;
  @ViewChild('inputTemplateContent', { read: TemplateRef }) inputTemplate!: TemplateRef<TextFieldInputDirective>;
  @ViewChild('textFieldInputContainer', { read: ViewContainerRef }) textFieldInputContainer!: ViewContainerRef;
  @HostBinding('attr.empty') empty: boolean = true;
  @HostBinding('attr.focused') focused: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const nativeInputElement = this.input.elementRef.nativeElement;
    nativeInputElement.addEventListener('input', (value: string) => {
      if (nativeInputElement.value === '') this.empty = true;
      else this.empty = false;
    });
    nativeInputElement.addEventListener('focus', () => {
      this.focused = true;
    });
    nativeInputElement.addEventListener('blur', () => {
      this.focused = false;
    });
  }

  ngAfterContentChecked() {
    const nativeInputElement = this.input.elementRef.nativeElement;
    if (nativeInputElement.value === '') this.empty = true;
    else this.empty = false;
  }
  
}