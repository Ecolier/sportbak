const overlay = {
    directory : 'overlay',
    images : {
        topRight : {
            filename : 'overlay-top-right-logo'
        }
    }
}
export default {
    path: process.env.ASSETS_PATH || '/assets',
    images : {
        OVERLAY_SPORTBAK_LOGO : 'overlay_sportbak_logo.png',
    },
    fonts : {
        BIG_NOODLE : 'big_noodle_titling.ttf'
    },
    json : {
        OVERLAY_METADATA : 'overlay_metadata.json'
    }
};
