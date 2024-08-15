import { Stream } from "stream";

export function isString(data : any) {
    return typeof data === 'string' || data instanceof String;
}

export function isObject(data : any) {
    return typeof data === 'object' && data !== null;
}

export function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(ms);
        }, ms);
    });
}

export async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise < Buffer > ((resolve, reject) => {
        const _buf = Array < any > ();
        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
} 