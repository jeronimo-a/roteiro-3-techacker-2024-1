
document.addEventListener("DOMContentLoaded", contentLoadedHandler);

function contentLoadedHandler() {
	browser.tabs.query({ active: true, currentWindow: true }, tabsQueryTPConnections);
}

function tabsQueryTPConnections(tabs) {
	const response = browser.runtime.sendMessage({ action: "thirdPartyConnections", tabId: tabs[0].id });
	response.then(populateTPAccessList);
}

function populateTPAccessList(response) {
	const thirdPartyConnectionsList = document.getElementById("thirdPartyConnections");
	response.forEach(hostname => {
		const listItem = document.createElement("li");
		listItem.textContent = hostname;
		thirdPartyConnectionsList.appendChild(listItem);
	});
}