$(function() {
	
	$('#btn-login, #btn-login_facebook').removeClass('disabled');
	$('#username, #password, #cbx-remember').removeAttr('disabled');

	$(document).on('click', '#btn-login', function(){
		if ( !$(this).hasClass('disabled') ) {
			if ( $.trim($('#username').val()) == '' ) {
				$('#message').html( '<i class="fa fa-warning"></i> กรุณากรอกชื่อผู้ใช้ด้วยค่ะ' ).addClass('text-red').removeClass('text-light-blue');
			}
			else if ( $('#password').val() == '' ) {
				$('#message').html( '<i class="fa fa-warning"></i> กรุณากรอกรหัสผ่านด้วยค่ะ' ).addClass('text-red').removeClass('text-light-blue');
			}
			else {
				$('#message').html( '<i class="fa fa-spinner fa-pulse"></i> กำลังตรวจสอบข้อมูล กรุณารอสักครู่ค่ะ' ).addClass('text-light-blue').removeClass('text-red');
				$('#btn-login, #btn-login_facebook').addClass('disabled');
				$('#username, #password, #cbx-remember').attr('disabled', 'disabled');
				login();
			}
		}
	});

	$(document).on('keydown', '#username, #password', function(e){
		var key = e.charCode || e.keyCode || 0;
		if (key == 13) {
			$('#btn-login').click();
		}
	});

	$(document).on('click', '#btn-login_facebook', function(){

		FB.login(function(response) {
			if (response.status === 'connected') {
				FB.api('/me', function(response) {
					var facebookLogin = JSON.stringify(response);
					$.post($('#apiUrl').val()+'/member/register', {
						apiKey: $('#apiKey').val(),
						shop: $('#shop').val(),
						type: 'Facebook',
						value: facebookLogin
					}, function(data, response){
						if (data.success) {
							$.cookie('memberKey', data.memberKey);
							location.reload(true);
						}
						else{
							console.log(data.error);
						}
					}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
				});
			}
		}, {scope: 'public_profile, email'});

	});

});


function login() {
	$.post($('#apiUrl').val()+'/member/login', { shop: $('#shop').val(), apiKey: $('#apiKey').val(),
		username: $.trim($('#username').val()),
		password: $('#password').val(),
	}, function(data) {
		if (data.success) {
			$('#message').html( '<i class="fa fa-spinner fa-pulse"></i> กำลังเข้าสู่ระบบ กรุณารอสักครู่ค่ะ' ).addClass('text-light-blue').removeClass('text-red');
			$.cookie('memberKey', data.memberKey, { expires: 365, secure: true });
			window.location.reload();
		}
		else {
			$('#btn-login, #btn-login_facebook').removeClass('disabled');
			$('#username, #password, #cbx-remember').removeAttr('disabled');
			$('#message').html( '<i class="fa fa-warning"></i> ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้องค่ะ' ).addClass('text-red').removeClass('text-light-blue');
		}
	});
}


window.fbAsyncInit = function() {
FB.init({
  appId      : '339747983276',
  xfbml      : true,
  version    : 'v2.0'
});
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));