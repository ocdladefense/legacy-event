define([],function(){
	var eventOptions = function(html,parentLineId){
		return function(resolve,reject){
			var $settings;

			$settings = {
				width:'85%',
				height:'550px',
				className: 'dialog',
				closeButton: false,
				transition: 'fade',
				opacity: 1.0
			};

			$settings.html = "<div><h1>Event Options</h1><div><em>Additional registration options:</em></div>"+html+"<div style='padding-top:5px;border-top:1px solid #eee; margin-top:30px;'><div id='closeModal' class='button'>Close</div><div class='button' id='updateRegistrationOptions'>Update Registration</div></div></div>";

			$.colorbox($settings);

			var updateAction = function(e){
		
				var entries = {};
				var opportunityLineParentId = parentLineId;//'00kQ000000B0iLyIAJ';
			
				try {	
					$entryIds = $('.product-option-checkbox .opt-Id');
					$quantities = $('.product-option-checkbox .opt-Quantity');
					$prices = $('.product-option-checkbox .opt-UnitPrice');
					$entries = $('.product-option-checkbox .opt-PricebookEntryId');

					$entryIds.each(function(index){
						$qty = $quantities.eq(index).val();
						if($qty != "0") {
							var obj = {
								Id: null,
								PricebookEntryId: null, // probably not necessary?
								UnitPrice: null,
								Quantity: null
								// description: 'Line description per Product Relation record.'
							};
							obj.Id = $(this).val();
							obj.UnitPrice = $prices.eq(index).val();
							obj.Quantity = $quantities.eq(index).val();
							obj.PricebookEntryId = $entries.eq(index).val();
							// obj.description = $descriptions.eq(index).val();
							// entries[$(this).val()] = $quantities.eq(index).val();
							entries[$entries.eq(index).val()] = obj;
						}
					});
				
					console.log('Sent RelatedProduct objects will be:');
					console.log(entries);

					var stringy = JSON.stringify(entries);

					addRelatedItems(stringy,opportunityLineParentId);
			
				} catch(e){
					alert(e);
				}
			
				$.colorbox.close();
				e.target.removeEventListener('click',this,false);
				// resolve();
			};

			var cancelAction = function(e){
				$.colorbox.close();
				// reject();
			};

			var cancel = document.getElementById('closeModal');
			var update = document.getElementById('updateRegistrationOptions');
			cancel.addEventListener('click',cancelAction,false);
			update.addEventListener('click',updateAction,false);
		};
	};



	var processEventForms = function(responseData,request,event,data) {


	/*
		var pricebookEntryId, clientId, error, message, errorType, productForms, m; 

		pricebookEntryId = responseData.pricebookEntryId || null;
		productForms = responseData.productForms; // ['morrowTableMealForm'];
	
		error = responseData.error || false;
		message = responseData.message || '';
		errorType = responseData.errorType || '';
		clientId = responseData.clientId || null;

		console.log('INSIDE PROCESS_EVENT_FORMS: responseData is:');
		console.log(responseData);

		// get the type of error
		// if more info is required before adding then display a modal
		if(error && errorType != "ClickpdxShoppingCart.ClickpdxShoppingCartInvalidFormException") {
			jQuery('.product-option-wrapper .loading').removeClass('loading');             	   
			var msg = '<h2>Woops!</h2><p>There was an error adding this item to your Cart:</p>'+message;
			modal({content:message});
			// @event currentTarget.addEventListener('click',window.addToCartButtonClick,false);
			return false;
		}

		else if(productForms && productForms.length && errorType == "ClickpdxShoppingCart.ClickpdxShoppingCartInvalidFormException") {
			var theForm = OCDLAForms.getForm(productForms[0],{pricebookEntryId:pricebookEntryId});

			// Init modal
			m = modal({content:theForm.html,  init: theForm.init, classes: [productForms[0]]});

			$('.form-action-close').click(function(e){
				if(window.confirm("Are you sure you want to Cancel?  Your changes will not be saved.")) {
					m.closeModal(e);
				} else {
					return false;
				}
			});
			$('.form-action-add-to-cart').click(function(e){
				var data = theForm.data();
				console.log('DATA IS');
				console.log(data);
				saveRegistrant(clientId,data);
				m.closeModal(e);
			});

			return false;
		}

		return false;
		*/
	};


	/**
	 * Show Related Event Products.
	 * We need to build HTML to display on the form
	 */
	var doShowProductOptions = function(responseData,request,event,data){
		console.log('Following is returned cart data for any related products:');
		console.log(responseData);

		if(responseData && responseData.relatedProducts && responseData.relatedProducts.length > 0) {
			var relatedProducts = responseData.relatedProducts;
			var relatedProductsInCart = responseData.relatedProductsInCart;
			var callingItem = responseData.item;
		
			function getExistingProduct(pricebookEntryId){
				console.log('Checking existing lines for: '+pricebookEntryId);
				for(var idx =0; idx<relatedProductsInCart.length; idx++){

					if(pricebookEntryId == relatedProductsInCart[idx].PricebookEntryId) {
						console.log('Found!');
						console.log(relatedProductsInCart[idx]);
						return relatedProductsInCart[idx].Quantity;
					}
				}
				return 0;
			}
		
	
		
			var html = '';
			for(var i = 0; i<relatedProducts.length; i++){
				var rProd = relatedProducts[i];
				var qty = getExistingProduct(rProd.PricebookEntryId);
				html += '<ul class="table-row store-product-options">';
				html += '<li class="table-cell product-option-checkbox">';
				html += '<input class="opt-Id" name="opt-Id" id="opt-Id" type="hidden" value="'+rProd.Id+'" />';
				html += '<input class="opt-UnitPrice" name="opt-UnitPrice" id="opt-UnitPrice" type="hidden" value="'+rProd.UnitPrice+'" />';
				html += '<input class="opt-PricebookEntryId" name="opt-PricebookEntryId" id="opt-PricebookEntryId" type="hidden" value="'+rProd.PricebookEntryId+'" />';
				html += '<input class="opt-Quantity" name="opt-Quantity" id="opt-Quantity" size="2" type="number" value="'+qty+'" min="0" />';
				html += '</li>';
				html += '<li class="table-cell product-option-name">'+rProd.Name+'<br /><span class="product-option-description">'+rProd.Description+'</span></li>';
				html += '<li class="table-cell product-option-price">$'+rProd.UnitPrice+'.00</li>';
				html+= '</ul>';
			}
			eventOptions(html,callingItem.ids)();
		}
	};
	
	return {
		eventOptions: eventOptions,
		processEventForms: processEventForms,
		doShowProductOptions: doShowProductOptions
	};

});