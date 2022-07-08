const QUITTIT_URL = "https://quittit.itsmaxymoo.com";

// To store list of blocked sites during runtime
var blocked_site_list = [];


// Load blocked sites from extension storage
function loadBlockedSiteList(onload = function(){}){
	let storage = browser.storage.local.get("blocked_site_list");
	storage.then(function(settings){
		bsl = settings.blocked_site_list;

		// If loaded data is not corrupt
		if(Array.isArray(bsl)){
			blocked_site_list = bsl;
		}

		// Else, set to default block list
		else{
			blocked_site_list = ["reddit.com", "old.reddit.com"];
		}

		// Also block the www. variant of domains
		var www_variants = []
		for(var i = 0; i < blocked_site_list.length; i++){
			if( ! blocked_site_list[i].startsWith("www.") ){
				www_variants.push("www." + blocked_site_list[i]);
			}
		}
		blocked_site_list = blocked_site_list.concat(www_variants);

		onload();
	});
}


// Add our block list loading listener
if(!browser.storage.onChanged.hasListener(loadBlockedSiteList)){
	browser.storage.onChanged.addListener(loadBlockedSiteList);
}


// Add our event listener to catch page load
window.onload = function(){
	// Load blocked sites
	loadBlockedSiteList(function(){
		if(blocked_site_list.indexOf(location.hostname) > -1){
			window.location = QUITTIT_URL;
		}
	});
}
