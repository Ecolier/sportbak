
export class GamepadSimulator {

  constructor() {
    this.create();
  }

  fakeController = {
    axes: [0, 0, 0, 0],
    buttons: [
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
      {
        pressed: false,
        touched: false,
        value: 0,
      },
    ],
    connected: false,
    id: 'Sportbak Virtual Gamepad',
    index: -1,
    mapping: 'standard',
    timestamp: Math.floor(Date.now() / 1000),
  };

  getGamepads?: (Gamepad | null)[];

  create() {
    document.addEventListener('keydown', event => {
      const numberFromKey = parseInt(event.key);
      if (numberFromKey !== NaN && numberFromKey >= 0 && numberFromKey <= 8) {
        this.fakeController.buttons[numberFromKey].pressed = true;
        this.fakeController.timestamp = Math.floor(Date.now() / 1000);
      }
    });

    document.addEventListener('keyup', event => {
      const numberFromKey = parseInt(event.key);
      if (numberFromKey !== NaN && numberFromKey >= 0 && numberFromKey <= 8) {
        this.fakeController.buttons[numberFromKey].pressed = false;
        this.fakeController.timestamp = Math.floor(Date.now() / 1000);
      }
    });

    // @ts-ignore
    this.getGamepads = navigator.getGamepads;

    // @ts-ignore
    //navigator.getGamepads = () => ({ 0: this.fakeController });
  }

  destroy() {
    if (this.fakeController.connected) {
      this.disconnect();
    }
    // @ts-ignore
    navigator.getGamepads = this.getGamepads;
  }

  connect() {
    const event = new Event('gamepadconnected');
    this.fakeController.connected = true;
    this.fakeController.timestamp = Math.floor(Date.now() / 1000);
    // @ts-ignore
    event.gamepad = this.fakeController;
    window.dispatchEvent(event);
  }

  disconnect() {
    const event = new Event('gamepaddisconnected');
    this.fakeController.connected = false;
    this.fakeController.timestamp = Math.floor(Date.now() / 1000);
    // @ts-ignore
    event.gamepad = this.fakeController;
    window.dispatchEvent(event);
  }
};