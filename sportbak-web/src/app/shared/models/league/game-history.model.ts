import {FBKModel} from '../futbak-parent-model';

const _default = {
  start: null,
  end: null,
  devices: null,
  actions: null,
  possession: null,
};

export class GameHistoryDataModel extends FBKModel {
    /* public static ACTIONS : {
        0 : "powerfulshots",
        1 : "powerfulshotsReceived",    // in interception
        2 : "successfulpasses",
        3 : "lostpasses",
        4 : "interceptionOfLostpasses", // in interception
        5 : "unsuccessfulduelswithBall",
        6 : "successfulduels",              // withoutBall
        7 : "successfuldribbles",           // withBall
        8 : "unsuccessfulduels",        // withoutBall - this = totalduels - successfulduels
        9 : "successfulpassesReceived", // not used at this moment
    }*/
    public static ACTIONS = {
      POWERFUL_SHOTS: 0,
      POWERFUL_SHOTS_RECEIVED: 1,
      SUCCESFUL_PASSES: 2,
      LOST_PASSES: 3,
      INTERCPTION_OF_LOST_PASSES: 4,
      UNSUCCESSFUL_DUELS_WITH_BALL: 5,
      SUCCESSFUL_DUELS: 6,
      SUCCESSFUL_DRIBBLES: 7,
      UNSUCCESSFUL_DUELS: 8,
      SUCCESSFUL_PASSES_RECEIVED: 9,
    }

    public static PLAYEDBALL_ACTIONS = [
      GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES,
      GameHistoryDataModel.ACTIONS.LOST_PASSES,
      GameHistoryDataModel.ACTIONS.POWERFUL_SHOTS,
      GameHistoryDataModel.ACTIONS.UNSUCCESSFUL_DUELS_WITH_BALL,
      GameHistoryDataModel.ACTIONS.UNSUCCESSFUL_DUELS,
    ];

    public start: Date;
    public end: Date;
    public devices: string[];
    public actions: number[];
    public possession : number[];

    constructor(data:any) {
      super(data, _default);
    }

    public static createPersonnalData(gameHistory : GameHistoryModel, deviceId : string) {
      let result = [];
      if (gameHistory && deviceId) {
        const data = gameHistory.data;
        if (data && data.length) {
          const newData = data.filter(function(element) {
            return element.devices ? element.devices.some((device) => device === deviceId) : false;
          });
          result = newData;
        }
      }
      return result;
    }

    public static filterByActionForMultipleDevices(datas : GameHistoryDataModel[], devicesId: string[], action: number) {
      let result = [];
      if (datas && datas.length) {
        const newDatas = datas.filter(function(element) {
          let _result = false;
          if (element.devices && element.actions) {
            if (element.devices.length && element.devices.length == element.actions.length) {
              const devices = element.devices;
              const actions = element.actions;
              for (let i = 0; i < devices.length; i++) {
                if ((devicesId == null || devicesId.indexOf(devices[i]) >= 0) && actions[i] == action) {
                  _result = true;
                  break;
                }
              }
            }
          }
          return _result;
        });
        result = newDatas;
      }
      return result;
    }

    public static filterByActionsForMultipleDevices(datas : GameHistoryDataModel[], devicesId: string[], actions: number[]) {
      let result = [];
      if (datas && datas.length) {
        const newDatas = datas.filter(function(element) {
          let _result = false;
          if (element.devices && element.actions) {
            if (element.devices.length && element.devices.length == element.actions.length) {
              const devices = element.devices;
              const _actions = element.actions;
              for (let i = 0; i < devices.length; i++) {
                if ((devicesId == null || devicesId.indexOf(devices[i]) >= 0) && actions && actions.indexOf(_actions[i]) >= 0) {
                  _result = true;
                  break;
                }
              }
            }
          }
          return _result;
        });
        result = newDatas;
      }
      return result;
    }

    public static filterByAction(datas : GameHistoryDataModel[], deviceId: string, action: number) {
      return GameHistoryDataModel.filterByActionForMultipleDevices(datas, deviceId ? [deviceId] : null, action);
    }

    public static filterByActions(datas : GameHistoryDataModel[], deviceId: string, actions: number[]) {
      return GameHistoryDataModel.filterByActionsForMultipleDevices(datas, deviceId ? [deviceId] : null, actions);
    }

