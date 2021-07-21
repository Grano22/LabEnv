import React, {Component} from 'react';
import Jumper from 'jumper';
import LanguageDescriptor from 'jumper/languageDescriptor';
import UnitesNamespaces from '../data/UnitsNotations.json';
import { MathLinearParser } from '../libraries/MathParser';
import CurrentComponentLangDescriptor from '../components/Exchanger/Exchanger.langs.json';
import SearchList from '../widgets/SearchList';
import { FloatingContainerNextToEvent } from '../libraries/Events';
import { changeArrayIndex, replaceBetween } from 'jumper/dataProcessing';
const currLangDictonary = new LanguageDescriptor(CurrentComponentLangDescriptor);

export class UnitsExchanger {
    constructor(unitsNamespace) {
        this.ns = unitsNamespace;
        for(let unitCat in this.ns) {
            this.ns[unitCat] = Object.assign({
                operation:"*",

            }, this.ns[unitCat]);
        }
    }

    getItemsBy(identifiersArr, indentType="") {
        if(Array.isArray(identifiersArr)) {
            for(let i = 0;i<identifiersArr;i++) {

            }
        }
    }

    convertTo(valueFrom, fromUnit, toUnit, fromUnitIdentifier="id", toUnitIndentifier="id") {
        let fromJM = null, targetJM = null;
        for(let unitCat in this.ns) {
            for(let nsItem in this.ns[unitCat]) {
                if(this.ns[unitCat][nsItem][fromUnitIdentifier] === fromUnit || (typeof this.ns[unitCat][nsItem][fromUnitIdentifier]=="object" && this.ns[unitCat][nsItem][fromUnitIdentifier][Jumper.Browser.language.substr(0, 2)] === fromUnit)) {
                    fromJM = this.ns[unitCat][nsItem];
                    if(targetJM!=null) break;
                   
                }
                if(this.ns[unitCat][nsItem][toUnitIndentifier] === toUnit || (typeof this.ns[unitCat][nsItem][toUnitIndentifier]=="object" && this.ns[unitCat][nsItem][toUnitIndentifier][Jumper.Browser.language.substr(0, 2)] === toUnit)) {
                    targetJM = this.ns[unitCat][nsItem];
                    if(fromJM!=null) break;
                }
                if(fromJM!=null && targetJM!=null) break;
            }
        }
        if(fromJM!=null && targetJM!=null) {
            let fromJMCalculated = typeof fromJM.notation=="string" && fromJM.notation!="" ? new MathLinearParser("x "+(typeof fromJM.operation=="string" ? fromJM.operation : "*")+" "+(fromJM.notation || "1")).invertion().bind({x:valueFrom}).calculate()[0] : valueFrom;
            console.log("before", fromJMCalculated);
            let toJMCalculated = new MathLinearParser("x "+(typeof targetJM.operation=="string" ? targetJM.operation : "*")+" "+(targetJM.notation || "1")).bind({x:fromJMCalculated}).calculate()[0];
            console.log("after", toJMCalculated);
            return toJMCalculated;
        } else { console.error("Unit not detected in namespace "+fromJM+" "+targetJM); return null; }
    }

    calculateConvertionDiff() {

    }

    toSelectable() {
        let localCatItems = [], catItems = [];
        for(let uniCat in this.ns) {
            localCatItems = [];
            for(let elInd in this.ns[uniCat]) {
                if(typeof localCatItems=="object") localCatItems.push(<option defaultValue={this.ns[uniCat][elInd].id}>{this.ns[uniCat][elInd].sign}</option>);
            }
            catItems.push(<optgroup label={uniCat}>{localCatItems}</optgroup>);
        }
        return catItems;
    }

    toData() {
        let outputDataItems = [];
        console.log(this.ns);
        for(let uniCat in this.ns) {
            outputDataItems.push({ name:uniCat, type:1 });
            for(let elInd in this.ns[uniCat]) {
                if(typeof this.ns[uniCat][elInd]=="object") outputDataItems.push({
                    id:typeof this.ns[uniCat][elInd]["id"]!="undefined" ? this.ns[uniCat][elInd]["id"] : undefined,
                    name:typeof this.ns[uniCat][elInd]["name"]!="undefined" && typeof this.ns[uniCat][elInd]["name"][Jumper.Browser.language.substr(0, 2)]!="undefined" ? this.ns[uniCat][elInd]["name"][Jumper.Browser.language.substr(0, 2)] : (typeof this.ns[uniCat][elInd]["name"]=="string" ? this.ns[uniCat][elInd]["name"] : "Unnamed"),
                    sign:typeof this.ns[uniCat][elInd]["sign"]!="undefined" && typeof this.ns[uniCat][elInd]["sign"][Jumper.Browser.language.substr(0, 2)]!="undefined" ? this.ns[uniCat][elInd]["sign"][Jumper.Browser.language.substr(0, 2)] : (typeof this.ns[uniCat][elInd]["sign"]=="string" ? this.ns[uniCat][elInd]["sign"] : "UndUnit"),
                    category:uniCat,
                    operation:typeof this.ns[uniCat][elInd]["operation"]=="string" ? this.ns[uniCat][elInd]["operation"] : ""
                });
            }
        }
        return outputDataItems;
    }

