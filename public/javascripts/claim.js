var json;

$(function() {	
	
	//loadData();
	loadDate();
	$(document).on('click', '.show_info', function(){
		var id = parseInt($(this).parents('tr').data('id'));
		var modal = $('#dv-info');
		modal.find('.modal-title').html( $(this).html() );
		modal.find('.mobile').html( json[id].Phone.substr(0,3)+'-'+json[id].Phone.substr(3,4)+'-'+json[id].Phone.substr(7) );
		modal.find('.time').html( json[id].TimeToContact );
		modal.find('.province').html( json[id].Province );
		modal.find('.address').html( json[id].Address );
		modal.find('.profile').html( json[id].Profile );
		modal.find('.reason').html( json[id].Reason );
		modal.find('.expect').html( json[id].Expect );
		modal.find('.comment').html( json[id].Comment );
		if (typeof json[id].PictureUrl != 'undefined') {
			for(i=0; i<=3; i++) {
				modal.find('.img'+i+' img').attr('src', 'https://res.cloudinary.com/powerdd/image/upload/v1438076463/0875665456-1.jpg');
				modal.find('.img'+i+' a').attr('href', '#');
				if (typeof json[id].PictureUrl[i] != 'undefined' && json[id].PictureUrl[i] != '') {
					modal.find('.img'+i).show().find('img').attr('src', json[id].PictureUrl[i]);
					modal.find('.img'+i).show().find('a').attr('href', json[id].PictureUrl[i]);
				}
				else {
					modal.find('.img'+i).hide();
				}
			}
		}
		else {
			for(i=0; i<=3; i++) modal.find('.img'+i).hide();
		}
	});
	
	$('.btn-submit').click(function(){
		loadData();
	});
	
	$('#table-claim_info').DataTable({
		searching: false,
		"language": {
			"search": "ค้นหา",
			"infoEmpty": "ไม่มีข้อมูล",
			"lengthMenu": "แสดง _MENU_ รายการ",
			"info":"ตั้งแต่ _START_ ถึง _END_ จาก _TOTAL_ รายการ",
			"infoFiltered": " ค้นหาจาก _MAX_ รายการ",
			"zeroRecords": "ไม่พบข้อมูลที่ค้นหา",
			"paginate": {
					 "first": "หน้าแรก",
					 "last": "หน้าสุดท้าย",
					 "next": "ถัดไป",
					 "previous": "ก่อนหน้า"
					}
			}
	});

});
function loadDate(){
	/*var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	var curr_year = d.getFullYear();
	$('.input-date').val(curr_date + "/" + curr_month + "/" + curr_year);*/
	
	$.datepicker.setDefaults( $.datepicker.regional[ "th" ] );
	$('.input-date').datepicker({
		dateFormat: "dd/mm/yy",
		onSelect: function( selectedDate ) {
            if(this.id == 'date_from'){
              var dateMin = $('#date_from').datepicker("getDate");
              var rMin = new Date(dateMin.getFullYear(), dateMin.getMonth(),dateMin.getDate()); // Min Date = Selected + 1d
              //var rMax = new Date(dateMin.getFullYear(), dateMin.getMonth(),dateMin.getDate() + 31); // Max Date = Selected + 31d
              $('#date_to').datepicker("option","minDate",rMin);
			  $('#date_to').val($('#date_from').val())
              //$('#date_to').datepicker("option","maxDate",rMax);                    
            }

        }
	}); 
}
function loadData(){
	//$('#dv-loading').show();
	//$('#dv-no_data, #dv-register_dealer').hide();
	
	var date_from = $('#date_from').val().split('/');
		date_from = date_from[2] +'-'+ date_from[1] +'-'+ date_from[0];
	var date_to = $('#date_to').val().split('/');
		date_to = date_to[2] +'-'+ date_to[1] +'-'+ date_to[0];
		
	$.post($('#apiUrl').val()+'/claim/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		id: $('#claimno').val(),
		claimdate_from: typeof $('#date_from').val() != 'undefined' && $('#date_from').val() != '' ? date_from : '',
		claimdate_to: typeof $('#date_to').val() != 'undefined' && $('#date_to').val() != '' ? date_to : '',
		status: $('.radio :checked').attr('data-status')
	}, function(data){
		$('#dv-loading').hide();
		
		moment.locale('th');

		if (data.success) {
			console.log('its okay')
			/*json = data.result;
			
			var html = '';
			for( i=0; i<json.length; i++ ) {
				var result = json[i];
				var PictureUrl = '';
				if (typeof result.PictureUrl != 'undefined') {
					for(j=0; j<=3; j++) {
						if (typeof result.PictureUrl[j] != 'undefined' && result.PictureUrl[j] != '') {
							PictureUrl += ' <i class="fa fa-photo td-image text-muted margin-left-5" data-container="body" data-toggle="popover" data-placement="top" data-content="<img src=\''+result.PictureUrl[j]+'\' width=\'100\'>"></i>';
						}
					}
				}
				
				html += '<tr data-id="'+i+'">';
				html += '<td><a href="https://24fin-api.azurewebsites.net/report/dealer/'+result.Firstname+'/'+result.Lastname+'.pdf"><i class="fa fa-file-pdf-o pointer"></i></a> <a class="show_info" href="#" data-target="#dv-info" data-toggle="modal"> คุณ'+result.Firstname+((result.Lastname != null) ? ' ' + result.Lastname : '')+
					((result.Nickname != null && result.Nickname != '') ? ' (' + result.Nickname + ')' : '')+'</a>'+ ( typeof PictureUrl != 'undefined' ? PictureUrl : '') +'</td>';			
				html += '<td>'+result.Province+'</td>';
				html += '<td>'+moment(result.RegisterDate).zone('+07:00').startOf('hour').fromNow()+'</td>';
				html += '<td>'+result.Profile+'</td>';
				html += '</tr>';
			}
			$('#dv-register_dealer tbody').html( html );			
			$('.td-image').popover({
				html: true,
				trigger: 'hover',
			});
			$('.wait').show();
			$('#dv-register_dealer').show();
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				$('#dv-register_dealer').hide();
			}
			
			$('#dv-register_dealer').DataTable({
				"language": {
					"search": "ค้นหา",
					"infoEmpty": "ไม่มีข้อมูล",
					"lengthMenu": "แสดง _MENU_ รายการ",
					"info":"ตั้งแต่ _START_ ถึง _END_ จาก _TOTAL_ รายการ",
					"infoFiltered": " ค้นหาจาก _MAX_ รายการ",
					"zeroRecords": "ไม่พบข้อมูลที่ค้นหา",
					"paginate": {
				             "first": "หน้าแรก",
							 "last": "หน้าสุดท้าย",
							 "next": "ถัดไป",
							 "previous": "ก่อนหน้า"
							}
					}
			});
			*/
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}