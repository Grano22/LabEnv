/* Math Parser by Grano22 Dev | V1 */
const MathConstans = {
    "e":Math.e
}

export class MathLinearItem {
    _value = null;

    constructor() {

    }

    set value(val) {
        this._value = val;
    }
    get value() {

    }
}

export class MathLinearValue {

}

export class MathLinearOperator {

}

export class MathLinearVariable {

}

export class MathLinearParser {

    lastNumber = 0;
    lastOperator = "";

    parsedPieces = [];
    lastPieces = [];
    asserts = [];
    operations = [];
    pattern = "";
    variables = null;

    constructor(initPattern="") {
        this.pattern = initPattern;
        if(initPattern!="") this.parse(this.pattern);
    }

    get assertion() { return this.asserts.map(ae=>ae.join(" ")).join(" = "); }

    factorial() {
        for(let pieceEl in this.lastPieces) {
            if(typeof this.lastPieces[pieceEl]=="string" && this.lastPieces[pieceEl].indexOf("!")==0) {
                let rep = parseFloat(this.lastPieces[pieceEl].replace("!", "")), sp = 1;
                if(isFinite(rep)) {
                    for(let i = rep;i>0;i--) sp = sp * i;
                    this.lastPieces[pieceEl] = sp;
                    sp = 1;
                }
            }
        }
        this.asserts.push(this.lastPieces.map(v=>v));
    }

    multiplication() {
        return this.beetwenOperation("*", (lastNum, nextNum)=>{ 
           return isFinite(lastNum) && isFinite(nextNum) ? parseFloat(lastNum) * parseFloat(nextNum) : lastNum + nextNum;
        });
    }

    diff() {
        return this.beetwenOperation("-", (lastNum, nextNum)=>parseFloat(lastNum) - parseFloat(nextNum))
    }

    sum() {
        return this.beetwenOperation("+", (lastNum, nextNum)=>parseFloat(lastNum) + parseFloat(nextNum))
    }

    division() {
        return this.beetwenOperation("/", (lastNum, nextNum)=>isFinite(lastNum) && isFinite(nextNum) ? parseFloat(lastNum) / parseFloat(nextNum) : lastNum + "/" + nextNum);
    }

    pow() {
        return this.beetwenOperation("^", (lastNum, nextNum)=>isFinite(lastNum) && isFinite(nextNum) ? Math.pow(parseFloat(lastNum), parseFloat(nextNum)) : lastNum + "^" + nextNum);
    }

    beetwenOperation(symbol, returnVal, requireNum=false) {
        try {
            for(let pieceEl in this.lastPieces) {
                if(this.lastPieces[pieceEl]==symbol) {
                    if(typeof this.lastPieces[parseInt(pieceEl) - 1]!="undefined") {
                        if(typeof this.lastPieces[parseInt(pieceEl) + 1]!="undefined") {
                        let lastNum = this.lastPieces[parseInt(pieceEl) - 1], nextNum = this.lastPieces[parseInt(pieceEl) + 1];
                        if(!requireNum || (isFinite(lastNum) && isFinite(nextNum))) {
                            this.lastPieces[pieceEl] = returnVal(lastNum, nextNum);
                            this.lastPieces.splice(parseInt(pieceEl) - 1, 1);
                            this.lastPieces.splice(parseInt(pieceEl), 1);
                        } else throw "This operator requires number beetwen operator "+symbol;
                        } else throw "Next item is unavailable";
                    } else throw "Previous item is unavailable";
                }
            }
            this.asserts.push(this.lastPieces.map(v=>v));
            return this.lastPieces;
        } catch(ErrorBeetweenOperation) {
            console.error(ErrorBeetweenOperation);
            return null;
        }
    }

    getOperations() {
        for(let pieceName of this.lastPieces) {
            switch(pieceName) {
                case "+":
                    if(typeof this.operations[5]=="undefined") this.operations[20] = "+";
                break;
                case "-":
                    if(typeof this.operations[5]=="undefined") this.operations[19] = "-";
                break;
                case "*":
                    if(typeof this.operations[5]=="undefined") this.operations[18] = "*";
                break;
                case "/":
                    if(typeof this.operations[5]=="undefined") this.operations[17] = "/";
                break;
                case "^":
                    if(typeof this.operations[5]=="undefined") this.operations[16] = "^";
                break;
                case "!":
                    if(typeof this.operations[5]=="undefined") this.operations[15] = "!";
                break;
            }
        }
        this.operations = Object.values(this.operations);
        return this.operations.length>0 ? this.operations : null;
    }

