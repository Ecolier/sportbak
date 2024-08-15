export enum SocketCommandesMessageAction {
    ACTION_NOT_FOUND = "action/not-found",
    ACTION_ERROR = "action/error",

    ONBOARDING_NEEDED = "onboarding/needed",
    ONBOARDING_LOGIN = "onboarding/login",
    ONBOARDING_SELECT_FIELD = "onboarding/selectField",
    ONBOARDING_SUCCESS = "onboarding/success",
    ONBOARDING_ERROR = "onboarding/error",
    ONBOARDING_FIELDS = "onboarding/fields",

    SESSION_START = "session/start",
    SESSION_RESET = "session/reset",
    SESSION_STOP = "session/stop",
    SESSION_TEAM_NAMES = "session/teamNames",
    SESSION_ADD_GOAL_TEAM_1 = "session/addGoalTeam1",
    SESSION_ADD_GOAL_TEAM_2 = "session/addGoalTeam2",
    SESSION_GOAL = "session/goal",
    SESSION_UNDO = "session/undo",
    SESSION_BUZZ = "session/buzz",
    SESSION_SCORE = "session/score",
    SESSION_PAUSE = "session/pause",
    SESSION_RESTART = "session/restart",
    SESSION_CURRENT_SESSION = "session/current-session",
    //SESSION_CURRENT_SESSION = "session/currentSession",
    SESSION_VAR = "session/var",
    SESSION_ERROR = "session/error",

    ADMIN_REBOOT = "admin/reboot",
    ADMIN_STOP = "admin/stop",
    ADMIN_RESET_API_KEYS = "admin/reset/apikeys",

    DATA_INIT = "data/init",
    DATA_FIELD = "data/field",
    DATA_COMPLEX = "data/complex",
    DATA_COMPLEX_URL_LOGO = "data/complex/url/logo",
    DATA_LOGGED = "data/logged",

    STATUS =  "status",
    STATUS_IP_ADDRESSES =  "status/ipaddresses",
    STATUS_VERSIONS = "status/versions",

    VIDEO_GET = "video/get",
    VIDEO_NEW = "video/new",

    CONFIG_GET = "config/get",
    CONFIG_UPDATE = "config/update",

    WEBRTC_IS_ENABLED = "webrtc/enabled",
    WEBRTC_FROM_EXTERNAL_START = "webrtc/external/start",
    WEBRTC_FROM_EXTERNAL_STOP = "webrtc/external/stop",
    WEBRTC_FROM_EXTERNAL_TUNNEL = "webrtc/external/tunnel",

    LIMIT_REACHED_GOALS = "limit/reached/goals",
    LIMIT_REACHED_BUZZS = "limit/reached/buzzs",
    LIMIT_REACHED_VARS = "limit/reached/vars",
    LIMIT_REACHED_SESSION_TIME = "limit/reached/session-time",

    LOG = "log",    
}
