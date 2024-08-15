import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {DrawImage, DrawRect, DrawService} from 'src/app/shared/services/draw.service';
import {FBKStaticUrls} from 'src/app/shared/values/static-urls';


// *************************************************** //
// ******************* DATASET *********************** //
// *************************************************** //


export type DatasetMode = 'eighth' | 'quarter' | 'semi' | 'final';
export class Dataset {
    public mode: DatasetMode;
    public winner : LeagueTeam = null;
    public data: DatasetBlockData[][];

    constructor() {
    }

    public onBeforePatch() {

    }
    public onAfterPatch() {
    }
}

// *************************************************** //
// ***************** DATASET BLOCK ******************** //
// *************************************************** //


export type ScoreStatus = 'won' | 'lost' | 'draw' | 'empty';
export type BlockStatus = 'won' | 'lost' | 'draw' | 'ongoing' | 'empty';
export class DatasetBlockData {
    public url : string = FBKStaticUrls.shirt.unknown;
    public name : string = null;
    public status : BlockStatus = 'empty'
    public scores : {
        value : string,
        status : ScoreStatus
    }[] = [{
      value: '-',
      status: 'empty',
    }];
    public click : () => void;

    constructor() {
    }

    public onBeforePatch() {

    }
    public onAfterPatch() {
    }
}

// *************************************************** //
// ***************** DRAW BLOCK ******************** //
// *************************************************** //


export type DrawFontType = {
    size : number,
    family : string,
    color : string,
}

export type DrawBlockType = 'normal' | 'small' | 'big_up' | 'big_down';
export class DrawBlock {
    private context : CanvasRenderingContext2D;

    public data : DatasetBlockData;

    public type : DrawBlockType;
    private image : DrawImage;

    public padding : number;

    public rect : DrawRect;
    public imgRect : DrawRect;
    public nameRect : DrawRect;
    public scoreRects : DrawRect[];

    public nameFont : DrawFontType;
    public scoreFont : DrawFontType;

    public scoreSize : number;

    public scoreColors : any;

    public cleared : boolean = false;

    constructor(context : CanvasRenderingContext2D, data : DatasetBlockData) {
      this.context = context;
      this.data = data;
    }

    public onBeforePatch() {

    }
    public onAfterPatch() {
    }

    public clear() {
      this.cleared = true;
      if (this.image) {
        this.image.clear();
      }
    }

    public draw() {
      this.setScoresRect();
      this.setImgRect();
      if (this.type == 'normal' || this.type == 'big_up' || this.type == 'big_down') {
        this.setNameRect();
      }
      this.rect.draw();
      this.drawImg();
      this.drawScores();
      if (this.type == 'normal' || this.type == 'big_up' || this.type == 'big_down') {
        this.drawName();
      }
      // this.rect.draw(true);
    }

    setImgRect() {
      const x = this.rect.content.x;
      let y = this.rect.content.y;
      let width = this.rect.content.height;
      let height = this.rect.content.height;
      if (this.type == 'small') {
        if (this.scoreRects && this.scoreRects.length) {
          width = (this.scoreRects[0].x - this.padding) - this.rect.content.x;
        }
      } else if (this.type == 'big_up') {
        width = this.rect.content.width;
        y = this.rect.content.y;
        if (this.scoreRects && this.scoreRects.length) {
          height = (this.scoreRects[0].y - this.scoreRects[0].height * 0.75 - y);
        }
      } else if (this.type == 'big_down') {
        width = this.rect.content.width;
        if (this.scoreRects && this.scoreRects.length) {
          y = (this.scoreRects[0].y + this.scoreRects[0].height + this.padding + this.scoreRects[0].height * 0.75);
          height = (this.rect.content.y + this.rect.content.height) - y;
        }
      }
      this.imgRect = new DrawRect(this.context, {
        x: x,
        y: y,
        width: width,
        height: height,
      });
    }

    drawImg() {
      if (!this.cleared) {
        this.image = new DrawImage(this.context, this.data.url, this.imgRect.x, this.imgRect.y, this.imgRect.width, this.imgRect.height);
        this.image.draw();
      }
    }

