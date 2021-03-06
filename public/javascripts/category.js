var loadedProduct = false;
var loadedCategory = false;
var loadedBrand = false;
var firstLoad = true;
var data = {};
var product;
var category = "3";
var productCode = '';
var newProductExp;
var canBuy = false;
var membeyTypeToBuy = [];
function renderScreen( config ) {
	if (firstLoad) {
		if (config == null) {
			$('#btn-box-view').addClass('btn-primary active').removeClass('btn-default');
			$('#cb-show_image').addClass('btn-primary active').removeClass('btn-default');
		}
		else {
			if ( config.showPicture)
				$('#cb-show_image').addClass('btn-primary active').removeClass('btn-default');
			if ( config.view == 'box' )
				$('#btn-box-view').addClass('btn-primary active').removeClass('btn-default');
			else
				$('#btn-list-view').addClass('btn-primary active').removeClass('btn-default');
			category = config.category;
		}
		loadBrand();
		loadCategory();
		firstLoad = false;

		if (device == 'desktop') {
			$('#dv-category').scrollToFixed({ marginTop: 10 });
		}
		$('#dv-cart').scrollToFixed({ marginTop: 10 });

	}
}

$(function() {
	$('.txt-qty').ForceNumericOnly();
	getShopConfig();
	loadScreenConfig();
	loadCartSummary();
	
	$(document).on('click', '#ul-category li.category', function(){
		var $obj = $(this);
		category = $obj.data('id');
		$('.brand').hide();
		$('.cat-'+category).show();
		$('.category i.fa-check-circle').removeClass('fa-check-circle').addClass('fa-chevron-circle-right');
		$('.category').removeClass('font-bold active');
		$('.category a').removeClass('text-light-blue');
		$('li.brand a').removeClass('text-red font-bold');
		$obj.addClass('font-bold').addClass('active')
			.find('i').removeClass('fa-chevron-circle-right').addClass('fa-check-circle');
		$obj.find('a').addClass('text-light-blue');

		$('#tab li').hide();
		$('#ul-category li.brand.cat-' + category).each( function(){
			$('#tab li.brand-'+$(this).data('id')).show();
		});

		$('#tab li.active').removeClass('active font-bold');
		$('#tab li.brand-').addClass('active font-bold').show();

		$('#dv-header').html( $obj.find('span').text()+' <span><small></small></span><span><small> : <b class="countItem">0</b> ' + $('#msg-items').val() + '</small></span>' );

		showProduct();
		updateMemberConfig();
	});

	$(document).on('click', '#ul-category li.brand', function(){
		$('#ul-category li.brand a').removeClass('text-red font-bold');
		$(this).find('a').addClass('text-red font-bold');
		
		$('#tab li.active').removeClass('active font-bold');
		$('#tab li.brand-'+$(this).data('id')).addClass('active font-bold');

		$('#dv-header small:eq(0)').html( '<i class="fa fa-angle-right"></i> ' + $(this).find('span').text() );

		showProduct();
	});

	$(document).on('click', '#tab li', function(){		
		$('#ul-category li.brand a').removeClass('text-red font-bold');
		$('#ul-category li.brand-' + $(this).data('id') + ' a').addClass('text-red font-bold');

		$('#tab li.active').removeClass('active font-bold');
		$('#tab li.brand-'+$(this).data('id')).addClass('active font-bold');

		if ($(this).hasClass('brand-')) {
			$('#dv-header small:eq(0)').html('');
		}
		else {
			$('#dv-header small:eq(0)').html( '<i class="fa fa-angle-right"></i> ' + $(this).find('a').text() );
		}

		showProduct();
		updateMemberConfig();

	});

	$(document).on('mouseover', '.tr-brand', function(){
		$(this).find('.btn-add_cart').show();
	});

	$(document).on('mouseout', '.tr-brand', function(){
		$(this).find('.btn-add_cart').hide();
	});

	$(document).on('mouseover', '.dv-thumb', function(){
		$(this).find('.btn-add_cart_box').show();
	});

	$(document).on('mouseout', '.dv-thumb', function(){
		$(this).find('.btn-add_cart_box').hide();
	});

	$(document).on('click', '#cb-show_image', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			$('.td-thumb, .dv-thumb').hide();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			$('.td-thumb, .dv-thumb').show();
		}
		updateMemberConfig();
	});

	$(document).on('click', '#btn-list-view', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			$('#btn-box-view').addClass('active btn-primary').removeClass('btn-default');
			$('#dv-box').show();
			$('.table-responsive').hide();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			$('#btn-box-view').removeClass('active btn-primary').addClass('btn-default');
			$('.table-responsive').show();
			$('#dv-box').hide();
		}
		updateMemberConfig();
	});

	$(document).on('click', '#btn-box-view', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			$('#btn-list-view').addClass('active btn-primary').removeClass('btn-default');
			$('.table-responsive').show();
			$('#dv-box').hide();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			$('#btn-list-view').removeClass('active btn-primary').addClass('btn-default');
			$('#dv-box').show();
			$('.table-responsive').hide();
		}
		updateMemberConfig();
	});

	$(document).on('keyup', '#txt-search', function(){
		searchProduct();
	});

	$(document).on('click', '.btn-add_cart, .btn-add_cart_box', function(){
		productCode = $(this).parents('.product-row').data('id');
	});

	$(document).on('click', '.img-product', function(){
		productCode = $(this).data('id');
	});

	$(document).on('click', '.zoom', function(){
		var $obj = $(this).parents('.product-row');
		if ( $('#sku-'+$obj.find('.sku').text()).attr('data-image') == '' && $(this).attr('src').indexOf('Logo') == -1) {
			loadProductImage($('#shop').val(), $obj.find('.sku').text());
		}
		else {
			showProductImage($obj.find('.sku').text());
		}
		//productCode = $(this).parents('.product-row').data('id');
	});

	$(document).on('click', '.btn-save', function(){
		var qty = 0;
		try {
			qty = parseInt( $(this).parents('.input-group').find('.txt-qty').val() )
		}
		catch(err) {
		}
		if (qty > 0) {
			$.post($('#apiUrl').val()+'/cart/update', {
				apiKey: $('#apiKey').val(),
				shop: $('#shop').val(),
				memberKey: $.cookie('memberKey'),
				product: productCode,
				quantity: qty
			}, function(data){
					if (data.success) {							
						if (data.totalItem > 0){
							$('#items').html( numberWithCommas(data.totalItem) );
							$('#pieces').html( numberWithCommas(data.totalQty) );
							$('#totalPrice').html( numberWithCommas(data.totalPrice) );
							$('.sp-no_item').hide();
							$('.sp-has_item').show();
							$('#menu-cart .badge').addClass('bg-red').html( numberWithCommas(data.totalItem) ).show();
						}

						/*if (data.result[0].remain == 0) {
							$('.btn-product-'+data.result[0].product).remove();
							$('.no-stock-'+data.result[0].product).show();
						}*/

						
					}

					$('#dv-cart').css('background', '#ffcc99');
					setTimeout(function(){
						$('#dv-cart').stop().css('background', 'white');
					}, 1000);

			}, 'json');
		}
		$('#dv-add_cart').modal('hide');
		$('#dv-view_image').modal('hide');
	});

	$('#dv-view_image').on('hidden.bs.modal', function (e) {
		$('#dv-view_image .carousel-indicators, #dv-view_image .carousel-inner').html('');
		$('#carousel-product').removeClass('carousel').removeClass('slide');
	});

});

