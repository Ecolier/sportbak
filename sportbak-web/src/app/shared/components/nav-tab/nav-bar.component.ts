import {Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewEncapsulation} from '@angular/core';
import {TranslateAppProvider} from '../../services/translate/translate.service';
import {FBKColors} from '../../values/colors';
import {FBKComponent} from '../base.component';

const defaultHeight = '50px';

const white = FBKColors.white;
const orange = FBKColors.orange;

@Component({
  selector: 'futbak-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NavBarComponent extends FBKComponent {
  @HostBinding('style.height') public _height: string = '';

  @Input() public height : string = null;
  @Input() public tabs : string[] | string = null;
  @Input() public badges : number[] | string = null;
  @Input() public index : number = null;
  @Input() public linkId : string = null;
  @Input() isBig:boolean = false;
  @Input() selectedTab:number;
  @Output() tabClicked = new EventEmitter<number>();

  public _tabs : string[] = [];
  public _badges : number[] = [];
  public _linkId : string;
  private indexSelected : number = 0;

  constructor(
    protected _refElement: ElementRef,
    protected translate : TranslateAppProvider,
  ) {
    super(_refElement, translate, 'NavBarComponent');
    this.updateElementHeight();
    this.updateTabs();
  }

  fbkOnInit() {
    if (this.linkId) {
      this._linkId = this.generateCustomComponentId(this.linkId);
    } else {
      this._linkId = this.getUniqueComponentId();
    }
    if (this.index) {
      this.indexSelected = this.index;
    }
  }

  fbkAfterInit() {
    this.updateElementHeight();
    this.updateTabs();
  }

  fbkInputChanged(inputName : string, currentValue : any, lastValue : any) {
    if (inputName == 'height') {
      this.updateElementHeight();
    } else if (inputName == 'tabs') {
      this.updateTabs();
    } else if (inputName == 'index') {
      this.indexSelected = this.index;
      this.updateTabs();
    }
  }

  updateTabs() {
    if (this.tabs) {
      if (typeof this.tabs == 'string') {
        try {
          const tabs = JSON.parse(this.tabs);
          this._tabs = tabs;
        } catch (err) {
          console.log('Error parse : ' + err);
        }
      }
      if (typeof this.badges == 'string') {
        try {
          this._badges = JSON.parse(this.badges);
        } catch (err) {
          console.log('Error parse : ' + err);
        }
      } else if (Array.isArray(this.tabs)) {
        this._tabs = this.tabs as string[];
      }
    }
  }

  updateElementHeight() {
    if (this.height) {
      this._height = this.height;
    } else {
      this._height = defaultHeight;
    }
  }

  onClick(index) {
    this.indexSelected = index;
    this.tabClicked.emit(this.indexSelected);
  }

  isSelected(index) {
    return index == this.indexSelected;
  }
}
