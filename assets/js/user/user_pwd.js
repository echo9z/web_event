$(function (){
    //导入layui中form表单验证
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        password:[/^[\S]{6,16}$/,'密码必须6到16位，且不能出现空格'],
        newpassword:function (value){
            let oldPassword = $('.layui-form [name=oldPwd]').val();
            if(value === oldPassword){
                return '新密码与原密码一致';
            }
        },
        repassword:function (value){
            let newPassword = $('.layui-form [name=newPwd]').val();
            if(value !== newPassword){
                return '两次输入密码不一致';
            }
        }
    });

    //提交修改密码
    $('.layui-form').on('submit',function (e){
        e.preventDefault();//阻止表单默认提交事件
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (response) {
                if(response.status !== 0){
                    return layer.msg(response.message);
                }
                layer.msg(response.message);
                //重置表单
                $('.layui-form')[0].reset();//调用
            }
        });
    });
});