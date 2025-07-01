sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "project1/utils/CSVParser"
], function (Controller, MessageToast, CSVParser) {
    "use strict";

    return Controller.extend("project1.controller.InventoryResults", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("InventoryResults").attachPatternMatched(this._onObjectMatched, this);
            
            console.log("InventoryResults controller initialized successfully");
        },

        /**
         * Método chamado quando a rota é ativada
         */
        _onObjectMatched: function () {
            // Carrega dados automáticos ou de exemplo
            this._loadSampleData();
        },

        /**
         * Carrega dados de exemplo
         */
        _loadSampleData: function () {
            var oInventoryModel = this.getOwnerComponent().getModel("inventory");
            
            // Dados de exemplo
            var aSampleData = this._createSampleData();
            
            oInventoryModel.setProperty("/results", aSampleData);
            MessageToast.show(this.getResourceBundle().getText("dataLoaded"));
        },

        /**
         * Cria dados de exemplo para demonstração
         * @returns {Array} Array com dados de exemplo
         */
        _createSampleData: function () {
            return [
                {
                    inventoryDoc: "16789",
                    item: "10",
                    position: "H3S0100203",
                    materialCode: "134567",
                    materialDesc: "COCA COLA LATA 350ML",
                    ud: "UN",
                    date: "2025-07-01",
                    status: "01",
                    statusDesc: "Contagem Inicial",
                    currentCount: "100",
                    deptType: "D01",
                    depot: "DP01",
                    noCount: "",
                    um: "UN",
                    baseQty: "95",
                    count1: "100",
                    diff1: "5",
                    user1: "USER001",
                    count2: "",
                    diff2: "",
                    user2: "",
                    count3: "",
                    diff3: "",
                    user3: "",
                    count4: "",
                    diff4: "",
                    user4: "",
                    count5: "",
                    diff5: "",
                    user5: "",
                    lastCount: "100",
                    lastDiff: "5",
                    diffValue: "250.00",
                    lastUser: "USER001"
                },
                {
                    inventoryDoc: "16889",
                    item: "20",
                    position: "H3S0100204",
                    materialCode: "134567",
                    materialDesc: "ALCATRAO 600KG",
                    ud: "KG",
                    date: "2025-07-01",
                    status: "02",
                    statusDesc: "Recontagem Necessária",
                    currentCount: "50",
                    deptType: "D01",
                    depot: "DP01",
                    noCount: "",
                    um: "KG",
                    baseQty: "55",
                    count1: "50",
                    diff1: "-5",
                    user1: "USER002",
                    count2: "52",
                    diff2: "-3",
                    user2: "USER003",
                    count3: "",
                    diff3: "",
                    user3: "",
                    count4: "",
                    diff4: "",
                    user4: "",
                    count5: "",
                    diff5: "",
                    user5: "",
                    lastCount: "52",
                    lastDiff: "-3",
                    diffValue: "-150.00",
                    lastUser: "USER003"
                },
                {
                    inventoryDoc: "16989",
                    item: "10",
                    position: "H3S0100205",
                    materialCode: "134568",
                    materialDesc: "AGUA DE COCO INTEGRAL LYNV 1L",
                    ud: "UN",
                    date: "2025-07-01",
                    status: "03",
                    statusDesc: "Contagem Finalizada",
                    currentCount: "200",
                    deptType: "D40",
                    depot: "DP40",
                    noCount: "X",
                    um: "UN",
                    baseQty: "200",
                    count1: "200",
                    diff1: "0",
                    user1: "USER001",
                    count2: "",
                    diff2: "",
                    user2: "",
                    count3: "",
                    diff3: "",
                    user3: "",
                    count4: "",
                    diff4: "",
                    user4: "",
                    count5: "",
                    diff5: "",
                    user5: "",
                    lastCount: "200",
                    lastDiff: "0",
                    diffValue: "0.00",
                    lastUser: "USER001"
                }
            ];
        },

        /**
         * Carrega dados de um arquivo CSV
         */
        onLoadCSV: function () {
            var oFileUploader = document.createElement("input");
            oFileUploader.type = "file";
            oFileUploader.accept = ".csv";
            oFileUploader.style.display = "none";
            
            var that = this;
            oFileUploader.addEventListener("change", function(event) {
                var file = event.target.files[0];
                if (file) {
                    that._processCSVFile(file);
                }
            });
            
            document.body.appendChild(oFileUploader);
            oFileUploader.click();
            document.body.removeChild(oFileUploader);
        },

        /**
         * Processa o arquivo CSV carregado
         * @param {File} file - Arquivo CSV
         */
        _processCSVFile: function (file) {
            var that = this;
            var reader = new FileReader();
            reader.onload = function(e) {
               try {
                   var csvContent = e.target.result;
                   var parsedData = CSVParser.parse(csvContent);
                   
                   var oInventoryModel = that.getOwnerComponent().getModel("inventory");
                   oInventoryModel.setProperty("/results", parsedData);
                   
                   MessageToast.show(parsedData.length + " registros carregados do CSV");
               } catch (error) {
                   MessageToast.show(that.getResourceBundle().getText("errorLoadingData"));
                   console.error("Erro ao processar CSV:", error);
               }
           };
           
           reader.readAsText(file);
       },

       /**
        * Exporta os dados da tabela
        */
       onExport: function () {
           var oInventoryModel = this.getOwnerComponent().getModel("inventory");
           var aData = oInventoryModel.getProperty("/results") || [];
           
           if (aData.length === 0) {
               MessageToast.show("Nenhum dado para exportar");
               return;
           }
           
           // Converte para CSV
           var csvContent = this._convertToCSV(aData);
           
           // Download do arquivo
           var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
           var link = document.createElement("a");
           var url = URL.createObjectURL(blob);
           link.setAttribute("href", url);
           link.setAttribute("download", "inventario_" + new Date().toISOString().split('T')[0] + ".csv");
           link.style.visibility = 'hidden';
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
       },

       /**
        * Converte dados para formato CSV
        * @param {Array} aData - Array de dados
        * @returns {string} Conteúdo CSV
        */
       _convertToCSV: function (aData) {
           var headers = [
               "Doc. de Inventário", "Item", "Posição", "Material", "Descr. Material",
               "UD", "Data", "Status", "Descrição do Status", "Contagem Atual",
               "Tp. Depto", "Depósito", "NÃO CONTAR", "UM", "Qtde Base",
               "Contagem 1", "Diferença 1", "Usuario 1", "Contagem 2", "Diferença 2", "Usuario 2",
               "Contagem 3", "Diferença 3", "Usuario 3", "Contagem 4", "Diferença 4", "Usuario 4",
               "Contagem 5", "Diferença 5", "Usuario 5", "Ultima Contagem", "Diferença - Ult",
               "Dif. em R$", "Usuario - Ult."
           ];
           
           var csvContent = headers.join(";") + "\n";
           
           aData.forEach(function(row) {
               var values = [
                   row.inventoryDoc || "", row.item || "", row.position || "",
                   row.materialCode || "", row.materialDesc || "", row.ud || "",
                   row.date || "", row.status || "", row.statusDesc || "",
                   row.currentCount || "", row.deptType || "", row.depot || "",
                   row.noCount || "", row.um || "", row.baseQty || "",
                   row.count1 || "", row.diff1 || "", row.user1 || "",
                   row.count2 || "", row.diff2 || "", row.user2 || "",
                   row.count3 || "", row.diff3 || "", row.user3 || "",
                   row.count4 || "", row.diff4 || "", row.user4 || "",
                   row.count5 || "", row.diff5 || "", row.user5 || "",
                   row.lastCount || "", row.lastDiff || "", row.diffValue || "", row.lastUser || ""
               ];
               
               csvContent += values.map(function(value) { return '"' + value + '"'; }).join(";") + "\n";
           });
           
           return csvContent;
       },

       /**
        * Volta para a tela anterior
        */
       onNavBack: function () {
           this.getRouter().navTo("InventoryReport");
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