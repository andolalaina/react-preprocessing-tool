function _verboseType(value : any) {
    if (typeof value !== "object") return typeof value;
    if (value instanceof Array) return "array";
    if (value instanceof Object) return "object";
    return typeof value;
}

export function getObjectTypedProperties(_object : any) {
    return Object.keys(_object).map(key => ([key, _verboseType(_object[key])]))
}