import React, {Component} from 'react';
import Jumper from 'jumper';
import UnitsExchangerWidget from '../../widgets/UnitsExchanger';
import LanguageDescriptor from 'jumper/languageDescriptor';
import CurrentComponentLangDescriptor from './Exchanger.langs.json';
const currLangDictonary = new LanguageDescriptor(CurrentComponentLangDescriptor);

export default class Exchanger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:currLangDictonary.getEntry("title").t
        }
    }

    outputTypeChange(ev) {

    }

    render() {        
        return (<>
            <header className="wide">
                <h1>{this.state.title}</h1>
            </header>
            <div className="appSingle">
                <div className="in">
                    <UnitsExchangerWidget />
                </div>
            </div>
            </>);
    }
}