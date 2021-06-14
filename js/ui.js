define([],function(){

	$(function(){
		$('body').append("<div id='paid-office-loader' class='paid-office-loader' style='width:300px;height:60px;position:fixed;z-index:1000;top:0px;right:0px;'>saving...</div>");
	});
	
	
	function showLoading(e,data){
		$('body').addClass('loading');
	}
	
	
	
	function showStatus(message){
		$('#paid-office-loader').html(message);
	}
	
	function hideLoading(){
		$('body').removeClass('loading');
	}
	
	function removeRegistrant(clientId){
		$('#registrant-'+clientId).slideUp(600,function(){ $(this).remove(); });
	}

	return {
		showLoading: showLoading,
		hideLoading: hideLoading,
		showStatus: showStatus,
		removeRegistrant: removeRegistrant
	};
	

			
});