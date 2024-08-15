import { Service } from 'typedi';
import Field from '../models/field.model';

export class FieldNotFoundException{

}

@Service()
export default class FieldService {
    
    async create(complexId: string, fieldId: string){
        let field = new Field({
            complexId: complexId,
            fieldId: fieldId
        });
        return await field.save();
    }

    async getAllFields(){
        return await Field.find();
    }

    async get(id: string){
        const field = await Field.findById(id);
        if (!field){
            throw new FieldNotFoundException();
        }
        return field;
    }

    async getByField(complexId: string, fieldId: string){
        const field = await Field.findOne({complexId: complexId, fieldId: fieldId});
        if (field){
            return field;
        }else{
            throw new FieldNotFoundException();
        }

    }

    async getOrCreate(complexId: string, fieldId: string){
        let field;
        try {
            field = await this.getByField(complexId, fieldId);
        }catch(e){
            if(e instanceof FieldNotFoundException) {
                field = this.create(complexId, fieldId);
            }else{
                throw e;
            }
            
        }
        return field;
    }

    async remove(id: string){
        const field = await Field.findByIdAndRemove(id);
        if (field){
            return true;
        }else{
            throw new FieldNotFoundException();
        }
    }


}