    private static getSummaries(datas: GameHistoryDataModel[], deviceId : string, filterByAction : number, linkedAction : number, offsetInArray : number) {
      const result = [];
      const devicesWithValues = {};

      datas = GameHistoryDataModel.filterByAction(datas, deviceId, filterByAction);
      if (datas && datas.length) {
        for (const data of datas) {
          const devices = data.devices;
          const actions = data.actions;
          let index = -1;
          if (devices && actions && devices.length == actions.length) {
            let i = 0;
            for (i = 0; i < actions.length; i++) {
              if (actions[i] == filterByAction) {
                index = i;
                break;
              }
            }

            if (index + offsetInArray >= 0 && (index + offsetInArray) < devices.length) {
              if (actions[index+offsetInArray] == linkedAction) {
                const device = devices[i+offsetInArray];
                devicesWithValues[device] = devicesWithValues[device] ? devicesWithValues[device] + 1 : 1;
              }
            }
          }
        }
      }

      const keys = Object.keys(devicesWithValues);
      for (const key of keys) {
        result.push({
          device: key,
          value: devicesWithValues[key],
        });
      }

      return result;
    }

    private static getSummariesByActions(datas: GameHistoryDataModel[], deviceId : string, filterByActions : number[]) {
      const result = [];
      const devicesWithValues = {};

      datas = GameHistoryDataModel.filterByActions(datas, deviceId, filterByActions);
      if (datas && datas.length) {
        for (const data of datas) {
          const devices = data.devices;
          const actions = data.actions;
          if (devices && actions && devices.length == actions.length) {
            for (let i = 0; i < actions.length; i++) {
              if (filterByActions.indexOf(actions[i]) >= 0) {
                const device = devices[i];
                devicesWithValues[device] = devicesWithValues[device] ? devicesWithValues[device] + 1 : 1;
              }
            }
          }
        }
      }

      const keys = Object.keys(devicesWithValues);
      for (const key of keys) {
        result.push({
          device: key,
          value: devicesWithValues[key],
        });
      }

      return result;
    }

    public static getSummarPlayedBalls(datas : GameHistoryDataModel[]) {
      return GameHistoryDataModel.getSummariesByActions(datas, null, GameHistoryDataModel.PLAYEDBALL_ACTIONS);
    }

