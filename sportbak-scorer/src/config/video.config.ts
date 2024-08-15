export default {
    service_url: process.env.VIDEO_SERVICE_URL || 'ws://localhost:9000',
    path: process.env.VIDEO_PATH || '/media/'
};
