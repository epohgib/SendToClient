import { profileManager } from './profileManager';
import { Settings } from './settings';
import { createButtons } from './trackerUtils';
import { globalSettingsManager } from './globalSettingsManager.js';

// Make the injected SendToClient links visually distinct from the tracker's
// own plain-text action links (DL/RP/ED/PL), which otherwise makes them very
// easy to miss on Gazelle sites.
/* global GM_addStyle */
// Gazelle sites hide the text of action links and render an icon via ::before.
// Give the injected link its own icon so it shows up like DL/RP/ED/PL instead
// of an empty box (or invisible text where the site's font-size:0 applies).
GM_addStyle(`
  /* The site sets font-size:0 on action links, so give the ::before its own
     absolute box and glyph. A plain + keeps it distinct from the DL arrow. */
  a.sendtoclient::before {
    content: '+' !important;
    display: inline-block !important;
    width: 16px !important;
    height: 16px !important;
    font-family: Arial, sans-serif !important;
    font-size: 18px !important;
    line-height: 16px !important;
    text-align: center !important;
    vertical-align: middle !important;
    font-weight: bold !important;
    color: #63ABE6 !important;
    background: none !important;
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
