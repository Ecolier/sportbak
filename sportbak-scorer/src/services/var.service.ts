import fs from 'fs';
import _path from 'path';
import VideoConfig from '../config/video.config';
import ContextService from './context.service';
import { FileService } from './file.service';

const m3u8FileName = "playlist.m3u8";
const m3u8Header = "#EXTM3U\n\
#EXT-X-VERSION:3\n\
#EXT-X-ALLOW-CACHE:NO\n\
#EXT-X-MEDIA-SEQUENCE:0\n\
#EXT-X-TARGETDURATION:2\n\n";
const m38uFooter = "#EXT-X-ENDLIST";

export abstract class VarService {

    // -------------------------------- //
    // -------------- M3U8 ------------- //
    // -------------------------------- //

    private static readM3u8(directory : string) : string {
        let result = null;
        const path = directory + "/" + m3u8FileName;
        if (fs.existsSync(path)) {
            result = fs.readFileSync(path).toString();
        }
        return result;
    }

    private static generateM3u8(m3u8 : string, files : string[], prefixFile : string = "") : {m3u8 : string, duration : number} {
        if (!files || !files.length)
            return null;
        let newM3u8 = m3u8Header;
        let duration = 0;
        for (var i = 0; i < files.length; i++) {
            let f = files[i];
            const append = VarService.getLinesForFileInM3u8(m3u8, f);
            if (append) {
                newM3u8 += append.header + "\n";
                newM3u8 += (prefixFile ? prefixFile : "") + append.file + "\n";
                duration += append.duration;
            }
            else if (i < files.length - 1) { // check if isn't the last file (maybe is the current recording)
                return null; 
            }   
        }
        newM3u8 += m38uFooter;
        return {
            m3u8 : newM3u8,
            duration : duration
        };
    }

    private static writeM3u8(directory : string, m3u8 : string) {
        let success = true;
        let filename = "var_" + new Date().getTime() + ".m3u8";
        try {
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            fs.writeFileSync(directory + "/" + filename, m3u8);
        } catch (err) {
            success = false;
        }

        return success ? filename : null;        
    }

    private static getLinesForFileInM3u8(m3u8 : string, filename : string) : {header : string, file : string, duration : number} {
        const splitted = m3u8.split('\n');
        let index = splitted.findIndex((l) => l == filename);
        let result = null;
        if (index > 0) {
            let header = splitted[index - 1];
            if (header.includes("#EXTINF:")) { // verify 
                let currDuration : number = parseFloat(splitted[index - 1].replace('#EXTINF:', '').replace(',','').trim())
                currDuration = isNaN(currDuration) ? 0 : currDuration;
                //console.log("Duration for file : " + filename + " - " + currDuration);
                result = {
                    header : splitted[index - 1],
                    file : splitted[index],
                    duration : currDuration
                }
            }
        }
        return result;
    }

    // -------------------------------- //
    // -------------- Playlist ------------- //
    // -------------------------------- //

    public static createPlaylist(contextService : ContextService, videoSessionId : string) : {path : string, filename : string, duration : number} {
        let config = contextService.configService.read();
        let directory = VideoConfig.path;
        let urlPath = "/media/";
        let dir = videoSessionId;//FileService.getLastCreatedDirectory(directory);
        //console.log("Var - Src directory : ", VideoConfig.path + dir);
        if (!dir)
            return null;
        // get path of current directory
        let path = _path.join(directory + dir); 
        urlPath += dir;
        // read current m3u8 file
        let currentM3u8 = VarService.readM3u8(path);
        let filesBeforeDateTime = new Date().getTime();
        let filesAfterDateTime = filesBeforeDateTime - config.varTime * 1000;
        let options = {
            afterDateTime : filesAfterDateTime,
            beforeDateTime : filesBeforeDateTime
        }
        // get ts files between two dates
        //console.log("Var - path : ", path);
        let files = FileService.getFilesWithExtension(path, "ts", options);
        //console.log("Var - ts files : ", files);
        // generate m3u8 string from files and current m3u8 file
        let newM3u8 = VarService.generateM3u8(currentM3u8, files);
        if (!newM3u8)
            return null;
        // write m3u8 file
        let newm3u8Filename = VarService.writeM3u8(path, newM3u8.m3u8);
        if (!newm3u8Filename)
            return null;
        
        //console.log("Url path : " + urlPath);
        return {
            path : urlPath + "/" + newm3u8Filename,
            filename : newm3u8Filename,
            duration : newM3u8.duration
        };
    }
}