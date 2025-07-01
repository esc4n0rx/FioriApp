sap.ui.define([], () => {
    "use strict";

    return {
        /**
         * Faz o parse de conteúdo CSV para array de objetos
         * @param {string} csvContent - Conteúdo do arquivo CSV
         * @returns {Array} Array de objetos com os dados
         */
        parse(csvContent) {
            const lines = csvContent.split('\n');
            const result = [];
            
            if (lines.length < 2) {
                throw new Error("CSV deve conter pelo menos cabeçalho e uma linha de dados");
            }
            
            // Parse do cabeçalho
            const headers = this._parseLine(lines[0]);
            const fieldMapping = this._createFieldMapping(headers);
            
            // Parse das linhas de dados
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const values = this._parseLine(line);
                    const obj = this._createObjectFromValues(fieldMapping, values);
                    if (obj) {
                        result.push(obj);
                    }
                }
            }
            
            return result;
        },

        /**
         * Faz parse de uma linha CSV
         * @param {string} line - Linha do CSV
         * @returns {Array} Array com os valores
         */
        _parseLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ';' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            
            result.push(current.trim());
            return result;
        },

        /**
         * Cria mapeamento de campos baseado no cabeçalho
         * @param {Array} headers - Array com os cabeçalhos
         * @returns {Object} Mapeamento de campos
         */
        _createFieldMapping(headers) {
            const mapping = {};
            
            headers.forEach((header, index) => {
                const cleanHeader = header.replace(/"/g, '').trim().toLowerCase();
                
                // Mapeamento dos campos do CSV para propriedades do objeto
                switch (cleanHeader) {
                    case 'doc. de inventário':
                    case 'documento inventario':
                    case 'inventorydoc':
                        mapping[index] = 'inventoryDoc';
                        break;
                    case 'item':
                        mapping[index] = 'item';
                        break;
                    case 'posição':
                    case 'posicao':
                    case 'position':
                        mapping[index] = 'position';
                        break;
                    case 'material':
                    case 'materialcode':
                        mapping[index] = 'materialCode';
                        break;
                    case 'descr. material':
                    case 'descrição material':
                    case 'materialdesc':
                        mapping[index] = 'materialDesc';
                        break;
                    case 'ud':
                        mapping[index] = 'ud';
                        break;
                    case 'data':
                    case 'date':
                        mapping[index] = 'date';
                        break;
                    case 'status':
                        mapping[index] = 'status';
                        break;
                    case 'descrição do status':
                    case 'statusdesc':
                        mapping[index] = 'statusDesc';
                        break;
                    case 'contagem atual':
                    case 'currentcount':
                        mapping[index] = 'currentCount';
                        break;
                    case 'tp. depto':
                    case 'depttype':
                        mapping[index] = 'deptType';
                        break;
                    case 'depósito':
                    case 'deposito':
                    case 'depot':
                        mapping[index] = 'depot';
                        break;
                    case 'não contar':
                    case 'nao contar':
                    case 'nocount':
                        mapping[index] = 'noCount';
                        break;
                    case 'um':
                        mapping[index] = 'um';
                        break;
                    case 'qtde base':
                    case 'baseqty':
                        mapping[index] = 'baseQty';
                        break;
                    case 'contagem 1':
                    case 'count1':
                        mapping[index] = 'count1';
                        break;
                    case 'diferença 1':
                    case 'diff1':
                        mapping[index] = 'diff1';
                        break;
                    case 'usuario 1':
                    case 'user1':
                        mapping[index] = 'user1';
                        break;
                    case 'contagem 2':
                    case 'count2':
                        mapping[index] = 'count2';
                        break;
                    case 'diferença 2':
                    case 'diff2':
                        mapping[index] = 'diff2';
                        break;
                    case 'usuario 2':
                    case 'user2':
                        mapping[index] = 'user2';
                        break;
                    case 'contagem 3':
                    case 'count3':
                        mapping[index] = 'count3';
                        break;
                    case 'diferença 3':
                    case 'diff3':
                        mapping[index] = 'diff3';
                        break;
                    case 'usuario 3':
                    case 'user3':
                        mapping[index] = 'user3';
                        break;
                    case 'contagem 4':
                    case 'count4':
                        mapping[index] = 'count4';
                        break;
                    case 'diferença 4':
                    case 'diff4':
                        mapping[index] = 'diff4';
                        break;
                    case 'usuario 4':
                    case 'user4':
                        mapping[index] = 'user4';
                        break;
                    case 'contagem 5':
                    case 'count5':
                        mapping[index] = 'count5';
                        break;
                    case 'diferença 5':
                    case 'diff5':
                        mapping[index] = 'diff5';
                        break;
                    case 'usuario 5':
                    case 'user5':
                        mapping[index] = 'user5';
                        break;
                    case 'ultima contagem':
                    case 'lastcount':
                        mapping[index] = 'lastCount';
                        break;
                    case 'diferença - ult':
                    case 'lastdiff':
                        mapping[index] = 'lastDiff';
                        break;
                    case 'dif. em r$':
                    case 'diffvalue':
                        mapping[index] = 'diffValue';
                        break;
                    case 'usuario - ult.':
                    case 'lastuser':
                        mapping[index] = 'lastUser';
                        break;
                    default:
                        // Campo não mapeado, ignora
                        break;
                }
            });
            
            return mapping;
        },

        /**
         * Cria objeto a partir dos valores mapeados
         * @param {Object} fieldMapping - Mapeamento de campos
         * @param {Array} values - Valores da linha
         * @returns {Object|null} Objeto criado ou null se inválido
         */
        _createObjectFromValues(fieldMapping, values) {
            const obj = {};
            let hasValidData = false;
            
            Object.keys(fieldMapping).forEach(index => {
                const fieldName = fieldMapping[index];
                const value = values[index] ? values[index].replace(/"/g, '').trim() : '';
                
                obj[fieldName] = value;
                
                if (value) {
                    hasValidData = true;
                }
            });
            
            // Garante que todos os campos existam, mesmo que vazios
            const allFields = [
                'inventoryDoc', 'item', 'position', 'materialCode', 'materialDesc',
                'ud', 'date', 'status', 'statusDesc', 'currentCount', 'deptType',
                'depot', 'noCount', 'um', 'baseQty', 'count1', 'diff1', 'user1',
                'count2', 'diff2', 'user2', 'count3', 'diff3', 'user3',
                'count4', 'diff4', 'user4', 'count5', 'diff5', 'user5',
                'lastCount', 'lastDiff', 'diffValue', 'lastUser'
            ];
            
            allFields.forEach(field => {
                if (!obj.hasOwnProperty(field)) {
                    obj[field] = '';
                }
            });
            
            return hasValidData ? obj : null;
        }
    };
});