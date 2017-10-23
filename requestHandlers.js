/**
 * Created by aaron.
 */
//执行非阻塞操作，从node来执行一个shell命令
var exec=require('child_process').exec;
var querystring=require('querystring');
var fs=require('fs');
var formidable=require('formidable');

function start(response) {
    console.log('Request handler "start" was called.');

    var body='<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="upload"/>' +
        '<br/>'+
        '<input type="submit" value="Upload file"/>'+
        '</form>' +
        '</body>'+
        '</html>';

    response.writeHead(200,{'Content-type':'text/html'});
    response.write(body);
    response.end();
}

function upload(response,request) {
    console.log('Request handler "upload " was called.');

    var form=new formidable.IncomingForm();
    form.parse(request,function (error,fields,files) {
        console.log('parsing done:<br/>'+files.upload.path);
        fs.renameSync(files.upload.path,'C:/temp/test.jpg');
        response.writeHead(200,{'Content-type':'text/html'});
        response.write('received image:<br/>');
        response.write('<img src="/show"/>');
        response.end();
    })
    /*response.writeHead(200,{'Content-type':'text/plain'});
    response.write('You`ve sent the text:'+
        querystring.parse(postData).text
    );
    response.end();*/
}

function show(response,postData) {
    console.log('Request handler "show" was called.');
    fs.readFile('C:/temp/test.jpg','binary',function (error,file) {
        if(error){
            response.writeHead(500,{'Content-type':'text/plain'});
            response.write(error+'\n');
            response.end();
        }else{
            response.writeHead(200,{'Content-type':'image/jpg'});
            response.write(file,'binary');
            response.end();
        }
    })
}

exports.start=start;
exports.upload=upload;
exports.show=show;