    prepareSign(signValue) {
        //dangerouslySetInnerHTML={{ __html: "Hello" }}
        try {
        let openableTag = "", inBracket = 0, closedBrackets = 0, tempText = signValue, openableIndex = -1, textHolder = "";
        for(let signChar in signValue) {
            if(signValue[signChar]=="^") {
                openableTag = 'sup';
                openableIndex = parseInt(signChar);
            } else if(openableTag!="" && inBracket==closedBrackets+1 && signValue[signChar]==")") {
                if(openableIndex<=-1) throw "Err";
                tempText = replaceBetween(tempText, openableIndex, parseInt(signChar), "<"+openableTag+">"+textHolder+"</"+openableTag+">");
            } else if(openableTag!="" && (signValue[signChar].trim()=="" || signValue.length - 1==parseInt(signChar))) {
                if(openableIndex<=-1) throw "Err";
                console.log(openableIndex, signChar);
                tempText = replaceBetween(tempText, openableIndex, parseInt(signChar) + 1, "<"+openableTag+">"+signValue.substring(openableIndex + 1,  signValue.length - 1==parseInt(signChar) ? parseInt(signChar)+1 : parseInt(signChar))+"</"+openableTag+">");
            } else if(signValue[signChar]=="(") {
                inBracket++;
            } else if(signValue[signChar]==")") {
                closedBrackets++;
            }
        }
        return tempText;
        } catch(ParserError) {
            console.error(ParserError);
        }
    }
}


export default class UnitsExchangerWidget extends Component {
    constructor(props) {
        super(props);
        this.outputUnitsList = React.createRef();
        this.exchanger = new UnitsExchanger(UnitesNamespaces);
        this.exchangerData = this.exchanger.toData();
        this.state = {
            fromUnitValue:props.fromUnitValue || 0,
            fromUnit:props.fromUnit || this.exchangerData[1].sign,
            toUnits:typeof props["toUnits"]!="undefined" ? props.toUnits : [ "j" ],
            outputType:props.outputType || ""
        }
    }

    assignUnits(obj, mergeItems=-1, ignoreWarns=false) {
        try {
        let inputFromUnit = null, inputToUnits = [];
        let fromUnityEntry = null, toUnitsEntries = new Array(obj.toUnit).fill(null);
        if(typeof obj.fromUnit=="string" && Array.isArray(obj.toUnits)) {
            inputFromUnit = obj.fromUnit; inputToUnits = obj.toUnit;
        } else if(typeof obj.fromUnit=="string") {
            inputFromUnit = obj.fromUnit; inputToUnits = this.state.toUnits;
        } else if(Array.isArray(obj.toUnits)) {
            inputFromUnit = this.state.fromUnit; inputToUnits = obj.toUnits;
        } else if(typeof obj=="string" && mergeItems>=0) {
            inputFromUnit = this.state.fromUnit; inputToUnits = this.state.toUnits;
            inputToUnits[mergeItems] = obj;
        } else throw "Invaild arguments passed "+arguments;
        for(let entryKey in this.exchangerData) {
            if(this.exchangerData[entryKey].sign==inputFromUnit) fromUnityEntry = this.exchangerData[entryKey];
            for(let unitEntryKey in inputToUnits) { if(this.exchangerData[entryKey].sign==inputToUnits[unitEntryKey]) { toUnitsEntries[unitEntryKey] = this.exchangerData[entryKey]; break; } }
        }
        if(fromUnityEntry==null) { console.error("Unit sign doesnt exits in namespace"); return; }
        for(let unitEntryKey in toUnitsEntries) {
            if(toUnitsEntries[unitEntryKey]==null) { console.error("Unit signs doesnt exist in namespace"); return; }
            if(toUnitsEntries[unitEntryKey].category!=fromUnityEntry.category) { if(!ignoreWarns) console.warn("Cannot convert units from different categories"); console.log("weird cat"+unitEntryKey); if(mergeItems>=0) toUnitsEntries[unitEntryKey] = toUnitsEntries[mergeItems]; else toUnitsEntries[unitEntryKey] = fromUnityEntry; } 
        }
        if(mergeItems>=0 && fromUnityEntry.category!=toUnitsEntries[mergeItems].category) fromUnityEntry = toUnitsEntries[mergeItems];
        this.setState({ fromUnit:fromUnityEntry.sign, toUnits:toUnitsEntries.map(v=>v.sign) });
        } catch(AssignError) {
            console.error(AssignError);
        }
    }
    outputTypeChange(ev) {
        let selOpt = ev.currentTarget;
        console.log(selOpt.options[selOpt.selectedIndex].value);
        this.setState({ outputType:selOpt.options[selOpt.selectedIndex].value });
    }
    //Add unit to 
    addUnitToOutput() {
        this.state.toUnits.push(this.state.fromUnit);
        this.setState({ toUnits:this.state.toUnits });
    }
    //Remove unit from
    removeUnitFromOutput(evt) {
        let index = parseInt(evt.currentTarget.parentElement.parentElement.getAttribute("data-index"));
        this.state.toUnits.splice(index, 1);
        this.setState({ toUnits:this.state.toUnits });
    }
    //Change unit index
    changeUnitIndex(evt, newIndx) {
        let currIndex = parseInt(evt.currentTarget.parentElement.parentElement.getAttribute("data-index"));
        changeArrayIndex(this.state.toUnits, currIndex, newIndx);
        this.setState({ toUnits:this.state.toUnits });
    }
    //Switch unit type
    switchUnitType() {
        let tempToUnit = this.state.toUnits[0];
        this.state.toUnits[0] = this.state.fromUnit;
        this.setState({ fromUnit:tempToUnit, toUnits:this.state.toUnits });
    }
    //Convert Action
    convertAction() {
        let convertionOutputs = document.getElementsByClassName("unitExchangerIndexedItem"), convertionInput = document.getElementsByClassName("unitExchangerFromUnit")[0];
        const currVal = parseFloat(convertionInput.children[0].value);
        for(let outputItem in convertionOutputs) {
            if(convertionOutputs.hasOwnProperty(outputItem)) {
                console.log(convertionOutputs[outputItem].children[1], currVal, this.state.toUnits[parseInt(outputItem)], this.state.fromUnit);
                convertionOutputs[outputItem].children[1].value = this.exchanger.convertTo(currVal, this.state.fromUnit, this.state.toUnits[parseInt(outputItem)], "sign", "sign");
            }
        }
    }

