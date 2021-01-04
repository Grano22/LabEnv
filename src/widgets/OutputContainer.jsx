import React, {Component} from 'react';

export default class OutputContainer extends Component {
    constructor(props) {
        super(props);
        this.tagName = props.newTagName || '';
        this.state = {
            dynamicalContent:this.props.newContent || (<></>)
        }
    }

    render() {
        const TagName = this.tagName;
        return TagName=="" ? (<>{this.state.dynamicalContent}</>) : (<TagName>{this.state.dynamicalContent}</TagName>)
    }
}