sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.InventoryReport", {
        onInit: function () {
            // Inicializa o modelo para os campos de filtro
            var oFilterModel = new JSONModel({
                depositNumber: "",
                inventoryDocFrom: "",
                inventoryDocTo: "",
                materialFrom: "",
                materialTo: "",
                positionFrom: "",
                positionTo: "",
                countingDateFrom: null,
                countingDateTo: null,
                layout: "ALV"
            });
            
            this.getView().setModel(oFilterModel);
            
            // Log para debug
            console.log("InventoryReport controller initialized successfully");
        },

        /**
         * Executa o relatório com base nos filtros informados
         */
        onExecuteReport: function () {
            var oModel = this.getView().getModel();
            var oFilters = oModel.getData();
            
            // Validação básica
            if (!this._validateFilters(oFilters)) {
                return;
            }
            
            // Armazena os filtros no modelo global para uso na próxima tela
            var oComponent = this.getOwnerComponent();
            var oInventoryModel = oComponent.getModel("inventory");
            oInventoryModel.setProperty("/filters", oFilters);
            
            MessageToast.show(this.getResourceBundle().getText("dataLoaded"));
            
            // Navega para a tela de resultados
            this.getRouter().navTo("InventoryResults");
        },

        /**
         * Valida os filtros informados
         * @param {object} oFilters - Objeto com os filtros
         * @returns {boolean} - True se válido
         */
        _validateFilters: function (oFilters) {
            // Validação simples - pelo menos um filtro deve ser preenchido
            var hasFilter = Object.values(oFilters).some(function(value) {
                return value !== null && value !== undefined && value !== "";
            });
            
            if (!hasFilter) {
                MessageToast.show("Informe pelo menos um filtro");
                return false;
            }
            
            return true;
        },

        /**
         * Volta para a tela anterior
         */
        onNavBack: function () {
            this.getRouter().navTo("RouteView1");
        },

        /**
         * Obtém o router da aplicação
         * @returns {sap.ui.core.routing.Router} Router instance
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * Obtém o resource bundle para i18n
         * @returns {sap.ui.model.resource.ResourceModel} Resource bundle
         */
        getResourceBundle: function () {
            return this.getView().getModel("i18n").getResourceBundle();
        }
    });
});