    setScoresRect() {
      const scoreRects = [];
      const length = this.data.scores.length;

      if (this.type == 'normal' || this.type == 'small') {
        for (let i = 0; i < length; i++) {
          const score = this.data.scores[i];
          const fillColor = this.getFillColorScore(score.status);
          const lineColor = this.getLineColorScore(this.data.status);


          const x = this.rect.x + this.rect.width - (length - i) * (this.scoreSize - this.rect.lineWidth) - this.rect.lineWidth;
          const y = this.rect.y;
          const width = this.scoreSize;
          const height = this.rect.height;

          const rect = new DrawRect(this.context, {
            x: x,
            y: y,
            width: width,
            height: height,
            radius: i == length - 1 ? {tr: this.rect.radius, br: this.rect.radius} : 0,
            fillColor: fillColor,
            lineColor: lineColor,
          });
          scoreRects.push(rect);
        }
      } else if (this.type == 'big_up') {
        for (let i = 0; i < length; i++) {
          const score = this.data.scores[i];
          const fillColor = this.getFillColorScore(score.status);
          const lineColor = this.getLineColorScore(this.data.status);

          const width = this.rect.width / length;
          const height = this.scoreSize;
          const x = this.rect.x + i * width;
          const y = this.rect.y + this.rect.height - this.scoreSize;
          const radius : any = {bl: (i == 0 ? this.rect.radius : 0), tl: 0, tr: 0, br: (i == length - 1 ? this.rect.radius : 0)};

          const rect = new DrawRect(this.context, {
            x: x,
            y: y,
            width: width,
            height: height,
            radius: radius,
            fillColor: fillColor,
            lineColor: lineColor,
          });
          scoreRects.push(rect);
        }
      } else if (this.type == 'big_down') {
        for (let i = 0; i < length; i++) {
          const score = this.data.scores[i];
          const fillColor = this.getFillColorScore(score.status);
          const lineColor = this.getLineColorScore(this.data.status);

          const width = this.rect.width / length;
          const height = this.scoreSize;
          const x = this.rect.x + i * width;
          const y = this.rect.y;
          const radius : any = {bl: 0, tl: (i == 0 ? this.rect.radius : 0), tr: (i == length - 1 ? this.rect.radius : 0), br: 0};

          const rect = new DrawRect(this.context, {
            x: x,
            y: y,
            width: width,
            height: height,
            radius: radius,
            fillColor: fillColor,
            lineColor: lineColor,
          });
          scoreRects.push(rect);
        }
      }
      this.scoreRects = scoreRects;
    }

    drawScores() {
      if (this.scoreRects && this.scoreRects.length) {
        for (let i = 0; i < this.scoreRects.length; i++) {
          const score = this.data.scores[i];
          const rect = this.scoreRects[i];
          rect.draw();
          if (this.scoreFont) {
            const positionCenter = DrawService.getPositionTextCenter(this.context, score.value, rect.x, rect.y, rect.width, rect.height, this.scoreFont.size, this.scoreFont.family);
            this.context.font = this.scoreFont.size + 'px ' + this.scoreFont.family;
            this.context.fillStyle = this.scoreFont.color;
            this.context.fillText(score.value + '', positionCenter.x, positionCenter.y);
          }
        }
      }
    }

    setNameRect() {
      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;
      if (this.type == 'normal') {
        x = this.rect.content.x;
        if (this.imgRect) {
          x = this.imgRect.x + this.imgRect.width + 2 * this.padding;
        }
        width = this.rect.content.x + this.rect.content.width - x;
        if (this.scoreRects && this.scoreRects.length) {
          width = (this.scoreRects[0].x - this.padding) - x;
        }
        y = this.rect.content.y;
        height = this.rect.content.height;
      } else {
        if (this.scoreRects && this.scoreRects.length) {
          x = this.rect.content.x;
          width = this.rect.content.width;
          height = this.scoreRects[0].height * 0.75;
          if (this.type == 'big_up') {
            y = this.scoreRects[0].y - height;
          } else if (this.type == 'big_down') {
            y = this.scoreRects[0].y + this.scoreRects[0].height;
          }
        }
      }
      this.nameRect = new DrawRect(this.context, {
        x: x,
        y: y,
        width: width,
        height: height,
      });
    }

    drawName() {
      if (this.nameFont) {
        const text = this.data.name ? this.data.name : '-';
        const stringFitted = DrawService.fittingString(this.context, text, this.nameRect.width, this.nameFont.size, this.nameFont.family);
        const positionCenter = DrawService.getPositionTextCenter(this.context, stringFitted, this.nameRect.x, this.nameRect.y, this.nameRect.width, this.nameRect.height, this.nameFont.size, this.nameFont.family);
        let x = this.nameRect.x;
        const y = positionCenter.y;
        if (this.type == 'big_up' ||this.type == 'big_down') {
          x = positionCenter.x;
        }
        this.context.font = this.nameFont.size + 'px ' + this.nameFont.family;
        this.context.fillStyle = this.nameFont.color;
        this.context.fillText(stringFitted, x, y);
      }
    }

    getLineColorScore(score : BlockStatus) {
      let result = null;
      if (this.scoreColors) {
        if (this.scoreColors.border) {
          result = this.scoreColors.border[score];
        }
      }
      return result;
    }

    getFillColorScore(score : BlockStatus) {
      let result = null;
      if (this.scoreColors) {
        if (this.scoreColors.fill) {
          result = this.scoreColors.fill[score];
        }
      }
      return result;
    }
}
