// ==UserScript==
 // @name         r/place Alliance of New York Institutions bot
 // @namespace    http://tampermonkey.net/
 // @version      1.0
 // @description  place tile bot
 // @author       Thanks Jared.
 // @match        https://hot-potato.reddit.com/embed*
 // @updateURL    https://gist.github.com/Alliance-of-New-York/0cd5ba86762b88d649218d92afc7a3cf/raw/placetesla.user.js
 // @downloadURL  https://gist.github.com/Alliance-of-New-York/0cd5ba86762b88d649218d92afc7a3cf/raw/placetesla.user.js
 // @grant        GM_xmlhttpRequest
 // @connect      raw.githubusercontent.com
 // ==/UserScript==

const UPDATEURL = "https://gist.github.com/Alliance-of-New-York/0cd5ba86762b88d649218d92afc7a3cf";

 (function () {
    "use strict";

    async function runScript(theCanvas) {
        const placeApi = getPlaceApi(theCanvas);

        // console.log(placeApi.getPixel(616,948));
        // await placeApi.setPixel(616,948, "#000000");
        // console.log(placeApi.getPixel(616,948));

        var ata_template = [
            [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 23, 23, 23, 23, 23, 23, 23, 23, 23, 12, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,],
            [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
            [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18]];

        let newDiv = document.createElement('div');
        newDiv.innerHTML = "bot v4.0 <a target='_blank' href=" + UPDATEURL + ">click here</a> and click \"raw\" to update bot. please update bot every hour!";
        document.body.prepend(newDiv);
        newDiv.style.position = "absolute";
        newDiv.style.backgroundColor = "red";
        newDiv.style.width = "10%";
        newDiv.style.height = "25%";
        newDiv.style.color = "white";
        newDiv.style["z-index"] = "9999";

        let xStart = 1038;
        let yStart = 209;
        let xEnd = xStart + ata_template[0].length - 1;
        let yEnd = yStart + ata_template.length - 1;

        console.log('Coordinates: ', xStart, yStart, 'to', xEnd, yEnd);

        setTimeout(async () => {
            while(true) {
                for(let y = yStart; y <= yEnd; y++) {
                    for(let x = xStart; x <= xEnd; x++) {
                        var selectedPixel = placeApi.getPixel(x, y);

                        var y_set = ata_template[y-yStart]
                        var pixel_color_index = y_set[x-xStart]

                        if (colorMap[selectedPixel] !== pixel_color_index)
                        {
                            await placeApi.setPixel(x, y, pixel_color_index);
                            console.log("set pixel", x, ",", y);
                            await sleep(5 * 60 * 1000 + 2000); // 5 minutes and 2 seconds
                            break;
                        }
                        else {
                            console.log('skipping', x, y);
                            await sleep(150);
                        }
                    }
                }


                // console.log(x, y, placeApi.getPixel(x, y));
                // if (placeApi.getPixel(x, y) !== humanColorMap.black) {
                //     console.log("setting", x, ",", y);
                //     await placeApi.setPixel(x, y, humanColorMap.black);
                //     return true;
                // }

            }
        }, 5000);
    }

    const humanColorMap = {
        black: "#000",
    };
    const colorMap = {
        "#FF450": 2,
        "#FFA80": 3,
        "#FFD635": 4,
        "#0A368": 6,
        "#7EED56": 8,
        "#2450A4": 12,
        "#3690EA": 13,
        "#51E9F4": 14,
        "#811E9F": 18,
        "#B44AC0": 19,
        "#FF99AA": 23,
        "#9C6926": 25,
        "#000": 27,
        "#898D90": 29,
        "#D4D7D9": 30,
        "#FFFFFF": 31,
    };

    const isReadyInterval = setInterval(() => {
        const theCanvas = document
            .querySelector("mona-lisa-embed")
            ?.shadowRoot?.querySelector("mona-lisa-camera")
            ?.querySelector("mona-lisa-canvas")
            ?.shadowRoot?.querySelector("canvas");

        if (theCanvas && document.querySelector("mona-lisa-embed")?.shadowRoot?.querySelector("mona-lisa-overlay")?.shadowRoot.children.length === 0) {
            clearInterval(isReadyInterval);
            runScript(theCanvas);
        }
    }, 500);

    function getPlaceApi(theCanvas) {
        const context = theCanvas.getContext("2d");

        return {
            getPixel: (x, y) => {
                const data = context.getImageData(x, y, 1, 1).data;
                return rgbToHex(data[0], data[1], data[2]);
            },
            setPixel: async (x, y, color) => {
                theCanvas.dispatchEvent(createEvent("click-canvas", { x, y }));
                await sleep(1000);
                theCanvas.dispatchEvent(
                    createEvent("select-color", { color: color })
                );
                await sleep(1000);
                theCanvas.dispatchEvent(createEvent("confirm-pixel"));
            },
        };
    }



    function createEvent(e, t) {
        return new CustomEvent(e, {
            composed: !0,
            bubbles: !0,
            cancelable: !0,
            detail: t,
        });
    }

    function sleep(ms) {
        return new Promise((response) => setTimeout(response, ms));
    }

    function rgbToHex(r, g, b) {
        return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`.toUpperCase();
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function GM_fetch(url, opt){
        function blobTo(to, blob) {
            if (to == "arrayBuffer" && blob.arrayBuffer) return blob.arrayBuffer()
            return new Promise((resolve, reject) => {
                var fileReader = new FileReader()
                fileReader.onload = function (event) { if (to == "base64") resolve(event.target.result); else resolve(event.target.result) }
                if (to == "arrayBuffer") fileReader.readAsArrayBuffer(blob)
                else if (to == "base64") fileReader.readAsDataURL(blob) // "data:*/*;base64,......"
                else if (to == "text") fileReader.readAsText(blob, "utf-8")
                else reject("unknown to")
            })
        }
        return new Promise((resolve, reject)=>{
            // https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_xmlhttpRequest
            opt = opt || {}
            opt.url = url
            opt.data = opt.body
            opt.responseType = "blob"
            opt.onload = (resp)=>{
                var blob = resp.response
                resp.blob = ()=>Promise.resolve(blob)
                resp.arrayBuffer = ()=>blobTo("arrayBuffer", blob)
                resp.text = ()=>blobTo("text", blob)
                resp.json = async ()=>JSON.parse(await blobTo("text", blob))
                resolve(resp)
            }
            opt.ontimeout = ()=>reject("fetch timeout")
            opt.onerror   = ()=>reject("fetch error")
            opt.onabort   = ()=>reject("fetch abort")
            GM_xmlhttpRequest(opt)
        })
    }
})();