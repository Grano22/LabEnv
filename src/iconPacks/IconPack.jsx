import React, { Component } from 'react';
import ReactCreateClass from 'create-react-class';
/* Icon Pack by Grano22 | Module v.1 */
export class Icon {
    name = "Unnamed";

    iconStructure = "";
    get iconBefore() { return ""; }
    get iconAfter() { return ""; }

    width = 24;
    height = 24;

    color = "black";
    fill = "transparent";

    constructor(initFunc=null) {
        if(initFunc!=null) { 
            var initObj = initFunc(this) || {};
            for(let objParam in initObj) this[objParam] = initObj[objParam];
        }
    }

    get completeStructure() {return this.iconBefore + this.iconStructure + this.iconAfter}

    asComponent() {
        var self = this, RenderedContext = ReactCreateClass({ render:function() { return (<div dangerouslySetInnerHTML={{__html: self.completeStructure }}></div>); }});
        return (<RenderedContext/>);
    }

    asNativeElement() {
        let temp = document.createElement('div');
        temp.innerHTML = this.completeStructure;
        return temp.firstChild;
    }

    fromTextAttributes(stringStyle) {
        if(typeof stringStyle.fontSize!="undefined") {
            this.width = this.height = stringStyle.fontSize;
        }
    }
}

export class SVGIcon extends Icon {
    static iterator = 0;
    get iconBefore() { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+this.width+' '+this.height+'" width="'+this.width+'" height="'+this.height+'" '+(typeof this.containerAttributes!="undefined" && Object.entries(this.containerAttributes).map((attr, ind, arr)=>attr[0]+'="'+attr[1]+'"').join(" "))+'>'; } //+(arr.length - 1>ind && " ")
    get iconAfter() { return '&#9633;</svg>'; }

    constructor(initFunc=null, outputType="") {
        super(initFunc);
        this.id = SVGIcon.iterator++;
        if(this.iconStructure=="") this.iconStructure = '<rect x="0" y="0" width="'+this.width+'" height="'+this.height+'" style="fill:transparent;stroke:#000;stroke-width:10" />';
        this.outputType = outputType;
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        return this;
    }

    get completeStructure() {
        let iconBefore = "", iconAfter = "";
        switch(this.outputType) {
            case "symbol":
                iconBefore = this.iconBefore + `<symbol id="iconPackOutput${this.id}" viewBox="0 0 ${this.originWidth || this.width} ${this.originHeight || this.height}" >`;
                iconAfter = `</symbol><use xlink:href="#iconPackOutput${this.id}" width="${this.width}" height="${this.height}"></use>` + this.iconAfter;
            break;
            case "preseved":
                this.containerAttributes = Object.assign(this.containerAttributes, { preserveAspectRatio:"none" });
                iconBefore = this.iconBefore;
            default:
        }
        return iconBefore + this.iconStructure + iconAfter;
    }
}