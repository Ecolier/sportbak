enum FrontendInterfaceTheme {
    classic = 'classic'
}

enum FrontendInterfaceBackgroundMode {
    default = 'default',
    complex = 'complex',
    color = 'color',
    custom = 'custom'
}

const white = "#FFFFFFFF";
const darkGrey = "#111111FF";
const black = "#000000FF";

export interface FrontendInterface {
    theme : FrontendInterfaceTheme,
    backgroundMode : FrontendInterfaceBackgroundMode,
    backgroundColor : string,
    backgroundOverlayColor : string,
    backgroundCustom : string,
    scoreColor : string,
    teamColor : string,
    periodColor : string,
    fieldColor : string,
    secondaryColor : string,
    primaryTimerColor : string,
    secondaryTimerColor : string,
    baseColor : string,
    switchTimers : boolean
}

// default config
export default {
    theme : FrontendInterfaceTheme.classic,
    backgroundMode : FrontendInterfaceBackgroundMode.default,
    backgroundColor : darkGrey,
    backgroundOverlayColor : "#111317DD",
    backgroundCustom : null,
    scoreColor : white,
    teamColor : white,
    secondaryColor : white,
    primaryTimerColor : black,
    secondaryTimerColor : black,
    periodColor : "#DAA520",
    fieldColor : white,
    baseColor : white,
    switchTimers : false
} as FrontendInterface;