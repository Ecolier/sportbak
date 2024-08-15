export interface StartSessionInput {
    time: number, // secondes of one period
    period : number,
    warmup : number, // secondes 
    pauseTime : number, // secondes
    ambiance : boolean,
    sounds : boolean,
    teamName1 : string,
    teamName2 : string
}