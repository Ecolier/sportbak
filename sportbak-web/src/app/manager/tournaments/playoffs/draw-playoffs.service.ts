import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {DrawRect} from 'src/app/shared/services/draw.service';
import {FBKStaticUrls} from 'src/app/shared/values/static-urls';
import {FBKComponent} from '../../../shared/components/base.component';
import {Dataset, DatasetBlockData, DatasetMode, DrawBlock, DrawBlockType, ScoreStatus} from './draw-playoffs.model';

const staticShirtUrl = FBKStaticUrls.shirt.base;
const unknownShirtUrl = FBKStaticUrls.shirt.unknown;
const emptyShirtUrl = FBKStaticUrls.shirt.empty;

const maxCanvasWidth = 2000;

const colors = {
  link: {
    won: '#1c502b', // "#BD6100", //"#D66614",
    lost: '#000000',
    draw: 'lightgrey',
    ongoing: 'lightgrey',
    empty: 'grey',
  },
  block: {
    border: {
      won: '#27723e', // orange dark "#CB7B27", // orange "#FF5715",
      lost: '#000000',
      draw: '#D3D3D3',
      ongoing: '#D3D3D3',
      empty: 'grey',
    },
    fill: {
      won: '#3bab5c22', // "#E16A1322", // "#ff781522",
      lost: '#80808022',
      draw: '#D3D3D322',
      ongoing: '#D3D3D322',
      empty: '#A0A0A022',
    },
  },
  score: {
    border: /* {
            // transparent
            won : "#00000000", //"#FF5715",
            lost : "#00000000",
            draw : "#00000000",
            ongoing : "#00000000",
            empty : "#00000000"
        }, */{
      won: '#27723e', // "#CB7B27", //"#FF5715",
      lost: '#000000',
      draw: '#D3D3D3',
      ongoing: '#D3D3D3',
      empty: 'grey',
    },
    fill: {
      won: '#3bab5c', // "#E16A1322", //"#ff7815",
      lost: '#808080',
      draw: '#D3D3D3',
      ongoing: '#D3D3D3',
      empty: 'grey',
    },
  },
};

const fontsFamily = {
  BigNoodleTitling: 'BigNoodleTitling',
};

const ratioSizeCanvas = 8;


export class DrawPlayoffsService {
    private parent : FBKComponent;

    public support : HTMLElement;
    public canvas : HTMLCanvasElement;
    public context : CanvasRenderingContext2D;

    public width : number;
    public height : number;

    public startX : number;
    public startY : number;

    public sizes : any;
    public fonts : any;

    private lineWidth : number;

    private sizeMultiplicator : number = 1;

    private clearId = 0;
    private drawBlocks : DrawBlock[][] = [];

    constructor(
        support : HTMLElement,
        canvas : HTMLCanvasElement,
        parent : FBKComponent) {
      this.support = support;
      this.canvas = canvas;
      this.init();
      this.parent = parent;
    }

    private init() {
      this.context = this.canvas.getContext('2d');
      this.resizeCanvasSizeContent(null);
      this.loadFonts();
      this.clear();
    }

    // Force load fonts by writing text
    private loadFonts() {
      const fonts = Object.keys(fontsFamily);
      for (const font of fonts) {
        this.context.font = '10px ' + font;
        this.context.fillText('', 0, 0);
      }
    }

    public resizeCanvasSizeContent(dataset) {
      // Update width
      this.width = Math.min(maxCanvasWidth, this.canvas.offsetWidth * ratioSizeCanvas);
      this.canvas.width = this.width;

      // Update line width
      this.lineWidth = 1 * ratioSizeCanvas;

      // Replace origin for estimation of size
      this.startX = this.lineWidth;
      this.startY = this.lineWidth;

      // Reload from new width for estimation
      this.reloadSizes(dataset, this.width);
      this.reloadFonts(dataset, this.width);

      // Estimate new size content
      let sizeContent = {width: this.width, height: 10};// defaultContentSize
      if (dataset) {
        sizeContent = this._draw(dataset, false); // draw without stroke
      }

      // Fit to percentage of the width
      const fitPercentage = 0.95;
      this.sizeMultiplicator = sizeContent.width > this.width * fitPercentage ? (this.width * fitPercentage) / sizeContent.width : 1;

      // Translate x origin to center horizontaly
      this.startX = (this.width - sizeContent.width * this.sizeMultiplicator) / 2.0;

      // Update height width contentHeight & size multiplicator
      this.height = sizeContent.height * this.sizeMultiplicator;
      this.canvas.height = this.height;

      // Reload width new multiplicator
      this.reloadSizes(dataset, this.width, this.sizeMultiplicator);
      this.reloadFonts(dataset, this.width, this.sizeMultiplicator);
    }

