$(function (){
    //修改用户信息表单验证规则
    //1.从layui中获取form对象
    let form = layui.form;
    let layer = layui.layer; //提示信息

    form.verify({
        nickname:function (value){
            if(value.length > 6){
                return '昵称长度1～6字符串之间！';
            }
        }
    });

    initUserInfo();
    //初始化用户数据
    function initUserInfo(){
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function (response) {
                if(response.status !== 0){
                    return layer.msg(response.message);
                }
                //将响应数据，初始化到form表单中，使用layui中表单赋值
                form.val('userInfo',response.data); //layui表单中的快速赋值
            }
        });
    }

    //表单数据的重置
    $('#btnReset').on('click',function (e){
        e.preventDefault();//阻止表单的默认重置行为
        initUserInfo(); //调用方法重新获取数据，重新填充表单数据
    });

    //更新修改用户的基本信息
    //监听表的提交事件
    $('.layui-form').on('submit',function (e){
        e.preventDefault();//阻止表单的默认提交行为
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (response) {
                if(response.status !==0 ){
                    layer.msg(response.message)
                }
                layer.msg(response.message);
                //调用父页面中的方法，重新渲染用户的头像 和用户的信息
                window.parent.getUserInfo(); //重新渲染用户名
            }
        });
    });
});