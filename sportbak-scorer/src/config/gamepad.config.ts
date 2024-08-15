export interface MappingGamePad {
    goalTeam1 : number;
    goalTeam2 : number;
    return : number,
    buzz : number;
    var : number;
    up : number;
    down : number;
}

// default config
export default {
    goalTeam1 : 0,
    goalTeam2 : 1,
    return : 4,
    buzz : 6,
    var : 7,
    up : 2,
    down : 3
} as MappingGamePad;