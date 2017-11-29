import React, { Component } from 'react';
import saturday from '../../static/saturday.json';
import saturdayLD from '../../static/ld/saturday.json';
import saturdayJL from '../../static/jl/saturday.json';
import Currency from '../../components/Currency/Currency';
import QueueAnim from 'rc-queue-anim';
export default class Saturday extends Component {
    constructor(props) {
        super(props)
        this.state = {
            saturday: null
        };
    }
    componentDidMount() {
        this.onGetSaturday();
    }
    onGetSaturday = () => {
        this.setState({ saturday: SATURDAY[this.props.shiftID] });
    }
    render() {
        return <div style={{ flex: 1 }}>
            <QueueAnim className="demo-content">
                <Currency data={this.state.saturday} reverse={this.props.reverse} />
            </QueueAnim>
        </div>
    }
}
const SATURDAY = {
    "1": saturday,
    "2": saturdayLD,
    "3": saturdayJL
};