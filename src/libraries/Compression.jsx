/* Compression Library by Grano22 */
export function compressStringToBufer(str) {
    var buf = new ArrayBuffer(str.length*2);
    var bufView = new Uint32Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
        console.log(bufView,  bufView.toString().replace(",", ""));
    }
    return buf;
}

export function compressString(str, asArray=false, dictSize=256) {
	let dictionary = {}, uncompressed = str, c, wc, w = "", ASCIIRes = asArray ? [] : '';
	for (let i = 0; i < dictSize; i += 1) dictionary[String.fromCharCode(i)] = i;
	for (let i = 0; i < uncompressed.length; i += 1) {
		c = uncompressed.charAt(i);
		wc = w + c;
		if (dictionary.hasOwnProperty(wc)) { w = wc; } else {
			if(asArray) ASCIIRes.push(dictionary[w]); else ASCIIRes += String.fromCharCode(dictionary[w]);
			dictionary[wc] = dictSize++;
			w = String(c); }
	}
	if (w !== "") if(asArray) ASCIIRes.push(dictionary[w]); else ASCIIRes += String.fromCharCode(dictionary[w]);
	return ASCIIRes;
}

export function decompressString(str, dictSize=256) {
    let dictionary = [], compressed = str, w, result, k, entry = "";
    for (let i = 0; i < dictSize; i += 1) dictionary[i] = String.fromCharCode(i);
    if(compressed && typeof compressed === 'string') {
        let tmp = [];
        for(let i = 0; i < compressed.length; i += 1) tmp.push(compressed[i].charCodeAt(0));
        compressed = tmp; tmp = null;
    }
    w = String.fromCharCode(compressed[0]);
    result = w;
    for (let i = 1; i < compressed.length; i += 1) {
        k = compressed[i];
        if (dictionary[k]) {
            entry = dictionary[k];
        } else {
            if (k === dictSize) entry = w + w.charAt(0); else return null;
        }
        result += entry;
        dictionary[dictSize++] = w + entry.charAt(0);
        w = entry;
    }
    return result;
}

/* Encoding */
export function UTF8ToHex(str) {
    return Array.from(str).map(c => 
        c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : 
        encodeURIComponent(c).replace(/\%/g,' Ox').substring(1)
    ).join('');
}

export function HexToUTF8() {

}

export function UTF8ToBin(str) {
    var utf8 = unescape(encodeURIComponent(str));
    var arr = [];
    for (var i = 0; i < utf8.length; i++) {
        arr.push(utf8.charCodeAt(i));
    }
    return arr;
}

export function encodeUTF16(str) {
    var buf = new ArrayBuffer(str.length*2), bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) bufView[i] = str.charCodeAt(i);
    return bufView;
}

export function encodeUTF32(str) {
    var buf = new ArrayBuffer(str.length*4), bufView = new Uint32Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) bufView[i] = str.charCodeAt(i);
    return bufView;
}