import VideoModel from '../models/video.model';
import videoConfig from '../config/video.config';
import RedisService from './redis.service';

const directoryFocusRedisKey = 'directory_focused';

export default class StorageService {
    redisService : RedisService;

    constructor(redisService : RedisService){
        this.redisService = redisService;
    }

    private directoryExists(dir : string) {
        return this.getIndexOfDirectory(dir) >= 0;
    }

    private getIndexOfDirectory(dir : string) : number {
        let index = -1;
        if (dir) {
            index = videoConfig.directories.findIndex((d) => d == dir);
        }
        return index;
    }

    getCountDirectories() : number {
        return videoConfig.directories.length;
    }

    getDirectories() : string[] {
        return videoConfig.directories;
    }

    getDefaultDirectoryIndex() : number{
        return 0;
    }

    getDirectoryAtIndex(index: number) : string {
        if (index >= 0 && index < videoConfig.directories.length)
            return videoConfig.directories[index];
        return videoConfig.directories[this.getDefaultDirectoryIndex()];
    }

    getDefaultDirectory() {
        return this.getDirectoryAtIndex(this.getDefaultDirectoryIndex());
    }

    async getDirectoryFocused() : Promise<string> {
        let result = this.getDefaultDirectory();
        let currDir = await this.redisService.get(directoryFocusRedisKey);
        console.log("STORAGE DIRECTORY - Current dir #1 : " + currDir);
        if (currDir && this.directoryExists(currDir)) {
            result = currDir;
        }
        console.log("STORAGE DIRECTORY - Current dir #2 : " + currDir);
        return result;
    }

    async getNextDirectory() {
        let currDir = await this.getDirectoryFocused();
        let currDirIndex = this.getIndexOfDirectory(currDir);
        if (currDirIndex < 0) {
            currDirIndex = this.getDefaultDirectoryIndex();
            currDir = this.getDirectoryAtIndex(currDirIndex);
        }
            
        let newIndex = (currDirIndex + 1) % this.getCountDirectories();
        return this.getDirectoryAtIndex(newIndex);
    }

    async updateDirectoryFocused(dir : string) : Promise<string> {
        let result = dir;
        if (!this.directoryExists(dir)) {
            result = this.getDefaultDirectory();
        }
        await this.redisService.set(directoryFocusRedisKey, result);
        console.log("STORAGE DIRECTORY - Next dir : " + result);
        return result;
    }

}