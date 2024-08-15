// *************************************************** //
// ***************** DRAW RECT ******************** //
// *************************************************** //


export class DrawRect {
  private context : CanvasRenderingContext2D;

  public x : number;
  public y : number;
  public width : number;
  public height : number;
  public radius : number | {tr : number, br : number, bl : number, tl : number};
  public lineWidth : number;
  public lineColor : string;
  public fillColor : string;
  public content : DrawRect;

  constructor(context : CanvasRenderingContext2D, data : any = {}) {
    this.context = context;
    if (data) {
      this.x = data.x;
      this.y = data.y;
      this.width = data.width;
      this.height = data.height;
      this.radius = data.radius;
      this.lineWidth = data.lineWidth;
      this.lineColor = data.lineColor;
      this.fillColor = data.fillColor;
      this.content = data.content;
    }
  }

  public onBeforePatch() {

  }
  public onAfterPatch() {
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} [radius = 5] The corner radius; It can also be an object
   *                 to specify different radii for corners
   * @param {Number} [radius.tl = 0] Top left
   * @param {Number} [radius.tr = 0] Top right
   * @param {Number} [radius.br = 0] Bottom right
   * @param {Number} [radius.bl = 0] Bottom left
   * @param {Boolean} [fill = false] Whether to fill the rectangle.
   * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
   */
  public draw(disableFillColor = false, stroke = true) {
    const ctx = this.context;
    let radius = this.radius;

    ctx.lineWidth = this.lineWidth;
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 0;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (const side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(this.x + radius.tl, this.y);
    ctx.lineTo(this.x + this.width - radius.tr, this.y);
    ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius.tr);
    ctx.lineTo(this.x + this.width, this.y + this.height - radius.br);
    ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius.br, this.y + this.height);
    ctx.lineTo(this.x + radius.bl, this.y + this.height);
    ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius.bl);
    ctx.lineTo(this.x, this.y + radius.tl);
    ctx.quadraticCurveTo(this.x, this.y, this.x + radius.tl, this.y);
    ctx.closePath();
    if (this.fillColor && !disableFillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    if (this.lineColor) {
      ctx.strokeStyle = this.lineColor;
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  public createContentWidthPadding(padding : number) {
    this.content = null;
    this.content = this.createNewRectWithPadding(padding);
  }

  public createNewRectWithPadding(padding : number) {
    const newRect = {...this};
    newRect.x = this.x + padding;
    newRect.y = this.y + padding;
    newRect.width = this.width - 2 * padding;
    newRect.height = this.height - 2 * padding;
    return newRect;
  }
}

// *************************************************** //
// ***************** DRAW IMAGE ******************** //
// *************************************************** //

export class DrawImage {
  private context : CanvasRenderingContext2D;

  private x : number;
  private y : number;
  private width : number;
  private height : number;

  private url : string;
  private img : HTMLImageElement;
  private cleared : boolean = false;

  constructor(context : CanvasRenderingContext2D, url, x, y, width, height) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.url = url;
  }

  public draw() {
    if (!this.cleared) {
      const self = this;
      this.img = new Image;
      this.img.src = this.url;
      this.img.onload = function() {
        if (self && !self.cleared) {
          DrawService.drawImageScaled(self.context, self.img, self.x, self.y, self.width, self.height);
        }
      };
    }
  }

  public clear() {
    this.cleared = true;
  }
}


export abstract class DrawService {
  public static drawImageScaled(ctx : CanvasRenderingContext2D, img, x, y, width, height) {
    const canvas = ctx.canvas;
    const hRatio = width / img.width;
    const vRatio = height / img.height;
    const ratio = Math.min( hRatio, vRatio );
    const centerShift_x = x + ( width - img.width*ratio ) / 2;
    const centerShift_y = y + ( height - img.height*ratio ) / 2;
    ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
  }

  public static fittingString(ctx : CanvasRenderingContext2D, str, maxWidth, fontSize, fontFamily) {
    ctx.font = fontSize + 'px ' + fontFamily;
    let width = ctx.measureText(str).width;
    const ellipsis = '…';
    const ellipsisWidth = ctx.measureText(ellipsis).width;
    if (width<=maxWidth || width<=ellipsisWidth) {
      return str;
    } else {
      let len = str.length;
      while (width>=maxWidth-ellipsisWidth && len-->0) {
        str = str.substring(0, len);
        width = ctx.measureText(str).width;
      }
      return str+ellipsis;
    }
  }

  public static getPositionTextCenter(ctx : CanvasRenderingContext2D, str, x, y, width, height, fontSize, fontFamily) {
    ctx.font = fontSize + 'px ' + fontFamily;
    const size = ctx.measureText(str);
    const newX = x + (width - size.width) / 2;
    const newY = y + height / 2 + fontSize / 3;
    const result = {
      x: newX,
      y: newY,
    };
    return result;
  }
}
