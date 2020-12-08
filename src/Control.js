/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
export class controlClass {
    constructor() {
        L.Control.MapController = L.Control.extend({
            onAdd: (map) => {
                const Data = document.getElementById("UI");
                Data.style.display = "";
                return Data;
            },

            onRemove: function(map) {
                // Nothing to do here
            }
        });
    }
}