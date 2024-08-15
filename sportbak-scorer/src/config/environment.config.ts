export enum EnvironmentMode {
    production = 'production',
    development = 'development',
    local = 'local',
}

let mode : EnvironmentMode = EnvironmentMode.production; // default
if (process.env.ENVIRONMENT_MODE == 'development') {
    mode = EnvironmentMode.development;
} else if (process.env.ENVIRONMENT_MODE == 'local') {
    mode = EnvironmentMode.local;
} 

export default {
    mode : mode,
    platform : process.env.PLATFORM,
    os : process.env.OS,
    osversion : process.env.OS_VERSION,
};