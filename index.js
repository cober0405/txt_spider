import {getDataByAxios, getDataByHttps, getDataByReq} from "./src/req";
import {getContent, getNextPageUrl, setCss, setHtml, setJsonData, setTxt} from "./src/save";

const catalogUrl = "https://wap.dingdianku.com/70_70792/all.html";
let dataJson = require('./data');
const fs = require('fs');

const TYPES = {
    req: "req",
    https: "https"
};

function reqData(type) {
    switch (type) {
        case TYPES.req:
            getDataByReq(catalogUrl, body => {
                getContent(body, content => {
                    setJsonData(content);
                });
            });
            break;
        case TYPES.https:
            getDataByHttps(catalogUrl, body => {
                getContent(body, content => {
                    setJsonData(content);
                });
            });
            break;
        default:
            let str = [];
            for (const t in TYPES) {
                str.push(t);
            }
            console.log(`请输入正确指令${str.join('|')}`);
    }
}

function deleteFirstIndex() {
    // dataJson.shift();
    console.log(dataJson);
    setJsonData(dataJson);
}

// deleteFirstIndex();

// reqData('xx');

const testUrl = [
    'http://localhost:8282/api/connectionTest',
    'https://www.beisen.com',
    'https://www.beisen.com/public/css/old/css/beisenv2.css'
];

function testReq() {
    // getDataByReq('http://localhost:8282/api/connectionTest', body => {
    //     console.log(body);
    // });

    getDataByAxios(testUrl[2]).then(body => {
        console.log(body);
        setCss(body);
    });
}

// testReq();

const txUrl = 'https://wap.dingdianku.com';


function reqTx(index, url) {
    getDataByAxios(txUrl + url).then(body => {
        getContent(body, content => {
            content = content.replace(/<br>/g, '\n').trim();
            if (/第\(1\/2\)页/.test(content)) {
                setTimeout(() => {
                    getNextPageUrl(body, nextUrl => {
                        reqTx(`${index}_2`, nextUrl);
                    });
                }, 50);
            }
            setTxt(index, content);
        });
    }).catch(reason => {
        console.log(reason);
    });
}

// for (let i = 116; i < 300; i++) {
//     const {url} = dataJson[i];
//     reqTx(i, url);
// }

// let txtStr = fs.readFileSync('./data/116.txt').toString();
// console.log(/第\(1\/2\)页/.test(txtStr));
// txtStr.replace('\r', '\n');
// console.log(txtStr);
// reqTx(118);

function reDoTx() {
    let html = fs.readFileSync('index.html').toString();
    // getContent(html, content => {
    //     content = content.replace(/<br>/g, '\n').trim();
    //     setTxt(118, content);
    // });

    getNextPageUrl(html, url => {
        console.log(url);
    })
}

// reDoTx();

// 进行下载后的处理

function mergeTxt(from, to) {
    let str = '';
    for (let index = from; index <= to; index++) {
        let txtStr = fs.readFileSync(`./data/${index}.txt`).toString();
        txtStr = txtStr.replace('天才一秒记住本站地址:(顶点中文)wap.dingdianku.com 最快更新!无广告!', '');
        let cutIndex = txtStr.indexOf('第(1/2)页') + 7;
        str += '\n' + txtStr.slice(0, cutIndex - 7) + '\n\n\t' + txtStr.substr(cutIndex, txtStr.length).trim();

        txtStr = fs.readFileSync(`./data/${index}_2.txt`).toString();
        txtStr = txtStr.replace('天才一秒记住本站地址:(顶点中文)wap.dingdianku.com 最快更新!无广告!', '')
            .replace('手机用户请浏览阅读，更优质的阅读体验。', '');
        cutIndex = txtStr.indexOf('第(2/2)页') + 7;
        str += txtStr.substr(cutIndex, txtStr.length).trim() + '\n';
    }
    return str;
}

function main() {
    setTxt('all', mergeTxt(116, 118));
    // fixDownload(287);
    // download(301, 500);
}

function fixDownload(index) {
    reqTx(index, dataJson[index].url)
}

// 此处可以下载
function download(from, to) {
    for (let j = from; j <= to; j++) {
        const {url} = dataJson[j];
        reqTx(j, url);
    }
    // let i = from;
    // let inter = setInterval(() => {
    //     if (i >= to) {
    //         clearInterval(inter);
    //     }
    //     i++;
    // }, 50);
}

main();