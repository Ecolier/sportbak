
export abstract class ScreenDimensionService {
  public static getBody() {
    return document.getElementsByTagName('body')[0];
  }

  public static getWidth() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    return w.innerWidth || e.clientWidth || g.clientWidth;
  }

  public static getHeight() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    return w.innerHeight|| e.clientHeight|| g.clientHeight;
  }

  public static getFontSizeOfElement(doc : HTMLElement) {
    const style = window.getComputedStyle(doc, null);
    const fontSize = parseFloat(style.getPropertyValue('font-size'));
    return fontSize;
  }

  public getWidthOfElement(doc : HTMLElement) {
    let w = 0;
    if (doc) {
      w = doc.offsetWidth;
    }
    return w;
  }

  public getHeighthOfElement(doc : HTMLElement) {
    let w = 0;
    if (doc) {
      w = doc.offsetWidth;
    }
    return w;
  }

  // pourcentage width to pixel
  public static pw_to_px(doc : HTMLElement, value : number) {
    let px = 0;
    if (doc) {
      const w = doc.offsetWidth;
      px = Math.floor(w * value);
    }
    return px;
  }

  // pourcentage height to pixel
  public static ph_to_px(doc : HTMLElement, value : number) {
    let px = 0;
    if (doc) {
      const h = doc.offsetHeight;
      px = Math.floor(h * value);
    }
    return px;
  }

  public static px_to_pw(doc : HTMLElement, value : number) {
    let pw = 0;
    if (doc) {
      const w = doc.offsetWidth;
      pw = value / w;
    }
    return pw;
  }

  public static px_to_ph(doc : HTMLElement, value : number) {
    let ph = 0;
    if (doc) {
      const h = doc.offsetHeight;
      ph = value / h;
    }
    return ph;
  }

  public static vw_to_px(value) {
    const x = ScreenDimensionService.getWidth();
    const result = (x*value)/100;
    return result;
  }

  public static vh_to_px(value) {
    const y = ScreenDimensionService.getHeight();
    const result = (y*value)/100;
    return result;
  }

  public static px_to_vw(value) {
    const x = ScreenDimensionService.getWidth();
    const result = (100*value)/x;
    return result;
  }

  public static px_to_vh(value) {
    const y = ScreenDimensionService.getHeight();
    const result = (100*value)/y;
    return result;
  }
}
