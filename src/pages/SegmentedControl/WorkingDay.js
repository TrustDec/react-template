import React, { Component } from 'react';
import workingday from '../../static/workingday.json';
import workingdayLD from '../../static/ld/workingday.json';
import workingdayJL from '../../static/jl/workingday.json';
import Currency from '../../components/Currency/Currency';
import QueueAnim from 'rc-queue-anim';

export default class WorkingDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wordingdata:null
        };
    }
    componentDidMount() {
        this.onGetWorkingDay();
    }
    
    onGetWorkingDay = () => {
        this.setState({ wordingdata: WORKINGDAY[this.props.shiftID] });
    }
    render() {
        return <div style={{ flex: 1 }}>
            <QueueAnim className="demo-content">
                <Currency data={this.state.wordingdata} reverse={this.props.reverse} />
            </QueueAnim>
        </div>
    }
}
const WORKINGDAY = {
    "1": workingday,
    "2": workingdayLD,
    "3": workingdayJL
};
