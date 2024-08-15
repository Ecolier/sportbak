import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';

@Component({
  selector: 'format-input',
  templateUrl: './format-input.component.html',
  styleUrls: ['./format-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormatInputComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FormatInputComponent,
    },
  ],
})
export class FormatInputComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() splitter = ':';
  @Input() format: string;
  placeholders = [];
  numberOfInputs = [];
  valueComponents = [];
  value = '';
  change = (components: string[]) => {}

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor() { }

  onChange($event, i) {
    this.valueComponents[i] = $event;
    this.change(this.valueComponents);

    if (this.valueComponents[i]?.length > 1) {
      const nextInput = this.inputs.find((input) => parseInt(input.nativeElement.getAttribute('data-id')) === i + 1);
      nextInput?.nativeElement.focus();
    }

    if (this.valueComponents[i]?.length === 0) {
      const previousInput = this.inputs.find((input) => parseInt(input.nativeElement.getAttribute('data-id')) === i - 1);
      previousInput?.nativeElement.focus();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const quantity = control.value;
    if (quantity <= 0) {
      return {
        mustBePositive: {
          quantity,
        },
      };
    }
  }

  tryForNumber($event) {
    const validKeys = [
      9, // tab
      8, // backspace
      16, // shift
      17, // ctrl
      20, // caps lock
      35, // end
      36, // home
      37, // left arrow
      39, // right arrow
      46, // delete
    ];

    const char = String.fromCharCode($event.keyCode);

    if (!/[0-9]/.test(char) &&
        !validKeys.find((validKey) => validKey === $event.keyCode)) {
      $event.stopPropagation();
      $event.preventDefault();
    }
  }

  registerOnValidatorChange?(fn: () => void): void {

  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnInit() {
    this.placeholders = this.format.split(this.splitter);
    this.numberOfInputs.length = this.format.split(this.splitter).length;
  }
}
