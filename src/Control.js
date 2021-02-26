/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
export class controlClass {
    constructor() {
        L.Control.MapController = L.Control.extend({
            onAdd: (map) => {
                const Data = UI;
                L.DomEvent.disableScrollPropagation(Data);
                L.DomEvent.disableClickPropagation(Data);
                Data.style.display = "";
                return Data;
            },

            onRemove: () => {
                // Nothing to do here
            }
        });
    }
}