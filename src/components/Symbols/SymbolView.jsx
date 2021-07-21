import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as MaterialIcons from '../../iconPacks/MaterialIcons/MaterialIcons.SVG';
import OutputContainer from '../../widgets/OutputContainer';
import TextViewerConfigurable from '../../widgets/TextViewerConfigurable';
import { FloatingContainerEvent, FloatingContainerNextToEvent, FloatingContainerCurrentEvent } from '../../libraries/Events';
import JumperBrowser from '../../libraries/Browser';
import MathSymbolsEntries from '../../data/MathSymbols';
import { UTF8ToHex, UTF8ToBin } from '../../libraries/Compression';
import { ShareSubwindow } from '../../widgets/Subwindow';

const currLanguage = JumperBrowser.language.substring(0, 2);

class CopySmallButton extends Component {
    constructor(props) {
        super(props);
        if(typeof props.copyTarget!="undefined") this.copyTarget = props.copyTarget; else this.copyTarget = "";
        this.state = {
            status:0
        }
    }

    onClick(ev) {
        if(this.setState.status>0) return false;
        console.log(this.copyTarget.toString());
        JumperBrowser.clipboard.copy(this.copyTarget);
        this.setState({status:1});
        setTimeout(()=>{
            this.setState({status:0});
        }, 1000);
    }

    render() {
        const ClipboardCopyIcon = this.state.status<=0 ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>)
        return (<span onClick={(ev)=>this.onClick(ev)}>{ClipboardCopyIcon}</span>)
    }
}

