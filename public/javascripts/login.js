$(function() {

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

});


function login() {
	$.post($('#apiUrl').val()+'/member/login', { shop: $('#shop').val(), apiKey: $('#authKey').val(),
		username: $.trim($('#username').val()),
		password: $('#password').val(),
	}, function(data) {
	});
}