function loadCategory(){
	$.post($('#apiUrl').val()+'/product/category_brand', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		type: 'all',
		value: 'all'
	}, function(data){
		for( i=0; i< data.result.length; i++ ) {
		var result = data.result[i];
		var htmlBrand = '';
		if (result.brand != undefined)
		{
			for( j=0; j< result.brand.length; j++ ) {
				var brand = result.brand[j];
				htmlBrand += '<li class="brand hidden cat-' + parseInt(result.category) + ' brand-' + parseInt(brand.id) + '" data-id="' + parseInt(brand.id) + '"><a href="javascript:void(0)" class="padding-left-30"><i class="fa fa-caret-right"></i> <span>' + brand.name + '</span></a></li>';
			}
		}
		$('#ul-category').append('<li class="category" data-id="' + parseInt(result.category) + '"><a href="javascript:void(0)"><i class="fa fa-chevron-circle-right"></i> <span>' + result.name + '</span></a>' + ((htmlBrand != '') ? htmlBrand : '') + '</li>');
	}
	$('.hidden').removeClass('hidden').hide();
	loadedCategory = true;
		if (loadedCategory && loadedBrand) loadProduct();
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}
	
function loadBrand(){
	$.post($('#apiUrl').val()+'/brand/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val()
	}, function(data){
		for( i=0; i < data.result.length; i++ ) {
			var result = data.result[i];
			$('#tab').append('<li class="brand-' + parseInt(result.ID) + ' hidden" data-id="' + parseInt(result.ID) + '"><a href="javascript:void(0)">' + result.Name + '</a></li>')
		}
		$('.hidden').removeClass('hidden').hide();
		loadedBrand = true;
			if (loadedCategory && loadedBrand) loadProduct();
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });	
}

