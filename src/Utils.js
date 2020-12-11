/* eslint-disable no-undef */
export class utilClass {
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

    createDeveloperElement(latlng) {
        const Data = document.getElementById("devFormForSystemsIDK");
        Data.setAttribute("location", latlng);
        Data.style.display = "";
        return Data;
    }

    async handleDark(changeState) {
        changeState ? await this.toggleSwitch("dark") : undefined;
    
        if (window.localStorage.getItem("dark") === "true") {
            DarkReader.enable();
            document.getElementById("Dark").innerText = "Dark mode enabled";
        } else {
            DarkReader.disable();
            document.getElementById("Dark").innerText = "Dark mode disabled";
        }
    }

    async handleMapOverlay(changeState) {
        changeState ? await this.toggleSwitch("mapOverlay") : undefined;

        if (window.localStorage.getItem("mapOverlay") === "true") {
            document.getElementById("mapOverlay").innerText = `Mapoverlay on${changeState ? " (Please reload for effects to work)" : ""}`;
        } else {
            document.getElementById("mapOverlay").innerText = `Mapoverlay off${changeState ? " (Please reload for effects to work)" : ""}`;
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