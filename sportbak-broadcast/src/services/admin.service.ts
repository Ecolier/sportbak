import { Service } from 'typedi';
import Admin from '../models/admin.model'

@Service()
export default class AdminService {
    
    async create(){
        const admin = new Admin();
        return await admin.save();
    }

    async remove(id: string){
        return await Admin.findOneAndDelete({"id": id});
    }

    async list(){
        return await Admin.find();
    }

}