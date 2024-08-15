import redis, { RedisClient } from 'redis';
import redisConfig from '../config/redis.config';
import { isString } from '../utils/utils';

type RedisData = {data : any, type : 'string' | 'object'};

export default class RedisService {
    public client : RedisClient;
    
    constructor(){
    }

    public connect() {
        this.client = redis.createClient(redisConfig.url);
    }

    public get(key : string) : Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client.get(key, (error : Error, result : string) => {
                    if (error)
                        return reject(error);
                    if (result) {
                        try {
                            const data : RedisData = JSON.parse(result);
                            if (data.type) {
                                resolve(data.data);
                            } else {
                                reject("Internal format error");
                            }
                        } catch(err) {  
                            reject(err);
                        }
                    } else {
                        resolve(null);
                    }
                })
            } else {
                reject("Client is null");
            }
        })
    }

    public set(key : string, data : any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.client) {
                let internalData : RedisData = {
                    type : 'object',
                    data : data
                };
                if (isString(data)) {
                    internalData.type = 'string';
                }
                try {
                    this.client.set(key, JSON.stringify(internalData), (error : Error) => {
                        if (error)
                            return reject(error);
                        resolve();
                    })
                } catch(err) {
                    reject(err);
                }
                
            } else {
                reject("Client is null");
            }
        })
    }

    public delete(key : string) : boolean {
        return this.client.del(key);
    }

}