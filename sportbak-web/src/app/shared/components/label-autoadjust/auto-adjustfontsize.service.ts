import {Injectable} from '@angular/core';

const LOGS = false;

@Injectable({
  providedIn: 'root',
})
export class AutoAdjustFontSizeService {
    public static defaultClassName = 'font-autoadjust';
    public static canvasContext = null;

    constructor() {}

    private static getFirstEllementOfClass(className : string) : HTMLElement {
      let element = null;
      const divs = document.getElementsByClassName(className);
      if (divs && divs.length) {
        element = <HTMLElement>divs[0];
      }
      return element;
    }

    public static getMinimumFontSizeOfFirstElementOfClass(className : string) : number {
      let fontSize = null;
      const element = this.getFirstEllementOfClass(className);
      if (element) {
        fontSize = this.getFontSizeFromHTMLElement(element);
      }
      return fontSize;
    }

    public static getFontSizeOfElementOfClass(className : string) : number {
      const divs = document.getElementsByClassName(className);
      let fontSize = null;
      if (divs && divs.length) {
        for (let i = 0; i < divs.length; i++) {
          const element = <HTMLElement>divs[i];
          const currFontSize = this.getFontSizeFromHTMLElement(element);
          if (fontSize == null || currFontSize < fontSize) {
            fontSize = currFontSize;
          }
        }
      }
      return fontSize;
    }

    public static getFontSizeFromHTMLElement(element : HTMLElement) : number {
      const style = window.getComputedStyle(element, null);
      const fontSize = parseFloat(style.getPropertyValue('font-size'));
      return fontSize;
    }

    private static getFontFamilyFromHTMLElement(element : HTMLElement) : string {
      const style = window.getComputedStyle(element, null);
      const fontFamily = style.getPropertyValue('font-family');
      return fontFamily;
    }

    private static getFontStyleFromHTMLElement(element : HTMLElement) : string {
      const style = window.getComputedStyle(element, null);
      const fontFamily = style.getPropertyValue('font-style');
      return fontFamily;
    }

    private static constructFont(fontSize : number, fontFamily : string, fontStyle : string = null) : string {
      return (fontStyle ? fontStyle + ' ' : '') + fontSize + 'px ' + fontFamily;
    }

    private static getFontFromHTMLElement(element : HTMLElement) : string {
      const style = window.getComputedStyle(element, null);
      const fontSize = parseFloat(style.getPropertyValue('font-size'));
      const fontFamily = style.getPropertyValue('font-family');
      return this.constructFont(fontSize, fontFamily);
    }

    private static getTextFromHTMLElement(element: HTMLElement) : string {
      return element.innerText;
    }

    private static getWidthFromHTMLElement(element : HTMLElement) : number {
      return element.offsetWidth;
    }

    private static getTextWidthFromFont(support : HTMLElement, fontSize : number, text : string) : number {
      support.innerHTML = text;
      support.style.fontSize = fontSize + 'px';
      const width = support.offsetWidth;
      return width;
    }

    private static createCanvacContext() : CanvasRenderingContext2D {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      return ctx;
    }

    private static assignFontSize(element : HTMLElement, fontSize : number) {
      element.style.fontSize = fontSize + 'px';
    }

    public static getFontSizeAutoAdjustedFromElement(support : HTMLElement, element: HTMLElement, text : string, minfontsize : number, originFontSize : number = null, step : number, canvasContext : CanvasRenderingContext2D = null) : number {
      if (!text) {
        text = this.getTextFromHTMLElement(element);
      }
      const width = this.getWidthFromHTMLElement(element)* 0.96;
      const fontFamily = this.getFontFamilyFromHTMLElement(element);
      let fontSize = originFontSize ? originFontSize : this.getFontSizeFromHTMLElement(element);
      const fontStyle = this.getFontStyleFromHTMLElement(element);
      let textWidth = this.getTextWidthFromFont(support, fontSize, text);

      if (LOGS) {
        console.log(' -------- ');
        console.log(element);
        console.log('Element - width ' + width + ' - textWidth ' + textWidth + ' - fontsize ' + fontSize + ' - Font Family :  ' + fontFamily + '  fontStyle : ' + fontStyle);
      }
      if (width) {
        while (textWidth > width && fontSize > minfontsize) {
          fontSize -= step;
          textWidth = this.getTextWidthFromFont(support, fontSize, text);
        }
      }
      if (LOGS) {
        console.log('   NEW :  textWidth ' + textWidth + ' - fontsize ' + fontSize);
      }

      return fontSize;
    }

    public static getOriginFontSizeFromClassName(div : HTMLElement) {
      let result = null;
      if (div) {
        const str = div.getAttribute('originfontsize');
        const value = Number(str);
        if (!isNaN(value)) {
          result = value;
        }
      }
      return result;
    }

    public static autoAdjustFontSizeWithMinValueOfElementsWithClassName(support : HTMLElement, className: string, text = null, minfontsize : number = 10, step : number = 1) {
      const divs = document.getElementsByClassName(className);
      if (LOGS) {
        console.log('divs : ');
        console.log(divs);
      }
      if (!AutoAdjustFontSizeService.canvasContext) {
        AutoAdjustFontSizeService.canvasContext = this.createCanvacContext();
      }
      for (let i = 0; i < divs.length; i++) {
        const div : HTMLElement = <HTMLElement>divs[i];
        const originFontSize = AutoAdjustFontSizeService.getOriginFontSizeFromClassName(div);
        this.autoAdjustFontSizeOfElement(support, div, text, minfontsize, originFontSize, step, AutoAdjustFontSizeService.canvasContext);
      }
      const minFontSize = AutoAdjustFontSizeService.getFontSizeOfElementOfClass(className);
      for (let i = 0; i < divs.length; i++) {
        const div : HTMLElement = <HTMLElement>divs[i];
        this.assignFontSize(div, minFontSize);
      }
    }


    public static autoAdjustFontSizeOfElementsWithClassName(support : HTMLElement, className: string, text = null, minfontsize : number = 10, originFontSize : number = null, step : number = 1) {
      const divs = document.getElementsByClassName(className);
      if (LOGS) {
        console.log('divs : ');
        console.log(divs);
      }
      if (!AutoAdjustFontSizeService.canvasContext) {
        AutoAdjustFontSizeService.canvasContext = this.createCanvacContext();
      }
      for (let i = 0; i < divs.length; i++) {
        const div : HTMLElement = <HTMLElement>divs[i];
        this.autoAdjustFontSizeOfElement(support, div, text, minfontsize, originFontSize, step, AutoAdjustFontSizeService.canvasContext);
      }
    }

    static autoAdjustFontSizeOfElement(support : HTMLElement, element: HTMLElement, text : string, minfontsize : number, originFontSize : number = null, step : number = 1, canvasContext : CanvasRenderingContext2D = null) {
      const fontsize = this.getFontSizeAutoAdjustedFromElement(support, element, text, minfontsize, originFontSize, step, canvasContext);
      this.assignFontSize(element, fontsize);
    }
}
