import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List, ListItem } from 'material-ui/List';
import { NoticeBar } from 'antd-mobile';
import HardwareKeyboardBackspace from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import '../../style/App.css';
import banner from '../../style/banner.png'
import QueueAnim from 'rc-queue-anim';
import schoolbus from '../../static/schoolbus';
import 'antd-mobile/dist/antd-mobile.css';
class Home extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            busdata: null,
            notice: "",
        };
    }
    componentDidMount() {
        this.onGetSchoolBusData();
    }
    onGetSchoolBusData = () => {
        this.setState({ busdata: schoolbus.data, notice: schoolbus.notice});
    }
    /*onGetSchoolBusData = () => {
        let url = 'http://wxmh.ahu.edu.cn/wapp/busLineApiController.do?allline';
        let Store = localStorage.getItem('buslist');
        if (Store) {
            Store = JSON.parse(Store);
            this.setState({ buslist: Store });
            return
        }
        fetch(url)
            .then((data) => data.json())
            .then((data) => {
                localStorage.setItem('buslist', JSON.stringify(data.index));
                this.setState({ buslist: data.index });
            })
            .catch((error)=>{
                console.log(error)
            });
         /*try {
            let response = await fetch(url);
            let responseJson = await response.json();
            localStorage.setItem('buslist', JSON.stringify(responseJson.index));
            console.log(this)
            this.setState({ buslist: responseJson.index });
        } catch (error) {
            console.error(error);
        } 
    }*/

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
    onPushDesPage = data => {
        
        console.log(this.props)
        //this.props.history.push({ pathname: `/Details/${data.id}`, state: { ...data } })
    }

    render() {
        let notice = this.state.notice.length>0?true:false;
        return (
            <QueueAnim className="App" ease={'easeInOutElastic'} type={'left'}>
                <img src={banner} key="logo" alt="logo" style={{ width: '100%',display: 'block' }} ref={ref => this.logo = ref} />
                { 
                    notice
                        ? <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
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
        );
    }
}

export default connect((state) => ({ userInfo: state.userInfo }))(Home)