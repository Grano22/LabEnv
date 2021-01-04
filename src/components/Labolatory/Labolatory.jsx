/* eslint-disable */
import React, {Component} from 'react';
import { ActionsStack, ActionOperation, ActionResumeOperation, ActionModule } from 'jumper/appStateExtended'; //'../../libraries/ActionsStackExtended'
import { downloadFileBlob, uploadFileInBackground } from '../../libraries/IO';
import { MathFormulas, MathStandardFormulas } from '../../libraries/MathPatterns';
import FormulaSearchList from '../../widgets/FormulaSearchList';
import { CreateSampleLaboratoryAction,
    DeleteSampleLaboratoryAction,
    ChangeLaboratorySamplePositionIndex,
    RandomizeLaboratorySampleItems,
    SortByIndexes,
    PrepareItemsIndexesToPositions,
    ImportSamplesItems,
    SelectOutputTypeToAdd,
    ChangeOutputLaboratorySamplePosition,
    DeleteOutput } from './Labolatory.actions';

class LaboratorySampleItem {
    index = 0;
    list = null;

    constructor(list, index, value) {
        this.value = value;
        this.list = list;
        this.index = index;
    }

    get id() {
        return this.list.name+"#"+this.index;
    }

    render(rounding = 0) {
        //id={"sample"}
        let self = this;
        return (
            <li id={this.id} className="sample-item"><div className="sample-view"><strong>{this.index + 1}</strong> | <span onInput={(ev)=>{ ev.currentTarget.textContent = ev.currentTarget.textContent.replace(/\s+/g, ""); }} onDoubleClick={(ev)=>{ console.log(ev.currentTarget.contentEditable); if(ev.currentTarget.contentEditable!='true') ev.currentTarget.contentEditable = 'true'; else { ev.currentTarget.contentEditable = 'false'; self.value = parseInt(ev.currentTarget.textContent); } }}>{this.value.toFixed(rounding)}</span></div><div className="sample-options"><span onClick={()=>this.list.component.changeSampleIndex(this.id, "-1")}>&#11165;</span><span onClick={()=>this.list.component.changeSampleIndex(this.id, "+1")}>&#11167;</span><span onClick={()=>this.list.component.deleteSampleItem(this.id)}>&#x1F5D1;</span></div></li>
        )
    }

    toObject() {
        return {
            index:this.index,
            id:this.id,
            value:this.value
        }
    }
}

class LaboratoryList {
    listItems = new Array();
    lastIndex = 0;
    name = "";
    component = null;
    //Options
    options = {
        "rounding":2,
        "randomizeFrom":25,
        "randomizeTo":1200,
        "randomizeMinItems":7,
        "randomizeMaxItems":10,
        "questionDelete":false
    }

    constructor(component, name) {
        this.name = name;
        this.component = component;
    }

    setup() {

    }

    render() {
        var self = this;
        const itemsList = new Array(self.listItems.length).fill(0).map((v, ind)=>self.listItems[ind].render(self.options.rounding));
        return (<ul>{itemsList}</ul>);
    }

    createSample(value=0) {
        this.listItems.push(new LaboratorySampleItem(this, this.lastIndex, value));
        this.lastIndex++;
        return this;
    }

    deleteSample(idStr) {
        for(let item in this.listItems) { if(this.listItems[item].id==idStr) { this.listItems.splice(item, 1); } }
    }

    changeSampleIndex(idStr, newInd) {
        let tgIndex = 0, currListItem = null, lastIndexNum = -1;
        for(let item in this.listItems) if(this.listItems[item].id==idStr) { currListItem = this.listItems[item]; lastIndexNum = item; }
        if((typeof newInd=="number" && newInd<0) || (typeof newInd=="string" && (newInd[0]==="+" || newInd[0]==="-"))) {
            tgIndex = parseInt(lastIndexNum) + parseInt(newInd);
        } else tgIndex = parseInt(newInd);
        if (tgIndex < this.listItems.length && tgIndex>=0) {
            console.log(lastIndexNum, newInd);
            this.listItems.splice(tgIndex, 0, this.listItems.splice(lastIndexNum, 1)[0]);
        }
        console.log(tgIndex);
        return tgIndex;
    }

    randomizeSamples(fromNum, toNum, startNum=7, endNum=10) {
        let iters = Math.floor(Math.random() * endNum) + startNum;
        this.listItems = []; this.lastIndex = 0;
        for(let i = 0;i<iters;i++) {
            this.createSample(parseFloat(((Math.random() * toNum) + fromNum).toFixed(this.options.rounding)));
        }
    }

    sortByIndexes() {
        for(let i = 0;i < this.listItems.length;i++) this.listItems[i].index = i;
    }

    setPositionsToIndexes() {
        let newArr = [];
        for(let item in this.listItems) newArr[this.listItems[item].index] = this.listItems[item];
        newArr = newArr.filter(v=>v);
        this.listItems = newArr;
    }

