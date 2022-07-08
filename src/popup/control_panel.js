// To store list of blocked sites during runtime
var blocked_site_list = [];


// Function to save blocked site list
function save(onsave = function(){}){
	browser.storage.local.set({blocked_site_list: blocked_site_list}, function(){
		console.log("quittit! extension settings saved.");

		onsave();
	})
}


// Function to load blocked site list
function load(onload = function(){}){
	let storage = browser.storage.local.get("blocked_site_list");
	storage.then(function(settings){
		bsl = settings.blocked_site_list;

		// If data is not corrupt
		if(Array.isArray(bsl)){
			blocked_site_list = bsl;
		}

		// Else, set default blocklist
		else{
			blocked_site_list = ["reddit.com", "old.reddit.com"];
		}

		console.log("quittit! extension settings loaded.");

		onload();
	});
}


// Construct any dynamic elements of the GUI
function constructGUI(){
	var bsl = document.querySelector("#blocked-site-list");

	// Clear existing blocked site entries
	while(bsl.firstChild){
		bsl.removeChild(bsl.lastChild);
	}
	bsl.textContent = "";

	// If there are blocked sites
	if(blocked_site_list.length > 0){
		// Hide no blocked sites message
		document.querySelector("#blocked-site-list-empty-message").hidden = true;

		// Get template
		let bse_template = document.querySelector("#blocked-site-entry-template");

		// Add each blocked site entry to GUI
		for(var i = 0; i < blocked_site_list.length; i++){
			var bse = bse_template.content.cloneNode(true);

			let bse_string = blocked_site_list[i];

			bse.querySelector("#bse-name").textContent = blocked_site_list[i];
			bse.querySelector("#bse-delete").onclick = function(){
				del_site(bse_string);
			};

			bsl.appendChild(bse);
		}
	}

	// Else, there are no blocked sites
	else{
		// Display no blocked sites message
		document.querySelector("#blocked-site-list-empty-message").hidden = false;
	}

	console.log("quittit! extension UI constructed.");
}


// Add a site to the block list and reload UI
function add_site(site){
	// Don't add a duplicate entry
	if( ! blocked_site_list.includes(site) ){
		blocked_site_list.unshift(site);
	}

	save();				// save to disk
	constructGUI();		// construct UI
}


// Delete a site from the block list and reload UI
function del_site(site){
	// Delete site
	blocked_site_list = blocked_site_list.filter(n => n !== site);

	save();				// save to disk
	constructGUI();		// construct UI
}


// On control panel load (main function essentially)
window.onload = function(){
	// Load block list, then construct GUI
	load(constructGUI);

	let add_bse_button = document.querySelector("#add-bse-button");
	let add_bse_input = document.querySelector("#add-bse-input");

	// "+" add site button
	add_bse_button.onclick = function(){
		add_site(add_bse_input.value.toLowerCase());	// add site to block list
		add_bse_input.value = "";		// reset text in textbox
	};

	// On keypress event, used to press the "+" add button on enter
	add_bse_input.addEventListener("keypress", function(event){
		if(event.key === "Enter"){
			event.preventDefault();
			add_bse_button.click();
		}
	});

	// On keypress event, used to disallow invalid characters
	add_bse_input.addEventListener("keypress", function(){
		add_bse_input.value = add_bse_input.value.replace(
			/[^A-Za-z0-9.-]/g, ""
		);
	});
};
