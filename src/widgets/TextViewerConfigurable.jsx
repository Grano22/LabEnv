import React, {Component} from 'react';

export default class TextViewerConfigurable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onCharStyling:false,
            fontSizeRange:false,
            colorRange:false
        };
        this.textField = typeof props.textDefaultField!="undefined" ? props.textDefaultField : "(None)";
        for(let textParameter of [["fontSize", 16], ["color", "#000"]]) if(typeof props[textParameter[0]]!="undefined") this.state[textParameter[0]] = props[textParameter[0]]; else this.state[textParameter[0]] = textParameter[1];

    }



    render() {
        return (
            <div className="marginedCentred">
                <h4 style={{ fontSize:"28px", fontStyle:"normal" }}>{this.textField}</h4>
                {this.state.onCharStyling ? (<><strong>Rozmiar:</strong>
                {this.state.fontSizeRange ? (<div className="textViewer-font-sizer">
                    <span class="circledIcon"><i>-</i></span>
                    <label><input type="range"/></label>
                    <span class="circledIcon"><i>+</i></span>
                    <span class="circledIcon textViewer-fontSample-huge" onClick={()=>this.setState({ fontSizeRange:false })}><i class="solid">&#x2699;</i></span>
                    </div>) : (<div className="textViewer-font-sizer">
                    <span class="circledIcon textViewer-fontSample-tiny"><i>A</i></span>
                    <span class="circledIcon textViewer-fontSample-small"><i>A</i></span>
                    <span class="circledIcon textViewer-fontSample-medium"><i>A</i></span>
                    <span class="circledIcon textViewer-fontSample-big"><i>A</i></span>
                    <span class="circledIcon textViewer-fontSample-huge"><i>A</i></span>
                    <span class="circledIcon textViewer-fontSample-huge" onClick={()=>this.setState({ fontSizeRange:true })}><i class="solid">&#x2699;</i></span>
                </div>)}
                <strong>Kolor:</strong>
                {this.state.colorRange ? (<div className="textViewer-font-colorer">
                    <span class="circledIcon"><i>-</i></span>
                    <label><input type="range"/></label>
                    <span class="circledIcon"><i>+</i></span>
                </div>) : (<div className="textViewer-font-colorer">
                    <span class="circledIcon"><span class="colorCircle black"></span></span>
                    <span class="circledIcon"><span class="colorCircle green"></span></span>
                    <span class="circledIcon"><span class="colorCircle blue"></span></span>
                    <span class="circledIcon"><span class="colorCircle red"></span></span>
                    <span class="circledIcon"><span class="colorCircle white"></span></span>
                    <span class="circledIcon textViewer-fontSample-huge"><i class="solid">&#x2699;</i></span>
                </div>)}
                <strong>Styl:</strong>
                <div className="textViewer-font-styler">
                    <span class="circledIcon"><i><strong>B</strong></i></span>
                    <span class="circledIcon"><i><em>I</em></i></span>
                </div>
                <span class="circledIcon" onClick={()=>this.setState({ onCharStyling:false })}><i>&times;</i></span></>) : (<button onClick={()=>this.setState({ onCharStyling:true })}>Edytuj styl</button>)}
            </div>
        );
    }
}