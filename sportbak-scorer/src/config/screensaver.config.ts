export interface ScreensaverConfig {
    enabled : boolean;
    timeout : number; // secondes
}

// default config
export default {
    enabled : true,
    timeout : 5 * 60 // 5 minutes
} as ScreensaverConfig;