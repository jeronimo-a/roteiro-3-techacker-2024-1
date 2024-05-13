// ##############################################
// ############## VARIÁVEIS GERAIS ##############
// ##############################################

const ICON_DEFAULT = "icons/magnifier.png";				// local do ícone
const VERSION = browser.runtime.getManifest().version;	// versão da extensão
const gDisplayNotifications = true;						// habilita ou desabilita notificações

let thirdPartyConnections = {};	// dicionário que relaciona o host principal de cada aba a um conjunto com os hosts de terceira parte
let cookiesDetails = {};

// ######################################################
// ############## CONFIGRUAÇÃO DE HANDLERS ##############
// ######################################################

browser.runtime.onMessage.addListener(handleMessage);	// define que função chamar ao receber uma mensagem de algum outro pedaço do código
browser.webRequest.onBeforeRequest.addListener(			// define que função chamar antes de fazer um novo request
    handleWebRequest,		// handler de web requests
    {urls: ["<all_urls>"]}	// para que URLs
);

// ########################################
// ############### HANDLERS ###############
// ########################################

// handler que roda ao receber uma mensagem de algum outro lugar do código
function handleMessage(request, sender, sendResponse) {
	
	switch (request.action) {

		// usado para reconhecer quando o código é executado
		case "debug":
			detectorNotification.display("Debug: " + request.message, 1000);
			break;
		
		// solicitação das conexões com terceiras partes
		case "thirdPartyConnections":
            sendResponse(Array.from(thirdPartyConnections[request.tabId] || []));
            break;

		// solicitação dos cookies
		case "countCookies":
            const cookiesTabsResponse = browser.tabs.query({ active: true, currentWindow: true });
			const cookieDetailsResponse = cookiesTabsResponse.then(getCookieDetails);
			cookieDetailsResponse.then(sendResponse);
			return true;

		case "localStorage":
			const storageTabsResponse = browser.tabs.query({ active: true, currentWindow: true });
			const storageResponse = storageTabsResponse.then(countStorageItemsInTab);
			storageResponse.then(sendResponse);
			return true;

		default:
			sendResponse({ error: "Error, unknown action " + request.action });
	}
}

// handler que roda antes de cada request da página
function handleWebRequest(details) {

	// extrai os argumentos e valida a aba
    const {url, tabId} = details;
    if (tabId < 0) return;

	// extrai o hostname da URL do request
    const fpHostname = new URL(url).hostname;

    // Adiciona o hostname ao conjunto de hostnames associados ao hostname da aba
	// A arrow function tab => {} tem tab como um parâmetro
    browser.tabs.get(tabId, tab => {

		// se não houver erro
        if (!chrome.runtime.lastError) {

			// pega o hostname principal da aba, a partir do argumento tab
            const tabHostname = new URL(tab.url).hostname;
			
			// se o hostname direcionado for diferente do principal da aba, adicona ele ao conjunto de hosts de terceira parte da aba
            if (fpHostname !== tabHostname) {

				// se não existir o conjunto para o tal hostname da aba, cria um antes de adicionar
                if (!thirdPartyConnections[tabId]) { thirdPartyConnections[tabId] = new Set(); }
                thirdPartyConnections[tabId].add(fpHostname);
            }
        }
    });
}

// ############################################
// ############### NOTIFICAÇÕES ###############
// ############################################

// objeto de notificações
const detectorNotification = {
	
	// método display que cria uma notificação com um texto "text" por "millis" milissegundos
	display: (text, millis) => {
		
		// se as notificações estiverem desabilitadas, finaliza
		if (!gDisplayNotifications) return;
		
		// cria a notificação com o ID "dmaster2000"
		browser.notifications.create("dmaster2000", {
			"type": "basic",									// tipo da notificação
			"iconUrl": browser.extension.getURL(ICON_DEFAULT),	// ícone da notifiação
			"title": "Detector Master 2000",					// título da notificação
			"message": text										// mensagem da notificação
		});
		
		// remove a notificação depois de "millis" milissegundos
		window.setTimeout(() => {
			browser.notifications.clear(razorNotification._notificationId);
		}, millis);
	}
}

// #############################################
// ############### FUNÇÕES EXTRA ###############
// #############################################

function countStorageItemsInTab(tabs) {
    return new Promise(resolve => {
        if (tabs.length <= 0) {
            resolve({ error: "Sem abas ativas" });
            return;
        }
        const tabId = tabs[0].id; // Obtém o ID da primeira aba na lista de abas

        const scriptResponse = browser.tabs.executeScript(tabId, {
            code: `({
                localStorageCount: Object.keys(localStorage).length,
            })`
        });

        scriptResponse.then(results => {
            if (browser.runtime.lastError) {
                resolve({ error: browser.runtime.lastError.message });
            } else {
                resolve({ data: results[0] });
            }
        }).catch(error => {
            resolve({ error: error.message });
        });
    });
}

function getCookieDetails(tabs) {
	if (tabs.length > 0) {
		const domain = new URL(tabs[0].url).hostname;
		const tabId = tabs[0].id;
		return new Promise(resolve => {

			browser.cookies.getAll({}, cookies => {				
				
				const details = {
					total: cookies.length,
					firstParty: 0,
					thirdParty: 0,
					session: 0,
					persistent: 0
				};

				cookies.forEach(cookie => {
					cookie.domain === domain ? details.firstParty++ : details.thirdParty++;
					"session" in cookie && cookie.session ? details.session++ : details.persistent++;
				});

				cookiesDetails[tabId] = details;
				resolve(details);
			});
		});
	}
}