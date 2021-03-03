/* eslint-disable no-undef */
import { utilClass, controlClass } from "./Utils.js";
import "./style.css";
import Systems from "./Systems.json";
import Links from "./Links.json";
import LBorders from "./LBorders.json";
const LoadedSystems = new Map();
const LoadedLinks = [];
const mainMap = L.map("mainMap", {
    maxBounds: [[0, 0], [1, 1]],
    minZoom: 10,
    maxZoom: 20
});
const Utils = new utilClass(mainMap, LoadedSystems, LoadedLinks);
new controlClass();
mainMap.createPane("linksPane").style.zIndex = 450;
mainMap.createPane("systemsPane").style.zIndex = 455;
mainMap.createPane("lBordersPane").style.zIndex = 460;

Dark.addEventListener("click", () => Utils.handleDark(true));
mapOverlay.addEventListener("click", () => Utils.handleMapOverlay(true));
devSwitch.addEventListener("click", () => Utils.toggleSwitch("devSwitch"));
SystemsSearch.addEventListener("input", (event) => Utils.populateSearchResults(event.target.value, LoadedSystems));

// Code for populating the map with systems
const populateMap = async () => {
    mainMap.eachLayer((layer) => {
        layer.remove();
    });

    Systems.forEach((value) => {
        L.circle(value.Location, {
            radius: 100,
            stroke: false,
            color: value.Security == "Core" ? "#00ff00" : value.Security == "Secure" ? "#00ffff" : value.Security == "Unsecure" ? "#ff0000" : "#ff00ff",
            fillOpacity: 1,
            pane: "systemsPane"
        }).bindPopup(Utils.newPopup(value)).addTo(mainMap);
        LoadedSystems.set(value.Name, {
            "Security": value.Security,
            "Location": value.Location
        });
    });
    Links.forEach((value) => {
        const Loc1 = LoadedSystems.get(value[0]).Location;
        const Loc2 = LoadedSystems.get(value[1]).Location;
        if (Loc1 && Loc2) {
            const polyline = L.polyline([Loc1, Loc2], {
                color: "darkgray",
                pane: "linksPane",
                weight: mainMap.getZoom() - 10
            }).bindPopup(`${value[0]} - ${value[1]}`).addTo(mainMap);
            mainMap.on("zoomend", async () => {
                //const zoomLevel = mainMap.getZoom();
                polyline.setStyle({
                    color: "darkgray",
                    pane: "linksPane",
                    weight: mainMap.getZoom() - 10
                });
            });
            LoadedLinks.push(polyline);
        } else {
            console.warn(`Unsatisfied link: ${value}`);
        }
    });
    LBorders.forEach((value) => {
        L.polyline(value.Locations, {
            color: value.Color,
            pane: "lBordersPane",
            weight: 6
        }).bindPopup(`${value.Name} border`).addTo(mainMap);
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
    Utils.populateSearchResults("", new Map());
    window.localStorage.getItem("mapOverlay") === "true" ? L.imageOverlay("./StarscapeMap.png", [[0, 0], [1, 1]], {
        pane: "tilePane"
    }).addTo(mainMap) : undefined;
})();

// Log 1, I surrender. I am not smart enough to make tiles for this, and I have decided to just use image overlays. I am gonna keep shit at 1,1 coordinates

// Dev stuff ;)
window.DevData = [];

if (window.localStorage.getItem("devSwitch") === "true" && window.localStorage.getItem("developer") === "true") {
    console.log("Using Systems");
    devPane.style.display = "";
    window.handleDevForm = (self) => {
        const Data = {
            "Name": self.elements.Name.value,
            "Security": self.elements.Security.value,
            "About": self.elements.About.value,
            "HelpURL": self.elements.HelpURL.value,
            "Location": self.attributes.location.value
        };
        window.DevData.push(JSON.parse(JSON.stringify(Data).replace("\"LatLng(", "[").replace(")\"", "]")));
        return false;
    };
    mainMap.on("click", async (e) => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(await Utils.createDeveloperElement(e.latlng))
            .openOn(mainMap);
    });
} else if (window.localStorage.getItem("developer") === "true") {
    console.log("Using Links");
    devPane.style.display = "";
    let Modifier = false;
    let Cache = [];
    window.onkeydown = (e) => {
        e.shiftKey ? Modifier = !Modifier : undefined;
        e.key == "c" ? Cache = [] : undefined;
        console.log(Modifier);
    };

    mainMap.on("popupopen", (Popup) => {
        if (Modifier) {
            const Name = Popup.popup.getContent().children.item(0).innerText.slice(6); // Very Hacky method
            Cache.push(Name);
            console.log(Cache);
            if (Cache.length >= 2) {
                window.DevData.push(Cache);
                Cache = [];
            }
        }
    });
} else {
    devPane.style.display = "none";
}