$(function (){
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options);

    //用户点击上传按钮，触发input文件上传按钮
    $('#btnChooseImage').on('click',function (){
        $('#file').click();
    });

    //为file上传文件发送改变，注册change事件，当input发送改变执行回调函数
    $('#file').on('change',function (e){
        let filesList = e.target.files;
        if(filesList.length === 0){
            return layer.msg('请选择图片');
        }
        //获取用户选择的文件
        let file = e.target.files[0];
        //根据用户选择文件创建url地址
        let imgURL = URL.createObjectURL(file);
        $image.cropper('destroy') //销毁原理image的图片地址
                .attr('src',imgURL) //重新设置图片路径
                .cropper(options); //重新初始化裁剪区域
    });

    //确定按钮注册点击事件，将的裁剪区域的100*100图片 或 50*50 图片上传至服务器
    $('#btnUpload').on('click',function (){
        //1.获取用户裁剪之后的头像
        //将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas画布上的内容，转化为 base64 格式的字符串
        console.log(dataURL);
        //2.调用接口，把头像上传服务器
        $.ajax({
            method: "post",
            url: "/my/update/avatar",
            data: {avatar:dataURL},  //请求体 为base64格式图片
            success: function (response) {
                if(response.status !== 0){
                    layer.msg(response.message);
                }
                layer.msg(response.message);
                window.parent.getUserInfo(); //重新渲染用户头像
            }
        });
    });

});