/**
 * 数据常量类
 * @type {Object}
 */
module.exports = {
    /**
     * 色调列表（适用于本地素材）
     */
    HUE_LIST: [
        {text:"红色", color:"#E11C12", value: 1},
        {text:"橙色", color:"#FF6C00", value: 2},
        {text:"黄色", color:"#FFC100", value: 3},
        {text:"绿色", color:"#56A813", value: 4},
        {text:"蓝色", color:"#00B7C9", value: 5},
        {text:"紫色", color:"#8A1CD2", value: 6},
        {text:"黑色", color:"#000000", value: 7},
        {text:"白色", color:"#FFFFFF", value: 8}
    ],   
    IMG_EXTENSION : "png,jpg,jpeg,gif,bmp,PNG,JPG,JPEG,GIF,BMP",
    IMG_MINI_TYPE : ".png,.jpg,.jpeg,.gif,.bmp,.PNG,.JPG,.JPEG,.GIF,.BMP",
    /*
    * 格式
    * IMG_TYPE_CONTENT 用于处理除了里面的格式外的格式。
    */
    IMG_TYPE_CONTENT: ["psd","cdr","ai","jar", "jc1", "jc8", "jcg", "jch", "jcs","eps","pdf","jpg","jpeg","png","bmp","tiff","tif"],
    JIN_CHAN: ["jar", "jc1", "jc8", "jcg", "jch", "jcs"],
    IMG_TYPE_JPG: ["jpg", "jpeg"],    
    FORMAT_TYPE: [
        {
            value : 0,
            text : "ALL",
            subText : "所有格式",
            total: 0,
            default: true
        },  
        {
            value : 1,
            text : "PSD",
            subText : "PSD",
            total: 0,
            default: false
        },
        {
            value : 2,
            text : "CDR",
            subText : "CDR",
            total: 0,
            default: false
        },
        {
            value : 3,
            text : "AI",
            subText : "AI",
            total: 0,
            default: false
        },
        {
            value : 4,
            text : "金昌",
            subText : "金昌",
            total: 0,
            default: false,
            data: ["jar", "jc1", "jc8", "jcg", "jch", "jcs"]
        },
        {
            value : 5,
            text : "EPS",
            subText : "EPS",
            total: 0,
            default: false
        },  
        {
            value : 6,
            text : "PDF",
            subText : "PDF",
            total: 0,
            default: false
        },
        {
            value : 7,
            text : "JPG",
            subText : "JPG",
            total: 0,
            default: false,
            data: ["jpg", "jpeg"]
        },
        {
            value : 8,
            text : "PNG",
            subText : "PNG",
            total: 0,
            default: false
        }, 
        {
            value : 9,
            text : "BMP",
            subText : "BMP",
            total: 0,
            default: false
        },
        {
            value : 10,
            text : "TIFF",
            subText : "TIFF",
            total: 0,
            default: false
        },
        {
            value : 11,
            text : "TIF",
            subText : "TIF",
            total: 0,
            default: false
        },        
        {
            value : 100,
            text : "其它",
            subText : "其它",
            total: 0,
            default: false
        }
    ],
    /*
     *图片用途
    */    
    FILE_USE: [
        {value:-1, text:'所有版权', total: 0, default: true},
        {value:0, text:'商用免费', total: 0, default: false},
        {value:1, text:'商用付费', total: 0, default: false},
        {value:2, text:'版权不明', total: 0, default: false}
    ],
    /*
     *图片来源
    */    
    FILE_FROM: [
        {value:0, text:'所有图像来源', total: 0, default: true},
        {value:1, text:'链图云', total: 0, default: false},
        {value:2, text:'千图网', total: 0, default: false},
        {value:3, text:'搜狗', total: 0, default: false},
        {value:4, text:'昵图网', total: 0, default: false},
        {value:5, text:'百度', total: 0, default: false},
        {value:6, text:'谷歌', total: 0, default: false},
        {value:7, text:'Tineye', total: 0, default: false}
    ],
    /*
     *网站类
    */    
    WEB_LIST: {
        google: {value: 1, keys: 1, text: 'Google', classes: 'bg g flex flex-a-c flex-j-c'},
        sogou: {value: 2, keys: 1, text: '搜狗', classes: 'bg s flex flex-a-c flex-j-c'}, 
        tineye: {value: 3, keys: 1, text: 'Tineye', classes: 'bg t flex flex-a-c flex-j-c'},
        nitu: {value: 4,keys: 1, text: '昵图网', classes: 'bg n flex flex-a-c flex-j-c'},
        wotu: {value: 5,keys: 1,text: '我图网', classes: 'bg w flex flex-a-c flex-j-c'},
        qiantu: {value: 6,keys: 1, text: '千图网', classes: 'bg q flex flex-a-c flex-j-c'},
        img360: {value: 7,keys: 1, text: '360图片', classes: 'bg img360 flex flex-a-c flex-j-c'},
        shutterstock: {value: 8,keys: 1, text: 'Shutterstock', classes: 'bg sk flex flex-a-c flex-j-c'}
    },
    /*
     *识图模式
    */
    SHITU_MODE: {
        image: 1,
        text: 2
    }
}