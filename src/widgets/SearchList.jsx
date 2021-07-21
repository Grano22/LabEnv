import React, {Component} from 'react';
import Jumper from 'jumper';
import { ListWidget } from 'jumper/components';

export class SearchListPropsalItem {
    prepare() {return (<></>);}
    render() {
        return (<li>{this.prepare()}</li>);
    }
}

export default class SearchList extends ListWidget {
    filter = function(outputItem, stateData) {

    };
    searchFilter = function(outputItem, stateData) {
        let outputMatching = [], currIters = 0;
        while(outputItem.indexOf(stateData.searchKeyword)>-1) {
            outputMatching.push(outputItem.substr(outputItem.indexOf(stateData.searchKeyword), stateData.searchKeyword.length));
            outputItem = outputItem.substr(outputItem.indexOf(stateData.searchKeyword) + stateData.searchKeyword.length);
            currIters++;
        }
        return outputMatching; 
    }

    //Events
    onSelectItem() {}
    onSearchItem() {}

    constructor(props) {
        super(props, ["f'onSelectItem", "f'onSearchItem"]);
        this.beforeFilterOutputList = this.outputList;
        let self = this;
        this.state = {
            displaySelectList:typeof props.displaySelectList=="boolean" ? props.displaySelectList : true,
            title:typeof props.title=="string" ? props.title : "Search list",
            isHidden:typeof props.isHidden=="boolean" ? props.isHidden : true,
            outputType:"",
            searchKeyword:"",
            selectedCategory:-1
        }
        this.filter = Array.isArray(props.filter) ? props.filter : [];

    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        if(typeof newProps.isHidden!="undefined") this.setState({ isHidden: newProps.isHidden });
    }

    search(ev) {
        let searchKey = ev.currentTarget.value;
        this.state.searchKeyword = searchKey;
        if(searchKey=="") { this.outputList = this.beforeFilterOutputList; this.setState({ searchKeyword: searchKey }); return; } else this.outputList = [];
        for(let outputItem in this.beforeFilterOutputList) {
            if(this.beforeFilterOutputList[outputItem].type!=1) {
                let tryMatching = this.searchFilter(this.beforeFilterOutputList[outputItem].name, this.state);
                if(tryMatching.length>0) {
                    for(let matchInStr of tryMatching) {
                        this.beforeFilterOutputList[outputItem].name.replace(matchInStr, "<strong>"+matchInStr+"</strong>");
                        this.outputList.push(this.beforeFilterOutputList[outputItem]);
                    }
                }
            }
        }
        this.setState({ searchKeyword: searchKey });
    }

    onCategorySelect(catID) {
        console.log(catID);
        if(catID=="all") { this.outputList = this.sourceOutputList; this.setState({ update:new Date() }); }
        let tempOutput = [], duringIterate = false;
        for(let ind in this.sourceOutputList) {
            if(this.sourceOutputList[ind].name==catID) {
                duringIterate = true;
            } else if(duringIterate) {
                if(this.sourceOutputList[ind].type==1) { duringIterate = false; break; } else tempOutput.push(this.sourceOutputList[ind]);
            }
        }
        if(tempOutput.length>0) { this.outputList = tempOutput; this.setState({ selectedCategory:catID, update:new Date() }); }
        this.beforeFilterOutputList = this.outputList;
    }

    render() {
        let self = this, categorySelect = [];
        if(this.state.displaySelectList) {
            let prepCat = [];
            this.sourceOutputList.forEach(v=>{
                if(typeof v.type=="number" && v.type==1) prepCat.push(<option value={v.id || v.name}>{v.name}</option>);
            });
            categorySelect = (<label className="categorySelection"><select onChange={ev=>this.onCategorySelect(ev.currentTarget.options[ev.currentTarget.selectedIndex].value)}><option value="all" default>{{ en:"All categories", pl:"Wszystkie kategorie" }[Jumper.Browser.language.substr(0, 2)]}</option>{prepCat}</select></label>)
        }
        return (<div className={this.state.isHidden ? "searchableDropdown" : "searchableDropdown active"}>
        <div className="searchableDropdownHeader"><h4>{this.state.title || "Search list"}</h4><div className="toolsBar"><span className="righty closeBtn" onClick={ev=>self.setState({ isHidden:true, update:new Date() })}>&times;</span></div></div>
        {categorySelect}
        <label className="search"><input type="search" placeholder="Wyszukaj" onInput={ev=>self.search(ev)}/><button>&#128269;</button></label>
        <div className="searchableContents" onClick={ev=>{ if(ev.target.tagName=="LI" && !ev.target.classList.contains("header")) { let onsl = self.onSelectItem(ev.target); if(onsl) self.setState(Object.assign({ isHidden: true }, onsl)); } }}>
        {self.output()}
        </div></div>);
    }
}