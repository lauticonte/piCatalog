if(!self.define){let e,s={};const a=(a,t)=>(a=new URL(a+".js",t).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(t,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let i={};const o=e=>a(e,c),g={module:{uri:c},exports:i,require:o};s[c]=Promise.all(t.map((e=>g[e]||o(e)))).then((e=>(n(...e),i)))}}define(["./workbox-50de5c5d"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"f5b2b642025f99e4813ca950922463e3"},{url:"/_next/static/Q8kggSDSoFVYRVeU3gEjg/_buildManifest.js",revision:"66a650a40453999ca40002ee32e3481e"},{url:"/_next/static/Q8kggSDSoFVYRVeU3gEjg/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/00cbbcb7-84a554eaedaffb97.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/114-6984064281660696.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/3627521c-221dd7555eb84b88.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/39209d7c-00d40bc5f659ce22.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/411-60b9d0c17787d90f.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/445-f26d431ed1310e32.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/599-fd54d884aff16fb9.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/621-0f8b925c5b030b4f.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/68-40780fdc25ab2a24.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/685-981fb9110fc183cc.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/696-3b2c04ce74cc01d9.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/9081a741-162e4803bbac95e8.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/929-6a4c8a7cc2b7b645.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/(routes)/beers/page-f4f102c7c456e34d.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/(routes)/cart/page-3886292d6a618221.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/(routes)/category/%5BcategoryId%5D/page-a9b903357391c33b.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/(routes)/loading-911ad0ac976c3082.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/(routes)/page-2479e5d611a552a0.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/(routes)/product/%5BproductId%5D/page-65dba8ce28f90879.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/app/layout-d63b66a38d9f6d62.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/bf6a786c-d4415fbd5bc9305a.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/framework-8883d1e9be70c3da.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/main-app-082dd3bf447e5465.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/main-ba7a0cd9a473a7fc.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/pages/_app-52924524f99094ab.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/pages/_error-c92d5c4bb2b49926.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-c71a170caeeaeeed.js",revision:"Q8kggSDSoFVYRVeU3gEjg"},{url:"/_next/static/css/f5c67a8f998f0e48.css",revision:"f5c67a8f998f0e48"},{url:"/_next/static/media/2aaf0723e720e8b9-s.p.woff2",revision:"e1b9f0ecaaebb12c93064cd3c406f82b"},{url:"/_next/static/media/9c4f34569c9b36ca-s.woff2",revision:"2c1fc211bf5cca7ae7e7396dc9e4c824"},{url:"/_next/static/media/ae9ae6716d4f8bf8-s.woff2",revision:"b0c49a041e15bdbca22833f1ed5cfb19"},{url:"/_next/static/media/b1db3e28af9ef94a-s.woff2",revision:"70afeea69c7f52ffccde29e1ea470838"},{url:"/_next/static/media/b967158bc7d7a9fb-s.woff2",revision:"08ccb2a3cfc83cf18d4a3ec64dd7c11b"},{url:"/_next/static/media/c0f5ec5bbf5913b7-s.woff2",revision:"8ca5bc1cd1579933b73e51ec9354eec9"},{url:"/_next/static/media/d1d9458b69004127-s.woff2",revision:"9885d5da3e4dfffab0b4b1f4a259ca27"},{url:"/alluneed-og.webp",revision:"8bed3c7cb85f35c409082abe2bbf9724"},{url:"/logo.png",revision:"af2b0861f83d2fa0f02bd02708d95802"},{url:"/manifest.json",revision:"9e4c246c52d987f08d32b1af4d87ee48"},{url:"/robots.txt",revision:"5755ca7f245bdb0be40c64cf7441007f"},{url:"/sitemap-0.xml",revision:"746d80f3b4c40d985001889403baab7e"},{url:"/sitemap.xml",revision:"795eb6c43d8012457341a0f600a1bb6a"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
