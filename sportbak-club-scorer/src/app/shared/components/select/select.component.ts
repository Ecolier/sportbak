import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnDestroy, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbk-option',
  encapsulation: ViewEncapsulation.None,
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class OptionComponent {
  @ViewChild(TemplateRef) contentTemplateRef!: TemplateRef<any>;
  constructor(public elementRef: ElementRef) {}
  @Input() value: any;
}

@Component({
  selector: 'sbk-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  exportAs: 'sbkSelect',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

  private value: any;
  
  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.contains(event.target)) this.collapsed = false;
    else this.collapsed = true;
  }
  @HostBinding('class.collapsed') collapsed = true;
  @HostBinding('class.expanded') get expanded() {
    return !this.collapsed;
  };

  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>;
  @Input() index = 0;
  @Output() indexChange = new EventEmitter<any>();

  keybordListener : (event : KeyboardEvent) => void;
  selectedIndex = 0;

  otherOptionsComponent : OptionComponent[] = [];

  propagateChange = (_: any) => {}
  private _onTouch = () => {}



  constructor(private elementRef: ElementRef, private changeDetector: ChangeDetectorRef) {
    this.keybordListener = (event) => {
      if (event.key == 'ArrowUp') {
        this.selectedIndex --;
        if (this.selectedIndex < 0)
          this.selectedIndex = this.options.length - 1;
        this.setSelected(this.selectedIndex);
      } else if (event.key == 'ArrowDown') {
        this.selectedIndex ++
        if (this.selectedIndex > this.options.length - 1)
          this.selectedIndex = 0;
        this.setSelected(this.selectedIndex);
      }
    };
    document.addEventListener('keydown', this.keybordListener);
  }
    
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  ngAfterViewInit() {
    this.setSelected(this.index);
  }

  setSelectedElement(optionComponent : OptionComponent) {
    this.setSelected(this.options.toArray().findIndex((o) => o == optionComponent));
  }

  setSelected(index: number) {
    if (this.options) {
      this.selectedIndex = index;
      let selectedOptionComponent = this.options.get(this.selectedIndex);
      if (selectedOptionComponent) {
        this.indexChange.emit(selectedOptionComponent.value);
      }
      this.otherOptionsComponent = this.options.toArray().filter((o) => o != selectedOptionComponent);
      this.changeDetector.detectChanges();
      this.collapsed = true;
    }

  }

  ngOnDestroy() {
    if (this.keybordListener)
      document.removeEventListener('keydown', this.keybordListener);
  }
  
}