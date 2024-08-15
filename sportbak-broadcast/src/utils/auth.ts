
export function parseBasicAuth(req){
    if (req.headers.authorization && req.headers.authorization.startsWith('Basic ')){
        const encUser = req.headers.authorization.replace('Basic ', '');
        const decodedUser = Buffer.from(encUser, 'base64');
        const access = decodedUser.toString().split(":");
        if (access.length == 2){
          return access;
        }
    }
    return null;
}