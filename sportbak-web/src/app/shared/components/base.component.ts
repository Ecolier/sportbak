import {Directive, ElementRef, OnInit, SimpleChanges} from '@angular/core';
import {ScreenDimensionService} from '../services/screen-dimension.service';
import {TranslateAppProvider} from '../services/translate/translate.service';

@Directive()
export abstract class FBKComponent implements OnInit {
    public static instanceCount : number = 0;
    protected afterViewInitDone : boolean = false;
    private uniqueComponentId : string = '';
    protected translations : any;
    private html : HTMLElement;
    private currWidth : number = -1;
    private currHeight : number = -1;
    constructor(
        protected _refElement: ElementRef,
        protected translateProvider : TranslateAppProvider,
        protected componentName : string, // ComponentName (use for traduction)
    ) {
      this.uniqueComponentId = this.componentName + '-component' + FBKComponent.instanceCount;
      this.html = _refElement.nativeElement as HTMLElement;
      FBKComponent.instanceCount ++;
    }

    ngOnInit() {
      this._init();
    }

    private async _init() {
      await this.reloadTranslation();
      this.translateProvider.subscribreLanguageChanged(() => {
        this.reloadTranslation();
        if (this.fbkTranslationUpdated) {
          this.fbkTranslationUpdated();
        }
      });
      this.fbkOnInit();
    }

    public async reloadTranslation() {
      this.translations = await this.translateProvider.getComponentTranslation(this.componentName);
    }

    public getTranslation(key) {
      if (this.translations) {
        return this.translations[key];
      }
      return '-';
    }

    public getTranslationWithPath(key) {
      if (this.translations) {
        return this.translations[key];
      }
      return '-';
    }


    ngAfterViewInit() {
      this.afterViewInitDone = true;
      if (this.fbkAfterInit) {
        this.fbkAfterInit();
      }
    }

    ngAfterViewChecked() {
      if (this.fbkSizeChanged) {
        const width = this.getWidth();
        const height = this.getHeight();

        if (width != this.currWidth || height != this.currHeight) {
          this.fbkSizeChanged(this.currWidth, width, this.currHeight, height);
        }
        this.currWidth = width;
        this.currHeight = height;
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (!changes) {
        return;
      }

      const keys = Object.keys(changes);
      for (const key of keys) {
        const simpleChange = changes[key];
        if (simpleChange) {
          if (simpleChange.previousValue != simpleChange.currentValue) {
            if (this.fbkInputChanged) {
              this.fbkInputChanged(key, simpleChange.currentValue, simpleChange.previousValue);
            }
          }
        }
      }
    }

    generateCustomComponentId(customeId) {
      return this.componentName + '-component-custom-' + customeId;
    }

    getComponentName() {
      return this.componentName;
    }

    getUniqueComponentId() {
      return this.uniqueComponentId;
    }

    getHtmlElement() {
      return this.html;
    }

    getWidth() {
      return this.getHtmlElement().offsetWidth;
    }

    getHeight() {
      return this.getHtmlElement().offsetHeight;
    }

    public pw_to_px(doc : HTMLElement, value : number) {
      return ScreenDimensionService.pw_to_px(doc, value);
    }

    public ph_to_px(doc : HTMLElement, value : number) {
      return ScreenDimensionService.ph_to_px(doc, value);
    }

    public px_to_pw(doc : HTMLElement, value : number) {
      return ScreenDimensionService.px_to_pw(doc, value);
    }

    public px_to_ph(doc : HTMLElement, value : number) {
      return ScreenDimensionService.px_to_ph(doc, value);
    }

    vw_to_px(value) {
      return ScreenDimensionService.vw_to_px(value);
    }

    vh_to_px(value) {
      return ScreenDimensionService.vh_to_px(value);
    }

    px_to_vw(value) {
      return ScreenDimensionService.px_to_vw(value);
    }

    px_to_vh(value) {
      return ScreenDimensionService.px_to_vh(value);
    }

    ngOnDestroy() {
      if (this.fbkOnDestroy) {
        this.fbkOnDestroy();
      }
    }

    abstract fbkOnInit() : void;
    fbkAfterInit?() : void;
    fbkOnDestroy?() : void;
    fbkInputChanged?(inputName : string, currentValue : any, lastValue : any) : void;
    fbkSizeChanged?(oldWidth : number, newWidth : number, oldHeight : number, newHeight : number) : void;
    fbkTranslationUpdated?() : void;
}