    parse(tgPattern) {
        try {
        this.parsedPieces = [];
        let objsmpl = "", inNr = false, openedBrackets = 0, closedBrackets = 0;
        for(let patternSample in tgPattern) {
            if(openedBrackets>0 || tgPattern[patternSample]!=" ") objsmpl += tgPattern[patternSample];
            switch(tgPattern[patternSample]) {
                case "(":
                case "[":
                    openedBrackets+=1;
                break;
            }
            if(openedBrackets<=0) {
            switch(tgPattern[patternSample]) {
                case "+":
                    if(typeof this.operations[20]=="undefined") this.operations[20] = "+";
                    this.parsedPieces.push(objsmpl);
                    objsmpl = "";
                break;
                case "-":
                    if(typeof this.operations[19]=="undefined") this.operations[19] = "-";
                    this.parsedPieces.push(objsmpl);
                    objsmpl = "";
                break;
                case "*":
                    if(typeof this.operations[18]=="undefined") this.operations[18] = "*";
                    this.parsedPieces.push(objsmpl);
                    objsmpl = "";
                break;
                case "/":
                    if(typeof this.operations[17]=="undefined") this.operations[17] = "/";
                    this.parsedPieces.push(objsmpl);
                    objsmpl = "";
                break;
                case "^":
                    if(typeof this.operations[16]=="undefined") this.operations[16] = "^";
                    this.parsedPieces.push(objsmpl);
                    objsmpl = "";
                break;
                case "!":
                    if(typeof this.operations[15]=="undefined") this.operations[15] = "!";
                    inNr = true;
                break;
                default:
                    let patternAsNum = parseFloat(tgPattern[patternSample]);
                    if(!inNr && !isNaN(patternAsNum) && isFinite(patternAsNum)) {
                        if(isNaN(parseFloat(tgPattern[parseInt(patternSample) + 1]))) { this.parsedPieces.push(patternAsNum); objsmpl = ""; } else inNr = true;
                    } else if(typeof MathConstans[tgPattern[patternSample]]!="undefined") {
                        this.parsedPieces.push(objsmpl);
                        objsmpl = "";
                    } else if(tgPattern[patternSample]!="." && inNr && isNaN(tgPattern[parseInt(patternSample) + 1]) && tgPattern[parseInt(patternSample) + 1]!=".") { 
                        if(isNaN(parseFloat(objsmpl)) && objsmpl[0]!="!") throw "Unknown operator before number";
                        this.parsedPieces.push(parseFloat(objsmpl) || objsmpl);
                        objsmpl = "";
                        inNr = false;
                    } else if(!inNr && tgPattern[patternSample]==".") {
                        inNr = true;
                    } else if(typeof tgPattern[patternSample]=="string" && tgPattern[patternSample].charCodeAt()>=97 && tgPattern[patternSample].charCodeAt()<=122) {
                        this.parsedPieces.push(objsmpl);
                        objsmpl = "";
                    } else if(!inNr && tgPattern[patternSample]!=" ") throw "Unknown character "+tgPattern[patternSample]+" on index "+patternSample;
            }
            }
            if(openedBrackets>0) {
                switch(tgPattern[patternSample]) { case ")": case "]": closedBrackets+=1; break; }
                if(openedBrackets==closedBrackets) {
                    this.parsedPieces.push(objsmpl);
                    objsmpl = "";
                    openedBrackets = 0;
                    closedBrackets = 0;
                }
            }
        }
        this.asserts.push(this.parsedPieces.map(v=>v));
        this.lastPieces = this.parsedPieces.map(v=>v);
        } catch(LinearMathParserError) {
            console.error(LinearMathParserError);
        }
        return this.parsedPieces;
    }

    calculate() {
        this.lastPieces = this.parsedPieces.map(v=>v);
        if(this.variables!=null) {
            let varsNames = Object.keys(this.variables);
            for(let pieceInd in this.lastPieces) { 
                if(varsNames.includes(this.lastPieces[pieceInd])) this.lastPieces[pieceInd] = this.variables[this.lastPieces[pieceInd]];
            } 
        }
        for(let operName of this.operations) {
            if(typeof operName!="undefined") {
            if(typeof operName=="string") {
                switch(operName) {
                    case "!":
                        this.factorial();
                    break;
                    case "^":
                        this.pow();
                    break;
                    case "/":
                        this.division();
                    break;
                    case "*":
                        this.multiplication();
                    break;
                    case "-":
                        this.diff();
                    break;
                    case "+":
                        this.sum();
                    break;
                }
            }
            }
        }
        this.operations = {};
        let operations = this.getOperations();
        if(operations!=null) return this.calculate(); else return this.lastPieces;
    }

    bind(inArr) { this.variables = inArr; return this; }

    changePattern(newPattern) {
        this.pattern = newPattern;
        this.parse(newPattern);
        return this;
    }

    invertionSumDiff() {
        let outputPattern = "";
        for(let pw in this.pattern) {
            switch(this.pattern[pw]) {
                case "+":
                    outputPattern += "-";
                break;
                case "-":
                    outputPattern += "+";
                break;
                default: outputPattern += this.pattern[pw];
            }
        }
        this.changePattern(outputPattern);
        return this;
    }

    invertion() {
        let outputPattern = "";
        for(let pw in this.pattern) {
            switch(this.pattern[pw]) {
                case "+":
                    outputPattern += "-";
                break;
                case "-":
                    outputPattern += "+";
                break;
                case "*":
                    outputPattern += "/";
                break;
                case "/":
                    outputPattern += "*";
                break;
                default: outputPattern += this.pattern[pw];
            }
        }
        this.changePattern(outputPattern);
        return this;
    }

    toString() {

    }

    valueOf() {

    }
}