    private reloadSizes(dataset, width, multiplicator = 1) {
      width = width * multiplicator;
      this.sizes = {
        block: {
          normal: {
            width: width / 3,
            height: width / 16,
            borderRadius: width / 100,
            padding: Math.max(2, Math.min(10, width / 30)),
            score: width / 18,
            lineWidth: this.lineWidth,
          },
          small: {
            width: width / 7,
            height: width / 16,
            borderRadius: width / 100,
            padding: Math.max(2, Math.min(10, width / 30)),
            score: width / 18,
            lineWidth: this.lineWidth,
          },
          big_up: {
            width: width / 4,
            height: width / 4,
            borderRadius: width / 100,
            padding: Math.max(2, Math.min(10, width / 30)),
            score: (width / 4) / 4, // height
            lineWidth: this.lineWidth,
          },
          big_down: {
            width: width / 4,
            height: width / 4,
            borderRadius: width / 100,
            padding: Math.max(2, Math.min(10, width / 30)),
            score: (width / 4) / 4, // height
            lineWidth: this.lineWidth,
          },
          spaceBetweenTwoBlockFirstRound: {
            eighth: width / 40,
            quarter: width / 10,
            semi: width / 5,
            final: width / 2.5,
          },
        },
        link: {
          borderRadius: width / 150,
          width: {
            won: this.lineWidth,
            lost: this.lineWidth,
            draw: this.lineWidth,
            ongoing: this.lineWidth,
            empty: this.lineWidth,
          },
        },
        spaceBetweenTwoRound: {
          eighth: width / 30,
          quarter: width / 20,
          semi: width / 10,
          final: width / 10,
        },
      };
    }

    private reloadFonts(dataset, width, multiplicator = 1) {
      width = width * multiplicator;
      this.fonts = {
        score: {
          family: fontsFamily.BigNoodleTitling,
          size: Math.floor(width / 20),
          color: 'white',
        },
        name: {
          family: fontsFamily.BigNoodleTitling,
          size: Math.floor(width / 25),
          color: 'white',
        },
      };
    }

    private removeDivsByName(name) {
      const divs = document.getElementsByName(name);
      const divsToRemove = [];
      for (let i =0; i < divs.length; i++) {
        divsToRemove.push(divs[i]);
      }
      for (const div of divsToRemove) {
        div.parentNode.removeChild(div);
      }
    }

