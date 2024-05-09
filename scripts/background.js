const VERSION = browser.runtime.getManifest().version;
const ICON_DEFAULT = "icons/magnifier.png";
const gDisplayNotifications = true;

function handleMessage(request, sender, sendResponse) {
	detectorNotification.display("Teste", 2000);
}

// ############################################
// ############### NOTIFICAÇÕES ###############
// ############################################

const detectorNotification = {
	_notificationIcon: browser.extension.getURL(ICON_DEFAULT),
	_notificationId: "dmaster2000",
  
	display: (text, millis) => {
  
		if (!gDisplayNotifications) return;
	
		browser.notifications.create(detectorNotification._notificationId, {
			"type": "basic",
			"iconUrl": detectorNotification._notificationIcon,
			"title": "Detector Master 2000 v" + VERSION,
			"message": text
		});
	
		window.setTimeout(() => {
			browser.notifications.clear(razorNotification._notificationId);
		}, millis);
	}
}

// ############################################
// ############### NOTIFICAÇÕES ###############
// ############################################

browser.runtime.onMessage.addListener(handleMessage);