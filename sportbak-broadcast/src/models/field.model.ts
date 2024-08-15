import { v4 as uuidv4 } from 'uuid';
import mongoose, { Document } from 'mongoose';

const FieldSchema = new mongoose.Schema({
    complexId: { type: String, required: true },
    fieldId: { type: String, required: true },
    key : { type: String, default: function(){
      return uuidv4()
    }},
  },
  { timestamps: true }
);

FieldSchema.index({complexId: 1, fieldId: 1}, {unique: true});


export interface Field extends Document {
  key: string;
  complexId: string;
  fieldId: string;

}

const Field = mongoose.model<Field>('Field', FieldSchema);


export function login(apiKey: string, apiSecret: string) : Promise<Field>{
  return new Promise((resolve, reject) => {
    Field.findById(apiKey).then((field) => {
      if (field && field.key === apiSecret){
        resolve(field);
      }
      resolve(null);
      }).catch( (error) => {
        console.log(error);
        reject(error);
      })
  });

}

export default Field;