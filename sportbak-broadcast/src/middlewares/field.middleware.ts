import Field from '../models/field.model';

export function requireLoggedField(req, res, next){
    if (!req.headers['x-apikey']  && !req.headers['x-apisecret']) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const apiKey = req.headers['x-apikey']
    const apiSecret = req.headers['x-apisecret']

    Field.findById(apiKey).then((field => {
        if (!field || field.key !== apiSecret){
            return res.status(403).json({ error: 'wrong credentials' });
        }
        
        req.field = field;

        next();
    })).catch( (error) => {
        return res.status(403).json({ error: 'wrong credentials' });
    });
}