    toExportData(format="json") {
        let outputObj = {
            list:this.listItems.map(o=>o.toObject()),
            exportDate:new Date().toJSON().slice(0, 19).replace('T', ' '),
            options:this.options
        };
        switch(format.toLocaleLowerCase()) {
            default:
            case "json":
                downloadFileBlob("mathenvLabExportedData.json", JSON.stringify(outputObj));
            break;
        }
    }

    toImportData(format="json", inData=null) {
        let inputObj = {};
        switch(format.toLocaleLowerCase()) {
            default:
            case "json":
               inputObj = JSON.parse(inData); 
            break;
        }
    }

    toArray() { return this.listItems.map(o=>o.value); }
}

export default class Labolatory extends Component {
    constructor(props) {
        super(props);
        this.actions = new ActionsStack(this, [
            CreateSampleLaboratoryAction,
            DeleteSampleLaboratoryAction,
            ChangeLaboratorySamplePositionIndex,
            RandomizeLaboratorySampleItems,
            SortByIndexes,
            PrepareItemsIndexesToPositions,
            ImportSamplesItems,
            SelectOutputTypeToAdd,
            ChangeOutputLaboratorySamplePosition,
            DeleteOutput
        ], { loadResumeable:false });
        //Children states
        this.hideFormulasList = true;
        //Containers
        this.inputNewSampleVal = null;
        this.outputSamples = null;
        this.mathFormulasCont = null;
        this.samplesList = new LaboratoryList(this, "labList");
        this.samplesMenu = "";
        this.mathPatterns = new MathFormulas(MathStandardFormulas);
        let self = this;
        /*this.mathPatterns.onSelectItem = function(ev, selFormula) {
            self.actions.addOperation(new SelectOutputTypeToAdd(), { selectedFormula: selFormula });
        };*/
    }

    componentDidMount() {
        this.actions.restoreStacksSessions();
        //this.inputNewSampleVal = React.createRef();
        //this.outputSamples = React.createRef();
        //this.mathFormulasCont = React.createRef();
    }

    componentWillUnmount() {

    }

    addSampleItem() {
        console.log(parseFloat(this.inputNewSampleVal.value), this.inputNewSampleVal.value);
        this.actions.addOperation(new CreateSampleLaboratoryAction(), { value: parseFloat(this.inputNewSampleVal.value) || 0 });
    }

    deleteSampleItem(idStr) {
        this.actions.addOperation(new DeleteSampleLaboratoryAction(), { listID:idStr });
    }

    changeSampleIndex(idStr, newInd) {
        this.actions.addOperation(new ChangeLaboratorySamplePositionIndex(), { lastIndex:idStr, newIndex:newInd });
    }

    randomizeItems() {
        this.actions.addOperation(new RandomizeLaboratorySampleItems(), { fromValue:this.samplesList.options.randomizeFrom, toValue: this.samplesList.options.randomizeTo, minItems: this.samplesList.options.randomizeMinItems, maxItems: this.samplesList.options.randomizeMaxItems });
    }

    sortItemsByIndexes() {
        this.actions.addOperation(new SortByIndexes());
    }

    prepareIndexesToPositions() {
        this.actions.addOperation(new PrepareItemsIndexesToPositions());
    }

    importSamples() {
        uploadFileInBackground().then((fRes, type)=>{
            console.log(fRes, type);
            this.actions.addOperation(new ImportSamplesItems(), { fileType:type, fileResource:fRes })
        }).catch(err=>console.error(err));
    }

    exportSamples() {
        this.samplesList.toExportData();
    }

    toggleOutputAddMenu() {
        let tgEl = this.mathFormulasCont;
        //this.hideFormulasList = !this.hideFormulasList;
        tgEl.setState({ isHidden:!tgEl.state.isHidden });
        //this.actions.invokeEmptyOperation();
        /*if(tgEl.style.display!="initial") tgEl.style.display = "initial"; else tgEl.style.display = "none";*/
    }

