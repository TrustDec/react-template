import React, { Component } from 'react';
import workingday from '../../static/workingday.json';
import workingdayLD from '../../static/ld/workingday.json';
import workingdayJL from '../../static/jl/workingday.json';
import Currency from '../../components/Currency/Currency';
import QueueAnim from 'rc-queue-anim';
import { FetchGet } from '../../modular/Common'

export default class WorkingDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wordingdata:null
        };
    }
    componentDidMount() {
        this.onGetSameDay();
    }
    
    onGetSameDay =  () => {
        let { shiftID, siteData, slideIndex } = this.props;
        let responseData = async () => {
            let responseData = await FetchGet(shiftID,'Weekday');
            this.setState({ wordingdata: responseData});
        };
        responseData();
        //this.setState({ wordingdata: WORKINGDAY[this.props.shiftID] });
    }
    render() {
        return <div style={{ flex: 1 }}>
            <QueueAnim className="demo-content">
                <Currency data={this.state.wordingdata} siteData={this.props.siteData} />
            </QueueAnim>
        </div>
    }
}
const WORKINGDAY = {
    "1": workingday,
    "2": workingdayLD,
    "3": workingdayJL
};
