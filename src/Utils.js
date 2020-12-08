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
        const Data = document.getElementById("myForm");
        Data.setAttribute("location", latlng);
        Data.style.display = "";
        return Data;
    }

    /*
    compareLinks(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === 2 &&
            b.length === 2 &&
            a.every((val) => b.find((val2) => val == val2));
    }
    */
}