import React, { Component } from 'react';
import './Calc.css';
import { ActionsStack } from 'jumper/appStateExtended';
import { CalcValueCellPreparation,
    CalcRowInsert,
    CalcColumnInsert } from './Calc.actions';

class MathEnvCalcDocument {
    title = "Sheet";
    lastSelectedCell = [0, 0];
    currSelected = [0, 0];
    cells = {};
    dimensionX = 0;
    dimensionY = 0;

    component = null;

    constructor(component, assocObj={}) {
        this.component = component;
        for(let assocProp in assocObj) {
            switch(assocProp) {
                case "title":
                    if(typeof assocObj[assocProp]=="string") this.title = assocObj[assocProp];
                break;
            }
        }
    }

    from() {
        
    }

    get dimension() {
        if(this.dimensionX>0 && this.dimensionY>0) {
            return [this.dimensionY, this.dimensionX];
        } else if(Object.keys(this.cells).length>0) {
            let mx = 16, my = 36;
            for(let cellInd in this.cells) { if(!isNaN(parseInt(cellInd))) { for(let cellPosInd in this.cells[cellInd]) { if(!isNaN(parseInt(cellPosInd))) { mx = Math.max(mx, this.cells[cellInd][cellPosInd].posX); my = Math.max(my, this.cells[cellInd][cellPosInd].posY); } } } } 
            this.dimensionX = my; this.dimensionY = mx;
        } else { this.dimensionX = 36; this.dimensionY = 16; return [16, 36]; }
    }

    getLetterPosition() {

    }

    onCellClearSelection(doc) {
        let selEls = document.getElementsByClassName("mathEnv-cell");
        let currSel = selEls[((this.dimension[1] * (doc.currSelected[1] - 1)) - 1) + doc.currSelected[0]];
        if(currSel.children[0].contentEditable) currSel.children[0].contentEditable = false;
        doc.currSelected = [0, 0];
        currSel.classList.remove("selected");
        let mathFormulaBar = document.getElementById("mathEnvCalc-formula");
        mathFormulaBar.value = "";
        mathFormulaBar.disabled = true;
    }

    /*generateGridTemplate() {
        const wnm = 27;
        let total = this.dimension, gridOutput = [], gridRows = [];
        for(let posy = 0;posy<=total[0];posy++) {
            for(let posx = 0;posx<=total[1];posx++) {
                if(posy==0 && posx==0) {
                    gridRows.push(<th>0</th>);
                } else if(posy==0) {
                    let charLiteral = "A".repeat(Math.floor(posx/wnm))+(posx<wnm ? String.fromCharCode(posx + 64) : String.fromCharCode(posx - (Math.floor(posx/wnm) * wnm) + 65));
                    gridRows.push(<th className="horizontaly">{charLiteral}</th>);

                } else if(posx==0) {
                    gridRows.push(<th>{posy}</th>);
                } else {
                    if(typeof this.cells[posy]=="object" && typeof this.cells[posy][posx]!="undefined") {
                        gridRows.push(<td>{this.cells[posy][posx].value}</td>);
                    } else gridRows.push(<td></td>);
                }
            }
            gridOutput.push(<tr>{gridRows}</tr>);
            gridRows = [];
        }
        return (<table>{gridOutput}</table>);
    }*/

    onCellSelect(evt, doc) {
        const wnm = 27;
        let carEl = evt.currentTarget, tgX = parseInt(carEl.getAttribute("data-posx")), tgY = parseInt(carEl.getAttribute("data-posy"));
        if(doc.currSelected[0] != tgX || doc.currSelected[1] != tgY) {
            if(doc.currSelected[0]>0 && doc.currSelected[1]>0) {
                this.onCellClearSelection(doc);
            }
            doc.currSelected = [tgX, tgY];
            doc.lastSelectedCell = doc.currSelected;
            document.getElementById("mathEnvCalc-currCell").value = "A".repeat(Math.floor(tgX/wnm))+(tgX<wnm ? String.fromCharCode(tgX + 64) : String.fromCharCode(tgX - (Math.floor(tgX/wnm) * wnm) + 65)) + tgY;
            carEl.classList.add("selected");
            let mathFormulaBar = document.getElementById("mathEnvCalc-formula");
            mathFormulaBar.value = carEl.children[0].textContent;
            mathFormulaBar.disabled = false;
            if(tgX>=doc.dimensionX && tgY>=doc.dimensionY) {
                this.component.actions.addOperations([
                    { operation:new CalcColumnInsert(), inputData:{ count:1 } },
                    { operation:new CalcRowInsert(), inputData:{ count:1 } }
                ]);
            } else if(tgX>=doc.dimensionX) {
                this.component.actions.addOperation(new CalcRowInsert(), { count:1 });
            } else if(tgY>=doc.dimensionY) {
                this.component.actions.addOperation(new CalcColumnInsert(), { count:1 });
            }
        }
    }

