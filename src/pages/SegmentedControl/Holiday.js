import React, { Component } from 'react';
import holiday from '../../static/holiday.json';
import holidayLD from '../../static/ld/holiday.json';
import holidayJL from '../../static/jl/holiday.json';
import Currency from '../../components/Currency/Currency';
import QueueAnim from 'rc-queue-anim';
export default class Holiday extends Component {
    constructor(props) {
        super(props)
        this.state = {
            holiday: null
        };
    }
    componentDidMount() {
        this.onGetHoliday();
    }
    onGetHoliday = () => {
        this.setState({ holiday: HOLIDAY[this.props.shiftID] });
    }
    render() {
        return <div style={{ flex: 1 }}>
            <QueueAnim className="demo-content">
                <Currency data={this.state.holiday} reverse={this.props.reverse}/>
            </QueueAnim>
        </div>
    }
}
const HOLIDAY = {
    "1": holiday,
    "2": holidayLD,
    "3": holidayJL
};