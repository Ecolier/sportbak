import express from 'express';
import { validationResult } from 'express-validator';
import Container from 'typedi';
import Field from '../models/field.model';
import FieldService from '../services/field.service';

export async function create(req : express.Request, res: express.Response){

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const fieldService = Container.get(FieldService);
        try{
            const field = await fieldService.create(req.body.complexId, req.body.fieldId);
            return res.json(field);
        }catch(err){
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Field."
            });
        }
}

export async function findAll(req : express.Request, res: express.Response){
    const fieldService = Container.get(FieldService);
    try{
        return res.json(await fieldService.getAllFields());
    }catch(err){
        return res.status(500).send({
            message: err.message || "Some error occurred while list fields."
        });   
    }
}

export async function findOne(req : express.Request, res: express.Response){
    const fieldService = Container.get(FieldService);
    try {
        res.json(await fieldService.get(req.params.id));
    }catch(err){
        return res.status(404).send({
            message: "Field not found with id " + req.params.id
        });
    }
}

export async function remove(req : express.Request, res: express.Response){
    const fieldService = Container.get(FieldService);
    try {
        const field = await fieldService.remove(req.params.id);
        if (field){
            res.json({});
        }else{
            return res.status(404).send({
                message: "Field not found with id " + req.params.id
            });
        }
        
    }catch(e){
        return res.status(404).send({
            message: "Field not found with id " + req.params.id
        });
    }
};