function loadProduct(){
	$.post($('#apiUrl').val()+'/product/all', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		memberKey: $.cookie('memberKey')
	}, function(data){
			if (data.success) {
				data.product = data.result;
				// Category And Brand //
				var categoryArrey = [];
				var brandArrey = [];
				for( i=0; i< data.result.length; i++ ) {
					var infoCat = {};
					var infoBrand = {};
					infoCat['CategotyId'] = data.result[i].CategoryId;
					infoCat['CategotyName'] = data.result[i].Category;
					infoCat['CategoryPriority'] = data.result[i].CategoryPriority;
					
					infoBrand['BrandId'] = data.result[i].BrandId;
					infoBrand['BrandName'] = data.result[i].Brand;
					infoBrand['BrandPriority'] = data.result[i].BrandPriority;
					categoryArrey.push(infoCat);		
					brandArrey.push(infoBrand);
				}					
				renderProduct(data);
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}
function loadCartSummary(){
	$.post($('#apiUrl').val()+'/cart/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		memberKey: $.cookie('memberKey')
	}, function(data){
			if (data.success) {
				if (data.summary.Item > 0){
					$('#items').html( numberWithCommas(data.summary.Item) );
					$('#pieces').html( numberWithCommas(data.summary.Qty) );
					$('#totalPrice').html( numberWithCommas(data.summary.Price) );
					$('.sp-no_item').hide();
					$('.sp-has_item').show();
				}
				
			}
	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function renderProduct(data){
	var html = '';
	var html2 = '';
	for(i=0; i < data.product.length; i++) {		
		result = data.product[i];
		var BrandId = parseInt(result.BrandId);
		var categoryId = parseInt(result.CategoryId);
		var addDate = moment(result.AddDate).add(3600*7, 'seconds').startOf('day');
		var now = moment().startOf('day');				
		var isNew = now.diff(addDate, 'days', true);
				
		html += '<tr data-id="' + result.ID + '" id="sku-' + result.ID + '" data-image="" class="product-row tr-cat-' + categoryId + ' tr-brand-'+BrandId+' tr-brand hidden font-normal">';
		html += '<td class="td-thumb padding-left-0"><img data-id="' + result.ID + '" class="img-product img-thumbnail lazy'+((result.CoverImage != null) ? ' zoom" data-target="#dv-view_image" data-toggle="modal"' : '"')+' data-original="' + ((result.CoverImage != null) ? result.CoverImage : 'https://cdn24fin.blob.core.windows.net/img/products/1/Logo/1_s.jpg') + '" src="https://cdn24fin.blob.core.windows.net/img/products/1/Logo/1_s.jpg" width="100"></td>';
		html += '<td><span class="text-'+((isNew <= newProductExp) ? 'red' : 'light-blue')+' font-bold name">' + result.Name + '</span>';
		html += (isNew <= newProductExp) ? ' <img src="/images/icons/new.gif">' : '';
		html += '<br>';
		html += (result.ID != null) ? 'SKU : <b class="sku">' + result.ID + '</b>' : '';
		html += (result.Warranty != 0) ? ' &nbsp; ' + $('#msg-warranty').val() + ' : <b>' + ((result.Warranty == 365) ? '1 '+$('#msg-year').val() : ((result.Warranty >= 30) ? (result.Warranty/30)+ ' ' + $('#msg-month').val() : result.Warranty + ' ' +$('#msg-day').val())) + '</b>' : '';
		html += '<br>';
		if ((canBuy == true) && result.HasStock == 1) {
			html += '<button class="btn-product-' + result.ID + ' btn-add_cart btn btn-sm btn-warning' + ((device == 'desktop') ? ' hidden' : '') + '" data-target="#dv-add_cart" data-toggle="modal">' + $('#msg-orderNow').val() + '</button>';
		}
		html += '<span class="no-stock-' + result.ID + ' font-sm text-no_stock text-red font-bold' + ((result.HasStock == 1) ? ' hidden' : '') + '"><i class="fa fa-warning"></i> ' + $('#msg-outOfStock').val() + '</span>';

		if ( result.OnCart != undefined ) {
			if ( result.OnCart > 0 || result.OnOrder > 0 ) {
				html += '<br><span class="font-sm text-muted"><span' + ((result.OnCart != 0) ? ' class="text-red"' : '') + '>' + $('#msg-itemOnCart').val() + ' : <b>' + result.OnCart + '</b></span> / <span' + ((result.OnOrder != 0) ? ' class="text-red"' : '') + '>' + $('#msg-onOrder').val() + ' : <b' + ((result.OnOrder != 0) ? ' class="font-bigger text-red"' : '') + '>' + result.OnOrder + '</b></span></span>';
			}
		}

		html += '</td>';
		if ( result.Stock != undefined ) {
			$('#tb-result thead .stock').show();
			html += '<td class="text-right font-bigger text-yellow">' + ((result.Stock > 0) ? numberWithCommas(result.Stock) : '-' )+ '</td>';
		}

		html += '<td class="text-right font-bigger font-bold text-green">' + numberWithCommas(result.Price) + '</td>';

		if ( result.wholesalePrice != undefined ) {
			$('#tb-result thead .wholesalePrice').show();
			html += '<td class="text-right font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice) + '</td>';
		}
		if ( result.wholesalePrice1 != undefined ) {
			$('#tb-result thead .wholesalePrice1').show();
			html += '<td class="text-right"><span class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice1) + 
				'</span> <i class="fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.Qty1 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.IsSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i></td>';
		}
		if ( result.wholesalePrice2 != undefined ) {
			$('#tb-result thead .wholesalePrice2').show();
			html += '<td class="text-right"><span class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice2) + 
				'</span> <i class="fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.Qty2 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.IsSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i></td>';
		}

		if ( result.Price1 != undefined ) {
			$('#tb-result thead .Price1').show();
			html += '<td class="text-right font-bigger">' + numberWithCommas(result.Price1) + '</td>';
		}
		if ( result.Price2 != undefined ) {
			$('#tb-result thead .Price2').show();
			html += '<td class="text-right font-bigger">' + numberWithCommas(result.Price2) + '</td>';
		}
		if ( result.Price3 != undefined ) {
			$('#tb-result thead .Price3').show();
			html += '<td class="text-right font-bigger' + (($('#role').val() == 'Sale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.Price3) + '</td>';
		}
		if ( result.Price4 != undefined ) {
			$('#tb-result thead .Price4').show();
			html += '<td class="text-right font-bigger' + (($('#role').val() == 'HeadSale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.Price4) + '</td>';
		}
		if ( result.Price5 != undefined ) {
			$('#tb-result thead .Price5').show();
			html += '<td class="text-right font-bigger' + (($('#role').val() == 'Manager') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.Price5) + '</td>';
		}
		html += '</tr>';

		html2 += '<div data-id="' + result.ID + '" class="product-row col-xs-12 col-sm-6 col-md-4 col-lg-4 margin-bottom-15 dv-cat-' + categoryId + ' dv-brand-'+BrandId+' dv-brand hidden">';
		html2 += '<div class="dv-box well well_thin well_white">';
		html2 += '<div class="dv-thumb margin-bottom-5 padding-top-5 text-center">';
		html2 += '<img data-id="' + result.ID + '" class="img-product lazy img-responsive img-rounded'+((result.CoverImage != null) ? ' zoom" data-target="#dv-view_image" data-toggle="modal"' : '"')+' data-original="' + ((result.CoverImage != null) ? result.CoverImage : 'https://cdn24fin.blob.core.windows.net/img/products/1/Logo/1_m.jpg') + '" src="https://cdn24fin.blob.core.windows.net/img/products/1/Logo/1_m.jpg">';
		
		if (canBuy == true && result.HasStock == 1) {
			html2 += '<button class="btn-product-' + result.ID + ' btn-add_cart_box btn btn-warning btn-sm btn-center hidden" data-toggle="modal" data-target="#dv-add_cart">' + $('#msg-orderNow').val() + '</button>';
		}
		html2 += '<span class="no-stock-' + result.ID + ' btn-center text-no_stock text-red font-bold' + ((result.HasStock == 1) ? ' hidden' : '') + '" style="text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;"><i class="fa fa-warning"></i> ' + $('#msg-outOfStock').val() + '</span>';

		if ( canBuy == true  ) {
		}
		html2 += '</div>';
		html2 += '<div><small class="pull-left text-muted">SKU : <b class="sku">'+result.ID+'</b>';
		html2 += ((isNew <= newProductExp) ? ' <img class="img-up" src="/images/icons/new.gif">' : '') + '</small>';
		html2 += (result.Warranty != 0) ? '<small class="pull-right text-muted">' + $('#msg-warranty').val() + ' <b>' + ((result.Warranty == 365) ? '1 '+$('#msg-year').val() : ((result.Warranty >= 30) ? (result.Warranty/30)+ ' ' + $('#msg-month').val() : result.Warranty + ' ' +$('#msg-day').val())) + '</b></small>' : '';
		html2 += '<div class="clearfix"></div><div class="text-'+((isNew <= newProductExp) ? 'red' : 'light-blue')+' font-bold name" style="min-height:48px">' + result.Name;
		html2 += '</div><div class="line"></div>';
		
		if ( result.wholesalePrice1 == undefined ) {
			html2 += '<div class="pull-left font-sm">' + $('#msg-retailPrice').val() + ' : <b class="font-bigger font-bold text-green">' + numberWithCommas(result.Price) + '</b></div>';
		}

		if ( result.wholesalePrice != undefined ) {
			html2 += '<div class="pull-right font-sm">' + $('#msg-wholesalePrice').val() + ' : <b class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice) + '</b></div>';
		}

		if ( result.wholesalePrice1 != undefined ) {
			html2 += '<div class="pull-left font-sm">' + $('#msg-price').val() + ' : <b class="font-bigger font-bold text-green">' + numberWithCommas(result.Price) + '</b></div>';
			html2 += '<div class="pull-right font-sm"><b class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice1) + '</b> <i class="img-up fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.Qty1 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.IsSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i> / <b class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice2) + '</b> <i class="img-up fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.Qty2 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.IsSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i></div>';
		}

		if ( result.Price1 != undefined ) {
			html2 += '<div class="pull-right font-sm">' + $('#msg-remain').val() + ' : <b class="font-bigger text-yellow">' + numberWithCommas(result.Stock) + '</b></div>';
			html2 += '<div class="clearfix"></div><div class="font-sm">' + $('#msg-wholesalePrice').val() + ' : <span class="font-bigger">' + numberWithCommas(result.Price1) + '</span>';
		}
		if ( result.Price2 != undefined ) {
			html2 += ' / <span class="font-bigger">' + numberWithCommas(result.Price2) + '</span>';
		}
		if ( result.Price3 != undefined ) {
			html2 += ' / <span class="font-bigger' + (($('#role').val() == 'Sale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.Price3) + '</span>' + (($('#role').val() == 'Sale') ? '</div>' : '') + '';
		}
		if ( result.Price4 != undefined ) {
			html2 += ' / <span class="font-bigger' + (($('#role').val() == 'HeadSale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.Price4) + '</span>' + (($('#role').val() == 'HeadSale') ? '</div>' : '') + '';
		}
		if ( result.Price5 != undefined ) {
			html2 += ' / <span class="font-bigger' + (($('#role').val() == 'Manager') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.Price5) + '</span>' + (($('#role').val() == 'Manager') ? '</div>' : '') + '';
		}

		if ( result.OnCart != undefined ) {
			if ( result.OnCart > 0 || result.OnOrder > 0 ) {
				html2 += '<div class="font-sm text-muted"><span' + ((result.OnCart != 0) ? ' class="text-red"' : '') + '>' + $('#msg-itemOnCart').val() + ' : <b>' + result.OnCart + '</b></span> / <span' + ((result.OnOrder != 0) ? ' class="text-red"' : '') + '>' + $('#msg-onOrder').val() + ' : <b' + ((result.OnOrder != 0) ? ' class="font-bigger text-red"' : '') + '>' + result.OnOrder + '</b></span></div>';
			}
		}
		
		html2 += '<div class="clearfix"></div>';
		html2 += '</div></div></div></div>';

	}
	$('#tb-result tbody').html(html);
	$('#dv-box').html(html2);
	$('.hidden').removeClass('hidden').hide();
	$('.wait').show();
	$('#dv-loading').hide();
	
	$('img.lazy').lazyload({
		effect : "fadeIn",
		event: "scrollstop"
	});
	
	if ($('#cb-show_image').hasClass('active')) {
		$('.td-thumb, .dv-thumb').show();
	}
	else {
		$('.td-thumb, .dv-thumb').hide();
	}
	
	$('#ul-category li.category[data-id='+categoryId+']').click();

	//showProduct();
}

function showProduct() {

	$('#txt-search').val('');
	$('.tr-brand').hide();
	$('.dv-brand').hide();
	category = $('#ul-category .category.active').data('id');
	var $obj;
	
	if ( $('#tab .active').hasClass('brand-') ) {
		$obj = $('.tr-cat-'+category+'.tr-brand');
		$('.tr-cat-'+category+'.tr-brand').show().find('.show-tooltip').tooltip({container: 'body'});
		$('.dv-cat-'+category+'.dv-brand').show().find('.show-tooltip').tooltip({container: 'body'});
	}
	else {
		$obj = $('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id'))
		$('.tr-cat-'+category+'.tr-brand').hide();
		$('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id')).show();
		$('.dv-cat-'+category+'.dv-brand').hide();
		$('.dv-cat-'+category+'.dv-brand-'+$('#tab .active').data('id')).show();
	}
	$('.countItem').html( $obj.length );

	if ( $('#btn-list-view').hasClass('active') ) {
		$('#dv-box').hide();
		$('.table-responsive').show();
	}
	else {
		$('#dv-box').show();
		$('.table-responsive').hide();
	}

}

function updateMemberConfig() {
	/*updateScreenConfig('{' +
		'"category": "' + category + '"' +
		', "showPicture": '+($('#cb-show_image').hasClass('active') ? 'true' : 'false')+
		', "view": "' + ($('#btn-box-view').hasClass('active') ? 'box' : 'list') + '"' +
		'}');*/
}

function searchProduct() {
	var key = $.trim($('#txt-search').val()).toLowerCase();
	if ( key.length > 0 ) {
		var $tr;
		var $div;
		if ( $('#tab .active').hasClass('brand-') ) {
			$tr = $('.tr-cat-'+category+'.tr-brand');
			$div = $('.dv-cat-'+category+'.dv-brand');
		}
		else {
			$tr = $('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id'));
			$div = $('.dv-cat-'+category+'.dv-brand-'+$('#tab .active').data('id'));
		}

		$('.tr-show').removeClass('tr-show');
		$tr.each(function(){
			var $obj = $(this);
			if ( $obj.find('.name').html().toLowerCase().indexOf(key) >= 0 || $obj.find('.sku').html().toLowerCase().indexOf(key) >= 0 )
				$obj.addClass('tr-show').show();
			else
				$obj.hide();
		});
		$('.countItem').html( $('.tr-show').length );

		$div.each(function(){
			var $obj = $(this);
			if ( $obj.find('.name').html().toLowerCase().indexOf(key) >= 0 || $obj.find('.sku').html().toLowerCase().indexOf(key) >= 0 )
				$obj.show();
			else
				$obj.hide();
		});

	}
	else {
		if ( $('#tab .active').hasClass('brand-') ) {
			$obj = $('.tr-cat-'+category+'.tr-brand');
			$('.tr-cat-'+category+'.tr-brand').show();
			$('.dv-cat-'+category+'.dv-brand').show();
		}
		else {
			$obj = $('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id'))
			$('.tr-cat-'+category+'.tr-brand').hide();
			$('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id')).show();
			$('.dv-cat-'+category+'.dv-brand').hide();
			$('.dv-cat-'+category+'.dv-brand-'+$('#tab .active').data('id')).show();
		}
		$('.countItem').html( $obj.length );
	}
}

function loadProductImage(shop, sku){
	$.post($('#apiUrl').val()+'/product/info', {
		apiKey: $('#apiKey').val(),
		shop: shop,
		type: 'item',
		value: sku
	}, function(data){
			if (data.success) {
				var imgName = data.result.CoverImage.split('/').pop();
				var imgPath = data.result.CoverImage;
				var cut = imgPath.lastIndexOf('/') +1;
				imgPath =  imgPath.substring(0,cut);
				$('#sku-'+sku).attr('data-image', imgName);
				$('#sku-'+sku).attr('data-image_location', imgPath);
				showProductImage(sku);				
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function showProductImage(sku){
	var sp = $('#sku-'+sku).attr('data-image').split(',');

	$('#dv-view_image .carousel-indicators, #dv-view_image .carousel-inner').html('');
	for(i=0, idx=0; i<sp.length; i++) {
		if ( sp[i].indexOf('_l.') != -1 ){
			$('#dv-view_image .carousel-indicators').append( '<li data-target="#carousel-product" data-slide-to="'+idx+'" class="'+((idx==0) ? 'active' : '')+'"></li>' );
			$('#dv-view_image .carousel-inner').append('<div class="item'+((idx==0) ? ' active' : '')+'"><img src="' + $('#sku-'+sku).attr('data-image_location')+sp[i].trim() + '" alt="..."><div class="carousel-caption"><h3>'+$('#sku-'+sku).find('span.name').html()+'</h3></div></div>' );
			idx++;
		}
	}
	if ( $('#dv-view_image .carousel-indicators li').length > 1) {
		$('#dv-view_image .carousel-control, #dv-view_image .carousel-indicators').show();
	}
	else {
		$('#dv-view_image .carousel-control, #dv-view_image .carousel-indicators').hide();
	}
	if ( !$('#carousel-product').hasClass('carousel') ) {
		$('#carousel-product').addClass('carousel').addClass('slide').attr('data-ride', 'carousel');
	}

	if ( $('#sku-'+sku).find('.btn-add_cart').length > 0 )
		$('#dv-view_image .modal-footer .input-group').show();
	else
		$('#dv-view_image .modal-footer .input-group').hide();


	$('.carousel').carousel();
}

function getShopConfig(){
	try{
		$.post($('#apiUrl').val()+'/shop-config/info', {
			apiKey: $('#apiKey').val(),
			shop: $('#shop').val()
		}, function(data){
				if (data.success) {
					data.shopConfig = data.config;
					
					if (typeof data.shopConfig.NewProductExpire.Value != 'undefined' && data.shopConfig.NewProductExpire.Value != ''){
						newProductExp = data.shopConfig.NewProductExpire.Value;
					}					
					if (typeof data.shopConfig.MemberTypeToBuy.Value != 'undefined' && data.shopConfig.MemberTypeToBuy.Value != ''){
						membeyTypeToBuy = data.shopConfig.MemberTypeToBuy.Value;
					}
				}
				for(i=0; i<membeyTypeToBuy.length; i++ ){
					if($('#role').val() == membeyTypeToBuy[i]){
						canBuy = true;
					}
				}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	}catch(error){
		console.log(error);
	}
}


function orderJsonString(prop) {
   return function(a,b){
	  if( a[prop] > b[prop]){
		  return 1;
	  }else if( a[prop] < b[prop] ){
		  return -1;
	  }
	  return 0;
   }
}

function orderJsonInt(prop) {
   return function(a,b){
	  if( parseInt(a[prop]) > parseInt(b[prop])){
		  return 1;
	  }else if( parseInt(a[prop]) < parseInt(b[prop]) ){
		  return -1;
	  }
	  return 0;
   }
}