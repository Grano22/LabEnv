import MathAdv from './MathAdv';
//Images
import defaultFormulaImg from '../images/formulas/defaultFormula.png';
import sumFormulaImg from '../images/formulas/sum.png';
import sumAvgFormulaImg from '../images/formulas/sumAvg.png';

export const MathFormulaTypes = [
    "arthimetic",
    "statistic",
    "sampling",
    "probability"
];

export class MathFormula {
    name = {
        "en":"Unknown formula",
        "pl":"Nieznany wzór"
    };
    description = {
        "en":"Unknown mathematic formula without description",
        "pl":"Nieznany wzór matematyczny bez opisu"
    };
    icon = defaultFormulaImg;

    constructor() {}
    project() {/* Native Code */}
    bind() {/* Native Code */}
    bindArguments() {/* Native Code */}
    calculateSet(setID) { this.calculate.apply(this, this.dataSets[setID]); }
    calculate() {/* Native Code */}
    toFormulaString() {/* Native Code */}
    toFormulaImage() {/* Native Code */}
    toString() {/* Native Code */}
}

export class MathSum extends MathFormula {
    name = {
        "en":"Sum of n numbers",
        "pl":"Suma n liczb"
    }
    description = {
        "en":"",
        "pl":""
    }
    icon = sumFormulaImg;
    types = [0, 1, 2];

    project() {

    }
    calculate() {return MathAdv.sum(...Array.from(arguments));}
}

export class ArtimeticAverage extends MathFormula {
    name = {
        "en":"Artimetic average",
        "pl":"Średnia arytmetyczna"
    }
    description = {
        "en":"Średnia arytmetyczna pozwoli obliczyć średnią wartość sum wyrazów",
        "pl":"Średnia arytmetyczna pozwoli obliczyć średnią wartość sum wyrazów"
    }
    icon = sumAvgFormulaImg;
    types = [1, 2];
    subformulas = [MathSum]

    project() {

    }
    calculate() {return MathAdv.artavg.apply(MathAdv, arguments);}
}

export class GeometricAverage extends MathFormula {
    name = {
        "en":"Geometric average",
        "pl":"Średnia geometryczna"
    }
    description = {
        "en":"",
        "pl":""
    }
    types = [1, 2];

    calculate() {return MathAdv.geoavg.apply(MathAdv, arguments);}
}

export class HarmonicAverage extends MathFormula {
    name = {
        "en":"Harmonic Averange",
        "pl":"Średnia harmoniczna"
    }
    description = {
        "pl":"",
        "en":""
    }
    types = [1, 2];

    calculate() {return MathAdv.harmavg.apply(MathAdv, arguments);}
}

export class MathFormulas {
    loadedFormulas = [];
    dataSets = [];
    constructor(formulasLists=[], options={}) {
        this.options = Object.assign({lang:"pl"}, options);
        if(formulasLists.length>0) {
            for(let formItem in formulasLists) { if(formulasLists[formItem].prototype instanceof MathFormula) this.loadedFormulas.push(new formulasLists[formItem]); else console.error("Given formula must be an child of MathFormula"); }
        }
    }
    iterator = 0;
    get length() {return this.dataSets.length;}
    createDataset(formula, vars) {
        let newDataSet = new MathDataSet(this.loadedFormulas[formula], vars);
        this.dataSets.push(newDataSet);
        this.iterator++;
    }
    deleteDataset(indx) { this.dataSets.splice(indx, 1); }
    loadFormula(newFormula) {
        if(newFormula.prototype instanceof MathFormula) this.formulasLists.push(new newFormula); else console.error("Given formula must be an child of MathFormula");
    }
    onSelectItem() {/* Native Code */}
    onUpdate() {/* Native Code */}
    toOutput() {
        return this.dataSets.map((oi, i, arr)=>oi.toOutput(i, arr.length));
    }
    render(mode="list", withContainer=true, filter=[]) {
        let self = this;
        switch(mode) {
            default:
            case "list": //this.loadedFormulas[parseInt(liNode.id.replace("formulaItem", ""))]
                let loadedCopy = this.loadedFormulas;
                if(Array.isArray(filter) && filter.length>0) loadedCopy = loadedCopy.filter(lf=>{ for(let type of lf.types) if(filter.includes(type)) return true; return false; });
                const listItems = loadedCopy.map((f, ind)=>(<li id={"formulaItem"+ind} title={f.description[this.options.lang]}><img src={f.icon}/><h4>{f.name[this.options.lang]}</h4></li>));
                return withContainer ? (<ul className="propsalList" onClick={(ev)=>{ if(ev.target.tagName!="UL") { let liNode = function() { let currNode = ev.target; while(currNode.tagName!="LI") currNode = currNode.parentElement; return currNode; }(); self.onSelectItem(ev, parseInt(liNode.id.replace("formulaItem", ""))); } }}>
                    {listItems}
                </ul>) : listItems;
        }
    }
    updateAll(newvars) {
        for(let dataSet of this.dataSets) {
            dataSet.update(newvars);
        }
    }
    changeIndex(lastIndex, newInd) {
        let tgIndex = 0, currListItem = null, lastIndexNum = -1;
        for(let item in this.dataSets) if(this.dataSets[item].index==lastIndex) { currListItem = this.dataSets[item]; lastIndexNum = item; }
        if((typeof newInd=="number" && newInd<0) || (typeof newInd=="string" && (newInd[0]==="+" || newInd[0]==="-"))) {
            tgIndex = parseInt(lastIndexNum) + parseInt(newInd);
        } else tgIndex = parseInt(newInd);
        if (tgIndex < this.dataSets.length && tgIndex>=0) {
            console.log(lastIndexNum, newInd);
            this.dataSets.splice(tgIndex, 0, this.dataSets.splice(lastIndexNum, 1)[0]);
        }
        console.log(tgIndex);
        return tgIndex;
    }
}

export class MathDataSet {
    vars = [];
    consts = [];
    funcs = [];

    formula = null;
    index = 0;

    constructor(formula, vars) {
        if(formula.__proto__ instanceof MathFormula) { 
            this.formula = formula;
            this.vars = vars;
        }
    }
    update(newvars) {
        this.vars = newvars;
    }
    onClose() {

    }
    toOutput(indx, lngth) {
        return (<div id={"math-calculation-output#"+indx} data-index={indx} className="math-calculation-output"><div class="in"><strong>{this.formula.name["pl"]}</strong>: <output>{this.formula.calculate(...this.vars)}</output><div className="options">{indx>0 && (<span className="upper">&#x21bf;</span>)}{((lngth - 1)>indx) && (<span className="downer">&#x21c2;</span>)}<span className="deletion">&times;</span></div></div><div className="rightybar"></div></div>);
        //onClick={(ev)=>{ this.onClose(ev); }}
    }
}

export const MathStandardFormulas = [
    MathSum,
    ArtimeticAverage,
    GeometricAverage,
    HarmonicAverage
];