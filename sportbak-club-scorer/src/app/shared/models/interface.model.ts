export enum FrontendInterfaceTheme {
    classic = 'classic',
    classicLarge = 'classic-large',
}

export enum FrontendInterfaceBackgroundMode {
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
    backgroundCustom : string | null,
    scoreColor : string,
    teamColor : string,
    secondaryColor : string,
    periodColor : string,
    fieldColor : string,
    primaryTimerColor : string,
    secondaryTimerColor : string,
    baseColor : string,
    switchTimers : boolean
}

const defaultInterface : FrontendInterface = {
    theme : FrontendInterfaceTheme.classic,
    backgroundMode : FrontendInterfaceBackgroundMode.default,
    backgroundColor : darkGrey,
    backgroundOverlayColor : "#111317CC",
    backgroundCustom : null,
    scoreColor : white,
    teamColor : white,
    secondaryColor : white,
    periodColor : white,
    fieldColor : white,
    primaryTimerColor : black,
    secondaryTimerColor : black,
    baseColor : white,
    switchTimers : false
};

export default defaultInterface;

function colorIsValid(color : string) {
    var s = new Option().style;
    s.color = color;
    return s.color.length;
}

export function formatInterface(data : FrontendInterface) : FrontendInterface {
    if (!data) data = defaultInterface;
    let result : any = data;
    if (!Object.values(FrontendInterfaceTheme).includes(result.theme)) {
        result.theme = defaultInterface.theme;
    }
    if (!Object.values(FrontendInterfaceBackgroundMode).includes(result.backgroundMode)) {
        result.backgroundMode = defaultInterface.backgroundMode;
    }

    colorIsValid("sdfsdfs");
    const keyColors = ['backgroundColor', 'backgroundOverlayColor', 'scoreColor',
    'teamColor', 'secondaryColor', 'primaryTimerColor', 'secondaryTimerColor',
    'baseColor'];
    for(let key of keyColors) {
        const color = result[key] as string;
        if (!colorIsValid(color)) {
            result[key] = (defaultInterface as any)[key];
        }
    }
    return result;
}
