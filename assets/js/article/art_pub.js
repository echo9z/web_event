$(function (){
    let layer = layui.layer;
    let form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor(); //执行的tinymce中的函数

    //一、定义加载文章分类的方法 动态的获取分类，进行渲染数据
    function initCate(id){
        id = id !== undefined ? id:'';
        $.ajax({
            method: "get",
            url: "/my/article/cates/"+id,
            success: function (response) {
                if(response.status !== 0){
                    return layer.msg(response.message);
                }
                console.log(response);
                if(id !== ''){
                    //模版引擎动态渲染下拉菜单
                    let strHtml = template('cateId',response);
                    console.log(strHtml);
                    $('[name=cate_id]').html(strHtml);
                    form.render();
                    return ;
                }
                //模版引擎动态渲染下拉菜单
                let strHtml = template('tpl-cate',response);
                $('[name=cate_id]').html(strHtml);
                form.render();//通知layui重新渲染表单区域的ui结构

            }
        });
    }

    //二、实现裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280, // 比例：1:1 1:5
        preview: '.img-preview' // 指定预览区域
    }
    // 3. 初始化裁剪区域
    $image.cropper(options);

    //三、为选择封面按钮 添加点击事件
    $('#btnChooseImage').on('click',function (){
        $('#coverFile').click();
    });
    //将用户选择的图片，设置到图片的裁剪区域中
    $('#coverFile').on('change',function (e){
        //e.target 选择中input文本框对象
        let files = e.target.files; //获取到文件列表的数组
        //判断用户是否选择了文件
        if(files.length === 0){
            return layer.msg('请选择文件');
        }
        //根据用户选择文件创建url地址
        let imgURL = URL.createObjectURL(files[0]);
        $image.cropper('destroy') //销毁原理image的图片地址
                .attr('src',imgURL) //重新设置图片路径
                .cropper(options); //重新初始化裁剪区域
    });


    //默认定义文章的发布状态是 已发布状态
    let art_state = '已发布';
    //当用户点击的存为草稿按钮，将art_state值改为'草稿'
    $('#btnSaveArt').on('click',function (){
        art_state = '草稿';
    });

    //为表单添加 提交事件
    $('#form-pub').on('submit',function (e){
        //1.阻止表单默认的提交行为
        e.preventDefault();
        //2.基于表单创建FormData 对象
        let formData = new FormData(this); 
        //3.将文章发布状态存储到 FormData中
        formData.append('state',art_state);
        
        //4.将裁剪后的图片，输出为文件
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            }).toBlob(function(blob) {       
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，存储到formData对象中
                formData.append('cover_img',blob);
            });
        //6.发起ajax数据请求
        publishArticle(formData);
        console.log(formData);
       /*  formData.forEach(function (val,key){
            console.log(key,val);
        }); */

    });

    //定义一个发布分章的方法
    function publishArticle(formData){
        $.ajax({
            method: "post",
            url: "/my/article/add",
            data: formData,
            //注意：如果向服务器提交的是FormData 格式的数据，必须添加两个配置项
            //不修改 Content-Type属性，使用 FormData 默认的 Content-Type 值
            contentType: false,
            //不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
            processData: false,
            success: function (response) {
                if(response.status !== 0 ){
                    return layer.msg(response.message);
                }
                layer.msg(response.message);
                //发布完成功之后，跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        });
    }
    // editArt(42712);
    //获取文章并渲染至功能
    window.editArt = function (id){
        $.ajax({
            method:'get',
            url:'/my/article/'+id,
            success: function (response) {
                if(status !== 0){
                    layer.msg(response.message);
                }
                form.val('formPub',response.data);
                console.log(response.data);
                initCate(response.data.cate_id);
                //重新渲染文章图片
                let newImgURL = 'http://api-breakingnews-web.itheima.net' + response.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options);        // 重新初始化裁剪区域
            }
        });
    }
    
});