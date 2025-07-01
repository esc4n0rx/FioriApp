sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
            // Inicialização do controller
        },

        /**
         * Navega para a tela de relatório de inventário
         */
        onNavigateToInventoryReport() {
            this.getRouter().navTo("InventoryReport");
        },

        /**
         * Obtém o router da aplicação
         * @returns {sap.ui.core.routing.Router} Router instance
         */
        getRouter() {
            return this.getOwnerComponent().getRouter();
        }
    });
});