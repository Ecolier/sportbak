import mongoose, { Document, ObjectId, Schema } from 'mongoose';
import Field from './field.model'

const VideoSchema = new mongoose.Schema({
    published: Boolean,
    field: {type: Schema.Types.ObjectId, ref: 'Field'},
    expirationDate: { type: Date, },
    startAt: { type: Date, },
    endAt: { type: Date, },
    duration: { type: Number }, 
    fileType: { type: String, enum: [ 'mp4', 'm3u8'], default: 'mp4'},
    type: { type: String, enum: [ 'buzz', 'full' ], default: 'full' },
    session : { type: String},
    directory : { type: String},
    path : { type: String},
}, {
    timestamps: true
});

export interface IVideo {
    published?: boolean,
    field: ObjectId,
    type: string,
    fileType?: string,
    expirationDate: Date,
    duration: number,
    startAt: Date,
    endAt: Date,
    session : string,
    directory : string, // parent directory where is saved video 
    path : string       // path where is saved video 
}

export interface Video extends IVideo, Document {}

export default mongoose.model<Video>('Video', VideoSchema);