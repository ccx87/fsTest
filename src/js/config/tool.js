import * as config from './config';
import AES from './AES.js'

const { target } = config;
export const Tool = {};
export const Dom = {};

Tool.paramType = data => {
    let paramArr = []; 
    let paramStr = ''; 
    for (let attr in data) {
        paramArr.push(attr + '=' + data[attr]);
    }
    paramStr = paramArr.join('&');
    paramStr = '?' + paramStr;
    return paramStr
}


Tool.ajax = url => {
  return new Promise((resolve, reject) => {
    let xml = new XMLHttpRequest();
    xml.open('get',url,true);
    xml.onload = resolve;
    xml.onerror = reject;
    xml.send();
  } )
}


let timer = null;
const doc = document;
Tool.alert =  (msg, msg2, outTime) => {
    clearTimeout(timer);
    let alertText, alertDom;
    const alertInit = () => {
        const hasDom = doc.getElementById('alertTip');
        hasDom && hasDom.parentNode.removeChild(hasDom);        
        alertText = document.createElement('div');
        alertText.setAttribute('id','alertText');

        alertDom = document.createElement('div');
        alertDom.setAttribute('id','alertTip');
        alertDom.appendChild(alertText);

        document.body.appendChild(alertDom);        
    }
    alertInit();

    alertText.innerHTML = msg2 ? msg+'<div class="alert_bottom">'+msg2+'</div>' : msg;
    alertDom.style.display = 'block';
    // alertDom.onclick = () => {
    //     clearTimeout(timer);
    //     alertDom.style.display = 'none';
    // }
    outTime = outTime || 3000
    timer = setTimeout( () => {
        alertDom.style.display = 'none';
        alertDom.parentNode && alertDom.parentNode.removeChild(alertDom);   
        clearTimeout(timer);
    },outTime)
}

Tool.confirm = (msgStr, confirmStr, confirmFn, cancelStr, cancelFn) => {
    let confirmDom, confirmOpt, titleClose, btnConfirm, btnCancel;
    const confirmInit = () => {
        const hasDom = doc.getElementById('confirmTip');
        hasDom && hasDom.parentNode.removeChild(hasDom);
        let fragmentDom, fragmentContent, fragmentTitle, fragmentBtn; 
        let confirmContent, contentTitle, titleText, contentText, contentBtn;
        confirmDom = doc.createElement('div');
        confirmDom.id = 'confirmTip';
        fragmentDom = doc.createDocumentFragment();

        confirmOpt = doc.createElement('div');
        confirmOpt.classList.add('opt');

        confirmContent = doc.createElement('div');
        confirmContent.classList.add('content');
        fragmentContent = doc.createDocumentFragment();

        contentTitle = doc.createElement('p');
        contentTitle.classList.add('c-title');
        fragmentTitle = doc.createDocumentFragment();
        titleText = doc.createElement('span');
        titleText.innerText = '系统提示';
        titleClose = doc.createElement('span');
        titleClose.classList.add('c-close');
        titleClose.innerText = '×';
        fragmentTitle.appendChild(titleText);
        fragmentTitle.appendChild(titleClose);
        contentTitle.appendChild(fragmentTitle);

        contentText = doc.createElement('p');
        contentText.classList.add('c-text');
        contentText.innerText = msgStr ? msgStr : '';

        contentBtn = doc.createElement('p');
        contentBtn.classList.add('c-btn');
        fragmentBtn = doc.createDocumentFragment();
        btnConfirm = doc.createElement('button');
        btnConfirm.type = 'button';
        btnConfirm.classList.add('confirm-btn', 'btn', 'default-bg');
        btnConfirm.innerText = confirmStr ? confirmStr : '确认';
        btnCancel = doc.createElement('button');
        btnCancel.type = 'button';
        btnCancel.classList.add('cancel-btn', 'btn');
        btnCancel.innerText = cancelStr ? cancelStr : '取消';        
        fragmentBtn.appendChild(btnConfirm);
        fragmentBtn.appendChild(btnCancel);
        contentBtn.appendChild(fragmentBtn);

        fragmentContent.appendChild(contentTitle);
        fragmentContent.appendChild(contentText);
        fragmentContent.appendChild(contentBtn);
        confirmContent.appendChild(fragmentContent);

        fragmentDom.appendChild(confirmOpt);
        fragmentDom.appendChild(confirmContent);

        confirmDom.appendChild(fragmentDom);

        doc.body && doc.body.appendChild(confirmDom);
    }
    confirmInit();
    const _confirmFn = () => {
        confirmFn && confirmFn.constructor == Function && confirmFn();
    } 
    const _cancelFn = () => {
        btnConfirm && btnConfirm.removeEventListener('click', _confirmFn);
        cancelFn && cancelFn.constructor == Function && cancelFn();
        btnCancel && btnCancel.removeEventListener('click', _cancelFn);
        titleClose && titleClose.removeEventListener('click', _cancelFn);        
        confirmDom && confirmDom.parentNode.removeChild(confirmDom);  
    }
    if( btnConfirm ){
        btnConfirm.addEventListener('click', _confirmFn, false);
    }
    if( btnCancel ){
        btnCancel.addEventListener('click', _cancelFn, false);
    }
    if( titleClose ){    
        titleClose.addEventListener('click', _cancelFn, false);
    }
}


