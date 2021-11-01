define(["libData",
"default/modules/event/js/actions",
"default/modules/event/js/ui"],function(libData,actions,ui){

	var containerId;

	function setup(){
		var members = document.getElementById(containerId);
		if(!members){
			console.log("WARNING: container not found.");
		} else {
			containers = members.getElementsByTagName("ul");
			document.addEventListener("click",doAction,true);
		}
	}

	var containers;

	var nodeDataAlgorithm;
	
	var setNodeDataAlgorithm = function(fn){
		nodeDataAlgorithm = fn;
	};

	var getParentNode = function(node){
		for(var i = 0; i<containers.length; i++){
			if(containers[i] == node || containers[i].contains(node)) {
				return containers[i];
			}
		}
		return null;
	};
	
	var doAction = function(e){

		var target = e.target;
		
		var action = (target.dataset && target.dataset.action) || null;
		
		if(null == action) {
			return false;
		}
		
		var approvedActions = ["save","remove","new","new-guest","close-registration"];
		
		if(approvedActions.indexOf(action) == -1){
			return false;
		}
		

		e.stopPropagation();
		e.preventDefault();
		
		ui.showLoading();

		

		
		try {
		
			if(!!window.activeSave){
				window.clearTimeout(window.activeSave);
			}

			if("close-registration" == action){
				window.location.reload();
			} else if("save"==action){
				ui.showStatus("Saving...");
				if(window.activeSaveRequest){
					throw new Error("Please wait for the previous save to complete.");
				}
				window.activeSaveRequest = true;
				var node = getParentNode(target);
				if(null == node) {
					throw new Error("Could not locate the parent node for this member.");
				}
	
				var data = nodeDataAlgorithm(node);
				
				console.log("Data from node is: "+data);
				
				actions.saveRegistrant(data).then(function(data){

					// cart.refreshCartComplete(data);
					ui.showStatus('Member saved.');
					var item = data.affectedItems[0];
					actions.setRegistrantOpportunityLineItemId(item.clientId,item.opportunityLineItemId);
					window.activeSave = window.setTimeout(ui.hideLoading,750);
					window.activeSaveRequest = false;
				})
				.catch(function(ex){
					console.log(ex);
					window.activeSaveRequest = false;
					ui.hideLoading();
				});
				
				
			} else if("remove" == action){
				ui.showStatus("Removing...");
				var node = getParentNode(target);
				if(null == node) return false;
	
				var data = nodeDataAlgorithm(node);
				
				if(!data.opportunityLineItemId){
					ui.removeRegistrant(data.clientId);
					window.setTimeout(ui.hideLoading,1200);
					return false;
				}
				
				actions.removeRegistrant(data)
				.then(function(resp){
					console.log(resp);
					ui.removeRegistrant(resp.affectedItems[0].clientId);
				})
				.then(function(){
					window.setTimeout(ui.hideLoading,1200);
				})
				.catch(function(ex){
					window.activeSaveRequest = false;
					ui.hideLoading();
					console.log(ex);
					alert(ex.message);
				});
				
				
			} else if("new" == action){
				ui.showStatus("Loading...");
				actions.newRegistrant(data).then(function(){
					window.setTimeout(ui.hideLoading,1200);
				});
			} else if("new-guest" == action){
				ui.showStatus("Loading...");
				console.log("Creating new guest entry...");
				actions.newGuest(data).then(function(){
					window.setTimeout(ui.hideLoading,1200);
				});
			}
		
		} catch(e) {

			console.log(e);
			window.activeSaveRequest = false;
			if(window.confirm(e)){
				ui.showStatus("Fixing errors...");
				window.setTimeout(ui.hideLoading,3000);
			} else {
				ui.showStatus("Fixing errors...");
				window.setTimeout(ui.hideLoading,3000);
			}
		}
		
		return false;
	};




	function showEventRegistrationErrors(e) {
		$errorPanel = $('div[id*="eventErrorMessages"]');
		$errorPanel.css({'padding':'15px','background-color':'yellow','width':'95%','border-radius':'3px'});
	
		$errorPanel.fadeIn().delay(300);
		$errorPanel.html(e.message);
	}

	function clearEventRegistrationErrors(){
		$errorPanel = $('div[id*="eventErrorMessages"]');
		$errorPanel.slideUp().hide();
	}

	return {
		setup: setup,
		setNodeDataAlgorithm: setNodeDataAlgorithm,
		setContainerId: function(id){ containerId = id;}
	};

});