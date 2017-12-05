import React, { Component } from 'react';
import workingday from '../../static/workingday.json';
import { Accordion, List } from 'antd-mobile';
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz';
import LocationOn from 'material-ui/svg-icons/communication/location-on';
import QueueAnim from 'rc-queue-anim';
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
export default class Currency extends Component {
    onAccordionStart = () => {
        let SHIFT = this.props.data;
        if (SHIFT) {
            let REVERSE = this.props.reverse;
            if (REVERSE && SHIFT.alongdata.length > 0) {
                return <Accordion className="my-accordion">
                {this.onAccordionView(SHIFT.alongdata)}
                </Accordion>
            }
            if (!REVERSE && SHIFT.backdata.length > 0) {
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
            return <Accordion.Panel key={index} header={this.onHeaderView(header, item.time)}>
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
    onHeaderView = (header, time) => {
        let color = compareDate(time) ? "#55BDFF" : "#ddd";
        return <div style={{
            display: 'flex', justifyContent: 'space-between', marginRight: 10
        }}>
            <div style={{ fontSize: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 5 }} />
                <div style={{ fontSize: 15, }}>{header}</div>
            </div>
            <div style={{ display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
                <div style={{ width: 43, height: 19, lineHeight: 'inherit', display: 'flex', color: '#fff', fontSize: 13,justifyContent: 'center', alignItems: 'center',backgroundColor: color,   borderRadius: 3 }}>
                   {/*  <font style={{ color: '#fff', fontSize: 13, }}>{time}</font> */}
                    {time}
                </div>
                
            </div>
        </div>
    }
    render() {
        return (
            <div style={{ flex: 1 }}>
                {this.onAccordionStart()}
            </div>
        );
    }
}