    render() {
        var self = this, refs = [];
        console.log(this.exchangerData);
        const conversionOutputTypesEl = currLangDictonary.getEntry("conversionOutputTypes").map(et=>(<option defaultValue={et.id}>{et.t}</option>));
        const conversionOutputValues = Array.isArray(this.state.toUnits) && this.state.toUnits.length>0 ? this.state.toUnits.map((uo, ind)=>(<div className="unitExchangerOverlap"><label className="medium unitExchangerIndexedItem" key={ind} data-index={ind}>
        <span className="unitExchangerIndex">{ind}</span>
        <input type="number" placeholder="Wynik konwersji" disabled/>
        <span className="unitSymbol">
            <var onClick={ev=>refs[ind + 1].setState({ isHidden:!refs[ind + 1].state.isHidden })} dangerouslySetInnerHTML={{ __html: this.exchanger.prepareSign(uo) }}></var>
            <SearchList ref={r=>refs.push(r)} outputList={this.exchangerData} childProps={{"data-index":"$i", key:"$i", "data-value":"%s[sign]"}} structure="%s[name]"  headerStructure="<h3>%s[name]</h3>" title="Jednostka" onSelectItem={(selItem)=>{
                self.assignUnits(selItem.getAttribute("data-value"), ind);
            }}/>
        </span>
        <div className="unitExchangerItemOptions">
            {this.state.toUnits.length>1 && <span onClick={ev=>this.removeUnitFromOutput(ev)}>&times;</span>} {this.state.toUnits.length>1 && ind!=this.state.toUnits.length-1 && <span onClick={evt=>this.changeUnitIndex(evt, "+1")}>&#11167;</span>} {this.state.toUnits.length>1 && ind!=0 && <span onClick={evt=>this.changeUnitIndex(evt, "-1")}>&#11165;</span>}
        </div>
        </label></div>)) : (<p>Brak jednostek wyjściowych</p>);
        //FloatingContainerNextToEvent(ev)
        return (<div className="unitExchangerContainer">
        <label className="medium unitExchangerFromUnit">
        <input type="number" placeholder="Wpisz jednostkę wejściową"/>
        <span className="unitSymbol">
            <var onClick={ev=>refs[0].setState({ isHidden:!refs[0].state.isHidden })} dangerouslySetInnerHTML={{ __html: this.exchanger.prepareSign(this.state.fromUnit) }}></var>
            <SearchList ref={r=>refs.push(r)} outputList={this.exchangerData} childProps={{"data-index":"$i", key:"$i", "data-value":"%s[sign]"}} structure="%s[name]" headerStructure="<h3>%s[name]</h3>" title="Jednostka" valueDeterminer="sign" onSelectItem={(selItem)=>{
                self.assignUnits({ fromUnit:selItem.getAttribute("data-value") });
                //self.setState({ fromUnit:selItem.getAttribute("data-value") });
            }}/>
        </span>
        </label>
        <span className="unitExchangerSwitchIcon" onClick={ev=>this.switchUnitType()}>
            &#x21c4;
        </span>
        <div className="unitExchangerTree" ref={er=>this.outputUnitsList = er}>
            <div className="unitExchangerItems">
                {conversionOutputValues}
            </div>
            {this.state.toUnits.length<10 && <button className="unitExchangerAddButton" onClick={ev=>this.addUnitToOutput()}>Dodaj inną jednostkę &#x002B;</button>}
        </div>
        <br/>
        <select onSelect={ev=>this.outputTypeChange(ev)}>{conversionOutputTypesEl}</select>
        <br/>
        <button onClick={ev=>this.convertAction()}>Konwertuj</button>
        </div>);
    }
}