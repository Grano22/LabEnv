export function JSONSafteyParse(inObj, defaultVal=null, onError=null) {
    try {
        let nd = JSON.parse(inObj);
        return nd;
    } catch (objError) {
        if (objError instanceof SyntaxError) {
            console.error(objError.name);
        } else {
            console.error(objError.message);
        }
        if(typeof onError=="function") onError(objError);
        if(defaultVal) return defaultVal;
    }
}