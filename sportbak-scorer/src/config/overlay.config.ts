export interface OverlayConfig {
    enabled : boolean;
    logoTopRight : boolean;
    customTopRightLogo : string; // url - png
}

// default config
export default {
    enabled : true,
    logoTopRight : true,
    customTopRightLogo : null
} as OverlayConfig;