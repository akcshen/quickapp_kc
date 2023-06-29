//demo.js
var fs = require('fs');  //引入fs模块，对文件进行操作
var archiver = require('archiver'); // archiver可用于普通的打包压缩
var filePath = 'test_folder/'; //获取文件路径
var dirList = fs.readdirSync(filePath); //获取文件列表
var zipPath = 'zip_package/test_folder.zip';  //压缩包生成路径
// register format for archiver
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));
//创建最终打包文件的输出流
var output = fs.createWriteStream(zipPath);
//生成archiver对象，打包类型为zip
// create archive and specify method of encryption and password
var archive = archiver.create('zip-encrypted',
    {
        zlib: {
            level: 8,//压缩等级
        },
        encryptionMethod: 'aes256',//加密方法
        password: '123',//解压密码
    }
);
//对文件压缩,
// archive.file('test_folder/test.txt', { name: 'text.txt' });//第一个源文件,第二个生成到压缩包的文件
//对文件夹进行压缩
archive.directory(filePath, false);
archive.pipe(output); //将打包对象与输出流关联
//监听所有archive数据都写完
output.on('close', function () {
    console.log('压缩完成', archive.pointer() / 1024 / 1024 + 'M');
});
archive.on('error', function (err) {
    console.log("压缩失败!");
    throw err;
});
//打包
archive.finalize();