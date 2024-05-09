// ################################################
// ############## CHAMADAS DE FUNÇÃO ##############
// ################################################

const VERSION = browser.runtime.getManifest().version;
browser.runtime.onMessage.addListener(handleMessage);

// ##############################################
// ############## VARIÁVEIS GERAIS ##############
// ##############################################

const ICON_DEFAULT = "icons/magnifier.png";
const gDisplayNotifications = true;

// ########################################
// ############### MENSAGENS ##############
// ########################################

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
			"title": "Detector Master 2000",
			"message": text
		});
	
		window.setTimeout(() => {
			browser.notifications.clear(razorNotification._notificationId);
		}, millis);
	}
}
