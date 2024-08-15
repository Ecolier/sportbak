import { v4 as uuidv4 } from 'uuid';
import mongoose, { Document } from 'mongoose';

const EventSchema = new mongoose.Schema({
  type : { type: String, enum: ['GOAL', 'BUZZ', 'PAUSE', 'VAR'], default: 'GOAL'},
  time: { type: Number, required: true }, // second
  path : String, 
  duration: Number,  // second
  videoDuration: Number // second
});
const SessionSchema = new mongoose.Schema({
    state : { type: String, enum: ['RECORDING', 'READY_TO_ENCODE', 'ENCODING', 'READY_TO_SEND', 'SENT', 'ENCODING_FAILED', 'UPLOAD_FAILED'], default: 'RECORDING'},
    path : String,
    duration: Number,           // second
    lowVideoDuration : Number,  // second
    startAt : Date,
    endedAt : Date,
    events : [EventSchema]
  },
  { timestamps: true }
);

export enum EventType{
  GOAL = 'GOAL',
  BUZZ = 'BUZZ',
  VAR = 'VAR',
  PAUSE = 'PAUSE'
}

export interface Event{
  type: EventType,
  time: number,       // second
  duration?: number,   // second
  videoDuration?: number, // second
  path? : string,
}

export interface Session extends Document {
  createdAt: Date;
  state: string;
  path: string;
  duration: number;   // second
  lowVideoDuration : number // second
  highVideoDuration : number // second
  startAt : Date;
  endedAt : Date;
  events: Array<Event>;
  
}

export default mongoose.model<Session>('Session', SessionSchema);