/* eslint-disable */
import { Link } from 'react-router-dom';
import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import MathSymbolsEntries from '../../data/MathSymbols';
import JumperBrowser from '../../libraries/Browser';
import * as MaterialIcons from '../../iconPacks/MaterialIcons/MaterialIcons.SVG';
import { FloatingContainerEvent, FloatingContainerNextToEvent, FloatingContainerCurrentEvent } from '../../libraries/Events';

const currLanguage = JumperBrowser.language;

export class Symbols extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.lastFetchList = [];
        this.state = {
            title:{ en:"Symbols", pl:"Symbole", "pl-PL":"Symbole" },
            filters:[],
            searchKeyword:''
        }
        
    }

    componentDidMount() {
        if(this.props.match.params) {
            try {
                console.log(this.props.match.params);
            } catch(RoutingError) {

            }
        }
    }

    selectCharacter(ev) {
        let currCont = ev.currentTarget.parentElement;
        console.log(currCont);
        if(currCont.hasAttribute("data-category") && currCont.hasAttribute("data-index")) {
            let currItem = this.lastFetchList[currCont.getAttribute("data-category")][parseInt(currCont.getAttribute("data-index"))];
            console.log(currItem);
            this.props.history.push(`/symbols/${encodeURI(currItem.subcategoryName)}/${encodeURI(currItem[currItem.subcategoryName])}/${encodeURI(currItem.unicodePoint)}`);
        } else if(currCont.hasAttribute("data-index")) {
            let currItem = this.lastFetchList[parseInt(currCont.getAttribute("data-index"))];
            console.log(currItem);
            this.props.router.push(`/symbols/${encodeURI(currItem.subcategoryName)}/${encodeURI(currItem[currItem.subcategoryName])}/${encodeURI(currItem.unicodePoint)}`);
        }
    }

    toOutput(symbolEntry, ind=-1, symbType="untypedSymbol", lang="pl") {
        return (<div className="inline-result" data-index={ind} data-category={symbType}>
            <var>{symbolEntry.char}</var>
            <h3>{symbolEntry.name[lang]}</h3>
            <p>
                <strong>HTML Entity:</strong><br/>
                {typeof symbolEntry["htmlEntityHexCodes"]!="undefined" && symbolEntry["htmlEntityHexCodes"][0] || "HTML Entity missing"}
            </p>
            <button onClick={(evt)=>JumperBrowser.clipboard.copy(evt.parentElement.children[0])}>Kopiuj</button>
            <button onClick={(ev)=>this.selectCharacter(ev)}>Otwórz</button>
        </div>);
    }

    outputAll() {
        let totalElements = {};
        totalElements["mathSymbols"] = MathSymbolsEntries.list;
        return totalElements;
    }

    outputSpecified(categoryName="", subcatName="") {
        let totalElements = [];
        console.log(categoryName, subcatName);
        switch(categoryName) {
            case "mathSymbols":
                totalElements = subcatName=="" || subcatName=="all" ? MathSymbolsEntries.list : MathSymbolsEntries.list.filter(v=>v.mathCategory==subcatName);
            break;
            case "arrows":

            break;
            case "borders":

            break;
        }
        return totalElements;
    }



    render() {
        let self = this, page = null;
        this.lastFetchList = [];
        if(self.state.selectedSymbol!=null) {

        } else {
            let allOutput = [];
            if(Array.isArray(this.state.filters) && this.state.filters.length>0) { 
                this.lastFetchList = this.outputSpecified.apply(this, this.state.filters);
                if(this.state.searchKeyword.length>0) this.lastFetchList = this.lastFetchList.filter(v=>v.name[currLanguage].indexOf(this.state.searchKeyword)>-1);
                allOutput = this.lastFetchList.map((v, ind)=>this.toOutput(v, ind, this.state.filters[0]));
            } else { 
                this.lastFetchList = this.outputAll();
                if(this.state.searchKeyword.length>0) this.lastFetchList = this.lastFetchList.filter(v=>v.name[currLanguage].indexOf(this.state.searchKeyword)>-1);
                for(let symbolsType in this.lastFetchList) allOutput = allOutput.concat(this.lastFetchList[symbolsType].map((v, ind)=>this.toOutput(v, ind, symbolsType)));
            }
            page = (<><div className="topBar">
            <select onChange={(ev)=>{
                let contextEl = ev.currentTarget;
                if(contextEl.value=="") self.setState({ filters:[] }); else self.setState({ filters:[ contextEl.options[contextEl.selectedIndex].parentElement.getAttribute("value"), contextEl.value ] });
            }}>
                <option value="" default>Wszystkie kategorie</option>
                <optgroup value="mathSymbols" label="Matematyczne">
                    <option value="all">Wszystkie</option>
                    <option value="logic">Logika</option>
                    <option value="arythymetic">Arytmetyka</option>
                    <option value="collections">Zbiory</option>
                    <option value="constans">Stałe</option>
                    <option value="variables">Zmienne</option>
                    <option value="operators">Inne operatory</option>
                </optgroup>
            </select>
            <label><input type="search" placeholder="Szukaj..." onInput={(ev)=>{ self.setState({ searchKeyword:ev.currentTarget.value }); }}/></label>
        </div>
        <div className="in">
        <main className="items-grid">
            {allOutput}
        </main></div></>);
        }
        return (
            <>
            <header className="wide">
                <h1>{this.state.title[currLanguage]}</h1>
            </header>
            <div className="appSingle">
                {page}
            </div>
            </>
        );
    }
}

export default withRouter(Symbols);