/* eslint-disable */
import React, {Component} from 'react';


export default class Formulas extends Component {
    title = "Symbole";
    selectedSymbol = "";

    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <>
            <header className="wide">
                <h1>{this.title}</h1>
            </header>
            <div className="app">
                {this.selectedSymbol ? (<div className="inside">

                </div>) : (<div className="topBar">
                    <select>
                        <option>Wszystkie</option>
                        <option>Staystyka</option>
                        <option>Próbkowanie</option>
                        <option>Prawdopodobieństwo</option>
                        <option>Algebra</option>
                        <option>Geometria</option>
                    </select>
                    <label><input type="search" placeholder="Szukaj..."/></label>
                </div>)}
            </div>
            </>
        );
    }
}