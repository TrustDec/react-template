import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List, ListItem } from 'material-ui/List';
import { NoticeBar, Carousel } from 'antd-mobile';
import Marquee from 'react-upward-marquee'
import HardwareKeyboardBackspace from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import '../../style/App.css';
import banner from '../../style/banner.png'
import QueueAnim from 'rc-queue-anim';
import schoolbus from '../../static/schoolbus';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import { Modal } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import { getQueryString } from "../../modular/Common";
class Home extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            busdata: null,
            notice: "",
            visible:false,
        };
    }
    componentDidMount() {
        this.onGetSchoolBusData();
    }
    /* onGetSchoolBusData = () => {
        this.setState({ busdata: schoolbus.data, notice: schoolbus.notice});
    } */
    onGetSchoolBusData = () => {
        let url = 'http://wxmh.ahu.edu.cn/wapp/busLineApiController.do?allline';
        localStorage.setItem('code', getQueryString('code'));
        let Store = localStorage.getItem('busdata');
        if (Store) {
            Store = JSON.parse(Store);
            this.setState({ busdata: Store.data, notice: Store.notice });
            return
        }
        let responseData = async () => {
            try {
                let response = await fetch(url);
                let responseJson = await response.json();
                this.setState({ busdata: responseJson.data, notice: responseJson.notice });
                localStorage.setItem('busdata', JSON.stringify(responseJson));
            } catch (error) {
                console.error(error);
            }
        };
        responseData();
    }

    onViewList = () => {
        return this.state.busdata && this.state.busdata.map((item, i) => {
            return <Link to={{ pathname: `/site`, query: { foo: 'bar' },state: { id: item.id, start: item.start, end: item.end }}} key={i}>
                <ListItem 
                    primaryText={`${item.start}-${item.end}`} 
                    rightIcon={<HardwareKeyboardBackspace />} 
                    style={{ borderBottomWidth: 0.1, borderBottomColor: '#e5e5e5', borderBottomStyle: 'solid',backgroundColor:'#fff' }} />
            </Link>
        });
    }
    render() {
        let notice = this.state.notice&&this.state.notice.length>0?true:false;
        return (
            <div>
                <QueueAnim className="App" ease={'easeInOutElastic'} type={'left'}>
                    <img src={banner} key="logo" alt="logo" style={{ width: '100%',display: 'block' }} ref={ref => this.logo = ref} />
                    {   
                        notice
                            ? <NoticeBar mode="link" onClick={() => this.setState({ visible:true})} marqueeProps={{ loop: true, fps: 60, leading: 400, trailing: 300,style: { padding: '0 7.5px', } }}>
                                通知: {this.state.notice}.
                            </NoticeBar>
                            :null
                     }
                    <MuiThemeProvider key="list">
                        <List className="busbox">
                            {this.onViewList()}
                        </List>
                    </MuiThemeProvider>
                </QueueAnim>
                
                <Modal
                    visible={this.state.visible}
                    popup
                    onClose={()=>this.setState({visible:false })}
                    animationType="slide-up"
                >
                    <div style={{ padding: 8, textAlign: 'left', backgroundColor:'rgba(243,123,29,.9)',color:'#fff'}}>
                        {this.state.notice}
                    </div>
                </Modal>
            </div>
        );
    }
}

export default connect((state) => ({ userInfo: state.userInfo }))(Home)