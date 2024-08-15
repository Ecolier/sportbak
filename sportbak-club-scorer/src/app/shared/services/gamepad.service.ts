import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GamepadSimulator } from '../utilities/gamepad-simulator';
import { DataService } from './data.service';
import { SessionService } from './session.service';
import { SocketService } from './socket.service';

export type Action = 'buzz' | 'down' | 'goalTeam1' | 'goalTeam2' | 'up' | 'var' | 'return';
export function isValidAction(action: string): action is Action {
  return action === 'buzz' || action === 'down' || action === 'goalTeam1' || action === 'goalTeam2' || action === 'up' || action === 'var' || action == 'return';
}

const actions : Action[]= ['buzz', 'down', 'goalTeam1', 'goalTeam2', 'up', 'var', 'return'];

const keyboardEnabled : boolean = true;

export type KeyBindings = {
  [key in Action]: number;
}

export type KeyboardKeyBindings = {
  [key in Action]: string;
}

@Injectable({
  providedIn: 'root',
})
export class GamepadService {
  private buttonBindings: KeyBindings = {
    buzz: 7,
    down: 4,
    goalTeam1: 0,
    goalTeam2: 1,
    up: 3,
    var: 2,
    return : 5
  };

  // work with azerty and qwerty keyboard !
  private keyboardBindings :  KeyboardKeyBindings = {
    buzz: 'b',
    down: 'd',
    goalTeam1: 'e',
    goalTeam2: 'i',
    up: 'u',
    var: 'v',
    return : 'r'
  };
  private keyboardButtonsPressed : string[] = [];

  private gamepads: Gamepad[] = [];
  private gamepadSimulator = new GamepadSimulator();
  private pollInterval;
  private buttonStateCache = new Map<Action, boolean>();
  private _buttonDown$ = new Subject<Action>();
  private _buttonUp$ = new Subject<Action>();

  private _buttonDownGamepadIndex$ = new Subject<number>();
  private _buttonUpGamepadIndex$ = new Subject<number>();

  private _gamepadConnected$ = new Subject<boolean>();


  buttonUp$ = this._buttonUp$.asObservable();
  buttonDown$ = this._buttonDown$.asObservable();

  buttonDownGamepadIndex$ = this._buttonDownGamepadIndex$.asObservable();
  buttonUpGamepadIndex$ = this._buttonUpGamepadIndex$.asObservable();
  
  gamepadConnected$ = this._gamepadConnected$.asObservable();

  constructor(private dataService : DataService) {
    this.dataService.dataInit$.subscribe(data => this.buttonBindings = data.mapping);
    window.addEventListener('gamepadconnected', event => {
      // add in array if doesn't exist yet
      if (!this.gamepads.find((g) => g.index == event.gamepad.index)) {
        this.gamepads.push(event.gamepad);
      }      

      if (this.gamepadIsConnected()) {
        this._gamepadConnected$.next(true);
      }
    })
    window.addEventListener('gamepaddisconnected', (event) =>{
      // remove from array
      this.gamepads = this.gamepads.filter((g) => g.index != event.gamepad.index);

      if (!this.gamepadIsConnected()) {
        this._gamepadConnected$.next(false);
      }
    })
    this.gamepadSimulator.connect();
    this.pollInterval = setInterval(() => this.loop(), 20);
    this.initKeyboard();
  }

  initKeyboard() {
    if (keyboardEnabled) {
      document.addEventListener('keydown', event => {
        const key : string = event.key.toLocaleLowerCase();
        if (!this.keyboardButtonsPressed.find((k) => k == key)) {
          this.keyboardButtonsPressed.push(key);
        }
      });
  
      document.addEventListener('keyup', event => {
        const key : string = event.key.toLocaleLowerCase();
        this.keyboardButtonsPressed = this.keyboardButtonsPressed.filter((k) => k != key);
      });
    }
  }

  refreshGamepad(gamepad : Gamepad) : Gamepad {
    let index = gamepad.index;
    if (index >= 0) {
      let gamepads = navigator.getGamepads();
      if (index < gamepads.length) {
        gamepad = gamepads[index] || gamepad;
      }
    }
    return gamepad;
  }
  
  loop() {
    let actionsGamepadPressed  : Action[] = [];
    let actionsKeyboardPressed  : Action[] = [];
    if (this.gamepads) {
      for (let gamepad of this.gamepads) {
        gamepad = this.refreshGamepad(gamepad);
        if (gamepad) {
          const buttons = gamepad.buttons;
          buttons.forEach((button, index) => {
            if (button.pressed) {
              const actionForKey = Object.keys(this.buttonBindings).find(key => (this.buttonBindings as any)[key] === index);
              if (actionForKey && isValidAction(actionForKey)) {
                if (!actionsGamepadPressed.find((a) => a == actionForKey))
                  actionsGamepadPressed.push(actionForKey);
              }
            }
          });
        }
      }
    }

    if (keyboardEnabled) {
      for (let actionForKey of actions) {
        let key = this.keyboardBindings[actionForKey];
        let keyPressed = this.keyboardButtonsPressed.find((k) => k == key) ? true : false;
        if (keyPressed) {
          if (!actionsKeyboardPressed.find((a) => a == actionForKey))
            actionsKeyboardPressed.push(actionForKey);
        }
      }
    }

    let actionPressed = [... actionsGamepadPressed, ...actionsKeyboardPressed];
    for (let a of actions) {
      
      if (actionsGamepadPressed.includes(a)) {
        if (this.buttonStateCache.get(a) === false) {
          this._buttonDownGamepadIndex$.next(this.buttonBindings[a]);
        }
      } else {
        if (this.buttonStateCache.get(a) === true) {
          this._buttonUpGamepadIndex$.next(this.buttonBindings[a]);
        }
      }

      if (actionPressed.includes(a)) {
        if (this.buttonStateCache.get(a) === false) {
          this._buttonDown$.next(a);
        }
        this.buttonStateCache.set(a, true);
      } else {
        if (this.buttonStateCache.get(a) === true) {
          this._buttonUp$.next(a);
        }
        this.buttonStateCache.set(a, false);
      }
    }
  }

  gamepadIsConnected() {
    let connected = false;
    for (let g of this.gamepads) {
      g = this.refreshGamepad(g);
      if(g && g.index >= 0) {
        if (g.connected) {
          connected = true;
          break;
        }
      }
    }
    return connected;
  }

  getKeysBinding() {
    return this.buttonBindings;
  }
  getKeyboardKeysBinding() {
    return this.keyboardBindings;
  }
}