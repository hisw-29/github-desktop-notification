import { config } from '../config.mjs';
import { logResult } from '../shared/modules/utils.mjs';
import { searchTargetTabId, notify, localizeHtmlPage } from '../shared/modules/chrome_utils.mjs';

/**
 * Check notifications
 */
async function checkNotification() {
  await fetch(config.target_url)
    .then(async (res) => {
      // Get notification specific identifier
      const html = await res.text();
      const identifierList = getNotificationIdentifierList(html);
      console.log(identifierList);
      document.getElementById('latest_check_time').innerText = new Date().toLocaleString()
      if (0 === Object.keys(identifierList).length) {
        // No update
        chrome.storage.local.set({'identifierList': {}});
        logResult('no notification.');
        return;
      } else {
        // Check for updates
        chrome.storage.local.get('identifierList', (data) => {
          const storedIdentifierList = data.identifierList ?? {};
          for (const key of Object.keys(identifierList)) {
            // Notify when there is an update
            if (typeof storedIdentifierList[key] === 'undefined') {
              notify(identifierList[key]);
              chrome.storage.local.set({'identifierList': identifierList});
              return;
            }
          }
          logResult('no update.');
        })
      }
    })
    .catch(error => console.error(error));
}

/**
 * Extract target notification information
 * @param {string} html - Notification page html
 * @return {object} - Identifier and text for each notification
 */
function getNotificationIdentifierList(html) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');

  let identifierList = {};
  let elements = doc.getElementsByClassName('notification-list-item-link');
  for (const element of elements) {
    let repoElement = element.getElementsByClassName('m-0 f6 flex-auto')[0];
    repoElement.querySelector('span').remove();
    let repo = repoElement.innerText.trim();
    let title = element.getElementsByClassName('markdown-title')[0].innerText.trim();
    identifierList[element.dataset.hydroClickHmac] = `${repo}\n${title}`;
  }
  return identifierList;
}

// Localize
localizeHtmlPage();

// Notification check processing
chrome.alarms.create('NOTIFICATION_CHECK_ALARM', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'NOTIFICATION_CHECK_ALARM') {
    console.clear();
    checkNotification();
  }
});

// Define behavior when clicking on desktop notifications
chrome.notifications.onClicked.addListener(async (notificationId) => {
  const targetTabId = await searchTargetTabId(config.target_url);

  if (null === targetTabId) {
    // Open a new tab to display the page
    chrome.tabs.create({url: config.target_url});
  } else {
    // Activate the target tab
    const updateProperties = {
      active: true
    };
    await chrome.tabs.update(targetTabId, updateProperties);
    await chrome.tabs.reload(targetTabId);
  }

  chrome.notifications.clear(notificationId);
});
