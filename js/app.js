$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}



globalScripts(["require","libData",
"default/modules/event/js/event",
"default/modules/event/js/actions"],function(require,libData,event,actions){

	actions.setTemplatePath("sites/default/modules/event/js/templates/registrant.html");
	
	actions.setGuestTemplatePath("sites/default/modules/event/js/templates/guest.html");
	
	event.setContainerId("registration-form");
		
	$(function(){
		event.setup();
	});
	
	var nodeDataAlgorithm = function(node){
		var data = libData.getFormData(node);
		var selectNodes = node.querySelectorAll("select[name*='eventRegistrationForm']");
		
		var pricebookEntries = selectNodes[0];
		var quantities = selectNodes[1];
		
		console.log(quantities);
		
		var pricebookEntryOptions = pricebookEntries.options;
		var quantityOptions = quantities ? quantities.options : null;
		
		
		var pricebookEntrySelected = pricebookEntries.selectedIndex;
		var quantitySelected = quantityOptions ? quantities.selectedIndex : null;
		
		
		
		data.pricebookEntryId = pricebookEntryOptions[pricebookEntrySelected].value;
		data.quantity = quantitySelected ? quantityOptions[quantitySelected].value : 1;
		
		
		data.notAttendee = data.pricebookEntryId == "01u8D000000PeYU";
		console.log("	IN NODE DATA ALGORITHM ",data);
		
		return data;
	};
	
	event.setNodeDataAlgorithm(nodeDataAlgorithm);

	
	function getLeftPosition($elem){
		var offset = $elem.offset();
		var left = offset.left;
		var top = offset.top;
		
		return left;
	}
	
	function getMain(){
		var sel = ".two-columns .main";
		return $(sel);
	}
	
	function setPosition(){
		$elem = getMain();
		var left = getLeftPosition($elem);
		$elem.css({left:left});
	}
	
	function setWidth(width){
		$elem = getMain();
		$elem.css({width:width});	
	}
	
	$(function(){
		setPosition();
		window.showTab = function(tabId){
			if(tabId=="eventRegistration"){
				setWidth("100%");
			}
			$('body').addClass(tabId);
			if(!$('#'+tabId).length) return false;
			$('.panel').removeClass('panel-active');
			$('.panel').hide();
			$('#'+tabId).addClass('panel-active');
			$('#'+tabId).show();
		}

		showTab('eventOverview');
	
		var selectedTickets = document.getElementsByClassName('pricebookEntryId');
		for(var i = 0; i<selectedTickets.length; i++){
			var selectedPbEntry = selectedTickets[i].dataset.selectedId;
			var options = selectedTickets[i].options;
			for(var idx = 0; idx < options.length; idx++){
			 if(options[idx].value == selectedPbEntry){
				options[idx].selected = true;
				break;
			 }
			}
		}

	});
});