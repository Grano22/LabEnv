/* MathAdv Library V1 */
export const MathAdv = new class {
    sum() { let sum = 0; console.log(arguments); for(let sumarg in arguments) sum+=parseFloat(arguments[sumarg]);return sum;}
    artavg() { let sum = this.sum.apply(this, arguments);return sum/arguments.length;}
    powAll() { let powers = 1;for(let powarg in arguments) powers*= parseFloat(arguments[powarg]);return powers;}
    geoavg() {let powers = this.powAll.apply(this, arguments);return Math.pow(powers, 1/powers.length);}
    fharmavg(){let par = 0;for(let parArg in arguments) par += 1/parseFloat(parArg);return arguments.length/par;}

    sigma() {

    }
}

export class ComplexNumber {
    _rz = 0;
    _im = 0;

    constructor(rz, im) {
        this._rz = rz;
        this._im = im;
        /*return new Proxy(this, {
            get: function(complexn, fieldname) {
                switch(fieldname) {
                    default: return ()=>[complexn._rz, complexn._im];
                }
            }
        });*/
        Object.defineProperties(this, {
            valueOf:{ 
                value:function() { return [ this._rz, this._im]; },
                configurable:false,
                enumerable:false,
                writable:false
            },
            toString:{
                value:function() {  }
            }
        });
    }

    get rz() {return this._rz;}
    get im() {return this._im;}

    sum() {
        let rzSum = 0, imSum = 0;
        for(let arg in arguments) {
            rzSum += arguments[arg].rz;
            imSum += arguments[arg].im;
        }
        return new ComplexNumber(rzSum, imSum);
    }

    pow() {

    }

    sqrt() {

    }
}



export class Matrix {
    _accessor = [];

    constructor() {
        let matrixMaxRowsLen = 0;
        try {
            for(let matrixRow in arguments) {
                if(Array.isArray(arguments[matrixRow])) matrixMaxRowsLen = Math.max(matrixMaxRowsLen, arguments[matrixRow].length);
            }
            for(let matrixRow in arguments) {
                let matRow = new Array(matrixMaxRowsLen).fill(0);
                for(let j = 0;j<arguments[matrixRow].length;j++) matRow[j] = arguments[matrixRow][j];
                this._accessor.push(matRow);
            }
        } catch(MatrixError) {
            console.error(MatrixError);
        }
    }
    getItem(indexRow, indexColumn) {return this._accessor[indexRow][indexColumn]}
    setItem(newValue, indexRow, indexColumn) {
        try {
            if(!isNaN(parseFloat(newValue))) this._accessor[indexRow][indexColumn] = parseFloat(newValue); else throw "Matrix items must be a number or number convertable value!";
        } catch(MatrixError) {
            console.error(MatrixError);
        }
    }
    getRow(indexRow) {return this._accessor[indexRow];}
    getColumn(indexColumn) {
        let column = [];
        for(let matrixRow in this._accessor) column.push(this._accessor[matrixRow][indexColumn]);
        return column;
    }
    transparent() {
        let transparented = [];
        for(let i = 0;i<this._accessor.length;i++) transparented.push(this.getColumn(i));
        return new Matrix(...transparented);
    }
    getDiagonalToRight(fromRowIndex=0, fromColumnIndex=0, customAccessor=null) {
        if(customAccessor==null) customAccessor = this._accessor;
        let outputRow = [];
        for(let matrixRow in customAccessor) {
            for(let matrixColumn in customAccessor[matrixRow]) {
                if(matrixRow==fromRowIndex && matrixColumn==fromColumnIndex) {
                    outputRow.push(customAccessor[matrixRow][matrixColumn]);
                    fromRowIndex++;
                    fromColumnIndex++;
                }
            }
        }
        return outputRow;
    }
    getDiagonalToLeft(fromRowIndex=0, fromColumnIndex=-1, customAccessor=null) {
        if(customAccessor==null) customAccessor = this._accessor;
        if(fromColumnIndex<0) fromColumnIndex = this.columnLength - 1;
        let outputRow = [];
        for(let matrixRow in customAccessor) {
            for(let matrixColumn = customAccessor[matrixRow].length - 1;matrixColumn>=0;matrixColumn--) {
                if(matrixRow==fromRowIndex && matrixColumn==fromColumnIndex) {
                    outputRow.push(customAccessor[matrixRow][matrixColumn]);
                    fromRowIndex++;
                    fromColumnIndex--;
                }
            }
        }
        return outputRow;
    }
    getDiagonalRevesedToLeft(fromRowIndex=-1, fromColumnIndex=-1) {
        if(fromRowIndex<0) fromRowIndex = this.rowLength - 1;
        if(fromColumnIndex<0) fromColumnIndex = this.columnLength - 1;
        let outputRow = [];
        for(let matrixRow = this._accessor.length - 1;matrixRow>=0;matrixRow--) {
            for(let matrixColumn = this._accessor[matrixRow].length - 1;matrixColumn>=0;matrixColumn--) {
                if(matrixRow==fromRowIndex && matrixColumn==fromColumnIndex) {
                    outputRow.push(this._accessor[matrixRow][matrixColumn]);
                    fromRowIndex--;
                    fromColumnIndex--;
                }
            }
        }
        return outputRow;
    }
    calculateMainDeterminant() {
        let fromLeftSum = 0, fromRightSum = 0, combinedAccessor = [...this._accessor, ...this._accessor];
        if(this._accessor.length>2) {
        for(let matrixRow in this._accessor) {
            fromLeftSum += this.getDiagonalToRight(matrixRow, 0, combinedAccessor).reduce((prev, next)=>prev*next);
            //console.log(fromLeftSum);
            fromRightSum += this.getDiagonalToLeft(matrixRow, -1, combinedAccessor).reduce((prev, next)=>prev*next);
            //console.log(fromRightSum);
        }
        } else { fromLeftSum = this.getDiagonalToRight(0, 0, combinedAccessor).reduce((prev, next)=>prev*next); fromRightSum = this.getDiagonalToLeft(0, -1, combinedAccessor).reduce((prev, next)=>prev*next); }
        return fromLeftSum - fromRightSum;
    }

    range() {
        let impliter = Math.min(this.rowLength, this.columnLength);
        if(this.rowLength>this.columnLength) {
            let moverWidth = 0, maxWidth = this.rowLength - impliter;
            for(;moverWidth<maxWidth;moverWidth++) {
                
            }
        } else {
            let movedHeight = 0, maxHeight = this.columnLength - impliter;

        }
    }

    inversed() {

    }

    get lastRow() {return this._accessor[this._accessor.length - 1];}
    get lastColumn() {return this.getColumn(this.columnLength);}
    get rowLength() { let len = 0; for(let matrixRow in this._accessor) len = Math.max(len, this._accessor[matrixRow].length); return len; }
    get columnLength() {return this._accessor.length}
    get length() {return this.columnLength * this.rowLength;}

    toString() {
        let outputStr = "", totalLen;
        for(let matrixRow in this._accessor) totalLen = Math.max(totalLen, this._accessor[matrixRow].join(" ").length);
        for(let matrixRow in this._accessor) {
            outputStr += '|';
            for(let matrixColumn in this._accessor) {
                let repeater = (totalLen/this._accessor[matrixRow].length)-this._accessor[matrixRow][matrixColumn].length;
                outputStr += `${"".repeat(repeater)}${this._accessor[matrixRow][matrixColumn]}${"".repeat(repeater)}`;
            }
            outputStr += '|\n';
        }
        return outputStr;
    }
}

export default MathAdv;