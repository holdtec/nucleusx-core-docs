import { h } from "vue";
import { defineClientConfig } from "vuepress/client";
import { setupPwa, setupViewPoint } from "/home/john/workspace/nucleusx-core-docs/node_modules/@vuepress/plugin-pwa/lib/client/composables/index.js";
import { PwaReadyPopup as _PwaReadyPopup } from "/home/john/workspace/nucleusx-core-docs/node_modules/@vuepress/plugin-pwa/lib/client/components/PwaReadyPopup.js";

import "/home/john/workspace/nucleusx-core-docs/node_modules/@vuepress/plugin-pwa/lib/client/styles/vars.css";

const locales = {"/":{"install":"Install","iOSInstall":"Tap the share button and then 'Add to Home Screen'","cancel":"Cancel","close":"Close","prevImage":"Previous Image","nextImage":"Next Image","desc":"Description","feature":"Key Features","explain":"This app can be installed on your PC or mobile device.  This will allow this web app to look and behave like any other installed app.  You will find it in your app lists and be able to pin it to your home screen, start menus or task bars.  This installed web app will also be able to safely interact with other apps and your operating system. ","hint":"Available offline","update":"New content is available.","updateHint":"Hit the refresh button to update promptly."}};

export default defineClientConfig({
  setup: () => {
    setupPwa("service-worker.js", false);
    setupViewPoint();
  },
  rootComponents: [
    () => h(_PwaReadyPopup, { locales }),
  ],
});
