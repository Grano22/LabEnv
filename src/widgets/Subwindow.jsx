import React, {Component} from 'react';

class Subwindow extends Component {
    constructor(props) {
        super(props);
    }

    static registerComponents(componentsArr) {
        let outputRes = Object.create({
            ".subwindow":{
                "&":{
                    "min-width":"250px",
                    "max-width":"350px",
                    "background-color":"#bdbdbd",
                    "border":"2px solid rgba(115, 115, 115, 0.8)",
                    "box-shadow":"0 0 0 1px #45A1FF, 0 0 0 4px rgba(69, 161, 255, 0.3)",
                    "border-radius":"5px"
                }
            },
            "header.subwindowHeader":{
                "&":{
                    "display":"inline-block",
                    "width":"100%",
                    "background-color":"#b0b0b0"
                },
                "& h3":{ "text-align":"center" }
            },
            "#subwindowMain":{
                "&":{
                    "display":"inline-block",
                    "width":"100%",
                    
                }
            },
            "#subwindowFooter":{
                "&":{
                    "display":"inline-block",
                    "width":"100%",
                    
                }
            }
        });
        for(let componentEntry of componentsArr) {
            let resClassOutput = new componentEntry();
            outputRes['.'+resClassOutput.className] = resClassOutput.style;
        }
        return outputRes;
    }

    render() {
        return (<></>);
    }
}

class SubwindowComponent extends Component {
    constructor(props) {
        super(props);
    }
    get className() {
        return this.__proto__.constructor.name[0].toString().toLowerCase()+this.__proto__.constructor.name.substr(1);
    }
    get style() { return {} }
}

class SubwindowOKButton extends SubwindowComponent {
    get style() {
        return {
            "&":{
                "display":"inline-block",
                "width":"100%",
                "background":"#a1a1a1",
                "color":"#444",
                "text-align":"center",
                "transition":"0.3s ease-out"
            },
            "&:hover":{
                "color":"#888",
                "background":"#454545",
                "cursor":"pointer",
                "transition":"0.3s ease-in"
            }
        };
    } 
    render() {
        return <span className={this.className} onClick={this.props.onClose}>OK</span>;
    }
}

export class ShareSubwindow extends Subwindow {
    static styles = this.registerComponents([SubwindowOKButton]);

    constructor(props) {
        super(props);
        this.state = {
            title:'',
            text:'',
            url:''
        }
        for(let prop in props) this.state[prop] = props[prop];
        //if(props.hasOwnProperty(prop))
        console.log(props, this.props);
        this.terminateWindow = this.props.terminateWindow;
    }

    render() {
        return (<div className="subwindow subwindowShare">
            <header className="subwindowHeader">
                <h3>{this.state.title || "Udostepnij"}</h3>
            </header>
            <main className="subwindowMain">
                <div className="in">
                    <p>{this.state.text}</p>
                    <input type="text" defaultValue={this.state.url}/>
                </div>
            </main>
            <footer className="subwindowFooter">
                <SubwindowOKButton onClose={this.terminateWindow}/>
            </footer>
        </div>);
    }
}

