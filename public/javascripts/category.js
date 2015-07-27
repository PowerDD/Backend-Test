var loadProductAll = false;
var loadedCategory = false;
var loadedBrand = false;
var firstLoad = true;
var data = {};
var product;
var category = "3";
var productCode = '';

$(function() {
	
	loadProductAll();

});

function loadProductAll(){
	$.post($('#apiUrl').val()+'/product/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		type: 'all',
		value: 'all'
	}, function(data){

	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	alert('Product');
}

