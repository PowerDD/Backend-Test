$(function() {

	$(document).on('click', '#btn-login', function(){
		if ( $.trim($('#txt-username').val()) == '' ) {
			$('#message').html( 'กรุณากรอกชื่อผู้ใช้ หรือ เบอร์โทรฯ หรือ อีเมล ด้วยค่ะ' ).addClass('text-red').removeClass('text-success');
		}
		else if ( $('#txt-password').val() == '' ) {
			$('#message').html( 'กรุณากรอกรหัสผ่านด้วยค่ะ' ).addClass('text-red').removeClass('text-success');
		}
		else {
			$('#message').html( 'กำลังตรวจสอบข้อมูล กรุณารอสักครู่ค่ะ' ).addClass('text-success').removeClass('text-red');
		}
	});

});