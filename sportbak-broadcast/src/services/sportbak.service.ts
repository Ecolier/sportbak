import { Inject, Service } from 'typedi';
import axios from 'axios';
import { TokenService } from './token.service';
import RedisService from './redis.service';
import StorageService from './storage.service';

@Service()
export default class SportbakService {
    private videoToken : string = null;
    tokenService : TokenService;
    redisService : RedisService;
    storageService : StorageService;
    
    constructor( @Inject("sportbak.url") private url: string, 
                 @Inject("sportbak.user") private user: string, 
                 @Inject("sportbak.password") private password : string ){

        this.tokenService = new TokenService();
        this.redisService = new RedisService();
        this.redisService.connect();
        this.storageService = new StorageService(this.redisService);
        
        console.log("Login to api sportbak ...");
        let self = this;
        (async function() {
            try {
                await self.loginVideo();
            } catch(err) {
                console.log("Error connecting api sportbak ...")
            }
        }())
    }

    private buildHeader(token : string, sportbakUser : string = null) {
        let header = {
            'Authorization': `Bearer ${token}`
        };
        if (sportbakUser) {
            header['sportbak-user'] = sportbakUser;
        }
        return header;
    }

    // ----------------------------------------- //
    // ----------------- ROLE ------------------ //
    // --------------COMPLEXMANAGER ------------ //
    // ----------------------------------------- //
    // ----------------------------------------- //

    async login(username, password) : Promise<string>{
        const response = await axios.post(`${this.url}everysport/api/fr/users/login/complexmanager`, {
            username: username,
            password: password
        });
        return response.data.token
    }


    async getComplex(token, sportbakUser : string = null) : Promise<any>{
        const response = await axios.get(`${this.url}everysport/api/fr/complexes/current?populate=["fields"]`, {
            headers: this.buildHeader(token, sportbakUser)
        });
        return response.data;
    }

    async getFields(token, sportbakUser : string = null) : Promise<any>{
        const response = await axios.get(`${this.url}everysport/api/fr/fields/current`, {
            headers: this.buildHeader(token, sportbakUser)
        });
        return response.data;
    }

    async isComplexManager(token, sportbakUser : string = null) : Promise<boolean> {
        const response = await axios.get(`${this.url}everysport/api/fr/users/token/complexmanager/authenticated`, {
            headers: this.buildHeader(token, sportbakUser)
        });
        return response.data.result;
    }

    async isComplexManagerForComplex(complexId : string, token, sportbakUser : string = null) : Promise<boolean> {
        const response = await axios.get(`${this.url}everysport/api/fr/complexes/${complexId}/iscomplexmanager`, {
            headers: this.buildHeader(token, sportbakUser)
        });
        return response.data.result;
    }

    async isSuperadmin(token) : Promise<boolean> {
        const response = await axios.get(`${this.url}everysport/api/fr/users/token/superadmin/authenticated`, {
            headers: this.buildHeader(token)
        });
        return response.data.result;
    }
    // ----------------------------------------- //
    // ----------------- ROLE ------------------ //
    // ---------------- VIDEO ------------------ //
    // ----------------------------------------- //
    // ----------------------------------------- //

    async loginVideo() : Promise<string>{
        const response = await axios.post(`${this.url}everysport/api/fr/users/login/video`, {
            username: this.user,
            password: this.password
        });
        return response.data.token;
    }

    async getVideoToken() : Promise<string> {
        if (!this.videoToken) {
            this.videoToken = await this.loginVideo();
        }
        return this.videoToken;
    }

    async getComplexById(complexId : string) : Promise<any> {
        const token = await this.getVideoToken();
        const response = await axios.get(`${this.url}everysport/api/fr/complexes/${complexId}?populate=["fields"]`, {
            headers: this.buildHeader(token)
        });
        return response.data;
    }

    async getFieldWithComplex(fieldId) : Promise<any> {
        const token = await this.getVideoToken();
        const populate = [
            {path : "complex", select : "_id createdAt status name logo image", populate : ["scorerSessionSettings"]},
            {path : "scorerSessionSettings"}
        ]
        const response = await axios.get(`${this.url}everysport/api/fr/fields/` + fieldId + '?populate=' + JSON.stringify(populate), {
            headers: this.buildHeader(token)
        });
        return response.data;
    }

    async getInitialDataSocket(fieldId) : Promise<{field : any, complex: any, defaultStartSession : any} | null> {
        let result = null;
        const document = await this.getFieldWithComplex(fieldId);
        if (document) {
          const currComplex = document.complex;
          let currField = document;
          delete currField.complex;
          let scorerSessionSettingsDefaultField = null;
          let scorerSessionSettingsDefaultComplex = null;
          if (currField.scorerSessionSettings) {
            scorerSessionSettingsDefaultField = currField.scorerSessionSettings.find(s => s.type === "default")
          }
          if (currField.scorerSessionSettings) {
            scorerSessionSettingsDefaultComplex = currComplex.scorerSessionSettings.find(s => s.type === "default")
          }

          let scorerSessionSettings = scorerSessionSettingsDefaultField ? scorerSessionSettingsDefaultField : scorerSessionSettingsDefaultComplex;
          let defaultStartSession = null;

          if (scorerSessionSettings) {
              // convert to session format
              defaultStartSession = {
                time: 60 * scorerSessionSettings.time,
                warmup : 60 * scorerSessionSettings.warmup,
                pauseTime : 60 * scorerSessionSettings.pauseTime,
                period : scorerSessionSettings.period,
                ambiance : scorerSessionSettings.ambiance,
                sounds : scorerSessionSettings.sound,
                teamName1 : scorerSessionSettings.teamName1,
                teamName2 : scorerSessionSettings.teamName2,
              }
          }

          result = {
            complex : currComplex,
            field : currField,
            defaultStartSession : defaultStartSession
          }
        }
        return result;
    }

    async getVideos() : Promise< any> {
        const token = await this.getVideoToken();
        const response = await axios.get(`${this.url}everysport/api/fr/videos`, {
            headers: this.buildHeader(token)
        });
        return response.data;
    }

    async addFullVideo(url, poster, duration, expireAt, startAt, endAt, complex, field) : Promise<any> {
        const token = await this.getVideoToken();
        const response = await axios.patch(`${this.url}everysport/api/fr/videos/full`, { videos: [
            {
                "url" : url,
                "poster" : poster,
                "duration" : duration,
                "expireAt" : expireAt,
                "startAt" : startAt,
                "endAt" : endAt,
                "complex" : complex,
                "field" : field,
            }
        ]} ,{
            headers: this.buildHeader(token)
        });
        return response.data;
    }


    async addPhysicalBuzzer(url, poster, duration, expireAt, startAt, endAt, complex, field) : Promise<any> {
        const token = await this.getVideoToken();
        const response = await axios.patch(`${this.url}everysport/api/fr/videos/buzzer/physical`, { videos: [
            {
                "url" : url,
                "poster" : poster,
                "duration" : duration,
                "expireAt" : expireAt,
                "startAt" : startAt,
                "endAt" : endAt,
                "complex" : complex,
                "field" : field,
            }
        ]} ,{
            headers: this.buildHeader(token)
        });
        return response.data;
    }

    async disableURL(url) : Promise< any> {
        const token = await this.getVideoToken();
        const response = await axios.patch(`${this.url}everysport/api/fr/videos/disable`, { url: url },{
            headers: this.buildHeader(token)
        });
        return response.data;
    }

}