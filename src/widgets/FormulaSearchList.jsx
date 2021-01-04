import React, {Component} from 'react';

export default class FormulaSearchList extends Component {
    filterTypes = [];
    loadedFormulas = [];
    mathFormulas = null;
    filter = [];
    onSelectItem() {}

    constructor(props) {
        super(props);
        this.filter = Array.isArray(props.filter) ? props.filter : [];
        this.state = {
            isHidden:typeof props.isHidden=="boolean" ? props.isHidden : true
        }
        if(typeof props.mathFormulas!="undefined") { 
            this.mathFormulas = props.mathFormulas;
            this.onSelectItem = this.props.onSelectItem.bind(this.mathFormulas) || this.onSelectItem.bind(this.mathFormulas);
            this.mathFormulas.onSelectItem = this.onSelectItem;
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        if(typeof newProps.isHidden!="undefined") this.setState({ isHidden: newProps.isHidden });
    }

    render() {
        let self = this;
        return (<div className={this.state.isHidden ? "searchableDropdown" : "searchableDropdown active"}>
        <div className="toolsBar"><span className="righty closeBtn" onClick={ev=>self.setState({ isHidden:true })}>&times;</span></div>
        <label><input type="search" placeholder="Wyszukaj"/></label>
        <div className="searchableContents">
        {(self.mathFormulas.render("list", true, this.filter))}
        </div></div>);
        /* ev.currentTarget.parentElement.parentElement.style.display="none" */
    }
}