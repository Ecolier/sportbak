const directoriesStr = process.env.MEDIA_PATHS || '/media/';
const directories = directoriesStr.split(';');
console.log("Medias directories : ", directories)
export default {
    directories: directories,
    expiration: process.env.EXPIRATION || 7,
    mediaBaseUrl: process.env.MEDIA_URL,
};
