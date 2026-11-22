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
  /* The site's action icons are SVG background images (font-size:0 hides the
     link text). Reuse its own green-plus glyph so the injected button matches
     the DL/RP/ED/PL icons exactly in scale, alignment and colour. */
  a.sendtoclient::before {
    content: '' !important;
    display: inline-block !important;
    width: 16px !important;
    height: 16px !important;
    /* mask keeps the site's glyph shape but lets us tint it to the same
       anchor blue as the DL/RP/ED/PL icons instead of standing out green. */
    -webkit-mask-image: var(--s-gold-plus) !important;
    mask-image: var(--s-gold-plus) !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat !important;
    -webkit-mask-position: center !important;
    mask-position: center !important;
    -webkit-mask-size: contain !important;
    mask-size: contain !important;
    background-color: #63ABE6 !important;
    vertical-align: middle !important;
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
