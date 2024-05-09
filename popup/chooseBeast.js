document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("beast")) {
      return;
    }
  
    var chosenBeast = e.target.textContent;
  
    chrome.tabs.executeScript(null, {
      file: "scripts/contentScript.js",
    });
  
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { beast: chosenBeast });
    });
  });
  