/* eslint-disable no-undef */
export class utilClass {
    constructor(mainMap, LoadedSystems, /*LoadedLinks*/) {
        this.mainMap = mainMap;
        this.LoadedSystems = LoadedSystems;
        //this.LoadedLinks = LoadedLinks;
    }

    newPopup(Properties = { Name: "Undefined", Security: "Undefined" }) {
        Properties.Name ? undefined : Properties.Name = "Undefined";
        Properties.Security ? undefined : Properties.Security = "Undefined";
        const Element = document.createElement("div");
        Element.appendChild(this.newPElement(`Name: ${Properties.Name}`));
        Element.appendChild(this.newPElement(`Security: ${Properties.Security}`));
        Properties.About ? Element.appendChild(this.newPElement(Properties.About)) : undefined;
        Properties.HelpURL ? Element.appendChild(this.newHelpElement(Properties.HelpURL, "More on the unofficial Wiki")) : undefined;
        return Element;
    }

    newPElement(Text) {
        const Tag = document.createElement("p");
        Tag.innerText = Text;
        Tag.style.margin = 0;
        return Tag;
    }

    newHelpElement(URL, Text) {
        const A = document.createElement("a");
        A.innerText = Text;
        A.href = URL;
        A.target = "_blank";
        A.style.margin = 0;
        A.style.marginTop = 8;
        return A;
    }

    async populateSearchResults(SearchTerm, Map) {
        const El = SystemsSearchResults;
        El.innerText = "";
        if (SearchTerm && typeof(SearchTerm) === "string" && SearchTerm !== "") {
            El.style.display = "";
            const RawData = Map.keys();
            const RE = new RegExp(SearchTerm.toLowerCase());
            for (const Name of RawData) {
                const PEl = this.newPElement(Name);
                PEl.addEventListener("click", () => this.mainMap.flyTo(Map.get(Name).Location));
                RE.test(Name.toLowerCase()) ? El.appendChild(PEl) : undefined;
            }
        } else {
            El.style.display = "none";
        }
    }

    async createDeveloperElement(latlng) {
        const Data = devFormForSystemsIDK;
        Data.setAttribute("location", latlng);
        Data.style.display = "";
        return Data;
    }

    async handleDark(changeState) {
        changeState ? await this.toggleSwitch("dark") : undefined;

        if (window.localStorage.getItem("dark") === "true") {
            DarkReader.enable();
            Dark.innerText = "Dark mode enabled";
        } else {
            DarkReader.disable();
            Dark.innerText = "Dark mode disabled";
        }
    }

    async handleMapOverlay(changeState) {
        changeState ? await this.toggleSwitch("mapOverlay") : undefined;

        if (window.localStorage.getItem("mapOverlay") === "true") {
            mapOverlay.innerText = `Mapoverlay on${changeState ? " (Please reload for effects to work)" : ""}`;
        } else {
            mapOverlay.innerText = `Mapoverlay off${changeState ? " (Please reload for effects to work)" : ""}`;
        }
    }

    async toggleSwitch(propertyName) {
        if (window.localStorage.getItem(propertyName) === "true") {
            window.localStorage.setItem(propertyName, false);
        } else if (window.localStorage.getItem(propertyName) === "false") {
            window.localStorage.setItem(propertyName, true);
        } else if (window.localStorage.getItem(propertyName) === null) {
            window.localStorage.setItem(propertyName, true);
        }
    }
}