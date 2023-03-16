<p align="center">
  <a href="https://unijump.ai" target="_blank" rel="noopener noreferrer">
    <img src="https://unijump.ai/_astro/logo.bdfd1cb1.png" width="36" height="36" alt="Unijump.ai logo">
  </a>
</p>
<br/>

# Unijump.ai Browser Extension

> Shortcut for ChatGPT with Superpowers!

- 🦄 100% Free
- ✨ 100% Open Source
- 🎉 No sign up required
- 🌐 Tested on Chrome, Firefox, Edge, Brave...

<br/>

> Use UniJump to easily access ChatGPT from any website by using just a keystroke!


- 👉 MAC Shortcut: CMD + J
- 👉 WIN Shortcut: ALT + J

<br/>

> 🚨 SUPERPOWERS 🚨
- Chat Interface on any website
- Paraphraser

<br/>

## Download

---

<p align="center">
<a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai">Chrome Web Store</a>
<p>
<p align="center">
<a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai"><img width="24" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/73.0.0/chrome/chrome.svg" /></a>
<a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai"><img width="24" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/73.0.0/brave/brave.svg" /></a>
<a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai"><img width="24" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/73.0.0/edge/edge.svg" /></a>
</p>
<p align="center">
  <a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai"><img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/users/olikadnicfhhpkfleolncoligkdcmjai"></a>
  <a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai"> <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/rating/olikadnicfhhpkfleolncoligkdcmjai"> </a>
  <a href="https://chrome.google.com/webstore/detail/olikadnicfhhpkfleolncoligkdcmjai"><img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/olikadnicfhhpkfleolncoligkdcmjai"></a>
</p>
<br/>

<p align="center">
Firefox Add-on (Coming soon)
<p>
<p align="center">
<img width="24" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/73.0.0/firefox/firefox.svg" />
</p>

<br/> <br/>

## Build

---

### Install Dependencies

- `npm install` or `yarn`

### Build extension

- Manifest Version 3 - Chromium (Chrome, Edge, Brave)
  - `npm build:mv3` (dist/mv3)
- Manifest Version 2 - Firefox
  - `npm build:mv2` (dist/mv2)

### Load extension to browser

- Chromium
  - Go to `chrome://extensions`, `brave://extensions`, `edge://extensions` etc...
  - Enable `Developer mode`
  - Click `Load unpacked` button
  - Select `dist/mv3` folder
- Firefox
  - Go to `about:debugging#/runtime/this-firefox`
  - Click `Load temporary Add-on...` button
  - Select `dist/mv2/manifest.json` file

<br/><br/>

## Development

---

- Copy `.env.sample` to `.env` file
  - `cp .env.sample .env`

- Web app environment (Replication of extension)
  - `npm run dev` or `yarn dev`
  - Open `http://localhost:2222`

- Extension environment
  - `npm run watch:mv3` for Chromium browsers, `npm run watch:v2` for Firefox.
  - Apply [Load extension to browser](#load-extension-to-browser) step above ☝️ 

<br/><br/>

## Contributing

---

Soon...
<br/><br/>

# License

[CC-BY-NC](LICENSE.md).

<p>
  <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" />
</p>