    onCellFocus(evt) {
        let carEl = evt.currentTarget;
        if(carEl.children[0].contentEditable=="true" && !carEl.children[0].contentEditable) carEl.children[0].contentEditable = "false"; else { carEl.children[0].contentEditable = "true"; carEl.children[0].focus(); } 
    }

    onCellsRangeSelect() {

    }

    generateGrid() {
        let self = this;
        const wnm = 27;
        let total = this.dimension, gridOutput = [], gridRows = [], thead = [], tbody = [];
        //thead
        for(let posy = 0;posy<=total[0];posy++) {
            if(posy==0) {
                gridRows.push(<tr><th><span className="halfTriangle"></span></th></tr>);
            } else gridRows.push(<tr><th>{posy}</th></tr>);
        }
        gridRows.push(<tr><th className="separator"></th></tr>);
        thead.push(gridRows);
        gridRows = [];
        //tbody
        for(let posy = 0;posy<=total[0];posy++) {
            for(let posx = 1;posx<=total[1];posx++) {
                if(posy==0) {
                    let charLiteral = "A".repeat(Math.floor(posx/wnm))+(posx<wnm ? String.fromCharCode(posx + 64) : String.fromCharCode(posx - (Math.floor(posx/wnm) * wnm) + 65));
                    gridRows.push(<th className="horizontaly">{charLiteral}</th>);
                } else {
                    if(typeof this.cells[posy]=="object" && typeof this.cells[posy][posx]!="undefined") {
                        gridRows.push(<td className="mathEnv-cell" onClick={ev=>this.onCellSelect(ev, this)} onDoubleClick={ev=>this.onCellFocus(ev)} data-posx={posx} data-posy={posy} ><var contentEditable={false}>{this.cells[posy][posx].value}</var><span className="mathEnv-cellCorner"></span></td>);
                    } else gridRows.push(<td className="mathEnv-cell" onClick={ev=>this.onCellSelect(ev, this)} onDoubleClick={ev=>this.onCellFocus(ev)} data-posx={posx} data-posy={posy} ><var contentEditable={false}></var><span className="mathEnv-cellCorner"></span></td>);
                }
            }
            gridOutput.push(<tr>{gridRows}</tr>);
            gridRows = [];
        }
        tbody.push(gridOutput);
        return (<table><thead>{thead}</thead><tbody>{tbody}</tbody></table>);
    }
}

class MathEnvCalcCell {
    _value = null;
    posX = 0;
    posY = 0;

    set value(val) {

    }
    get value() {

    }

    toString() {

    }

    valueOf() {

    }
}

export default class Calc extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            currentMenu:""
        }
        this.actions = new ActionsStack(this, [
            CalcRowInsert,
            CalcColumnInsert
        ], { loadResumeable:false });
        let lastData = this.actions.restoreComponentProp("currDocument");
        this.currDocument = lastData!=null ? new MathEnvCalcDocument(this, lastData) : new MathEnvCalcDocument(this, { title:props.title });
        this.actions.addEventListener("beforeunload", function() {
            this.saveComponentProp("currDocument");
        });
    }

    componentDidMount() {
        this.actions.restoreStacksSessions();
    }

    menu() {
        switch(this.state.currentMenu) {
            case "doc":

            break;

        }
    }

    render() {
        let self = this;
        
        return (<>
            <nav id="mathEnvCalc-top"><section><h4>Calc</h4><span className="hl"></span></section><section className="navCenter">{self.currDocument.title}</section><section></section></nav>
            <header id="mathEnvCalc-menu">
                <section id="mathEnvCalc-menuCat">
                    <div className="mathEnvCalc-catItem">Dokument</div>
                    <div className="mathEnvCalc-catItem">Formatowanie</div>
                    <div className="mathEnvCalc-catItem">Wstaw</div>
                    <div className="mathEnvCalc-catItem">Automatyzacja</div>
                    <div className="mathEnvCalc-catItem">Pomoc</div>
                </section>
                <section id="mathEnvCalc-menuContent">

                </section>
            </header>
            <div className="appSingle">
                <section id="mathEnvCalc-formulaBar"><aside><input id="mathEnvCalc-currCell" type="text" placeholder="Komórka" disabled/></aside><section id="mathEnvCalc-formulaSection"><button id="mathEnvCalc-funcBtn">f(x)</button><input id="mathEnvCalc-formula" type="text" disabled/></section></section>
                <section id="mathEnvCalc-gridContainer">
                    {this.currDocument.generateGrid()}
                </section>
                <footer></footer>
            </div>
        </>);
    }
}