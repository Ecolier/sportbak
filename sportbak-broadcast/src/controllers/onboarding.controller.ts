import express from 'express';
import Field from '../models/field.model';
import SportbakService from '../services/sportbak.service';
import Container from 'typedi';
import { validationResult } from 'express-validator';
import FieldService from '../services/field.service';


export async function login(req : express.Request, res: express.Response){
    const spk = Container.get(SportbakService); 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        const token = await spk.login(req.body.username, req.body.password);
        return res.send({"token": token, "fields": await spk.getFields(token)});
    }catch{
        return res.status(400).send({"errors":[{"msg" : "Please check your username and your password"}]});
    }
    
    
}

export async function create(req : express.Request, res: express.Response){    
    const spk = Container.get(SportbakService); 
    const fieldService = Container.get(FieldService); 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const spkField = await spk.getFieldWithComplex(req.body.fieldId); 
    if (spkField){
        const field = await fieldService.getOrCreate(spkField.complex._id, req.body.fieldId);
        return res.json(field);
    }else{
        return res.status(400).send({"errors":[{"msg" : "This field is not owned by the given token"}]});
    }
}