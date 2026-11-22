import { profileManager } from './profileManager';
import { Settings } from './settings';
import { createButtons } from './trackerUtils';
import { globalSettingsManager } from './globalSettingsManager.js';

// Make the injected SendToClient links visually distinct from the tracker's
// own plain-text action links (DL/RP/ED/PL), which otherwise makes them very
// easy to miss on Gazelle sites.
/* global GM_addStyle */
GM_addStyle(`
  a.sendtoclient {
    display: inline-block !important;
    padding: 0 4px !important;
    border: 1px solid #4caf50 !important;
    border-radius: 3px !important;
    color: #4caf50 !important;
    text-decoration: none !important;
    font-weight: bold !important;
  }
  a.sendtoclient:hover {
    background: #4caf50 !important;
    color: #fff !important;
  }
`);

GM.registerMenuCommand('Settings', () => {
  Settings();
});
const profileQuickSwitcher = () => {
  let id = GM.registerMenuCommand(
    `Selected Profile: ${profileManager.selectedProfile.name}`,
    () => {}
  );
  window.addEventListener('profileChanged', () => {
    GM.unregisterMenuCommand(id);
    profileQuickSwitcher();
    window.removeEventListener('profileChanged', () => {});
  });
};
globalSettingsManager.load().then(() =>
  profileManager.load().then(() => {
    profileQuickSwitcher();
    createButtons();
  })
);

document.addEventListener('PTPAddReleasesFromOtherTrackersComplete', () => {
  console.log('Adding buttons for added releases');
  profileQuickSwitcher();
  createButtons();
});
