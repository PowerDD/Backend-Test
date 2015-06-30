$(function() {

	$(document).on('click', '#btn-login', function(){
		if ( !$(this).hasClass('disabled') ) {
			if ( $.trim($('#txt-username').val()) == '' ) {
				$('#message').html( '<i class="fa fa-warning"></i> กรุณากรอกชื่อผู้ใช้ด้วยค่ะ' ).addClass('text-red').removeClass('text-light-blue');
			}
			else if ( $('#txt-password').val() == '' ) {
				$('#message').html( '<i class="fa fa-warning"></i> กรุณากรอกรหัสผ่านด้วยค่ะ' ).addClass('text-red').removeClass('text-light-blue');
			}
			else {
				$('#message').html( '<i class="fa fa-spinner fa-pulse"></i> กำลังตรวจสอบข้อมูล กรุณารอสักครู่ค่ะ' ).addClass('text-light-blue').removeClass('text-red');
				$('#btn-login, #btn-login_facebook').addClass('disabled');
			}
		}
	});

});