/* eslint-disable no-undef */
import { utilClass } from "./Utils.js";
const Utils = new utilClass();
const LoadedSystems = new Map();
const LoadedLinks = [];
const mainMap = L.map("mainMap", {
    maxBounds: [[0, 0], [1, 1]],
    minZoom: 10,
    maxZoom: 20
});
mainMap.createPane("linksPane").style.zIndex = 450;
mainMap.createPane("systemsPane").style.zIndex = 455;

// Dev stuff ;)
const onMapClick = async (e) => {
    if (window.localStorage.getItem("developer") === "true") {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(Utils.createDeveloperElement(e.latlng))
            .openOn(mainMap);
    }
};
mainMap.on("click", onMapClick);

// Code for populating the map with systems
const populateMap = async () => {
    {
        const xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", "Systems.json", true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState === 4 && xobj.status === 200) {
                const Data = JSON.parse(xobj.responseText);
                Data.forEach(async (value) => {
                    L.circle(value.Location, {
                        radius: 100,
                        stroke: false,
                        color: value.Security == "Core" ? "#00ff00" : value.Security == "Secure" ? "#00ffff" : value.Security == "Unsecure" ? "#ff0000" : "#ff00ff",
                        fillOpacity: 1,
                        pane: "systemsPane"
                    }).bindPopup(Utils.newPopup(value)).addTo(mainMap);
                    LoadedSystems.set(value.Name, value.Location);
                });
            }
        };
        xobj.send();
    }
    {
        const xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", "Links.json", true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState === 4 && xobj.status === 200) {
                const Data = JSON.parse(xobj.responseText);
                Data.forEach(async (value) => {
                    if (LoadedSystems.get(value[0]) && LoadedSystems.get(value[1])) {
                        L.polyline([LoadedSystems.get(value[0]), LoadedSystems.get(value[1])], {
                            color: "#272727",
                            pane: "linksPane"
                        }).addTo(mainMap);
                        LoadedLinks.push(value);
                    } else {
                        console.warn(`Unsatisfied link: ${value}`);
                    }
                });
            }
        };
        xobj.send();
    }
};

// Code to run once page loads
(async () => {
    const onresize = async () => {
        // Compute the absolute coordinates and dimensions of mainMap.
        let x = 0;
        let y = 0;
        const mainMap = document.getElementById("mainMap");
        let element = document.getElementById("mainDiv");
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position mainMap over mainDiv
        mainMap.style.left = x + "px";
        mainMap.style.top = y + "px";
        mainMap.style.width = (document.documentElement.clientWidth) + "px";
        mainMap.style.height = (document.documentElement.clientHeight) + "px";
    };
    window.addEventListener("resize", onresize, false);
    onresize();

    mainMap.setView([0.5, 0.5], 15);
    window.localStorage.getItem("developer") === "true" ? L.imageOverlay("./StarscapeMap.png", [[0, 0], [1, 1]]).addTo(mainMap) : undefined;

    populateMap();
})();

// Log 1, I surrender. I am not smart enough to make tiles for this, and I have decided to just use image overlays. I am gonna keep shit at 1,1 coordinates