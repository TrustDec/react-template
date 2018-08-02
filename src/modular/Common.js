/*  截取url */
export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//- 小写数字转换成大写, 只处理到[0 ~ 99]
export function numberConvertToUppercase(num) {
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
export function compareDate(startTime) {
    let date = new Date();
    let timestamp3 = Date.parse(new Date());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let start = Date.parse(new Date(`${year}/${month}/${day} ${startTime}:00`));
    return (start - timestamp3) > 0;
}
export function getSpeicalTime(num, _DATE_) {
    var now = _DATE_;
    now.setMinutes(now.getMinutes() - num);
    return getCurrentTime(now);
}
export function getCurrentTime(DATA) {
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
    let _DATA = { ymd: `${year}-${month}-${date}`, hms: `${hour}:${minute}`, week: week };
    return _DATA;

}
export const FetchGet = async (shiftID,cycle) => {
    let url = `https://wxmh.ahu.edu.cn/wapp/busOrderApiController.do?working&lineid=${shiftID}&mctime=${cycle}`;
    try {
        let response = await fetch(url);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return null;
    }
}

