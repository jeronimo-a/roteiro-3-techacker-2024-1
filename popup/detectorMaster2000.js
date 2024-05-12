
document.addEventListener("DOMContentLoaded", contentLoadedHandler);

function contentLoadedHandler() {
	browser.tabs.query({ active: true, currentWindow: true }, getCookiesAndTPConnections);
}

function getCookiesAndTPConnections(tabs) {
	const response1 = browser.runtime.sendMessage({ action: "thirdPartyConnections", tabId: tabs[0].id });
	response1.then(populateTPAccessList);
	const response2 = browser.runtime.sendMessage({ action: "countCookies", domain: new URL(tabs[0].url).hostname });
	response2.then(displayCookies);
}

function populateTPAccessList(response) {
	const thirdPartyConnectionsList = document.getElementById("thirdPartyConnections");
	response.forEach(hostname => {
		const listItem = document.createElement("li");
		listItem.textContent = hostname;
		thirdPartyConnectionsList.appendChild(listItem);
	});
}

function displayCookies(response) {
	const totalCookieCount = response.total;
	const fpCookieCount = response.firstParty;
	const tpCookieCount = response.thirdParty;
	const sessionCookieCount = response.session;
	const persistentCookieCount = response.persistent;
	document.getElementById("totalCookieCount").textContent = String(totalCookieCount);
	document.getElementById("fpCookieCount").textContent = String(fpCookieCount);
	document.getElementById("tpCookieCount").textContent = String(tpCookieCount);
	document.getElementById("sessionCookieCount").textContent = String(sessionCookieCount);
	document.getElementById("persistentCookieCount").textContent = String(persistentCookieCount);
}