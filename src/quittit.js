const QUITTIT_URL = "https://quittit.itsmaxymoo.com";
var blocked_site_list = [];


// Load blocked sites from extension storage
function loadBlockedSiteList(){
	let storage = browser.storage.local.get("blocked_site_list");
	storage.then(function(settings){
		bsl = settings.blocked_site_list;

		if(Array.isArray(bsl)){
			blocked_site_list = bsl;
		}

		onload();
	});
}


// Add our block list loading listener
if(!browser.storage.onChanged.hasListener(loadBlockedSiteList)){
	browser.storage.onChanged.addListener(loadBlockedSiteList);
}


// Add our event listener to catch page load
window.onload = function(){
	//
}


// Load blocked sites
loadBlockedSiteList();