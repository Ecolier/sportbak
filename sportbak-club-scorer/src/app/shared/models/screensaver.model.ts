export default interface Screensaver {
    enabled : boolean;
    timeout : number; // secondes
}

// default config
const _default = {
    enabled : true,
    timeout : 5 * 60 // 5 minutes
} as Screensaver;
export const defaultScreensaver = _default;