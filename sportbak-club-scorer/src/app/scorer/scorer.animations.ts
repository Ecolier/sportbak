import { animate, group, query, style, transition, trigger } from '@angular/animations';

const EASING = '1s cubic-bezier(0.35, 0, 0.25, 1)';
const PAUSE_TIME = '2s';

export const scorerAnimations = [
  trigger('newPeriodTransition', [
    transition('inactive => active', [
      group([ 
        query('.session-stopwatch', animate(EASING, style({ transform: 'translateY(225px) scale(1.75)', color: 'white' }))),
        query('.match__stage', animate(EASING, style({ transform: 'translateY(375px) scale(2)' }))),
        //query('.complex-logo', animate(EASING, style({ transform: 'scale(1.5)' }))),
        query('.right-pane', animate(EASING, style({ transform: 'translateY(0) rotate(90deg) scale(4)' }))),
        query('.left-pane', animate(EASING, style({ transform: 'translateY(0) rotate(90deg) scale(4)' }))) 
      ]),

      animate(PAUSE_TIME),

      group([ 
        query('.session-stopwatch', animate(EASING, style({ transform: 'translateY(0) scale(1)', color: 'black' }))),
        query('.match__stage', animate(EASING, style({ transform: 'translateY(0) scale(1)' }))),
        //query('.complex-logo', animate(EASING, style({ transform: 'translateY(0) scale(1)' }))),
        query('.right-pane', animate(EASING, style({ transform: 'translateY(100%)' }))),
        query('.left-pane', animate(EASING, style({ transform: 'translateY(-100%)' }))) 
      ]),
    ]),
  ])
];