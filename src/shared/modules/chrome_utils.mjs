import { config } from '../../config.mjs';

/**
 * Finds the target window and returns the tab ID
 * @param {string} url - Target URL
 * @return {?number} - Target tab ID
 */
export async function searchTargetTabId(url) {
  // Get all open windows
  const queryOptions = {
    populate: true,
    windowTypes: ['normal']
  };
  let windows = await chrome.windows.getAll(queryOptions);

  // Find the window that opens the target URL
  for (const window of windows) {
    for (const tab of window.tabs) {
      // When the target tab is found
      if (-1 != tab.url.indexOf(url)) {
        const updateInfo = {
          focused: true
        };
        await chrome.windows.update(window.id, updateInfo);
        return tab.id;
      }
    }
  }
  return null;
}

/**
 * Make desktop notifications
 * @param {string} [msg=config.notification.default_msg] - Message to display in notification
 */
export function notify(msg = config.notification.default_msg) {
  const options = {
    type: config.notification.type,
    title: config.notification.title,
    message: msg,
    iconUrl: config.notification.iconUrl,
  };
  chrome.notifications.create(msg, options, () => {}); 
}

export function localizeHtmlPage() {
  document.querySelectorAll("[data-i18n-text]").forEach(element => {
      const key = element.getAttribute("data-i18n-text");
      element.textContent = chrome.i18n.getMessage(key);
  });
}