export default class Symbols extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:{ en:"Cannot find char", pl:"Cannot find char", "pl-PL":"Cannot find char" },
            selectedSymbol:null,
            filtetedOutput:[]
        }
        this.technicalOutput = React.createRef();
        this.codingOutput = React.createRef();
        this.sourceOutput = React.createRef();
    }

    componentDidMount() {
        if(this.props.match.params) {
            try {
                console.log(this.props.match.params);
                let routingParams = this.props.match.params, goalSymbol = this.getCharEntry(decodeURI(routingParams.category), decodeURI(routingParams.subcategory), decodeURI(routingParams.id));
                console.log(goalSymbol.name[currLanguage]);
                if(goalSymbol) this.setState({ selectedSymbol:goalSymbol, title:goalSymbol.name });
            } catch(RoutingError) {
                console.error(RoutingError);
            }
        }
    }

    getCharEntry(category, subcategory, charPos) {
        switch(category) {
            case "mathCategory":
                for(let mathEntry of MathSymbolsEntries.list) {
                    if(mathEntry.unicodePoint==charPos) {
                        return mathEntry;
                    }
                }
            break;
        }
        return null;
    }

    render() {
        let self = this;
        console.log(self.state);
        if(self.state.selectedSymbol==null || !self.state.selectedSymbol) {
            return (<div className="in">
            Nie znaleziono
        </div>);
        } else {
        var technicalDescriptions = [
            { id:"sign", title:{ en:"Symbol/Sign", pl:"Symbol/Znak" }, baseValue: self.state.selectedSymbol.char },
            { id:"fullName", title:{ en:"Full name", pl:"Pełna nazwa" }, baseValue: self.state.selectedSymbol.name[currLanguage] },
            { id:"otherNames", title:{ en:"Other names", pl:"Inne nazwy" }, baseValue: self.state.selectedSymbol.synonyms && Array.isArray(self.state.selectedSymbol.synonyms[currLanguage]) ? self.state.selectedSymbol.synonyms[currLanguage].join(",") : "Brak" },
            { id:"unicodeNr", title:{ en:"Unicode nr", pl:"Numer Unicode" }, baseValue: self.state.selectedSymbol.unicodePoint },
            { id:"category", title:{ en:"Category", pl:"Kategoria" }, baseValue: self.state.selectedSymbol.category },
            { id:"type", title:{ en:"Type", pl:"Typ" }, baseValue: self.state.selectedSymbol[self.state.selectedSymbol.subcategoryName] }
        ],
        codingDescriptions = [
            { id:"entityName", title:{ en:"HTML Entity (Name)", pl:"HTML Entity (Nazwa)" }, baseValue: self.state.selectedSymbol.htmlEntityName ? self.state.selectedSymbol.htmlEntityName : "Brak" },
            { id:"entityHex", title:{ en:"HTML Entity (Hex)", pl:"HTML Entity (Kod szesnastkowy)" }, baseValue: self.state.selectedSymbol.htmlEntityHexCodes.join(",") },
            { id:"entityDecimal", title:{ en:"HTML Entity (Decimal)", pl:"HTML Entity (Kod dziesiętny)" }, baseValue: self.state.selectedSymbol.htmlEntityDecimalCodes.join(",") },
            { id:"urlEscape", title:{ en:"URL Escape", pl:"URL Escape" }, baseValue: encodeURIComponent(self.state.selectedSymbol.char) },
            { id:"utf8Hex", title:{ en:"UTF-8 (Hex)", pl:"UTF-8 (Kod szesnastkowy)" }, baseValue: UTF8ToHex(self.state.selectedSymbol.char) },
            { id:"utf8Bin", title:{ en:"UTF-8 (Binary)", pl:"UTF-8 (Binarny)" }, baseValue: UTF8ToBin(self.state.selectedSymbol.char).map(v=>v.toString("2")).join(":") }
        ],
        sourceCodeDescriptions = [
            { id:"cssSource", title:{ en:"CSS", pl:"CSS" }, baseValue: `\\${self.state.selectedSymbol.unicodePoint.replace("U+", "")}` },
            { id:"cSource", title:{ en:"C, C++", pl:"C, C++" }, baseValue: `"\\u${self.state.selectedSymbol.unicodePoint.replace("U+", "")}"` },
            { id:"c#Source", title:{ en:"C#", pl:"C#" }, baseValue: `@"\\u${self.state.selectedSymbol.unicodePoint.replace("U+", "")}"` },
            { id:"jsSource", title:{ en:"Javascript", pl:"Javascript" }, baseValue: `"\\u${self.state.selectedSymbol.unicodePoint.replace("U+", "")}"` },
            { id:"perlSource", title:{ en:"Perl", pl:"Perl" }, baseValue: `\\x{${self.state.selectedSymbol.unicodePoint.replace("U+", "")}}` },
            { id:"python2Source", title:{ en:"Python 2", pl:"Python 2" }, baseValue: `u"\\u${self.state.selectedSymbol.unicodePoint.replace("U+", "")}"` },
            { id:"python3Source", title:{ en:"Python 3", pl:"Python 3" }, baseValue: `\\u${self.state.selectedSymbol.unicodePoint.replace("U+", "")}` },
            { id:"rubySource", title:{ en:"Ruby", pl:"Ruby" }, baseValue: `\\u{${self.state.selectedSymbol.unicodePoint.replace("U+", "")}}` },
        ];
        function DescriptorGenerator(currDescriptor) {
            let finalElements = [];
            for(let i = 0;i<currDescriptor.length;i++) {
                currDescriptor[i] = Object.assign({ title:{ en:"Untitled", pl:"Bez tytułu", "pl-PL":"Bez tytułu" }, baseValue:"", copyValue:null }, currDescriptor[i]);
                currDescriptor[i].title["pl-PL"] = currDescriptor[i].title.pl;
                currDescriptor[i].title["en-US"] = currDescriptor[i].title.en;
                if(currDescriptor[i].copyValue==null) currDescriptor[i].copyValue = currDescriptor[i].baseValue;
                if(!self.state.filtetedOutput.includes(currDescriptor[i].id)) finalElements.push((<div className="rowItem"><strong>{currDescriptor[i].title[currLanguage]}</strong>: {currDescriptor[i].baseValue} {(<div className="rowOptions"><CopySmallButton copyTarget={currDescriptor[i].copyValue}/></div>)}</div>));
            }
            return finalElements;
        }
        const checkBoxesTechnicalDescriptors = technicalDescriptions.map((v, ind)=>(<label className="checkboxContainer">{v.title[currLanguage]}
            <input type="checkbox" key={ind} value={v.id} onChange={evt=>{
                let currCheckbox = evt.currentTarget, indicator = self.state.filtetedOutput.indexOf(currCheckbox.value);
                if(currCheckbox.checked) { if(indicator>-1) self.state.filtetedOutput.splice(indicator, 1); } else self.state.filtetedOutput.push(currCheckbox.value);
                self.technicalOutput.setState({ dynamicalContent:DescriptorGenerator(technicalDescriptions) });
            }} defaultChecked={this.state.filtetedOutput.includes(v.id) ? "" : "checked"}/>
            <span className="checkmark"></span>
        </label>));
        const checkBoxesCodingDescriptors = codingDescriptions.map((v, ind)=>(<label className="checkboxContainer">{v.title[currLanguage]}
            <input type="checkbox" key={ind} value={v.id} onChange={evt=>{
                let currCheckbox = evt.currentTarget, indicator = self.state.filtetedOutput.indexOf(currCheckbox.value);
                if(currCheckbox.checked) { if(indicator>-1) self.state.filtetedOutput.splice(indicator, 1); } else self.state.filtetedOutput.push(currCheckbox.value);
                self.codingOutput.setState({ dynamicalContent:DescriptorGenerator(codingDescriptions) });
            }} defaultChecked={this.state.filtetedOutput.includes(v.id) ? "" : "checked"}/>
            <span className="checkmark"></span>
        </label>)); 
        const checkBoxesSourceDescriptors = sourceCodeDescriptions.map((v, ind)=>(<label className="checkboxContainer">{v.title[currLanguage]}
            <input type="checkbox" key={ind} value={v.id} onChange={evt=>{
                let currCheckbox = evt.currentTarget, indicator = self.state.filtetedOutput.indexOf(currCheckbox.value);
                if(currCheckbox.checked) { if(indicator>-1) self.state.filtetedOutput.splice(indicator, 1); } else self.state.filtetedOutput.push(currCheckbox.value);
                self.sourceOutput.setState({ dynamicalContent:DescriptorGenerator(sourceCodeDescriptions) });
            }} defaultChecked={this.state.filtetedOutput.includes(v.id) ? "" : "checked"}/>
            <span className="checkmark"></span>
        </label>));
        return (<>
            <header className="wide">
                <h1>{this.state.title[currLanguage]}</h1>
            </header>
            <div className="appSingle">
                {(<div className="inside">
            <nav className="topNavigator"><div className="marginedMedium"><Link to="/symbols">Symbole</Link> -&gt; {this.state.selectedSymbol.name[currLanguage]}</div></nav>
            <div className="in">
                <div className="righty relativeContainer">
                    <span className="icon beforeFloating" onClick={ev=>FloatingContainerCurrentEvent(ev)}>{MaterialIcons.MaterialIconFilterSVGIcon.resize(32, 32).asComponent()}</span>
                    <div className="floatingContainer righty scrollableContainerThin">
                        <header className="hoverableHeader"><h3>Informacje techniczne</h3></header>
                        <div className="hoverableContainer"><div className="in">{checkBoxesTechnicalDescriptors}</div></div>
                        <header className="hoverableHeader"><h3>Kodowanie</h3></header>
                        <div className="hoverableContainer"><div className="in">{checkBoxesCodingDescriptors}</div></div>
                        <header className="hoverableHeader"><h3>Kod źródłowy</h3></header>
                        <div className="hoverableContainer"><div className="in">{checkBoxesSourceDescriptors}</div></div>
                    </div>
                    <span className="icon" onClick={()=>JumperBrowser.share({ title:self.state.selectedSymbol.title, text:self.state.selectedSymbol.name[currLanguage], url:self.props.location.url }, ShareSubwindow)}>{MaterialIcons.MaterialIconShareSVGIcon.resize(32, 32).asComponent()}</span>
                    <span className="icon">{MaterialIcons.MaterialIconPrintSVGIcon.resize(32, 32).asComponent()}</span>
                </div>
                <div className="descriptor">
                    <TextViewerConfigurable textDefaultField={self.state.selectedSymbol.char}/>
                    <h3>Informacje techniczne</h3><hr className="smooth"/>
                    <OutputContainer ref={oc=>this.technicalOutput = oc} newTagName="section" newContent={DescriptorGenerator(technicalDescriptions)} />
                    <h3>Kodowanie</h3><hr className="smooth"/>
                    <OutputContainer ref={oc=>this.codingOutput = oc} newTagName="section" newContent={DescriptorGenerator(codingDescriptions)}/>
                    <h3>Kod źródłowy</h3><hr className="smooth"/>
                    <OutputContainer ref={oc=>this.sourceOutput = oc} newTagName="section" newContent={DescriptorGenerator(sourceCodeDescriptions)}/>
                </div>
            </div>
        </div>)}
            </div>
        </>);
        }
    }
}