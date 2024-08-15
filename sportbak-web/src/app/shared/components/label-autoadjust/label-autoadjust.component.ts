import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {TranslateAppProvider} from '../../services/translate/translate.service';
import {FBKComponent} from '../base.component';
import {AutoAdjustFontSizeService} from './auto-adjustfontsize.service';

@Component({
  selector: 'futbak-label-autoadjust',
  templateUrl: 'label-autoadjust.component.html',
  styleUrls: ['./label-autoadjust.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class LabelAutoadjustComponent extends FBKComponent {
  @Input() public text : string = '';
  @Input() public minFontSizeAutoAdjust : number = 1;
  @Input() public fontSize : number = null;
  @Input() public color : string = null;
  // if many "futbak-label-autoadjust" have the same linkId, all "futbak-label-autoadjust" will have the smallest font-size
  @Input() public linkId : string = null;
  @Input() public icon : boolean = false;

  @Output() onFontSizeChange = new EventEmitter<number>();

  private enabled = true;

  private autoadjusting = false;
  private autoadjusted = false;

  private ownCSSClass = null;
  private orginFontSize = null;

  public style : any = {};
  public styleInvisibleSupportCheck : any = {};
  public invisibleSupportCheckId : string;

  constructor(
    protected _refElement: ElementRef,
    protected translate : TranslateAppProvider,
  ) {
    super(_refElement, translate, 'LabelAutoadujstComponent');
    this.invisibleSupportCheckId = 'support-invisible-support-check-' + this.getUniqueComponentId();
    this.init();
  }

  getHtmlElement() {
    return this._refElement.nativeElement as HTMLElement;
  }

  getInvisibleSupportCheckHtmlElement() {
    return document.getElementById(this.invisibleSupportCheckId);
  }

  fbkOnInit() {
    this.init();
  }

  init() {
    this.style = this.getStyle();
    this.styleInvisibleSupportCheck = this.getStyleInvisibleSupportCheck();
  }

  fbkAfterInit() {
    this.updateOriginFont();

    this.runAutoadjust(true);

    if (this.linkId) {
      setTimeout(() => {
        this.runAutoadjust();
      });
    }
  }

  fbkInputChanged?(inputName : string, currentValue : any, lastValue : any) {
    if (inputName == 'text') {
      this.runAutoadjust();
    } else if (inputName == 'fontSize' || inputName == 'linkId') {
      if (currentValue) {
        this.updateOriginFont(currentValue);
        this.runAutoadjust();
      }
    }
  }

  fbkSizeChanged(oldWidth : number, newWidth : number, oldHeight : number, newHeight : number) {
    this.runAutoadjust();
  }

  updateOriginFont(originFontSize = this.getOriginFontSize()) {
    this.orginFontSize = originFontSize;
    if (this.linkId) {
      const classesStr = this.getHtmlElement().className;
      let newClassesStr = '';
      const classes = classesStr ? classesStr.split(' ') : [];
      const ownClassBasse = this.generateClassFromLinkId();
      for (const _class of classes) {
        if (!_class.includes(ownClassBasse)) {
          newClassesStr += newClassesStr.length ? ' ' : '' + _class;
        }
      }
      this.ownCSSClass = ownClassBasse;
      newClassesStr += ' ' + this.ownCSSClass;
      this.getHtmlElement().className = newClassesStr;
      this.getHtmlElement().setAttribute('originfontsize', '' + this.orginFontSize);
    }
  }

  runAutoadjust(first = false) {
    // if (!this.enabled || !this.afterViewInitDone)
    //   return;

    // this.autoadjusting = true;
    // this.autoadjusted = false;

    // if (this.linkId) {
    //   // autoadjust other if font-size is bigger
    //   AutoAdjustFontSizeService.autoAdjustFontSizeWithMinValueOfElementsWithClassName(this.getInvisibleSupportCheckHtmlElement(), this.ownCSSClass, this.text, this.minFontSizeAutoAdjust);
    // } else {
    //   AutoAdjustFontSizeService.autoAdjustFontSizeOfElement(this.getInvisibleSupportCheckHtmlElement(), this.getHtmlElement(), this.text, this.minFontSizeAutoAdjust, this.orginFontSize);
    // }

    // this.autoadjusted = true;
    // this.autoadjusting = false;
    // this.onFontSizeChange.emit(this.getCurrentFontSize());
    // this.style = this.getStyle();
  }

  generateClassFromLinkId() {
    return this.generateCustomComponentId(this.linkId);
  }


  getStyle() {
    const style = {
    };
    if (this.color) {
      style['color'] = this.color;
    }
    if (this.fontSize && ! this.autoadjusting && !this.autoadjusted) {
      style['font-size'] = this.fontSize + 'px';
    }
    return style;
  }

  getStyleInvisibleSupportCheck() {
    const style = {
      'position': 'absolute',
      'visibility': 'hidden',
      'height': 'auto',
      'width': 'auto',
      'white-space': 'nowrap',
    };
    if (this.fontSize && ! this.autoadjusting && !this.autoadjusted) {
      style['font-size'] = this.fontSize + 'px';
    }
    return style;
  }

  getCurrentFontSize() {
    return AutoAdjustFontSizeService.getFontSizeFromHTMLElement(this.getHtmlElement());
  }

  getOriginFontSize() {
    let result = this.getCurrentFontSize();
    if (this.fontSize) {
      result = this.fontSize;
    }
    return result;
  }
}
