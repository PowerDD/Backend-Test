$(function() {

	$(document).on('click', '#btn-login', function(){
		if ( $.trim($('#txt-username').val()) == '' ) {
			$('#message').html( 'กรุณากรอกชื่อผู้ใช้ด้วยค่ะ' ).addClass('text-red').removeClass('text-light-blue');
		}
		else if ( $('#txt-password').val() == '' ) {
			$('#message').html( 'กรุณากรอกรหัสผ่านด้วยค่ะ' ).addClass('text-red').removeClass('text-light-blue');
		}
		else {
			$('#message').html( 'กำลังตรวจสอบข้อมูล กรุณารอสักครู่ค่ะ' ).addClass('text-light-blue').removeClass('text-red');
		}
	});

});