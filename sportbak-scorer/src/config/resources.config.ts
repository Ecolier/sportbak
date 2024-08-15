const overlay = {
    directory : 'overlay',
    images : {
        build : {
            filename : 'overlay'
        },
        temporary : {
            filename : 'current_overlay'
        },
        topRight : {
            filename : 'overlay-top-right-logo'
        }
    }
}
export default {
    path: process.env.RESSOURCES_PATH || '/resources',
    overlay : overlay
};
