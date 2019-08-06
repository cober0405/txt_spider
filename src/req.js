const request = require('request');
const https = require('https');
import {userAgents} from "./userAgents";
import axios from "axios";


function getDataByReq(url, callback) {
    let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
    request(url, {
        'User-Agent': userAgent
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(body);
        } else {
            console.log(error);
        }
    });
}


function getDataByHttps(url, callback) {
    let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
    https.get(url, function (res) {

        let html = '';

        // 每当我们从指定的url中得到数据的时候,就会触发res的data事件,事件中的chunk是每次得到的数据,data事件会触发多次,因为一个网页的源代码并不是一次性就可以下完的

        res.on("data", function (chunk) {

            html += chunk;

        });

        // 当网页的源代码下载完成后, 就会触发end事件

        res.on("end", function () {

            //这里我们对下载的源代码进行一些处理

            callback(html);


        });

    });
}

function getDataByAxios(targetUrl, params) {
    const headers = {
        'user-agent': userAgents[parseInt(Math.random() * userAgents.length)],
        'connection': 'keep-alive',
        'cache-control': 'max-age=0'
    };
    return axios.get(targetUrl, {
        params,
        headers
    }).then(res => {
        // console.log('res', res);
        return res.data;
    }).catch(error => {
        console.log(error);
    });
}

export {
    getDataByHttps,
    getDataByReq,
    getDataByAxios
}