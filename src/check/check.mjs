import { config } from '../config.mjs';
import { logResult } from '../shared/modules/utils.mjs';
import { searchTargetTabId, notify, localizeHtmlPage } from '../shared/modules/chrome_utils.mjs';

/**
 * Check notifications
 */
async function checkNotification(target_url) {
  await fetch(target_url)
    .then(async (res) => {
      // Get notification specific identifier
      const html = await res.text();
      const identifierList = getNotificationIdentifierList(html, target_url);
      console.log(identifierList);
      document.getElementById('latest_check_time').innerText = new Date().toLocaleString()
      if (0 === Object.keys(identifierList).length) {
        // No update
        const storage_key = `identifierList_${target_url}`
        chrome.storage.local.set({[storage_key]: {}});
        logResult('no notification.');
        return;
      } else {
        // Check for updates
        chrome.storage.local.get('identifierList', (data) => {
          const storedIdentifierList = data.identifierList ?? {};
          for (const key of Object.keys(identifierList)) {
            // Notify when there is an update
            if (typeof storedIdentifierList[key] === 'undefined') {
              const message = identifierList[key]['message']
              const notificationId = `${message}____${target_url}`
              notify(message, notificationId);
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
function getNotificationIdentifierList(html, target_url) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');

  let identifierList = {};
  let elements = doc.getElementsByClassName('notification-list-item-link');
  for (const element of elements) {
    let repoElement = element.getElementsByClassName('m-0 f6 flex-auto')[0];
    repoElement.querySelector('span').remove();
    let repo = repoElement.innerText.trim();
    let title = element.getElementsByClassName('markdown-title')[0].innerText.trim();
    identifierList[element.dataset.hydroClickHmac] = {
      "message": `${repo}\n${title}`,
      "url": target_url
    };
  }
  return identifierList;
}

// Localize
localizeHtmlPage();

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.btn').addEventListener('click', function () {
      const target_urls = document.getElementById('input_target_urls').value
      chrome.storage.local.set({'target_urls': target_urls}, function () {
        chrome.storage.local.get('target_urls', (data) => {
          alert(`updated to "${data.target_urls}"`)
        })
      })
  });
});

// make sure target_urls
chrome.storage.local.get('target_urls', (data) => {
  if (chrome.runtime.lastError) {
    chrome.storage.local.set({'target_urls': config.target_url})
    document.getElementById('input_target_urls').value = config.target_url
  } else {
    document.getElementById('input_target_urls').value = data.target_urls
  }
})

// Notification check processing
chrome.alarms.create('NOTIFICATION_CHECK_ALARM', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'NOTIFICATION_CHECK_ALARM') {
    console.clear();

    chrome.storage.local.get('target_urls', (data) => {
      const target_url_list = data.target_urls.split(',')
        for (const target_url of target_url_list) {
          checkNotification(target_url);
        }
    })
  }
});

// Define behavior when clicking on desktop notifications
chrome.notifications.onClicked.addListener(async (notificationId) => {
  const target_url = notificationId.split('____')[1]

  const targetTabId = await searchTargetTabId(target_url);

  if (null === targetTabId) {
    // Open a new tab to display the page
    chrome.tabs.create({url: target_url});
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
