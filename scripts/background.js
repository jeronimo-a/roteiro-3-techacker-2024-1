const VERSION = browser.runtime.getManifest().version;
const ICON_DEFAULT = "icons/magnifier.png";

browser.notifications.create("detector", {
    "type": "basic",
    "iconUrl": ICON_DEFAULT,
    "title": "Detector Master 2000 v" + VERSION,
    "message": "caraio viado"
  });