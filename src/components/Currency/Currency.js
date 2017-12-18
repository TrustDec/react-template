import React, { Component } from 'react';
import workingday from '../../static/workingday.json';
import { Accordion, List, Button, Toast, ActionSheet } from 'antd-mobile';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import LocationOn from 'material-ui/svg-icons/communication/location-on';
import QueueAnim from 'rc-queue-anim';
/*  截取url */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//- 小写数字转换成大写, 只处理到[0 ~ 99]
function numberConvertToUppercase(num) {
    num = Number(num);
    var upperCaseNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
    var length = String(num).length;
    if (length == 1) {
        return upperCaseNumber[num];
    } else if (length == 2) {
        if (num == 9) {
            return upperCaseNumber[num];
        } else if (num > 9 && num < 20) {
            return '十' + upperCaseNumber[String(num).charAt(1)];
        } else {
            return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
        }
    }
}
function compareDate(startTime) {
    let date = new Date();
    let timestamp3 = Date.parse(new Date());
    let year =date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let start = Date.parse(new Date(`${year}/${month}/${day} ${startTime}:00`));
    return (start - timestamp3) > 0;
}
function getSpeicalTime(num,_DATE_){
    var now = _DATE_;
    now.setMinutes(now.getMinutes() - num);
    return getCurrentTime(now);
}
function getCurrentTime(DATA) {
    var datetime = DATA;
    var year = datetime.getFullYear(); 
    var month = datetime.getMonth() + 1;
    if (month <= 9) {
        month = "0" + month;
    }
    var date = datetime.getDate();
    if (date <= 9) {
        date = "0" + date;
    }
    var week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[datetime.getDay()];
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    //var currentTime = this.year + "年" + this.month + "月" + this.date + "日 " + this.hour + "时" + this.minute + "分" + this.second + "秒 " + this.day;
    let _DATA = {ymd: `${year}-${month}-${date}`, hms: `${hour}:${minute}`, week: week};
    return _DATA; 

}
String.prototype.replaceAll = function (f, e) {//吧f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象   
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
        console.log(this.props)
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
                }} style={{ width: 43, height: 19, lineHeight: 'inherit', display: 'flex', color: '#fff', fontSize: 13, justifyContent: 'center', alignItems: 'center', backgroundColor: color, borderRadius: 3 ,marginRight:10}}>预约</div>
                <div style={{ width: 43, height: 19, lineHeight: 'inherit', display: 'flex', color: '#fff', fontSize: 13,justifyContent: 'center', alignItems: 'center',backgroundColor: color,   borderRadius: 3 }}>
                   {/*  <font style={{ color: '#fff', fontSize: 13, }}>{time}</font> */}
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
        const CODE = getQueryString('code');
        //const CODE = `d143273d09d4549ace33c50ae016e1c4f79b37e73a671cfb48141a49e958d2682e8a0fc1315dd76387520584949545ab71f5f8844884b527c6a103d3f8551845`;
        const URL = `http://wxmh.ahu.edu.cn/wapp/scheduleApiController.do?doAdd&code=${CODE}`;
        
        
        //let compareDate(data.time);
        let showSheet = async (__DATE__) => {
            let YMD = getCurrentTime(__DATE__).ymd;
            let time = `${getCurrentTime(__DATE__).ymd.replaceAll('-', '/')} ${items.time}:00`;
            let num = await this.showActionSheet();
            if (BUTTONS[num] !== 0){
                Toast.loading('正在添加日程...', 10);
                let EarlyYMD = getSpeicalTime(BUTTONS[num], new Date(time)).hms;
                let data = {
                    "mctime": YMD,
                    "mcstart": EarlyYMD,
                    "mcend": items.time,
                    "title": `${siteData.start}至${siteData.end}`,
                    "background": ""
                };
                const OPTION = {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                try {
                    let response = await fetch(URL, OPTION);
                    let responseJson = await response.json();
                    Toast.hide();
                    Toast.success('添加成功', 1);
                } catch (error) {
                    Toast.hide();
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