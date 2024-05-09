// Assign beastify() as a listener for messages from the extension.
document.body.style.border = "5px solid red";
chrome.runtime.onMessage.addListener(beastify);

alert("uhu");

function beastify(request, sender, sendResponse) {
  removeEverything();
  insertBeast(beastNameToURL(request.beast));
  chrome.runtime.onMessage.removeListener(beastify);
}

function removeEverything() {
  while (document.body.firstChild) {
    document.body.firstChild.remove();
  }
}

function insertBeast(beastURL) {
  var beastImage = document.createElement("img");
  beastImage.setAttribute("src", beastURL);
  beastImage.setAttribute("style", "width: 100vw");
  beastImage.setAttribute("style", "height: 100vh");
  document.body.appendChild(beastImage);
}

function beastNameToURL(beastName) {
  switch (beastName) {
    case "Sapão":
      return chrome.extension.getURL("beasts/frog.jpg");
    case "Croba":
      return chrome.extension.getURL("beasts/snake.jpg");
    case "Tortuga":
      return chrome.extension.getURL("beasts/turtle.jpg");
  }
}