import { Session } from './session.model';

export type GenericMessage = {
  action: '';
  params?: any;
}


export type OnboardingNeededMessage = {
  action: 'onboarding/needed';
  params?: any;
}

export type CurrentSessionMessage = {
  action: 'session/current-session';
  params: Session;
}

export type GoalMessage = {
  action: 'session/goal';
  params: Session;
}

export type BuzzMessage = {
  action: 'session/buzz';
  params: Session;
}

export type VarMessage = {
  action: 'session/var';
  params: Session;
}

export type MatchMessage = GenericMessage | CurrentSessionMessage | GoalMessage | BuzzMessage | VarMessage ;


export function isValidMessage (message: any) : message is MatchMessage | OnboardingNeededMessage{
  return message.action ? true : false
}