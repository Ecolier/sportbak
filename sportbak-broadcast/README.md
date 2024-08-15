# SportBak Backend App

# Api

Before starting docker compose 

```
    docker network create sportbak
```

## Env variables :

      - REDIS=redis://redis:6379
      - DB=mongodb://@db:27017/sportbak?authSource=admin
      - URL: 'http://localhost:8080/'
      - MEDIA_URL: 'http://localhost:8080/media/'
      - SPORTBAK_URL: 'http://51.75.142.97:3000/'
      - SPORTBAK_USER: 'developpment@sportbak.com'
      - SPORTBAK_PASSWORD: ''
      - VIRTUAL_HOST=api.video.sportbak.com
      - VIRTUAL_PROTO=http
      - LETSENCRYPT_HOST=api.video.sportbak.com
      - LETSENCRYPT_EMAIL=contact@stream.studio
      - EXPIRATION : Default expiration date in days


# Start Webserver 
```
    docker-compose up
```

## Publics api

### fields

#### Add field 

```
 curl -H "X-APIKEY: XXXXXXXXXXXXXXX"  -H "X-APISECRET: XXXXXXXXXXXXXXXX" -H "Content-Type: application/json" --data '{"complexId":"daadddddds", "fieldId":"ddddsxyz"}' https://api.video.sportbak.com/fields/
```

Returns :
```
{"_id":"6047460f8e43e00026c4a0a7","complexId":"daadddddds","fieldId":"ddddsxyz","key":"XXXXXXXXXXX","createdAt":"2021-03-09T09:55:27.524Z","updatedAt":"2021-03-09T09:55:27.524Z","__v":0}
```

#### Get field

 curl -H "X-APIKEY: XXXXXXXXXXXXXXX"  -H "X-APISECRET: XXXXXXXXXXXXXXXX" -H "Content-Type: application/json" https://api.video.sportbak.com/fields/<id>


#### List field

```
curl -H "X-APIKEY: XXXXXXXXXXXXXXX"  -H "X-APISECRET: XXXXXXXXXXXXXXXX" -H "Content-Type: application/json"  https://api.video.sportbak.com/fields/
```


#### Remove field 

```
curl -H "X-APIKEY: XXXXXXXXXXXXXXX"  -H "X-APISECRET: XXXXXXXXXXXXXXXX" -H "Content-Type: application/json" -X DELETE https://api.video.sportbak.com/fields/<id>
```

Error list :
 - {"message":"wrong credentials"}
 - {"message":"field not found with id 604744ef8e43e00026c4a0a"}%   


### Videos

#### Create publish "ticket" 

```
    curl -H "X-APIKEY: 6047460f8e43e00026c4a0a7"  -H "X-APISECRET: 7e8a46aa-e432-4863-ae06-bf31b67c5d4b" -H "Content-Type: application/json" --data '{}' https://api.video.sportbak.com/videos/
```

#### list tickets

``` 
    curl -H "X-APIKEY: 6047460f8e43e00026c4a0a7"  -H "X-APISECRET: 7e8a46aa-e432-4863-ae06-bf31b67c5d4b" -H "Content-Type: application/json"  https://api.video.sportbak.com/videos/
```


# Command line interface

## Create admin account
```
    docker-compose run web npm run admin create 
```

## Delete admin account 
```
    docker-compose run web npm run admin delete <id>
```

## List admin accounts
```
    docker-compose run web npm run admin list
```