    public static getSummaryPowerfulShot(datas : GameHistoryDataModel[], deviceId : string = null) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.POWERFUL_SHOTS, GameHistoryDataModel.ACTIONS.POWERFUL_SHOTS, 0);
    }

    public static getSummaryRecoveredBall(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.POWERFUL_SHOTS_RECEIVED, GameHistoryDataModel.ACTIONS.POWERFUL_SHOTS, -1);
    }

    public static getSummaryInterceptions(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.INTERCPTION_OF_LOST_PASSES, GameHistoryDataModel.ACTIONS.LOST_PASSES, -1);
    }

    public static getSummaryLostPasses(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.LOST_PASSES, GameHistoryDataModel.ACTIONS.INTERCPTION_OF_LOST_PASSES, 1);
    }

    public static getSummarySuccessfulPasses(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES, GameHistoryDataModel.ACTIONS.SUCCESSFUL_PASSES_RECEIVED, 1);
    }

    public static getSummarySuccessfulPassesReceived(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.SUCCESSFUL_PASSES_RECEIVED, GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES, -1);
    }

    public static getSummaryTotalLostPasses(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.LOST_PASSES, GameHistoryDataModel.ACTIONS.LOST_PASSES, 0);
    }

    public static getSummaryTotalSuccessfulPasses(datas: GameHistoryDataModel[], deviceId : string) {
      return GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES, GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES, 0);
    }

    public static getSummaryPossession(datas: GameHistoryDataModel[]) {
      const result = [];
      const possessions = GameHistoryDataModel.getPossessions(datas);
      const keys = Object.keys(possessions);
      for (const key of keys) {
        result.push({
          device: key,
          percentage: true,
          value: Math.round(100 * possessions[key]),
        });
      }
      return result;
    }

    public static getSummaryPassesAccuracy(datas: GameHistoryDataModel[]) {
      const success = GameHistoryDataModel.getSummaries(datas, null, GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES, GameHistoryDataModel.ACTIONS.SUCCESFUL_PASSES, 0);
      const failed = GameHistoryDataModel.getSummaries(datas, null, GameHistoryDataModel.ACTIONS.LOST_PASSES, GameHistoryDataModel.ACTIONS.LOST_PASSES, 0);
      const result = [];
      const devices = [];
      for (const data of success) {
        if (!devices.some((device) => device == data.device)) {
          devices.push(data.device);
        }
      }
      for (const data of failed) {
        if (!devices.some((device) => device == data.device)) {
          devices.push(data.device);
        }
      }
      for (const device of devices) {
        let successPasses = 0;
        let faildPasses = 0;
        for (const data of success) {
          if (data.device == device) {
            successPasses = data.value;
            break;
          }
        }
        for (const data of failed) {
          if (data.device == device) {
            faildPasses = data.value;
            break;
          }
        }
        result.push({
          device: device,
          value: (100 * successPasses / (successPasses + faildPasses)),
          percentage: true,
        });
      }
      return result;
    }

    public static getSummaryDuels(datas: GameHistoryDataModel[], deviceId : string) {
      const duelsWon = GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.SUCCESSFUL_DUELS, GameHistoryDataModel.ACTIONS.UNSUCCESSFUL_DUELS_WITH_BALL, -1);
      const duelsLost = GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.UNSUCCESSFUL_DUELS, GameHistoryDataModel.ACTIONS.SUCCESSFUL_DRIBBLES, -1);
      const result = [];
      const devices = [];
      for (const data of duelsWon) {
        if (!devices.some((device) => device == data.device)) {
          devices.push(data.device);
        }
      }
      for (const data of duelsLost) {
        if (!devices.some((device) => device == data.device)) {
          devices.push(data.device);
        }
      }
      for (const device of devices) {
        let valueDuelsWon = 0;
        let valueDuelsLost = 0;
        for (const data of duelsWon) {
          if (data.device == device) {
            valueDuelsWon = data.value;
            break;
          }
        }
        for (const data of duelsLost) {
          if (data.device == device) {
            valueDuelsLost = data.value;
            break;
          }
        }
        result.push({
          device: device,
          value: valueDuelsWon,
          onValue: (valueDuelsWon + valueDuelsLost),
        });
      }
      return result;
    }

    public static getSummaryDribbles(datas: GameHistoryDataModel[], deviceId : string) {
      const dribblesWon = GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.SUCCESSFUL_DRIBBLES, GameHistoryDataModel.ACTIONS.UNSUCCESSFUL_DUELS, 1);
      const dribblesLost = GameHistoryDataModel.getSummaries(datas, deviceId, GameHistoryDataModel.ACTIONS.UNSUCCESSFUL_DUELS_WITH_BALL, GameHistoryDataModel.ACTIONS.SUCCESSFUL_DUELS, 1);
      const result = [];
      const devices = [];
      for (const data of dribblesWon) {
        if (!devices.some((device) => device == data.device)) {
          devices.push(data.device);
        }
      }
      for (const data of dribblesLost) {
        if (!devices.some((device) => device == data.device)) {
          devices.push(data.device);
        }
      }
      for (const device of devices) {
        let valueDribblesWon = 0;
        let valueDribblesLost = 0;
        for (const data of dribblesWon) {
          if (data.device == device) {
            valueDribblesWon = data.value;
            break;
          }
        }
        for (const data of dribblesLost) {
          if (data.device == device) {
            valueDribblesLost = data.value;
            break;
          }
        }
        result.push({
          device: device,
          value: valueDribblesWon,
          onValue: (valueDribblesWon + valueDribblesLost),
        });
      }
      return result;
    }

    public static getPossessionsBetweenDatesForDevice(datas: GameHistoryDataModel[], start : Date, end : Date, device : string) {
      let result = 0;
      const possession = GameHistoryDataModel.getPossessionsBetweenDates(datas, start, end);
      if (possession) {
        if (possession[device]) {
          result = possession[device];
        }
      }
      return result;
    }

    public static getPossessionsBetweenDates(datas: GameHistoryDataModel[], start : Date, end : Date) {
      const result = {};
      for (const d of datas) {
        const startAction = new Date(d.start);
        const endAction = new Date(d.end);

        let addTimes = true;

        if (start && start.getTime() > startAction.getTime()) {
          addTimes = false;
        }
        if (end && end.getTime() > endAction.getTime()) {
          addTimes = false;
        }

        if (addTimes) {
          if (d.devices.length == d.possession.length) {
            for (let i = 0; i < d.devices.length; i++) {
              const device = d.devices[i];
              result[device] = d.possession[i] + (result[device] ? result[device] : 0);
            }
          }
        }
      }
      const devices = Object.keys(result);
      let sum = 0;
      for (const device of devices) {
        sum += result[device];
      }
      for (const device of devices) {
        result[device] = result[device]/sum;
      }
      return result;
    }

    public static getPossessions(datas: GameHistoryDataModel[]) {
      return GameHistoryDataModel.getPossessionsBetweenDates(datas, null, null);
    }

    public static getDevices(datas: GameHistoryDataModel[]) {
      const devices = [];
      for (const d of datas) {
        for (const device of d.devices) {
          if (devices.indexOf(device) < 0) {
            devices.push(device);
          }
        }
      }
      return devices;
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      // HERE YOU NEED TO CONSTRUCT CHILDREN
    }
}

const __default = {
  _id: null,
  createdAt: null,
  enabled: null,
  data: null,
};


export class GameHistoryModel extends FBKModel {
  public _id: string;
  public createdAt: Date;
  public enabled: boolean;
  public data: GameHistoryDataModel[];

  constructor(data:any) {
    super(data, __default);
  }

  public onBeforePatch() {
  }
  public onAfterPatch() {
    if (this.data) {
      const data = [];
      for (let i = 0; i < this.data.length; i++) {
        data.push(new GameHistoryDataModel(this.data[i]));
      }
      this.data = data;
    }
  }
}
