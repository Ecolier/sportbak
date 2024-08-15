
export function awaitDelay(delay : number) : Promise<void>{
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

export function isString(data : any) {
    return typeof data === 'string' || data instanceof String;
}