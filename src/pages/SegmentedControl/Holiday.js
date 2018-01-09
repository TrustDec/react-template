import React, { Component } from 'react';
import holiday from '../../static/holiday.json';
import holidayLD from '../../static/ld/holiday.json';
import holidayJL from '../../static/jl/holiday.json';
import Currency from '../../components/Currency/Currency';
import QueueAnim from 'rc-queue-anim';
import { FetchGet } from '../../modular/Common'
export default class Holiday extends Component {
    constructor(props) {
        super(props)
        this.state = {
            holiday: null
        };
    }
    componentDidMount = () => {
        this.onGetSameDay();
    }
    onGetSameDay = () => {
        let { shiftID, siteData, slideIndex } = this.props;
        let responseData = async () => {
            let responseData = await FetchGet(shiftID, 'Vacation');
            this.setState({ saturday: responseData });
        };
        responseData();
        //this.setState({ holiday: HOLIDAY[this.props.shiftID] });
    }
    render() {
        return <div style={{ flex: 1 }}>
            <QueueAnim className="demo-content">
                <Currency data={this.state.holiday} siteData={this.props.siteData}/>
            </QueueAnim>
        </div>
    }
}
const HOLIDAY = {
    "1": holiday,
    "2": holidayLD,
    "3": holidayJL
};