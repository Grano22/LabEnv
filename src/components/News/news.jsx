import React, {Component} from 'react';
import LatestNewsService  from '../../services/latest';

export class NewsPostPage extends Component {
    constructor(props) {
        super(props);
        this.service = new LatestNewsService();
    }

    componentDidMount() {
        console.log("starting...");
        this.service.getLatestNews().then((r)=>{
            console.log(r);
        }).catch((e)=>{
            console.error(e);
        });
    }

    render() {
        return (<>
            
        </>);
    }
}