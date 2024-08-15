export class AdjustingInterval {
  private expected = 0;
  private timeout?: any;

  constructor(
    private workFunc: Function,
    private interval: number,
    private errorFunc?: Function) { }

  start() {
    this.expected = Date.now() + this.interval;
    this.timeout = setTimeout(this.step.bind(this), this.interval);
  }

  stop() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  step() {
    const drift = Date.now() - this.expected;
    if (drift > this.interval) {
      if (this.errorFunc) this.errorFunc();
    }
    this.workFunc();
    this.expected += this.interval;
    this.timeout = setTimeout(this.step.bind(this), Math.max(0, this.interval - drift));
  }
}
