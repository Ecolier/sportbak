import Admin from '../models/admin.model';

export function requireLoggedAdmin(req, res, next){
    if (!req.headers['x-apikey']  && !req.headers['x-apisecret']) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const apiKey = req.headers['x-apikey']
    const apiSecret = req.headers['x-apisecret']

    Admin.findById(apiKey).then((admin) => {
        if (!admin || admin.key !== apiSecret){
            return res.status(403).json({ error: 'wrong credentials' });
        }
        next();
        
    }).catch( (error) => {
        return res.status(403).json({ error: 'wrong credentials' });
    });

}