    public clear() {
      this.clearId ++;
      this.removeDivsByName('team');
      this.removeDivsByName('winner');
      for (let i = 0; i < this.drawBlocks.length; i++) {
        for (let j = 0; j < this.drawBlocks[i].length; j++) {
          this.drawBlocks[i][j].clear();
        }
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear html5 canvas
      this.drawBlocks = [];
    }


    public draw(dataset : Dataset) {
      this.clear();
      this.resizeCanvasSizeContent(dataset);
      this._draw(dataset);
    }

    private _draw(dataset : Dataset, stroke = true) {
      const result = {
        height: 0,
        width: 0,
      };
      const ctx = this.context;
      const drawBlocks : DrawBlock[][] = [];
      const data = dataset.data;
      let maxScoresPresent = 1;
      for (let round = 0; round < data.length; round++) {
        const datasetBlocks = data[round];
        for (let i = 0; i < datasetBlocks.length; i++) {
          const datasetBlock = datasetBlocks[i];
          maxScoresPresent = Math.max(maxScoresPresent, datasetBlock.scores.length);
        }
      }
      const nbRounds = data.length;
      const clearIdBeforeDraw = this.clearId;
      for (let round = 0; round < nbRounds; round++) {
        const datasetBlocks = data[round];
        const drawCurrentBlocks : DrawBlock[] = [];
        if (clearIdBeforeDraw != this.clearId) {
          break;
        }
        for (let i = 0; i < datasetBlocks.length; i++) {
          const datasetBlock = datasetBlocks[i];
          let drawParentBlocks : DrawBlock[] = [];

          if (clearIdBeforeDraw != this.clearId) {
            break;
          }

          // Type
          let type : DrawBlockType = 'normal';
          if (round == 0) {
            if (nbRounds > 1) {
              type = 'normal';
            } else {
              type = 'big_up';
            }
          } else if (round == nbRounds - 1) { // final
            if (i == 0) {
              type = 'big_up';
            } else {
              type = 'big_down';
            }
          } else {
            type = 'small';
          }

          // Position & Size
          const scoreSize = this.sizes.block[type].score;
          let width = this.sizes.block[type].width;
          const height = this.sizes.block[type].height;
          let x = this.startX;
          let y = this.startY + i * (height + this.sizes.block.spaceBetweenTwoBlockFirstRound[dataset.mode]);

          if (round == 0 && nbRounds == 1) {
            x = this.startX + i * (width + this.sizes.block.spaceBetweenTwoBlockFirstRound[dataset.mode]);
            y = this.startY;
          }

          // Style
          const borderRadius = this.sizes.block[type].borderRadius;
          const lineWidth = this.sizes.block[type].lineWidth;

          // Colors
          const scoreColors = colors.score;

          // Fonts
          const fontName = this.fonts.name;
          const fontScore = this.fonts.score;

          // If not first round - update position
          if (round > 0) {
            // Get parents of current block
            drawParentBlocks = [drawBlocks[round - 1][i*2 + 0], drawBlocks[round - 1][i*2 + 1]];
            x = drawParentBlocks[0].rect.x + drawParentBlocks[0].rect.width + round * this.sizes.spaceBetweenTwoRound[dataset.mode];
            y = drawParentBlocks[0].rect.y + (drawParentBlocks[1].rect.y + drawParentBlocks[1].rect.height - drawParentBlocks[0].rect.y - height)/2;
          }

          // Additionnal width for block
          if (maxScoresPresent > 1) {
            if (type != 'big_up' && type != 'big_down') {
              width += (maxScoresPresent - 1) * scoreSize;
            }
          }

          // Create block
          const drawBlock = new DrawBlock(this.context, datasetBlock);
          drawBlock.type = type;
          drawBlock.padding = Math.max(2, Math.min(10, width / 30));
          drawBlock.nameFont = fontName;
          drawBlock.scoreFont = fontScore;
          drawBlock.scoreSize = scoreSize;
          drawBlock.scoreColors = scoreColors;
          drawBlock.rect = new DrawRect(this.context, {
            x: x,
            y: y,
            width: width,
            height: height,
            radius: borderRadius,
            lineWidth: lineWidth,
            lineColor: colors.block.border[datasetBlock.status],
            fillColor: colors.block.fill[datasetBlock.status],
          });
          drawBlock.rect.createContentWidthPadding(drawBlock.padding);

          if (stroke) {
            drawBlock.draw();
            if (round > 0) {
              this.linkBlock(ctx, drawParentBlocks[0], drawParentBlocks[1], drawBlock, this.sizes.link.borderRadius, drawBlock.rect.lineWidth);
            }
            this.addOverlayDivForBlock(drawBlock);
          }

          if (y + height + lineWidth > result['height']) {
            result['height'] = y + height + lineWidth;
          }
          if (x + width + lineWidth > result['width']) {
            result['width'] = x + width + lineWidth;
          }

          drawCurrentBlocks.push(drawBlock);
        }
        drawBlocks.push(drawCurrentBlocks);
      }

      // Clear while the draw
      if (clearIdBeforeDraw != this.clearId) {
        for (let i = 0; i < drawBlocks.length; i++) {
          for (let j = 0; j < drawBlocks[i].length; j++) {
            drawBlocks[i][j].clear();
          }
        }
      } else {
        if (dataset.winner) {
          const rect = this.addOverlayWinnerDiv(dataset, drawBlocks, stroke);
          if (rect) {
            if (rect.x + rect.width > result['width']) {
              result['width'] = rect.x + rect.width;
            }
          }
        }
      }
      if (stroke) {
        this.drawBlocks = drawBlocks;
      }
      return result;
    }


    private addOverlayDivForBlock(block : DrawBlock) {
      const newDiv = document.createElement('div');
      const width = this.width;
      const height = this.height;
      newDiv.setAttribute('name', 'team');
      newDiv.style.position = 'absolute';
      newDiv.style.width = (block.rect.width * 100)/width + '%';
      newDiv.style.height = (block.rect.height * 100)/height + '%';
      newDiv.style.left = (block.rect.x * 100)/width + '%';
      newDiv.style.top = (block.rect.y * 100)/height + '%';
      newDiv.onclick = function() {
        if (block.data && block.data.click) {
          block.data.click();
        }
      };
      this.support.appendChild(newDiv);
    }

    private addOverlayWinnerDiv(dataset : Dataset, blocks : DrawBlock[][], stroke) {
      const nbRound = blocks.length;
      const final = blocks[nbRound - 1];
      const width = this.width;
      const height = this.height;
      let result = null;
      if (final.length == 2) {
        const firstBlock = final[0];
        const secondBlock = final[1];

        let spaceBetweenBlocks = 0;
        let divWidth = 0;
        let divX = 0;
        let divHheight = 0;
        let divY = 0;

        if (nbRound > 1) {
          spaceBetweenBlocks = secondBlock.rect.y - (firstBlock.rect.y + firstBlock.rect.height);
          divWidth = firstBlock.rect.width * 1;
          divX = (firstBlock.rect.x + firstBlock.rect.width / 2) - divWidth / 2;
          divHheight = spaceBetweenBlocks * 0.8;
          divY = firstBlock.rect.y + firstBlock.rect.height + (spaceBetweenBlocks - divHheight) / 2;
        } else {
          spaceBetweenBlocks = secondBlock.rect.x - (firstBlock.rect.x + firstBlock.rect.width);
          divWidth = firstBlock.rect.width * 0.95;
          divX = firstBlock.rect.x + firstBlock.rect.width + (spaceBetweenBlocks - divWidth) / 2;
          divHheight = firstBlock.rect.height * 0.8;
          divY = (firstBlock.rect.y + firstBlock.rect.height / 2) - divHheight / 2;
        }

        if (stroke) {
          const newDiv = document.createElement('div');
          newDiv.setAttribute('name', 'winner');
          newDiv.style.position = 'absolute';
          newDiv.style.width = (divWidth * 100)/width + '%';
          newDiv.style.height = (divHheight * 100)/height + '%';
          newDiv.style.left = (divX * 100)/width + '%';
          newDiv.style.top = (divY * 100)/height + '%';
          // newDiv.style.backgroundColor = "#FFFFFF66";
          newDiv.style.display = 'flex';
          newDiv.style.alignItems = 'center';
          newDiv.style.justifyContent = 'center';
          newDiv.style.flexDirection = 'column';

          const canvasWidth = this.canvas.offsetWidth;
          const canvasHeight = this.canvas.offsetHeight;
          const fontSizeTeam = Math.min(Math.floor(canvasWidth / 15), Math.floor(canvasHeight / 5));
          const fontSizeTitle = Math.min(Math.floor(canvasWidth / 30), Math.floor(canvasHeight / 15));
          newDiv.innerHTML = '\
                    <img src="../../../../assets/img/competitions/winnertournament.png" style="width: 40%; height: 70%; object-fit: contain"></img>\
                    <div style="color : ' + colors.score.fill.won + '; font-size: ' + fontSizeTitle + 'px; line-height : ' + fontSizeTitle + 'px;">' +
                    this.parent.getTranslation('winner') +
                    '</div>\
                    <div style="color : white; font-family : BigNoodleTitling; font-size: ' + fontSizeTeam + 'px; line-height : ' + fontSizeTeam + 'px;text-align: center;">' +
                     dataset.winner.name +
                    '</div>\
                ';
          newDiv.onclick = function() {
          };
          this.support.appendChild(newDiv);
        }

        result = {
          x: divX,
          y: divY,
          width: divWidth,
          height: divHheight,
        };
      }
      return result;
    }


    private linkBlock(ctx, blockLeft1 : DrawBlock, blockLeft2 : DrawBlock, blockRight : DrawBlock, radius, lineWidth) {
      const x = blockLeft1.rect.x + blockLeft1.rect.width;
      const y1 = blockLeft1.rect.y + blockLeft1.rect.height / 2.0;
      const y2 = blockLeft2.rect.y + blockLeft2.rect.height / 2.0;
      const endX = blockRight.rect.x;
      const endY = blockRight.rect.y + blockRight.rect.height / 2.0;

      const lineWidthTop = this.sizes.link.width[blockLeft1.data.status];
      const linkWithBottom = this.sizes.link.width[blockLeft2.data.status];

      const linkColorTop = colors.link[blockLeft1.data.status];
      const linkColorBottom = colors.link[blockLeft2.data.status];

      let lineTopWin = false;
      if (blockLeft1.data.status == 'won') {
        lineTopWin = true;
      }

      DrawPlayoffsService.jonctionNextBlock(ctx, x, y1, y2, endX, endY, radius, lineWidthTop, linkWithBottom, linkColorTop, linkColorBottom, lineTopWin, true);
    }

    // ****************************************************************************************** //
    // ****************************************************************************************** //
    // ************************************    STATIC      ************************************** //
    // ****************************************************************************************** //
    // ****************************************************************************************** //

    // ********************
    // ******************** - DRAW
    // ********************

    private static perpendicularJonction(ctx, startX, startY, width, height, down, right, radius, lineWidth, lineColor, stroke) {
      radius = Math.max(0, Math.min(Math.min(width, height), radius));
      ctx.beginPath();
      if (!down) {
        const endX = startX + width;
        const endY = startY - height;
        ctx.moveTo(startX, startY);
        if (right) {
          ctx.lineTo(endX - radius, startY);
          ctx.arcTo(endX, startY, endX, startY - radius, radius);
          ctx.lineTo(endX, endY);
        } else {
          ctx.lineTo(startX, endY + radius);
          ctx.arcTo(startX, endY, startX + radius, endY, radius);
          ctx.lineTo(endX, endY);
        }
      } else {
        const endX = startX + width;
        const endY = startY + height;
        ctx.moveTo(startX, startY);
        if (right) {
          ctx.lineTo(endX - radius, startY);
          ctx.arcTo(endX, startY, endX, startY + radius, radius);
          ctx.lineTo(endX, endY);
        } else {
          ctx.lineTo(startX, endY - radius);
          ctx.arcTo(startX, endY, startX + radius, endY, radius);
          ctx.lineTo(endX, endY);
        }
      }
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      if (stroke) {
        ctx.stroke();
      }
    }

    private static jonctionNextBlock(ctx, startX, startY1, startY2, endX, endY, radius, lineWidthTop, lineWidthBottom, colorTop, colorBottom, nextLineFromUp, stroke) {
      const width = endX-startX;
      const height = (startY2 - startY1);
      const middleHeight = height / 2.0;
      const widthLinkTwoBlocks = width * 0.4;


      DrawPlayoffsService.perpendicularJonction(ctx, startX, startY1, widthLinkTwoBlocks, middleHeight, true, true, radius, lineWidthTop, colorTop, stroke);
      DrawPlayoffsService.perpendicularJonction(ctx, startX, startY2, widthLinkTwoBlocks, middleHeight, false, true, radius, lineWidthBottom, colorBottom, stroke);

      ctx.beginPath();
      ctx.lineWidth = nextLineFromUp ? lineWidthTop : lineWidthBottom;
      ctx.strokeStyle = nextLineFromUp ? colorTop : colorBottom;
      ctx.moveTo(startX + widthLinkTwoBlocks, startY1 + middleHeight);
      ctx.lineTo(endX, endY);
      if (stroke) {
        ctx.stroke();
      }
    }


    // ********************
    // ******************** - DATASET
    // ********************

    private static tournamentIsValid(tournament : TournamentModel) {
      let result = false;
      if (tournament) {
        result = true;
        if (tournament.finalStage < 0 || tournament.finalStage > 3) {
          result = false;
        }

        const gamesByRound = tournament.game;
        if (gamesByRound) {
          // number of round in the playoffs (now is 4 for eighth)
          // tournament.finalStage : // 0 -> 1/8    1 -> 1/4    2 -> 1/2    3 -> 1
          let nbConfrontationExpected = 1;
          const expectedRounds = 4 - tournament.finalStage;
          if (gamesByRound.length == expectedRounds) {
            // start from final and check every round if number of confrontation is correct
            for (let round = expectedRounds - 1; round >= 0; round--) {
              const games = gamesByRound[round];
              if (games.length != nbConfrontationExpected) {
                result = false;
              }
              nbConfrontationExpected *= 2;
            }
          }
        }
      }
      return result;
    }

    private static getScoretatus(game : GameModel, teamIndex : number) {
      let result : ScoreStatus = 'draw';
      const opponentIndex = teamIndex == 1 ? 0 : 1;
      if (game.teams[teamIndex].goals < game.teams[opponentIndex].goals) {
        result = 'lost';
      } else if (game.teams[teamIndex].goals > game.teams[opponentIndex].goals) {
        result = 'won';
      }
      return result;
    }

    private static generateDatasetBlockDatas(tournament : TournamentModel, game: GameModel, callback: (game : GameModel, team : LeagueTeam) => void) {
      const data : DatasetBlockData[] = [];
      for (let i = 0; i < 2; i++) {
        const newData : DatasetBlockData = new DatasetBlockData();
        const team : LeagueTeam = tournament.getTeamFromId(game.teams[i].from as string);
        if (team) {
          const scoreStatus : ScoreStatus = DrawPlayoffsService.getScoretatus(game, i);
          newData.url = staticShirtUrl + team.shirt;
          newData.name = team.name;
          if (game.status == 'complete') {
            newData.status = scoreStatus;
            newData.scores = [
              {
                value: game.teams[i].goals + '',
                status: scoreStatus,
              }, /* ,
                        {
                            value : (scoreStatus == "won" ? 0: 1) + "",
                            status : scoreStatus == "won" ? "lost": "won"
                        }*/
            ];
          }
          newData.click = () => {
            if (callback) {
              callback(game, team);
            }
          };
        }
        data.push(newData);
      }
      return data;
    }

    public static generateDataset(tournament : TournamentModel, click : (game : GameModel, team : LeagueTeam) => void = null, roundFocus = 0) : Dataset {
      let result : Dataset = null;
      if (DrawPlayoffsService.tournamentIsValid(tournament)) {
        const modes = ['eighth', 'quarter', 'semi', 'final'];
        const mode : DatasetMode = modes[tournament.finalStage + roundFocus] as DatasetMode;// modes[tournament.finalStage] as DatasetMode;
        const data : DatasetBlockData[][] = [];
        const gamesByRounds = tournament.game;

        for (let round = roundFocus; round < gamesByRounds.length; round ++) {
          const games = gamesByRounds[round];
          const dataCurrentRound : DatasetBlockData[] = [];
          for (const game of games) {
            const newDatas = DrawPlayoffsService.generateDatasetBlockDatas(tournament, game, click);
            dataCurrentRound.push(...newDatas);
          }
          data.push(dataCurrentRound);
        }
        result = new Dataset();
        result.winner = tournament.getWinnerTeamIfPossible();
        result.mode = mode;
        result.data = data;
      }
      return result;
    }
}
