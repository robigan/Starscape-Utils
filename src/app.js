/* eslint-disable no-undef */
import { utilClass } from "./Utils.js";
import { controlClass } from "./Control.js";
const Utils = new utilClass();
new controlClass();
const LoadedSystems = new Map();
const LoadedLinks = [];
const mainMap = L.map("mainMap", {
    maxBounds: [[0, 0], [1, 1]],
    minZoom: 10,
    maxZoom: 20
});
mainMap.createPane("linksPane").style.zIndex = 450;
mainMap.createPane("systemsPane").style.zIndex = 455;
mainMap.createPane("lBordersPane").style.zIndex = 460;

// Dev stuff ;)
const TestData = [];
const TestFunc = (latlng) => {
    TestData.push([latlng.lat.toString().slice(0, 7), latlng.lng.toString().slice(0, 7)]);
    console.log(JSON.stringify(TestData));
    return `[${latlng.lat.toString().slice(0, 7)}, ${latlng.lng.toString().slice(0, 7)}]`;
};
const onMapClick = async (e) => {
    if (window.localStorage.getItem("developer") === "true") {
        document.getElementById("devPane").style.display = "";
        L.popup()
            .setLatLng(e.latlng)
            .setContent(/*Utils.createDeveloperElement(e.latlng)*/TestFunc(e.latlng))
            .openOn(mainMap);
    } else {
        document.getElementById("devPane").style.display = "none";
    }
};
mainMap.on("click", onMapClick);

document.getElementById("Dark").addEventListener("click", () => Utils.handleDark(true));
document.getElementById("mapOverlay").addEventListener("click", () => Utils.handleMapOverlay(true));

// Code for populating the map with systems
const populateMap = async () => {
    mainMap.eachLayer((layer) => {
        layer.remove();
    });
    //So that at least the fetch for Links.json is run even if the systems are still being rendered

    await fetch("./Systems.json").then((Data) => {
        Data.json().then((Json) => {
            Json.forEach((value) => {
                L.circle(value.Location, {
                    radius: 100,
                    stroke: false,
                    color: value.Security == "Core" ? "#00ff00" : value.Security == "Secure" ? "#00ffff" : value.Security == "Unsecure" ? "#ff0000" : "#ff00ff",
                    fillOpacity: 1,
                    pane: "systemsPane"
                }).bindPopup(Utils.newPopup(value)).addTo(mainMap);
                LoadedSystems.set(value.Name, value.Location);
            });
        });
    }).catch(err => {
        console.error(err);
    });
    await fetch("./Links.json").then((Data) => {
        Data.json().then((Json) => {
            Json.forEach((value) => {
                if (LoadedSystems.get(value[0]) && LoadedSystems.get(value[1])) {
                    L.polyline([LoadedSystems.get(value[0]), LoadedSystems.get(value[1])], {
                        color: "darkgray",
                        pane: "linksPane"
                    }).bindPopup(`${value[0]} - ${value[1]}`).addTo(mainMap);
                    LoadedLinks.push(value);
                } else {
                    console.warn(`Unsatisfied link: ${value}`);
                }
            });
        });
    }).catch(err => {
        console.error(err);
    });
    await fetch("./LBorders.json").then((Data) => {
        Data.json().then((Json) => {
            Json.forEach((value) => {
                L.polyline(value.Locations, {
                    color: value.Color,
                    pane: "lBordersPane"
                }).bindPopup(`${value.Name} border`).addTo(mainMap);
            });
        });
    }).catch(err => {
        console.error(err);
    });

    // Callback hell ugh, couldn't find any other way tho using async/await or couldn't come up with a way
};

// Code to run once page loads
(async () => {
    DarkReader.setFetchMethod(window.fetch);
    Utils.handleDark();
    const onresize = async () => {
        const mainMap = document.getElementById("mainMap");
        mainMap.style.left = "0px";
        mainMap.style.top = "0px";
        mainMap.style.width = (document.documentElement.clientWidth) + "px";
        mainMap.style.height = (document.documentElement.clientHeight) + "px";
    };
    window.addEventListener("resize", onresize, false);
    onresize();

    mainMap.setView([0.5, 0.5], 15);

    populateMap();
    (() => {
        return new L.Control.MapController({
            position: "topleft"
        });
    })().addTo(mainMap);

    Utils.handleMapOverlay();
    window.localStorage.getItem("mapOverlay") === "true" ? L.imageOverlay("./StarscapeMap.png", [[0, 0], [1, 1]], {
        pane: "tilePane"
    }).addTo(mainMap) : undefined;
})();

// Log 1, I surrender. I am not smart enough to make tiles for this, and I have decided to just use image overlays. I am gonna keep shit at 1,1 coordinates