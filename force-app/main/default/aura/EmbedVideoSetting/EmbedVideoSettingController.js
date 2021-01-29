({
	doInit: function(component, event, helper) {
		var action = component.get('c.getEmbedVideoSettings');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var data = response.getReturnValue();
                console.log(data);
                
                if (!$A.util.isEmpty(data.GOOGLE_API_KEY)) {
                    component.set('v.googleApiKey', data.GOOGLE_API_KEY);
                }
            } else {
                var errors = response.getError();
                console.error(errors);
            }
        });
        $A.enqueueAction(action);
	},
    handleSaveGoogleApiKey: function(component, event, helper) {
        var action = component.get('c.saveEmbedVideoSettings');
        action.setParams({
            apiName: 'google',
            value: component.get('v.googleApiKey')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var data = response.getReturnValue();
                console.log(data);
                component.find('notifLib').showToast({
                    "title": "Success!",
                    "variant": "success"
                });
            } else {
                var errors = response.getError();
                console.error(errors);
            }
        });
        $A.enqueueAction(action);
    },
})