Tool.getStyle =  (o, key) => { 
    return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 
} 

Tool.nextPage = (dom,currentPage,totalPage,callback,shouldUpdata) => { //分页
    let updata = shouldUpdata;
    let page = currentPage;
    let height = 0;
    let windowHeight = window.screen.height;
    let setTop = 0;
    let Bottom = 0;
    let oldScrollTop = 0;
    let timer = null;
    dom.addEventListener('touchstart',() => {
        height = dom.offsetHeight;
        setTop = dom.offsetTop;
        Bottom = parseInt(Tool.getStyle(dom,'marginBottom'));
    },false)
    dom.addEventListener('touchmove',() => {
       loadMore();
    },false)
    dom.addEventListener('touchend',() => {
       oldScrollTop = document.body.scrollTop
        moveEnd()
    },false)
    
    let requestID;
    const moveEnd = () => {
        requestID = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd()
            }else{
                loadMore();
            }
        })
    }

    const loadMore = () => {
        if ((page < totalPage)&&(updata==true)) {
            if (document.body.scrollTop+windowHeight >= height+setTop+Bottom) {
                cancelAnimationFrame(requestID)
                page++;
                updata = false;
                callback(page);
            }
        }
    }
}

var tokenKey = "yun.zhaoyinqian.com";
Tool.setCookie = (c_name, value, expirems) => {
    value = encodeURI(value);
    value = AES.Ctr.encrypt(value + "", tokenKey, 128);
    var expire = "";
    if(expirems != null) {
        var exdate = new Date()
        var endTime = exdate.getTime()+(parseInt(expirems,10)*24*3600*1000);
        exdate.setTime(endTime);
        expire = ";expires=" + exdate.toGMTString();
    } else {
        if(!!window.ActiveXObject || "ActiveXObject" in window){    //判断是否是ie核心浏览器
            expire = ";expires=At the end of the Session";  
        }else{    
            expire = ";expires=Session";  
        }  
    }
    document.cookie=c_name+ "=" + value + expire + ";path=/"
}
Tool.getCookie =  c_name => {
    if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            var c_end = document.cookie.indexOf(";",c_start)
            if (c_end==-1)
                c_end=document.cookie.length
            var value = document.cookie.substring(c_start,c_end);

            value = AES.Ctr.decrypt(value, tokenKey, 128);
            value = decodeURI(value);
            return value;
        }
    }
    return ""
}
Tool.checkCookie = c_name => {
    var username = getCookie(c_name)
    if (username!=null && username!="") {
        return true;
    } else {
        return false;
    }
}
Tool.delCookie = c_name => {
    var exp = new Date(); 
    exp.setDate(exp.getDate()-1);
    var cval = getCookie(c_name);
    if(cval!=null) 
        document.cookie= c_name + "="+cval+";expires="+exp.toGMTString()+";path=/";
}

Tool.setLocal = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    localStorage.setItem(name, content);
}
Tool.getLocal = name => {
    if (!name) return;
    var data = localStorage.getItem(name)
    try{
        return JSON.parse(data)
    } catch (e) {
        return data
    }

}
Tool.removeLocal = name => {
    if (!name) return;
    localStorage.removeItem(name);
}
//深度克隆
Tool.cloneObj = obj => {
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //序列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? module.exports.cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
}
//去前后空格
Tool.trim = str => { 
  if( !str ) return str;
  return str.replace(/(^\s*)|(\s*$)/g, "") 
}
//获取浏览器的宽度
Tool.dimensions = () => {
    var winWidth = 0,
        winHeight = 0;  
    if (window.innerWidth){
        winWidth = window.innerWidth;
    }else if ((document.body) && (document.body.clientWidth)){
         winWidth = document.body.clientWidth;
    }               
    if (window.innerHeight){
        winHeight = window.innerHeight;
    }else if ((document.body) && (document.body.clientHeight)){
        winHeight = document.body.clientHeight;
    }
    if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth){
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    return {w: winWidth, h: winHeight};     
}
//正则
Tool.regularly = opt => {
    switch(opt){
        case 1:
        return /[ '.,:;*?~`!@\#$%^&+=\-_)(<>{}]|\]|\[|\/|\\\|\"|\|/g
    }
}
//替换
Tool.replace = (text, reg, opt) => {
    return text.replace(reg, opt)
}
//编码
Tool.encodeURI = text => {
    return encodeURI(text)
}


//获取iframe的高度
let riTimer;
Dom.reinitIframe = iframeId => {
    window.clearInterval(riTimer)
    const riFn = () => {
        const iframe = document.getElementById(iframeId);
        try{
            const bHeight = iframe.contentWindow.document.body.scrollHeight,
                  dHeight = iframe.contentWindow.document.documentElement.scrollHeight,
                  height = Math.max(bHeight, dHeight);
            iframe.height = height;
            //console.log(height);
        }catch (ex){} 
    }  
    riTimer = window.setInterval(riFn, 1000);     
}