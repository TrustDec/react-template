import React, { Component } from 'react';
import workingday from '../../static/workingday.json';
import { Accordion, List, Button, Toast, ActionSheet } from 'antd-mobile';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import LocationOn from 'material-ui/svg-icons/communication/location-on';
import QueueAnim from 'rc-queue-anim';
import { getQueryString, numberConvertToUppercase, compareDate, getSpeicalTime, getCurrentTime } from '../../modular/Common'
import FromPost,{Base64} from '../../modular/Util'
String.prototype.replaceAll = function (f, e) {
    var reg = new RegExp(f, "g"); //吧f替换成e 创建正则RegExp对象   
    return this.replace(reg, e);
}

export default class Currency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: 'none',
        };
    }
    onAccordionStart = () => {
        let SHIFT = this.props.data;
        if (SHIFT) {
            let REVERSE = this.props.siteData;
            if (REVERSE.reverse && SHIFT.alongdata.length > 0) {
                return <Accordion className="my-accordion">
                {this.onAccordionView(SHIFT.alongdata)}
                </Accordion>
            }
            if (!REVERSE.reverse && SHIFT.backdata.length > 0) {
                return <Accordion className="my-accordion">
                    {this.onAccordionView(SHIFT.backdata)}
                </Accordion>
            }
        }
        return <div style={{ textAlign: 'center', fontSize: 20, color: '#aaa', marginTop: 50 }}>暂无班次</div>;
    }
    onAccordionView = data => {
        let end = data.length - 1;
        return data.map((item, index) => {
            let header = index === 0 ? '首班车' : end === index ? "末班车" : `第${numberConvertToUppercase(index)}班`;
            return <Accordion.Panel key={index} header={this.onHeaderView(header, item)}>
                <List className="my-list">
                    {this.onAccordionViewList(item.site)}
                </List>
            </Accordion.Panel>
        }); 
    }
    onAccordionViewList = site => {
        return site.map((item, index) => {
            return <List.Item key={index}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <LocationOn color="#88D8FF" style={{ width: 16, height: 16 }} />
                    <div style={{ fontSize: 15, color: '#888', marginLeft: 10 }}>
                        {site[index]}
                    </div>
                </div>
            </List.Item>
        });
    }
    onHeaderView = (header, data) => {
        let color = compareDate(data.time) ? "#55BDFF" : "#ddd";
        return <div style={{
            display: 'flex', justifyContent: 'space-between', marginRight: 10
        }}>
            <div style={{ fontSize: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 5 }} />
                <div style={{ fontSize: 15, }}>{header}</div>
            </div>
            <div style={{ display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
                <div onClick={(e)=>{
                    this.onMakeAppointment(data);
                    e.stopPropagation()
                }} style={{ width: 43, height: 19, lineHeight:'19.5px', color: '#fff', fontSize: 13, backgroundColor: color, borderRadius: 3 ,marginRight:10,textAlign:'center'}}>提醒</div>
                <div style={{ width: 43, height: 19, lineHeight: '19.5px', color: '#fff', fontSize: 13, backgroundColor: color, borderRadius: 3, textAlign: 'center' }}>
                    {data.time}
                </div>
                
            </div>
        </div>
    }
    showActionSheet = () => {
        const BUTTONS = ['5分钟', '10分钟', '15分钟', '半小时', '取消'];
        let options = {
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            message: '设置提前提醒',
            maskClosable: true,
            'data-seed': 'logId',
        }
        return new Promise(resolve => {
            ActionSheet.showActionSheetWithOptions(options, buttonIndex => {
                resolve(buttonIndex);
            });
        });
    }
    onMakeAppointment = items => {
        if (!compareDate(items.time)) {
            Toast.fail('已过预约时间', 1);
            return
        }
        const BUTTONS = [5,10,15,30,0];
        
        let siteData = this.props.siteData;
        //const CODE = getQueryString('code');
        //const CODE = `d143273d09d4549ace33c50ae016e1c4f79b37e73a671cfb48141a49e958d2682e8a0fc1315dd76387520584949545ab71f5f8844884b527c6a103d3f8551845`;
        
        const CODE = localStorage.getItem('code');
        if (!CODE) {
            Toast.fail('凭证失效 !!!', 1);
            return
        }
        //let compareDate(data.time);
        let showSheet = async (__DATE__) => {
            let YMD = getCurrentTime(__DATE__).ymd;
            let time = `${getCurrentTime(__DATE__).ymd.replaceAll('-', '/')} ${items.time}:00`;
            let num = await this.showActionSheet();
            if (BUTTONS[num] !== 0){
                Toast.loading('正在添加日程...', 1000000);
                let EarlyYMD = getSpeicalTime(BUTTONS[num], new Date(time)).hms;
                let data = JSON.stringify({mctime:YMD,mcstart:EarlyYMD,mcend:items.time,title:`${siteData.start}至${siteData.end}`,background:'green'});
               const URL = 'https://wxmh.ahu.edu.cn/wapp/scheduleApiController.do?doAdd';
                let personBase = new Base64();
                
                let base64str = personBase.encode(data);
                
                let scheduleBase = {code:CODE,scheduleBase:base64str}
                console.log(scheduleBase)
                let response = await FromPost(URL,scheduleBase);
                console.log(response)
                Toast.hide()
				if (response.flag && response.flag==="1") {
					Toast.success('添加成功', 1);
				} else {
					Toast.fail('添加失败 !!!', 1);
				}
            }
        }
        let slideIndex = this.props.siteData.slideIndex;
        let now = new Date();
        let NowDay = now.getDay();
        let nowTime = now.getTime();
        let oneDayLong = 24 * 60 * 60 * 1000;
        if (slideIndex === 1) {
            if (NowDay !== 6) {
                let MondayTime = nowTime - (NowDay - 6) * oneDayLong;
                showSheet(new Date(MondayTime))
                return
            } 
        } else if (slideIndex === 2){
            if (NowDay !== 0) {
                let SundayTime = nowTime + (7 - NowDay) * oneDayLong;
                showSheet(new Date(SundayTime));
                return
            } 
        }
        showSheet(new Date());
    }
    render() {
        return (
            <div style={{ flex: 1 }}>
                {this.onAccordionStart()}
            </div>
        );
    }
}