    render() {
        let self = this, contentsAside = null;
        switch(self.samplesMenu) {
            case "settings":
                contentsAside = (
                    <div className="optionsView">
                        <h2 className="centred">Ustawienia</h2><hr/>
                        <form>
                        <label><strong>Stopień zaokrogleń:</strong><input type="number" name="rounding" min="0" max="20" defaultValue={self.samplesList.options.rounding}/></label>
                        <label><strong>Losowe wartości od:</strong><input type="number" name="randomizeFrom" min="0.0000001" max="10000000" defaultValue={self.samplesList.options.randomizeFrom}/></label>
                        <label><strong>Losowe wartości do:</strong><input type="number" name="randomizeTo" min="0.0000001" max="10000000" defaultValue={self.samplesList.options.randomizeTo}/></label>
                        <label><strong>Ilość losowych wartości od:</strong><input type="number" name="randomizeMinItems" min="1" max="40" defaultValue={self.samplesList.options.randomizeMinItems}/></label>
                        <label><strong>Ilość losowych wartości do:</strong><input type="number" name="randomizeMaxItems" min="1" max="40" defaultValue={self.samplesList.options.randomizeMaxItems}/></label>
                        <label className="checkboxContainer">Pytać czy usunąć wartość próbki?
                            <input type="checkbox"/>
                            <span className="checkmark"></span>
                        </label>
                        <input type="button" value="Zapisz" onClick={(ev)=>{
                            let formEl = ev.currentTarget.parentElement;
                            console.log(formEl, formEl.elements['rounding']);
                            self.samplesList.options.rounding = parseInt(formEl.elements['rounding'].value);
                            self.samplesList.options.randomizeFrom = parseFloat(formEl.elements['randomizeFrom'].value);
                            self.samplesList.options.randomizeTo = parseFloat(formEl.elements['randomizeTo'].value);
                            self.samplesList.options.randomizeMinItems = parseFloat(formEl.elements['randomizeMinItems'].value);
                            self.samplesList.options.randomizeMaxItems = parseFloat(formEl.elements['randomizeMaxItems'].value);
                            this.samplesMenu = "";
                            self.actions.invokeEmptyOperation();
                        }}/>
                        </form>
                    </div>
                );
            break;
            default:
            case "samplesList":
                console.log(self.samplesList);
                contentsAside = self.samplesList.render();
            break;
        }
        return (
            <>
            <header className="wide">
                <h1>Laboratorium</h1>
            </header>
            <div className="app">
            <aside className="fullheight">
                <div className="aside-section"><h3 className="centred">Pomiary</h3></div>
                <div className="aside-contents">
                    {contentsAside}
                </div>
                <div className="toolbar">
                    <span className="full"><input type="number" placeholder="0.00" step="0.01" ref={(r)=>this.inputNewSampleVal = r}/></span>
                    <span title="Dodaj wartośc próbną" onClick={()=>this.addSampleItem()}>&#x0002B;</span>
                    <span>&#x0229E;</span>
                    <span title="Losuj" onClick={()=>this.randomizeItems()}>℅</span>
                    <span title="Sortuj po indeksie" onClick={()=>this.sortItemsByIndexes()}>◪</span>
                    <span title="Przyporządkuj indeksy do pozycji" onClick={()=>this.prepareIndexesToPositions()}>◩</span>
                    <span title="Importuj" onClick={()=>this.importSamples()}>&#x2191;</span>
                    <span title="Eksportuj" onClick={()=>this.exportSamples()}>&#x2193;</span>
                    <span title="Ustawienia" onClick={()=>{
                        if(this.samplesMenu==="") this.samplesMenu = "settings"; else this.samplesMenu = "";
                        self.actions.invokeEmptyOperation();
                    }}>&#x022EF;</span>
                </div>
            </aside>
            <main>
                <section>
                    <div className="in">
                            <h1 className="centred">Próbkowanie</h1>
                            <div id="outputSamplesData" ref={(r)=>this.outputSamples = r} onClick={(ev)=>{
                                console.log(ev.target.parentElement.parentElement.parentElement);
                                if(ev.target.parentElement.parentElement.parentElement.classList.contains("math-calculation-output")) {
                                    let currCont = ev.target;
                                    console.log("cos");
                                    if(currCont.classList.contains("upper")) {
                                        self.actions.addOperation(new ChangeOutputLaboratorySamplePosition(), {
                                            lastIndex:currCont.id.replace("math-calculation-output#", ""),
                                            newIndex:"+1"
                                        });
                                    } else if(currCont.classList.contains("downer")) {
                                        self.actions.addOperation(new ChangeOutputLaboratorySamplePosition(), {
                                            lastIndex:currCont.id.replace("math-calculation-output#", ""),
                                            newIndex:"-1"
                                        });
                                    } else if(currCont.classList.contains("deletion")) {
                                        self.actions.addOperation(new DeleteOutput(), { 
                                            lastIndex:currCont.id.replace("math-calculation-output#", "")
                                        });
                                    }
                                }
                            }}>{this.mathPatterns.toOutput()}</div>
                            <br/>
                            <div className="relativeLayout"><FormulaSearchList ref={(r)=>this.mathFormulasCont = r} filter={[2]} mathFormulas={self.mathPatterns} onSelectItem={(ev, selFormula)=>{
                                self.actions.addOperation(new SelectOutputTypeToAdd(), { selectedFormula: selFormula });
                            }}/>
                            <button onClick={()=>this.toggleOutputAddMenu()}>Dodaj dane wyjściowe</button>
                            </div>
                    </div>
                </section>
            </main>
            </div>
            </>
        );
    }
}