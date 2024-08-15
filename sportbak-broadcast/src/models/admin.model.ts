import { v4 as uuidv4 } from 'uuid';
import mongoose, { Document } from 'mongoose';

const AdminSchema = new mongoose.Schema({
    key : { type: String, default: function(){
      return uuidv4()
    }},
  },
  { timestamps: true }
);


export interface Admin extends Document {
    key: string;
}
  

const Admin = mongoose.model<Admin>('Admin', AdminSchema);


export function login(apiKey: string, apiSecret: string){
  return new Promise((resolve, reject) => {
      
    Admin.findById(apiKey).then((admin) => {
      if (!admin || admin.key !== apiSecret){
        resolve(admin);
      }
      resolve(null);

    }).catch( (error) => {
        resolve(null);
      })
  });

}



export default Admin;