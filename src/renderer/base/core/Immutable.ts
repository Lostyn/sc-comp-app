export function imSet(src: any, path:string, value:any) {
    const dest = clone(src);
    const itt = path.split('.');
    
    let obj = dest;
    while (itt.length > 1) {
        obj = obj[itt.shift()]
    }
    
    obj[itt.shift()] = value;

    return dest;
}

export function clone(source: any) {
    if (Array.isArray(source))
        return source.map( o => clone(o));
    
    if (typeof source !== 'object') return source;

    let dest = {};
    for(var key in source) {
        if (typeof source[key] === 'object') {
            dest[key] = clone(source[key]);
        } else {
            dest[key] = source[key];
        }
    }
    return dest;
}