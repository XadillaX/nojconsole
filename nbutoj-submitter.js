function unicode2chr(str) {
    return unescape(str.replace(/\\/g, "%"));
}

function get_post_length(obj) {
    var querystring = require("querystring");
    var str = querystring.stringify(obj);

    return str.length;
}

function get_session_id(headers) {
    return headers["set-cookie"][0].substr(0, headers["set-cookie"][0].length - 7);
}

var spider = require("nodegrass");

var logindata = {
};
var codefilename = "code.c";
var language = 1;
var langstr = "gcc";
var probid = "1000";

var prevargv = "";
process.argv.forEach(function(val, index, array) {
    if(prevargv === "-u") logindata["username"] = val;
    if(prevargv === "-p") logindata["password"] = val;
    if(prevargv === "-f") codefilename = val;
    if(prevargv === "-l") {
        if("gcc" === val) language = 1;
        if("g++" === val) language = 2;
        if("fpc" === val) language = 4;
        langstr = val;
    }
    if(prevargv === "-i") probid = val;

    prevargv = val;
});

console.log("You are submitting [P" + probid + "] by uploading \"" + codefilename + "\" in " + langstr + ".");

var postlen = get_post_length(logindata);

var headers = {
    "content-type" : "application/x-www-form-urlencoded",
    "content-length" : postlen
};

function view_result(cookie, username) {
    var postdata = {};
    var headers = {
        "cookie" : cookie,
        "content-length" : 0
    };

    spider.post("http://acm.nbut.edu.cn/problem/status.xhtml?page=1&username=" + username, function(data, status, headers) {
        var pos = data.indexOf("<tbody>");
        pos = data.indexOf("<span style=\"color", pos);
        pos = data.indexOf(">", pos);
        var pos2 = data.indexOf("<", pos);
        var result = data.substring(pos + 1, pos2);
        console.log(result);

        if(result === "QUEUING" || result === "COMPILING" || result === "RUNNING") {
            view_result(cookie, username);
        }
    }, headers, postdata, "utf8").on("error", function(e) {
        console.log(e);
    });
}

function submit_code(cookie, code) {
    var spider = require("nodegrass");
    var postdata = {
        "language" : language,
        "id" : probid,
        "code" : code
    };
    var headers = {
        "cookie" : cookie,
        "content-type" : "application/x-www-form-urlencoded",
        "content-length" : get_post_length(postdata)
    };

    spider.post("http://acm.nbut.edu.cn/problem/submitok.xhtml", function(data, status, headers){
        var json = JSON.parse(data);
        if(json["status"] === 0) {
            console.log("Failed while submitting: " + json["info"]);
            return; 
        }

        view_result(cookie, logindata["username"]);
    }, headers, postdata, "utf8").on("error", function(e){
        console.log(e.message);
    });
}

var decoder = require("string_decoder").StringDecoder;
var d = new decoder("utf8");

spider.post("http://acm.nbut.edu.cn/user/chklogin.xhtml", function(data, status, headers){
    if(data != "1") {
        console.log("Failed while logging in: " + data);
        return;
    }

    var fs = require("fs");
    fs.readFile(codefilename, function(err, data) {
        if(err) {
            console.log("Can't open file: " + codefilename);
            return;
        }
        var code = d.write(data);
        submit_code(get_session_id(headers), code);
    });
}, headers, logindata, "utf8").on("error", function(e) {
    //console.log(e.message);
});
