import fs from 'fs'
import _path from 'path'

export abstract class FileService {

    public static getLastCreatedDirectory(directory) {
        let result = null;
        let dirs = fs.readdirSync(directory, { withFileTypes: true });
        dirs = dirs.filter(d => d.isDirectory());

        if (dirs && dirs.length) {
            let dirsInfos = dirs.map(function (dir) {
                return {
                  name: dir.name,
                  time: fs.statSync(_path.join(directory, dir.name)).ctime.getTime()
                };
            }).sort(function (a, b) {
                return b.time - a.time; 
            });

            result = dirsInfos[0].name;
        }
        return result;
    }

    // options = {
    //    afterDateTime : number // get file created after this date.getTime()
    //    beforeDateTime : number // get file created before this date.getTime()
    //}
    public static getFilesWithExtension(directory, extension, options = null) {
        let files = fs.readdirSync( directory );
        // Filter by extension
        files = files.filter( function( elm ) {
            let regex = new RegExp("\." + extension + "", "ig");
            return elm.match(regex);
        });
        // Filter by date
        let filesInfos = files.map(function (fileName) {
            return {
              name: fileName,
              time: fs.statSync(directory + '/' + fileName).mtime.getTime()
            };
        }).sort(function (a, b) {
            return a.time - b.time; 
        })

        if (options) {
            const afterDateTime = options.afterDateTime;
            const beforeDateTime = options.beforeDateTime;
            if (afterDateTime) {
                filesInfos = filesInfos.filter((f) => f.time > afterDateTime);
            }
            if (beforeDateTime) {
                filesInfos = filesInfos.filter((f) => f.time < beforeDateTime);
            }
        }

        files = filesInfos.map(function (v) {
            return v.name; 
        });
        return files;
    }
}