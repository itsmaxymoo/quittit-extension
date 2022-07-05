var blocked_site_list = [];


function save(onsave = function(){}){
	browser.storage.local.set({blocked_site_list: blocked_site_list}, function(){
		console.log("quittit! extension settings saved.");

		onsave();
	})
}


function load(onload = function(){}){
	let storage = browser.storage.local.get("blocked_site_list");
	storage.then(function(settings){
		bsl = settings.blocked_site_list;

		if(Array.isArray(bsl)){
			blocked_site_list = bsl;
		}
		else{
			blocked_site_list = ["reddit.com"];
		}

		console.log("quittit! extension settings loaded.");
		onload();
	});
}


function constructGUI(){
	// Clear existing blocked site entries
	document.querySelector("#blocked-site-list").innerHTML = "";

	if(blocked_site_list.length > 0){
		// Hide no blocked sites message
		document.querySelector("#blocked-site-list-empty-message").hidden = true;

		// Get template
		let bse_template = document.querySelector("#blocked-site-entry-template");

		for(var i = 0; i < blocked_site_list.length; i++){
			var bsl = document.querySelector("#blocked-site-list");
			var bse = bse_template.content.cloneNode(true);

			let bse_string = blocked_site_list[i];

			bse.querySelector("#bse-name").innerHTML = blocked_site_list[i];
			bse.querySelector("#bse-delete").onclick = function(){
				del_site(bse_string);
				constructGUI();
			};

			bsl.appendChild(bse);
		}
	}
	else{
		// Display no blocked sites message
		document.querySelector("#blocked-site-list-empty-message").hidden = false;
	}

	console.log("quittit! extension UI constructed.");
}


function add_site(site){
	if( ! blocked_site_list.includes(site) ){
		blocked_site_list.unshift(site);
	}

	save();
}


function del_site(site){
	blocked_site_list = blocked_site_list.filter(n => n !== site);

	save();
}


// Load
window.onload = function(){
	load(constructGUI);

	let add_bse_button = document.querySelector("#add-bse-button");
	let add_bse_input = document.querySelector("#add-bse-input");

	add_bse_button.onclick = function(){
		add_site(add_bse_input.value.toLowerCase());
		add_bse_input.value = "";
		constructGUI();
	};

	add_bse_input.oninput = function(){
		add_bse_input.value = add_bse_input.value.replace(
			/[^A-Za-z0-9.-]/g, ""
		);
	}
};
