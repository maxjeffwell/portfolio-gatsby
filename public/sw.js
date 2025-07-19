/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "_gatsby/slices/_gatsby-scripts-1.html",
    "revision": "1a671ce1741280073414ca6ceac6c8c9"
  },
  {
    "url": "_redirects",
    "revision": "9d70648ed92ffc8583ce371e00ca01ad"
  },
  {
    "url": "~partytown/debug/partytown-atomics.js"
  },
  {
    "url": "~partytown/debug/partytown-media.js"
  },
  {
    "url": "~partytown/debug/partytown-sandbox-sw.js"
  },
  {
    "url": "~partytown/debug/partytown-sw.js"
  },
  {
    "url": "~partytown/debug/partytown-ww-atomics.js"
  },
  {
    "url": "~partytown/debug/partytown-ww-sw.js"
  },
  {
    "url": "~partytown/debug/partytown.js"
  },
  {
    "url": "~partytown/partytown-atomics.js"
  },
  {
    "url": "~partytown/partytown-media.js"
  },
  {
    "url": "~partytown/partytown-sw.js"
  },
  {
    "url": "~partytown/partytown.js"
  },
  {
    "url": "265-7d4b997b9e3443a85125.js"
  },
  {
    "url": "265-7d4b997b9e3443a85125.js.map",
    "revision": "75f8e6592e352cee0fec4abdf06b9b88"
  },
  {
    "url": "404.html",
    "revision": "8b720f2af9adee15d141a2588145d3e7"
  },
  {
    "url": "404/index.html",
    "revision": "a3825879a60f9870073b65ef518aeeb0"
  },
  {
    "url": "about/index.html",
    "revision": "3d74782774bdc68a3020969cb34c435a"
  },
  {
    "url": "app-01c7826c1226dcc9fc0c.js"
  },
  {
    "url": "app-01c7826c1226dcc9fc0c.js.map",
    "revision": "df7308bebaaab2a1fcd0824095a68785"
  },
  {
    "url": "app-4753576622d7a8a3c050.js"
  },
  {
    "url": "app-4753576622d7a8a3c050.js.map",
    "revision": "3f2a29b97f384cf4022e5ebc3c6f4269"
  },
  {
    "url": "app-5655722a40f2258d6c19.js"
  },
  {
    "url": "app-5655722a40f2258d6c19.js.map",
    "revision": "d8b34709955ba61b3136fbd227327e8e"
  },
  {
    "url": "app-92d1946f47434122b24e.js"
  },
  {
    "url": "app-92d1946f47434122b24e.js.map",
    "revision": "4a24849e6e5a33574e5436639aadb21c"
  },
  {
    "url": "app-a9392b700f9a7b9aec74.js"
  },
  {
    "url": "app-a9392b700f9a7b9aec74.js.map",
    "revision": "35e6b93153b9ffb46d6c74bb664b7a47"
  },
  {
    "url": "app-ae1a5fa3a8139393ca9b.js"
  },
  {
    "url": "app-ae1a5fa3a8139393ca9b.js.map",
    "revision": "9833e8ceaf419d147ce6f1c273f82274"
  },
  {
    "url": "app-b76dcd7074ca7131c54e.js"
  },
  {
    "url": "app-b76dcd7074ca7131c54e.js.map",
    "revision": "2666daa9f726011dad469604bd1c73b9"
  },
  {
    "url": "app-c261a0e05fecdc311a80.js"
  },
  {
    "url": "app-c261a0e05fecdc311a80.js.map",
    "revision": "b778d15d102ca142969cea5006b95fe0"
  },
  {
    "url": "app.a8ad031f1b782bc2f66f.css"
  },
  {
    "url": "chunk-map.json",
    "revision": "622d38e41e37062d5ea542dce2ac7285"
  },
  {
    "url": "common-02db0b3c15fac1b9f580.js"
  },
  {
    "url": "common-02db0b3c15fac1b9f580.js.map",
    "revision": "297853c2611573e7f1035e08fd1daa56"
  },
  {
    "url": "common-29ff6088ee760d1ce96a.js"
  },
  {
    "url": "common-29ff6088ee760d1ce96a.js.map",
    "revision": "64908825407cd2428b89b27736ae7b92"
  },
  {
    "url": "common-86f43d66dc634cc052ab.js"
  },
  {
    "url": "common-86f43d66dc634cc052ab.js.map",
    "revision": "ee1827cf569e7d2c3d5a5951190dbc84"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-ea7988fc457a5ff3b5ab.js"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-ea7988fc457a5ff3b5ab.js.map",
    "revision": "698f7fbe4407918a39552c1d0bc39cea"
  },
  {
    "url": "component---src-pages-404-js-18f9542e3b7836b567dc.js"
  },
  {
    "url": "component---src-pages-404-js-18f9542e3b7836b567dc.js.map",
    "revision": "6a07a117afa08fa6204532dec49ce276"
  },
  {
    "url": "component---src-pages-about-js-01bba79f863468937d7e.js"
  },
  {
    "url": "component---src-pages-about-js-01bba79f863468937d7e.js.map",
    "revision": "869790ba9f592da1376783ffad79dd6a"
  },
  {
    "url": "component---src-pages-about-js-9747246272497ace1096.js"
  },
  {
    "url": "component---src-pages-about-js-9747246272497ace1096.js.map",
    "revision": "cd7b43971c25e8fb94670563ac7dd5ba"
  },
  {
    "url": "component---src-pages-contact-js-08dda29390ea7e1b1c66.js"
  },
  {
    "url": "component---src-pages-contact-js-08dda29390ea7e1b1c66.js.map",
    "revision": "e43ee68c1ebe33f0d7585248acca9c4f"
  },
  {
    "url": "component---src-pages-contact-js-635a91fa6b4cc705e72c.js"
  },
  {
    "url": "component---src-pages-contact-js-635a91fa6b4cc705e72c.js.map",
    "revision": "9babff9b29a942d3d15890e9fcf12f5b"
  },
  {
    "url": "component---src-pages-index-js-03ecc99d01c663c6559d.js"
  },
  {
    "url": "component---src-pages-index-js-03ecc99d01c663c6559d.js.map",
    "revision": "e3f360e4fae373c005358bde3c7b3808"
  },
  {
    "url": "component---src-pages-index-js-04e92392018490eaeb1b.js"
  },
  {
    "url": "component---src-pages-index-js-04e92392018490eaeb1b.js.map",
    "revision": "9ca8f1c97e6acdea8c4c421ea6d80d36"
  },
  {
    "url": "component---src-pages-index-js-1674eff9b8c1447d492a.js"
  },
  {
    "url": "component---src-pages-index-js-1674eff9b8c1447d492a.js.map",
    "revision": "c6817d38b28c643594af55a18f964685"
  },
  {
    "url": "component---src-pages-index-js-33935eaf171250b7468b.js"
  },
  {
    "url": "component---src-pages-index-js-33935eaf171250b7468b.js.map",
    "revision": "0ac9ba76be8b2bd2f1e93f07fd0572bb"
  },
  {
    "url": "component---src-pages-index-js-37427d8b71a263ba0ac9.js"
  },
  {
    "url": "component---src-pages-index-js-37427d8b71a263ba0ac9.js.map",
    "revision": "b6d89ce92e0be8ace61c0e8f81f8335c"
  },
  {
    "url": "component---src-pages-index-js-3e781f88c3d38f340b0b.js"
  },
  {
    "url": "component---src-pages-index-js-3e781f88c3d38f340b0b.js.map",
    "revision": "28a44e1c49f4b711b8e6a23c808dd01f"
  },
  {
    "url": "component---src-pages-index-js-49485edc10520158d5fc.js"
  },
  {
    "url": "component---src-pages-index-js-49485edc10520158d5fc.js.map",
    "revision": "cfdf606b41c95befca67c037e19a52e8"
  },
  {
    "url": "component---src-pages-index-js-49dcc77c00bd267d2e7c.js"
  },
  {
    "url": "component---src-pages-index-js-49dcc77c00bd267d2e7c.js.map",
    "revision": "2047f3802debe1c9c29437abab3ee6fa"
  },
  {
    "url": "component---src-pages-index-js-56a959604c4118384834.js"
  },
  {
    "url": "component---src-pages-index-js-56a959604c4118384834.js.map",
    "revision": "f4ebeeeb98fc5363f68dc46b5c249be5"
  },
  {
    "url": "component---src-pages-index-js-59f5eaefaf36f287b5c5.js"
  },
  {
    "url": "component---src-pages-index-js-59f5eaefaf36f287b5c5.js.map",
    "revision": "09c1295eff22e5e721d107303a3b6535"
  },
  {
    "url": "component---src-pages-index-js-6959dbaf8a89c937ad81.js"
  },
  {
    "url": "component---src-pages-index-js-6959dbaf8a89c937ad81.js.map",
    "revision": "eb7d5ea720b7ba4e36b0882d86c21e60"
  },
  {
    "url": "component---src-pages-index-js-770830d59ff6ef056c0d.js"
  },
  {
    "url": "component---src-pages-index-js-770830d59ff6ef056c0d.js.map",
    "revision": "32595f2648990e5cdda5eb3206e7d666"
  },
  {
    "url": "component---src-pages-index-js-9e47d5561c4f7e142af6.js"
  },
  {
    "url": "component---src-pages-index-js-9e47d5561c4f7e142af6.js.map",
    "revision": "89bc2effd3d1f78f4985f6ef387e31bd"
  },
  {
    "url": "component---src-pages-index-js-a84f7fddf476ec0f5d48.js"
  },
  {
    "url": "component---src-pages-index-js-a84f7fddf476ec0f5d48.js.map",
    "revision": "6ccd68d0c01346202f863ab5a812c79f"
  },
  {
    "url": "component---src-pages-index-js-b23e57eafcf941adbcc6.js"
  },
  {
    "url": "component---src-pages-index-js-b23e57eafcf941adbcc6.js.map",
    "revision": "e8e7a3d10e86d521485e34064e547830"
  },
  {
    "url": "component---src-pages-index-js-bb8f26caa6c868e0e4e7.js"
  },
  {
    "url": "component---src-pages-index-js-bb8f26caa6c868e0e4e7.js.map",
    "revision": "f865639c7659e4a4c1dbe9a532f26e08"
  },
  {
    "url": "component---src-pages-index-js-c7015f83dc39b9bd7cfe.js"
  },
  {
    "url": "component---src-pages-index-js-c7015f83dc39b9bd7cfe.js.map",
    "revision": "2533342310c30e3479841961ab0cd82f"
  },
  {
    "url": "component---src-pages-index-js-cf6744be56f731032439.js"
  },
  {
    "url": "component---src-pages-index-js-cf6744be56f731032439.js.map",
    "revision": "55110a74c05c3ace7b6fb0920e7547bc"
  },
  {
    "url": "component---src-pages-index-js-df3f75b07ef79cfa1b87.js"
  },
  {
    "url": "component---src-pages-index-js-df3f75b07ef79cfa1b87.js.map",
    "revision": "c54e12d1fcabd1cc92914e2a9b2f8726"
  },
  {
    "url": "component---src-pages-index-js-f5651705095969ec7ad1.js"
  },
  {
    "url": "component---src-pages-index-js-f5651705095969ec7ad1.js.map",
    "revision": "c9cf2193b50deceb82e4ce0d252ddcb6"
  },
  {
    "url": "component---src-pages-index-js-f798f53cc53da675c579.js"
  },
  {
    "url": "component---src-pages-index-js-f798f53cc53da675c579.js.map",
    "revision": "2fb8acff248e1e88dc4fccf68e0a2010"
  },
  {
    "url": "component---src-pages-index-js-f9b1edb19dd357557bb1.js"
  },
  {
    "url": "component---src-pages-index-js-f9b1edb19dd357557bb1.js.map",
    "revision": "b002732f7043d115943aeaca964d0ce1"
  },
  {
    "url": "component---src-pages-projects-js-7ee72e72d46ad8cbb462.js"
  },
  {
    "url": "component---src-pages-projects-js-7ee72e72d46ad8cbb462.js.map",
    "revision": "ee491f812d604493b68c7ac305599687"
  },
  {
    "url": "component---src-pages-projects-js-869b9a56b2490048c80b.js"
  },
  {
    "url": "component---src-pages-projects-js-869b9a56b2490048c80b.js.map",
    "revision": "4aeaeb250af01fc66e8c829811dc4255"
  },
  {
    "url": "component---src-pages-projects-js-ab9d15cb418d8afc053b.js"
  },
  {
    "url": "component---src-pages-projects-js-ab9d15cb418d8afc053b.js.map",
    "revision": "c15c3efa3b5674d8179893324247f0b8"
  },
  {
    "url": "component---src-pages-projects-js-cb9c2eb521b61b40802c.js"
  },
  {
    "url": "component---src-pages-projects-js-cb9c2eb521b61b40802c.js.map",
    "revision": "35d00d0ab59f5f4e247990ebfc38c3b9"
  },
  {
    "url": "contact/index.html",
    "revision": "e6d8e37da2799d3b2d3e365a6ea5851e"
  },
  {
    "url": "emotion-6cf803d4c826e2d427b1.js"
  },
  {
    "url": "emotion-6cf803d4c826e2d427b1.js.map",
    "revision": "ea5f016da665b53a4fdb4646c20794ec"
  },
  {
    "url": "emotion-de118d24e570978b526e.js"
  },
  {
    "url": "emotion-de118d24e570978b526e.js.map",
    "revision": "23c9f5759157162919454bdd5c9b85ef"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "cbf80004cd5ab833183c03051685d8f8"
  },
  {
    "url": "fonts/AvenirLTStd-Roman.svg",
    "revision": "bee7fd88c4dfe72e1faac41f17186cdb"
  },
  {
    "url": "fonts/AvenirLTStd-Roman.woff",
    "revision": "9270e77499b993a33ebb44a721d5fc47"
  },
  {
    "url": "fonts/AvenirLTStd-Roman.woff2",
    "revision": "61908ca4c185bd8fb82dfb4e627b2eb2"
  },
  {
    "url": "fonts/fonts.css"
  },
  {
    "url": "fonts/HelveticaNeueLTStd-Bd.svg",
    "revision": "2a54ef5da79e96b3184a6d680305fb63"
  },
  {
    "url": "fonts/HelveticaNeueLTStd-Bd.woff",
    "revision": "0c7d5d335c68c9484f38a12f622141cf"
  },
  {
    "url": "fonts/HelveticaNeueLTStd-Bd.woff2",
    "revision": "68a168e0a78894ff64f9d1d16ee761d2"
  },
  {
    "url": "fonts/HelveticaNeueLTStd-Roman.svg",
    "revision": "c865b460e50f469c36bc8f81cdcee95e"
  },
  {
    "url": "fonts/HelveticaNeueLTStd-Roman.woff",
    "revision": "0508fe495bc458e2d81b90cc98edfbfc"
  },
  {
    "url": "fonts/HelveticaNeueLTStd-Roman.woff2",
    "revision": "5521967698b81e131a6f47de77f80b69"
  },
  {
    "url": "fonts/SabonLTStd-Roman.svg",
    "revision": "7285b907ef4db3eea45bd517b1c2b50d"
  },
  {
    "url": "fonts/SabonLTStd-Roman.woff",
    "revision": "60e65ef00480e08f694be3fd341816d7"
  },
  {
    "url": "fonts/SabonLTStd-Roman.woff2",
    "revision": "fde161ba557eb460af328acb772bca75"
  },
  {
    "url": "icons-308f13698b3738a360d0.js"
  },
  {
    "url": "icons-308f13698b3738a360d0.js.map",
    "revision": "474f6df18e00198af61e302fd9b5f011"
  },
  {
    "url": "icons-bda02d634163d9a1ca5a.js"
  },
  {
    "url": "icons-bda02d634163d9a1ca5a.js.map",
    "revision": "42b22736af0bf52c5634456854d219d8"
  },
  {
    "url": "icons-e47119f8fd39d83aaeda.js"
  },
  {
    "url": "icons-e47119f8fd39d83aaeda.js.map",
    "revision": "a89ffcce5e29340a3fa11e33ac63e384"
  },
  {
    "url": "idb-keyval-3.2.0-iife.min.js"
  },
  {
    "url": "index.html",
    "revision": "0e89110b52d8764cd3ce64666e95b0b0"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "7cee333be19d17910b25bfe68022f385"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "ee567a5861b782ccc5f74ad51d9c1c7c"
  },
  {
    "url": "page-data/404.html/page-data.json",
    "revision": "37addd85c820632ed6d9220a3cb977c0"
  },
  {
    "url": "page-data/404/page-data.json",
    "revision": "5fa78bc9547d443acbf20d396b95765a"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "e50421174d0bca8d467762856aa5f520"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "3be97585b09965b5be5fa29f03559f5b"
  },
  {
    "url": "page-data/contact/page-data.json",
    "revision": "1dc4fa2d77536eb550de3e485e7ddb80"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "0b963a1412ab0d27e264919fba9a0ba1"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "d22fedc5f9585423cf2e45d46cac048f"
  },
  {
    "url": "page-data/projects/page-data.json",
    "revision": "23b530721cd71b85feeb3d3ca8cb84e3"
  },
  {
    "url": "page-data/sq/d/1451598326.json",
    "revision": "5c57656f9874dbdc371c1dbfe7fe6c2e"
  },
  {
    "url": "page-data/sq/d/3068597134.json",
    "revision": "140f5d4e6af430baf200c62307854eca"
  },
  {
    "url": "page-data/sq/d/3211724603.json",
    "revision": "0aac09f157aea53b61d4b75093f38b37"
  },
  {
    "url": "page-data/sq/d/4204347964.json",
    "revision": "2144bc8e2f7b7dce0e5c7d7dff11255a"
  },
  {
    "url": "page-data/sq/d/764694655.json",
    "revision": "5819b7f15d214f318110e81b4baf674e"
  },
  {
    "url": "projects/index.html",
    "revision": "8c1c475a0652a020e9d56f5342d0f944"
  },
  {
    "url": "react-21be866445a21d3fb180.js"
  },
  {
    "url": "react-21be866445a21d3fb180.js.LICENSE.txt",
    "revision": "910ba5c5d7ec250f7aa9aa6b53dca2df"
  },
  {
    "url": "react-21be866445a21d3fb180.js.map",
    "revision": "74fa384640429b98ffb27f650a030dac"
  },
  {
    "url": "sitemap-0.xml",
    "revision": "7b893f9cc6ba3dc97187bdd6701bd2cb"
  },
  {
    "url": "sitemap-index.xml",
    "revision": "7800c26aea0f716ba751ceeeccceb4b8"
  },
  {
    "url": "src/images/elephant_noun_project.png",
    "revision": "4999aa6259609aff9d8b84668a6e3162"
  },
  {
    "url": "static/0b31cf72996d167316623929a8f15b93/11a8d/aspca.png"
  },
  {
    "url": "static/0b31cf72996d167316623929a8f15b93/201fc/aspca.webp"
  },
  {
    "url": "static/0b31cf72996d167316623929a8f15b93/39c77/aspca.webp"
  },
  {
    "url": "static/0b31cf72996d167316623929a8f15b93/4a3cc/aspca.png"
  },
  {
    "url": "static/0b31cf72996d167316623929a8f15b93/c98f8/aspca.avif"
  },
  {
    "url": "static/0b31cf72996d167316623929a8f15b93/ffb6d/aspca.avif"
  },
  {
    "url": "static/2dff70a9d87b48d8e48f37cc5d0e4c29/1d786/iapf.png"
  },
  {
    "url": "static/2dff70a9d87b48d8e48f37cc5d0e4c29/558fb/iapf.avif"
  },
  {
    "url": "static/2dff70a9d87b48d8e48f37cc5d0e4c29/94c1e/iapf.webp"
  },
  {
    "url": "static/2dff70a9d87b48d8e48f37cc5d0e4c29/9c8d0/iapf.webp"
  },
  {
    "url": "static/2dff70a9d87b48d8e48f37cc5d0e4c29/a010d/iapf.avif"
  },
  {
    "url": "static/2dff70a9d87b48d8e48f37cc5d0e4c29/d3720/iapf.png"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/0ee8a/bookmarked_screenshot.webp"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/25d8d/bookmarked_screenshot.avif"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/27ad7/bookmarked_screenshot.avif"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/292c5/bookmarked_screenshot.webp"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/73b95/bookmarked_screenshot.png"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/91c09/bookmarked_screenshot.webp"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/b4235/bookmarked_screenshot.png"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/b68ab/bookmarked_screenshot.avif"
  },
  {
    "url": "static/48a9fd4a1c52f41f9fa8a22f4e648b50/e20b2/bookmarked_screenshot.png"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/1da39/educationELLy_screenshot2.webp"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/24095/educationELLy_screenshot2.avif"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/2e9b2/educationELLy_screenshot2.webp"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/55f0b/educationELLy_screenshot2.png"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/5faa1/educationELLy_screenshot2.webp"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/61176/educationELLy_screenshot2.avif"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/6800f/educationELLy_screenshot2.avif"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/6b540/educationELLy_screenshot2.png"
  },
  {
    "url": "static/4aa904dad1e5f6f51eb8db7b9cf09bed/82549/educationELLy_screenshot2.png"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/4d674/code-talk_screenshot.webp"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/636a4/code-talk_screenshot.avif"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/641d8/code-talk_screenshot.png"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/6a725/code-talk_screenshot.png"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/7f749/code-talk_screenshot.avif"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/82575/code-talk_screenshot.webp"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/85099/code-talk_screenshot.avif"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/a2dca/code-talk_screenshot.png"
  },
  {
    "url": "static/57b938154362aa7839f73775c9ebaf0a/e8f81/code-talk_screenshot.webp"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/0a5f3/bookmarked_screenshot2.webp"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/3011d/bookmarked_screenshot2.avif"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/4b63d/bookmarked_screenshot2.avif"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/4bb76/bookmarked_screenshot2.png"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/7134c/bookmarked_screenshot2.png"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/d17b2/bookmarked_screenshot2.avif"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/d351e/bookmarked_screenshot2.webp"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/de802/bookmarked_screenshot2.png"
  },
  {
    "url": "static/5c68b8fe1e7267cd88881fae49b58c60/eef68/bookmarked_screenshot2.webp"
  },
  {
    "url": "static/7f393da51d3e85fae2337c015b5b9e5c/32d11/logo_elephant_100x100.png"
  },
  {
    "url": "static/7f393da51d3e85fae2337c015b5b9e5c/938c9/logo_elephant_100x100.webp"
  },
  {
    "url": "static/7f393da51d3e85fae2337c015b5b9e5c/ca926/logo_elephant_100x100.avif"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/12219/elephant-developer.avif"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/13beb/elephant-developer.avif"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/2203e/elephant-developer.webp"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/28898/elephant-developer.avif"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/725d3/elephant-developer.webp"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/80940/elephant-developer.webp"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/845ad/elephant-developer.png"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/86b8a/elephant-developer.png"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/8cec7/elephant-developer.png"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/95edf/elephant-developer.webp"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/b78ce/elephant-developer.png"
  },
  {
    "url": "static/80cbe93869928de756f16e0617e3df07/feab1/elephant-developer.avif"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/03569/educationELLy_screenshot.webp"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/49098/educationELLy_screenshot.webp"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/4a62f/educationELLy_screenshot.avif"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/75451/educationELLy_screenshot.avif"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/7cd52/educationELLy_screenshot.png"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/c1e8e/educationELLy_screenshot.webp"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/f3220/educationELLy_screenshot.avif"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/f595f/educationELLy_screenshot.png"
  },
  {
    "url": "static/983f693057d48b48e693586fd54cf656/f9208/educationELLy_screenshot.png"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/565e3/code-talk_screenshot2.png"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/6175a/code-talk_screenshot2.webp"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/647ce/code-talk_screenshot2.webp"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/7e871/code-talk_screenshot2.png"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/a9d2f/code-talk_screenshot2.avif"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/c8bc1/code-talk_screenshot2.png"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/cba20/code-talk_screenshot2.avif"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/cbdee/code-talk_screenshot2.webp"
  },
  {
    "url": "static/9ab93126be00ba7cc14875ca9f2ca8d0/df1dd/code-talk_screenshot2.avif"
  },
  {
    "url": "static/AvenirLTStd-Roman-0147f25890093689d6481f8267ef7e59.svg"
  },
  {
    "url": "static/AvenirLTStd-Roman-70b1968f01e80186bc97a6d90c29eef9.woff"
  },
  {
    "url": "static/AvenirLTStd-Roman-8f5b2f423ae0d005f83b41151436912a.woff2"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/00255/code-companions.webp"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/0d35c/code-companions.png"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/254d5/code-companions.png"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/2f3ca/code-companions.webp"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/369ee/code-companions.avif"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/446db/code-companions.png"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/4a9a5/code-companions.png"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/52fad/code-companions.webp"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/6a35f/code-companions.avif"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/94dbf/code-companions.webp"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/9ed4f/code-companions.avif"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/a728d/code-companions.avif"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/b889c/code-companions.webp"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/f08a8/code-companions.avif"
  },
  {
    "url": "static/d67f79ef56850dd0083ef7b6a5dfff63/f8d3f/code-companions.png"
  },
  {
    "url": "static/HelveticaNeueLTStd-Bd-2362598f4cd3a66f1cf40613b24ab194.woff"
  },
  {
    "url": "static/HelveticaNeueLTStd-Bd-b5317469c3c586905a894a9be299dcac.svg"
  },
  {
    "url": "static/HelveticaNeueLTStd-Bd-bbb79d9bdafc74236e9b43cffda47cfa.woff2"
  },
  {
    "url": "static/HelveticaNeueLTStd-Roman-7f0f446e51c6bab16fb8f213b7eb1abd.woff2"
  },
  {
    "url": "static/HelveticaNeueLTStd-Roman-995f2b86acde78124ef5515d5e0c3f90.svg"
  },
  {
    "url": "static/HelveticaNeueLTStd-Roman-abd662a85b398f76f0d2c88ccc243ee8.woff"
  },
  {
    "url": "static/SabonLTStd-Roman-1d54350f6674d9f590286906a34ba2e7.woff"
  },
  {
    "url": "static/SabonLTStd-Roman-a08130e1925c1b14dc883bb9a2209c77.svg"
  },
  {
    "url": "static/SabonLTStd-Roman-af78f3afcc26e4fd8517117784d94d4a.woff2"
  },
  {
    "url": "vendors-e554105b5c14cd9f9f44.js"
  },
  {
    "url": "vendors-e554105b5c14cd9f9f44.js.LICENSE.txt",
    "revision": "d2d6c48632fd8e77cb7fe14264410a37"
  },
  {
    "url": "vendors-e554105b5c14cd9f9f44.js.map",
    "revision": "234a0033a02bd56c1ac1a40d36f86f83"
  },
  {
    "url": "webpack-runtime-0ccb56727e8a244d0da5.js"
  },
  {
    "url": "webpack-runtime-0ccb56727e8a244d0da5.js.map",
    "revision": "043b8ba04ec4da4fd8a55d450688a564"
  },
  {
    "url": "webpack-runtime-2d23427118b74e9113da.js"
  },
  {
    "url": "webpack-runtime-2d23427118b74e9113da.js.map",
    "revision": "f15a1fe5b0b4ea5f41b4c00a34e692c2"
  },
  {
    "url": "webpack-runtime-2e0e410d8e1b64de4f85.js"
  },
  {
    "url": "webpack-runtime-2e0e410d8e1b64de4f85.js.map",
    "revision": "ab57da2ed95bb0bf203c96a3662ca46d"
  },
  {
    "url": "webpack-runtime-3a013585d883ce6b03c0.js"
  },
  {
    "url": "webpack-runtime-3a013585d883ce6b03c0.js.map",
    "revision": "e6bab3bc4d1b0eb122a8cef158be4f23"
  },
  {
    "url": "webpack-runtime-544c48d5057115de566e.js"
  },
  {
    "url": "webpack-runtime-544c48d5057115de566e.js.map",
    "revision": "1280c1649e15184fb9c92bfef80d16c6"
  },
  {
    "url": "webpack-runtime-697b2e88cbc6099a7f2f.js"
  },
  {
    "url": "webpack-runtime-697b2e88cbc6099a7f2f.js.map",
    "revision": "956a59e226403cab683c970030ee6191"
  },
  {
    "url": "webpack-runtime-7379de84f96f98aee582.js"
  },
  {
    "url": "webpack-runtime-7379de84f96f98aee582.js.map",
    "revision": "6a5c30f6531935cac067e8dd17e9ee63"
  },
  {
    "url": "webpack-runtime-78b0c656d43e24476a77.js"
  },
  {
    "url": "webpack-runtime-78b0c656d43e24476a77.js.map",
    "revision": "af3f6f6b1c9d99efb070bc633f0f4bc6"
  },
  {
    "url": "webpack-runtime-7cc421ec46ac2298636e.js"
  },
  {
    "url": "webpack-runtime-7cc421ec46ac2298636e.js.map",
    "revision": "74d367a5be18b56305c196e4ff6e08b9"
  },
  {
    "url": "webpack-runtime-896b76de6f0e8e01ab79.js"
  },
  {
    "url": "webpack-runtime-896b76de6f0e8e01ab79.js.map",
    "revision": "acae0f15ec86d0b0b61c12b9a00d7c3a"
  },
  {
    "url": "webpack-runtime-8f67fa5dac7ba3f94851.js"
  },
  {
    "url": "webpack-runtime-8f67fa5dac7ba3f94851.js.map",
    "revision": "5d83a97679552047b1c0f8be89c72337"
  },
  {
    "url": "webpack-runtime-938f5ea4441e670a84c6.js"
  },
  {
    "url": "webpack-runtime-938f5ea4441e670a84c6.js.map",
    "revision": "fb2237ff1f53741baa24b12bb67b7f44"
  },
  {
    "url": "webpack-runtime-9fd6d75d59fc41d5c8f6.js"
  },
  {
    "url": "webpack-runtime-9fd6d75d59fc41d5c8f6.js.map",
    "revision": "4276da24e52952443d32116303939acf"
  },
  {
    "url": "webpack-runtime-ab2c096371f6789b62a5.js"
  },
  {
    "url": "webpack-runtime-ab2c096371f6789b62a5.js.map",
    "revision": "69143240a471c5806ee371a02470325e"
  },
  {
    "url": "webpack-runtime-aee5e46b9f6f20cd4780.js"
  },
  {
    "url": "webpack-runtime-aee5e46b9f6f20cd4780.js.map",
    "revision": "794d54e071d3d28e339a3dbbf551ef0e"
  },
  {
    "url": "webpack-runtime-af61e1657bc0b81c79ba.js"
  },
  {
    "url": "webpack-runtime-af61e1657bc0b81c79ba.js.map",
    "revision": "af4922d6207cdcaf84d1d02d39487e14"
  },
  {
    "url": "webpack-runtime-af791cf0d4e6e9c19404.js"
  },
  {
    "url": "webpack-runtime-af791cf0d4e6e9c19404.js.map",
    "revision": "6c9510e8e4f099c4a4619b772e4dc2da"
  },
  {
    "url": "webpack-runtime-b362599505282b53bd1c.js"
  },
  {
    "url": "webpack-runtime-b362599505282b53bd1c.js.map",
    "revision": "b67d061a73611309ce292f6e12436223"
  },
  {
    "url": "webpack-runtime-b58269287692ce46c55e.js"
  },
  {
    "url": "webpack-runtime-b58269287692ce46c55e.js.map",
    "revision": "53f2b7ff39286a8c9c15566aad235bc8"
  },
  {
    "url": "webpack-runtime-b938c249485b057f7165.js"
  },
  {
    "url": "webpack-runtime-b938c249485b057f7165.js.map",
    "revision": "f363558cfe899e2c1ff67e1716e7ebb2"
  },
  {
    "url": "webpack-runtime-d91a311ad13a4646f222.js"
  },
  {
    "url": "webpack-runtime-d91a311ad13a4646f222.js.map",
    "revision": "765e3dee368983f8b195e432362022ac"
  },
  {
    "url": "webpack-runtime-eb679c563aaaa9f0c653.js"
  },
  {
    "url": "webpack-runtime-eb679c563aaaa9f0c653.js.map",
    "revision": "a5291d4ff58c07b90d0d23cf92db7d1d"
  },
  {
    "url": "webpack-runtime-ee65bf9c86f5bb90e1a9.js"
  },
  {
    "url": "webpack-runtime-ee65bf9c86f5bb90e1a9.js.map",
    "revision": "2504f44162663cbdd124f4690a7fbef0"
  },
  {
    "url": "webpack-runtime-f371bb90a0f81af19bd0.js"
  },
  {
    "url": "webpack-runtime-f371bb90a0f81af19bd0.js.map",
    "revision": "8dd7bc7d320a75b38fdd3e06e1caf36c"
  },
  {
    "url": "webpack-runtime-fbfa9189bc7f66a696f2.js"
  },
  {
    "url": "webpack-runtime-fbfa9189bc7f66a696f2.js.map",
    "revision": "77b090bbcefab085eadf96961ded436a"
  },
  {
    "url": "webpack.stats.json",
    "revision": "615e558567734b0ed2dec044a3961751"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())

    // We detected compilation hash mismatch
    // we should clear runtime cache as data
    // files might be out of sync and we should
    // do fresh fetches for them
    event.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            if (key && key.includes(`runtime`)) {
              return caches.delete(key)
            }

            return Promise.resolve()
          })
        )
      })
    )
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-4753576622d7a8a3c050.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
