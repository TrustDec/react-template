import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import { Linkw, withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import { SegmentedControl } from 'antd-mobile';
import WorkingDay from '../SegmentedControl/WorkingDay';
import Saturday from '../SegmentedControl/Saturday';
import Sunday from '../SegmentedControl/Sunday';
import Holiday from '../SegmentedControl/Holiday';
import 'antd-mobile/dist/antd-mobile.css';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import '../../style/App.css';
const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
};
const style = {
    height: 120,
    width: '95vw',
    margin: '2.5vw',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
};

class Details extends Component {
    constructor(props) {
        super(props);
        this.moment = null;
        this.animationLeft = { left: '62%', duration: 300 };
        this.animationRight = { right: '62%', duration: 300 };
        this.windowOnScroll();
        this.state = {
            moment: null,
            paused: true,
            reverse: true,
            slideIndex: 0,
            open: false,
            contentClass: 'conditionArea conditionArea_absolute'
        };
    }
    componentDidMount() {
        this.onchangeGetDay()
    }
    onchangeGetDay = () => {
        let isWeekDay = new Date().getDay();
        if (isWeekDay === 6) {
            this.setState({ slideIndex: 1 });
        }
        if (isWeekDay === 0) {
            this.setState({ slideIndex: 2 });
        }
    }
    windowOnScroll() {
        let _this = this;
        window.onscroll = () => {
            let h = document.body.scrollTop || document.documentElement.scrollTop;
            if (h > 136) {
                _this.setState({
                    contentClass: "conditionArea conditionArea_fixed"
                });
            } else {
                _this.setState({
                    contentClass: "conditionArea conditionArea_absolute"
                });
            }
        }
    };
    handleChange = (e) => {
        this.setState({
            slideIndex: e.nativeEvent.selectedSegmentIndex,
        });
    }
    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    onScrollViewList() {
        let data = this.props.location.state;
        let Components = label[this.state.slideIndex].component;
        let start = this.state.reverse ? data.start : data.end;
        let end = !this.state.reverse ? data.start : data.end;
        let siteData = { start: start, end: end, reverse: this.state.reverse, slideIndex: this.state.slideIndex};
        return <Components siteData={siteData} shiftID={data.id} slideIndex={this.state.slideIndex}/>
    }
    onClick = (event) => {
        let reverse = !this.state.reverse;
        this.setState({
            paused: false,
            reverse: reverse,
            moment: null,
        });
    }

    render() {
        let data = this.props.location.state;
        return (
            <MuiThemeProvider style={{ height: '100%', }} >
                <QueueAnim ease={'easeOutElastic'} >
                    <div key="details" style={{ display: 'inline-block', height: '100%', overflow: 'hidden', }} >
                        <Paper style={style} zDepth={1} >
                            <TweenOne
                                animation={this.animationLeft}
                                paused={this.state.paused}
                                reverse={this.state.reverse}
                                moment={this.state.moment}
                                className="code-box-shape-left"
                            >{data.start}</TweenOne>
                            <FloatingActionButton 
                                mini={false} 
                                style={{ position: 'relative', zIndex: 100 }} 
                                onClick={this.onClick} 
                                backgroundColor='#27B2FF'>
                                <ActionSwapHoriz style={{ width: 38, height: 38}}/>
                            </FloatingActionButton>
                            <TweenOne
                                animation={this.animationRight}
                                paused={this.state.paused}
                                reverse={this.state.reverse}
                                moment={this.state.moment}
                                className="code-box-shape-right"
                            >{data.end}</TweenOne>
                        </Paper>
                        <SegmentedControl 
                            values={['工作日', '周六', '周日', '寒暑假']}
                            selectedIndex={this.state.slideIndex}
                            onChange={this.handleChange}
                            key="SegmentedControl"
                            tintColor={'#27B2FF'}
                            style={{ backgroundColor:'#fff',marginLeft: 10, marginRight: 10, height: 35, marginBottom: 8 }}
                        />
                        <div style={styles.root} key="details-list">
                            {this.onScrollViewList()}
                        </div>
                    </div>
                </QueueAnim>
            </MuiThemeProvider>
        );
    }
}

const label = [
    { label: "工作日", component: WorkingDay }, 
    { label: "周六", component: Saturday },
    { label: "周日", component: Sunday },
    { label: "寒暑假", component: Holiday },
];
export default withRouter(Details)