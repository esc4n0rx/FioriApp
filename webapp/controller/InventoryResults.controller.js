sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "project1/utils/CSVParser"
], (Controller, MessageToast, CSVParser) => {
    "use strict";

    return Controller.extend("project1.controller.InventoryResults", {
        onInit() {
            const oRouter = this.getRouter();
            oRouter.getRoute("InventoryResults").attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Método chamado quando a rota é ativada
         */
        _onObjectMatched() {
            // Carrega dados automáticos ou de exemplo
            this._loadSampleData();
        },

        /**
         * Carrega dados de exemplo
         */
        _loadSampleData() {
            const oInventoryModel = this.getOwnerComponent().getModel("inventory");
            
            // Dados de exemplo
            const aSampleData = this._createSampleData();
            
            oInventoryModel.setProperty("/results", aSampleData);
            MessageToast.show(this.getResourceBundle().getText("dataLoaded"));
        },

        /**
         * Cria dados de exemplo para demonstração
         * @returns {Array} Array com dados de exemplo
         */
        _createSampleData() {
            return [
                {
                    inventoryDoc: "1000001",
                    item: "10",
                    position: "A-01-01",
                    materialCode: "MAT001",
                    materialDesc: "Produto A - Descrição Completa",
                    ud: "PC",
                    date: "2025-07-01",
                    status: "01",
                    statusDesc: "Contagem Inicial",
                    currentCount: "100",
                    deptType: "FG",
                    depot: "1000",
                    noCount: "",
                    um: "PC",
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
                    inventoryDoc: "1000001",
                    item: "20",
                    position: "A-01-02",
                    materialCode: "MAT002",
                    materialDesc: "Produto B - Material Especial",
                    ud: "KG",
                    date: "2025-07-01",
                    status: "02",
                    statusDesc: "Recontagem Necessária",
                    currentCount: "50",
                    deptType: "RM",
                    depot: "1000",
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
                    inventoryDoc: "1000002",
                    item: "10",
                    position: "B-02-01",
                    materialCode: "MAT003",
                    materialDesc: "Produto C - Componente Crítico",
                    ud: "UN",
                    date: "2025-07-01",
                    status: "03",
                    statusDesc: "Contagem Finalizada",
                    currentCount: "200",
                    deptType: "SG",
                    depot: "2000",
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
        onLoadCSV() {
            const oFileUploader = document.createElement("input");
            oFileUploader.type = "file";
            oFileUploader.accept = ".csv";
            oFileUploader.style.display = "none";
            
            oFileUploader.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    this._processCSVFile(file);
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
        _processCSVFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
               try {
                   const csvContent = e.target.result;
                   const parsedData = CSVParser.parse(csvContent);
                   
                   const oInventoryModel = this.getOwnerComponent().getModel("inventory");
                   oInventoryModel.setProperty("/results", parsedData);
                   
                   MessageToast.show(`${parsedData.length} registros carregados do CSV`);
               } catch (error) {
                   MessageToast.show(this.getResourceBundle().getText("errorLoadingData"));
                   console.error("Erro ao processar CSV:", error);
               }
           };
           
           reader.readAsText(file);
       },

       /**
        * Exporta os dados da tabela
        */
       onExport() {
           const oInventoryModel = this.getOwnerComponent().getModel("inventory");
           const aData = oInventoryModel.getProperty("/results") || [];
           
           if (aData.length === 0) {
               MessageToast.show("Nenhum dado para exportar");
               return;
           }
           
           // Converte para CSV
           const csvContent = this._convertToCSV(aData);
           
           // Download do arquivo
           const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
           const link = document.createElement("a");
           const url = URL.createObjectURL(blob);
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
       _convertToCSV(aData) {
           const headers = [
               "Doc. de Inventário", "Item", "Posição", "Material", "Descr. Material",
               "UD", "Data", "Status", "Descrição do Status", "Contagem Atual",
               "Tp. Depto", "Depósito", "NÃO CONTAR", "UM", "Qtde Base",
               "Contagem 1", "Diferença 1", "Usuario 1", "Contagem 2", "Diferença 2", "Usuario 2",
               "Contagem 3", "Diferença 3", "Usuario 3", "Contagem 4", "Diferença 4", "Usuario 4",
               "Contagem 5", "Diferença 5", "Usuario 5", "Ultima Contagem", "Diferença - Ult",
               "Dif. em R$", "Usuario - Ult."
           ];
           
           let csvContent = headers.join(";") + "\n";
           
           aData.forEach(row => {
               const values = [
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
               
               csvContent += values.map(value => `"${value}"`).join(";") + "\n";
           });
           
           return csvContent;
       },

       /**
        * Volta para a tela anterior
        */
       onNavBack() {
           this.getRouter().navTo("InventoryReport");
       },

       /**
        * Obtém o router da aplicação
        * @returns {sap.ui.core.routing.Router} Router instance
        */
       getRouter() {
           return this.getOwnerComponent().getRouter();
       },

       /**
        * Obtém o resource bundle para i18n
        * @returns {sap.ui.model.resource.ResourceModel} Resource bundle
        */
       getResourceBundle() {
           return this.getView().getModel("i18n").getResourceBundle();
       }
   });
});