import ReactDOM from 'react-dom';
//import Jumper, { JumperModule } from 'jumper';

/* Browser Jumper */
export const JumperBrowser = new class {
    constructor() {
        Object.defineProperty(window, "subwindow", { value:null, enumerable:false, writable:true })
    }
    async share(shareData, component=null) {
        try {
            if(typeof navigator.share!="undefined") {
                await navigator.share(shareData);
            } else if(component!=null) {
                await this.shareViaComponent(shareData, component);
            }
        } catch(ShareError) {
            console.error(ShareError);
        }
    }
    async shareViaComponent(shareData, ShareComponent) {
        try {
            const initiationComponent = <ShareComponent terminateWindow={this.closeWindow} {...shareData}/>;
            await this.createWindow(initiationComponent);
        } catch(ShareError) {
            console.error(ShareError);
        }
    }
    async createWindow(component) {
        if(document.getElementById("subwindowContainer")!=null) return false;
        var windowContainer = document.createElement("div"), windowStyles = `#subwindowContainer { position:fixed; left: 0; top: 0; height: 100vh; width: 100%; background: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; }`, stylesContainer = document.createElement("style"), subwindowHolder = document.createElement("div");
        windowContainer.id = "subwindowContainer";
            stylesContainer.setAttribute("type", "text/css");
            /* Registered Components Styles */
            let subwindowComponentCSS = "";
            console.log(component);
            if(typeof component.type.styles!="undefined") {
            for(let styleContName in component.type.styles) {
                for(let styleContDef in component.type.styles[styleContName]) {
                    subwindowComponentCSS += ` #subwindowContainer ${styleContDef.replace("&", styleContName)} {`;
                    for(let propDef in component.type.styles[styleContName][styleContDef]) {
                        subwindowComponentCSS += `${propDef}:${component.type.styles[styleContName][styleContDef][propDef]};`;
                    }
                    subwindowComponentCSS += '}';
                }
            }};
            /* END Registered Component Styles */
            stylesContainer.textContent = windowStyles + subwindowComponentCSS;
            windowContainer.appendChild(stylesContainer);
            subwindowHolder.id = "subwindowHolder";
            windowContainer.appendChild(subwindowHolder);
        document.body.appendChild(windowContainer);
        window.subwindow = windowContainer;
        ReactDOM.render(component, subwindowHolder);
    }
    async closeWindow() {
        if(window.subwindow==null) { console.error("Current subwindow context is inactive"); return false; }
        window.subwindow.remove();
        window.subwindow = null;
    }
    async terminateWindow() {

    }
    get language() {
        if(typeof window.navigator.languages[0]!="undefined") return window.navigator.languages[0];
        if(typeof window.navigator.language!="undefined") return window.navigator.language;
        else if(typeof window.navigator.userLanguage!="undefined") return window.navigator.userLanguage;
    }
    get clipboard() {
        var lastError = null;
        return new class {
            copyText(targetStr) {
                try {
                    if(typeof targetStr!=="string") return false;
                    if(typeof document.execCommand!="undefined") {
                        if(typeof document.queryCommandSupported!="undefined") {
                            if(document.queryCommandSupported('copy')) {
                                var avoidCont = document.createElement("textarea");
                                avoidCont.style = { visibility: "hidden", position:"absolute", left:"-1000px", top: "-1000px" };
                                avoidCont.value = targetStr.toString();
                                document.body.appendChild(avoidCont);
                                avoidCont.select();
                                let res = document.execCommand('copy');
                                document.body.removeChild(avoidCont);
                                console.log(targetStr);
                                return !!res;
                            } else return false;
                        } else {
                            let res = document.execCommand('copy');
                            return !!res;
                        }
                    } else if(typeof window.clipboardData!="undefined") {
                        window.clipboardData.setData('Text', targetStr);
                    } else throw "No Method";
                } catch(clipboardError) {
                    console.error("Jumper.Browser.Clipboard.Error: "+clipboardError.toString());
                }
            }
            async copyTextAwaited(targetStr) {
                try {
                    await navigator.clipboard.writeText(targetStr);
                } catch(clipboardError) {
                    console.error("Jumper.Browser.Clipboard.Error: "+clipboardError.toString());
                }
            }
            copy(copyRes) {
                switch(typeof copyRes) {
                    case "string":
                        this.copyText(copyRes);
                }
            }
            async copyAwiated(copyRes) {
                switch(typeof copyRes) {
                    case "string":
                        await this.copyTextAwaited(copyRes);
                }
            }
        }
    }
}

export default JumperBrowser;