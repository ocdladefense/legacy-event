define([],function(){

	function isEmpty(data){
		var d = data && data.trim();
		
		return (d == "" || d == null || typeof d === "undefined");
	}

	function validateMember(data){
		var errors = [];
		
		if(data.notAttendee) {
			return;
		}
	
		if(isEmpty(data.firstName)){
			errors.push('Registrant First Name field cannot be empty.');
		}

		if(isEmpty(data.lastName)){
			errors.push('Registrant Last Name field cannot be empty.');
		}

		if(isEmpty(data.email)){
			errors.push('Registrant Email field cannot be empty.');
		}

		if(!!data.email && data.email.indexOf('@') === -1){
			errors.push('Enter email address in this form: abc@abc.com.');
		}

		if(!!errors.length){
			var showErrors = errors.join("\n");
			throw Error(showErrors);
		}
	
	}

	return {
		validateMember: validateMember
	};
			
});