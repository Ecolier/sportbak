export interface BaseSessionSettings {
  time: number;
  period: number;
  pauseTime: number;
  teamName1?: string;
  teamName2?: string;
  sound: boolean;
  ambiance: boolean;
  warmup: number;
}

export interface SessionSettingsRemote extends BaseSessionSettings {
  type: string;
  name: string;
}

export interface HydratedSessionSettingsRemote extends SessionSettingsRemote {
  createdAt: string;
  target: string;
  targetModel: string;
  updatedAt: string;
  _id: string;
}

export type SessionSettings = BaseSessionSettings | SessionSettingsRemote | HydratedSessionSettingsRemote;

export const isHydratedSessionSettings = (sessionSettings: any): sessionSettings is HydratedSessionSettingsRemote => {
  return sessionSettings.target;
};
