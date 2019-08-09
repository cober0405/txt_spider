// 引入https模块，由于我们爬取的网站采用的是https协议

// 引入cheerio模块，使用这个模块可以将爬取的网页源代码进行装载，然后使用类似jquery的语法去操作这些元素

// 在cheerio不是内置模块，需要使用包管理器下载安装

const cheerio = require('cheerio');

const fs = require('fs');

// 这里以爬取拉钩网为例

// var url = "https://www.dingdianku.com/chapter/70792_21320399.html";

let catalogUrl = "https://wap.dingdianku.com/70_70792/all.html";

// 使用https模块中的get方法，获取指定url中的网页源代码
function getCatalog(html, callback) {

    // 使用cheerio模块装载我们得到的页面源代码,返回的是一个类似于jquery中的$对象

    const $ = cheerio.load(html);
    const content = $("#content").text();
    console.log(content);

    const $catalog = $("#chapterlist").find("p");
    const result = [];

    $catalog.each((i, item) => {
        const $a = $(item).find("a");
        if ($a) {
            const obj = {
                name: $a.text(),
                url: $a.attr("href")
            };
            result.push(obj);
        }
    });

    callback(result);
}

function setJsonData(data) {
    const str = JSON.stringify(data, null, '\t');
    fs.writeFile('data.json', str, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('已输入');
        }
    })
}

function setHtml(data) {
    fs.writeFile('index.html', data, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('已输入');
        }
    })
}

function setCss(data) {
    fs.writeFile('index.css', data, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('已输入');
        }
    })
}


function setJson(name, data) {
    const json = JSON.stringify(data, null, '\t');
    fs.writeFile(`./data/${name}.json`, json, err => {
        if (err) {
            console.log(err);
        } else {
            // console.log('已输入');
        }
    })
}


function setTxt(name, data) {
    fs.writeFile(`./data/${name}.txt`, data, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('已输入');
        }
    })
}

function getContent(html, callback) {

    const $ = cheerio.load(html, {decodeEntities: false});
    // const content = $("#chaptercontent").text();
    let $content = $("#chaptercontent");
    $content.find('p').remove();
    $content.find('script').remove();
    const content = $content.html();
    console.log(content);

    callback(content);
}

function getNextPageUrl(html, callback) {

    const $ = cheerio.load(html, {decodeEntities: false});
    // const content = $("#chaptercontent").text();
    let $a = $("#pt_next");

    callback($a.attr('href'));
}

export {
    setJsonData,
    setHtml,
    getCatalog,
    setCss,
    getContent,
    setTxt,
    getNextPageUrl,
    setJson
}
