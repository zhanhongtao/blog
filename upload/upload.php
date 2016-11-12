<?php

header('Content-Type: application/json');

function response($code, $msg) {
    $response = [
	    'code' => $code
	];
	if (isset($msg)) {
	    $response[$code == 0 ? 'data' : 'msg'] = $msg;
	}
    echo json_encode($response);
}

/*
    code:
	    0 => done
		1 => 缺少上传文件
		2 => 缺少指定名称(name)
*/

$key = 'pic';
define('ROOT', dirname(__FILE__));
define('UPLOAD_DIR', '/images/');

// 是否存在上传文件
if (count($_FILES) == 0) {
    return response(1);
}


// 缺少指定 name
if (!array_key_exists($key, $_FILES)) {
    return response(2);
}

// 仅支持上传一个文件.
$file = $_FILES['pic'];

if (!is_uploaded_file($file['tmp_name'])) {
    return response(3);
}

// 过滤文件类型.
$type = $file['type'];
$supportTypes = [
   'image/jpeg',
   'image/png',
   'image/gif',
   'image/vnd.wap.wbmp',
   'image/x-ms-bmp',
   'image/x-icon',
   'image/x-jng'
];

// length 为 0 表示不过滤
if (count($supportTypes) > 0) {
    // 区分大小写
    if (!in_array($type, $supportTypes, true)) {
	    return response(4);
	}
}


/*
    name -> 客户端机器文件的原文件名
	type -> mime 类型 ex: image/gif
	size -> 文件大小(单位字节)
	tmp_name -> 文件被上传后在服务端的临时文件名. 放在 php.ini 中 upload_tmp_dir 设置的路径内. 值为完整路径.
	error -> 和该文件上传相关的错误代码
	
	move_uploaded_file(String $filename, String $destnation); // 返回 boolean
	检查文件是否为通过 http post 上传的.
	is_uploaded_file(String $filename);
*/


// 生成文件名策略: md5(file).extname;
$filename = md5_file($file['tmp_name']);
$info = pathinfo($file['name']);
$extname = $info['extension'];

$relativepath = UPLOAD_DIR . $filename . '.' .$extname;

$realpath = ROOT . $relativepath;

$ret = move_uploaded_file($file['tmp_name'], $realpath);

if (!$ret) {
    return response(11);
}

$httppath = '//' . $_SERVER['SERVER_NAME'] . $relativepath;

return response(0, $httppath);

