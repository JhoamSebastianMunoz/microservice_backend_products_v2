"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const config_azureStorage_1 = __importDefault(require("../config/config-azureStorage"));
const storage_blob_1 = require("@azure/storage-blob");
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
if (!containerName) {
    throw new Error("El nombre del contenedor (AZURE_STORAGE_CONTAINER_NAME) no está configurado en el archivo .env");
}
;
class AzureBlobRepository {
    static uploadToImage(registerImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!registerImage.fileName || !registerImage.content) {
                    throw new Error("El nombre del archivo o el contenido están vacíos.");
                }
                let fileId = (0, uuid_1.v4)();
                fileId += `.${registerImage.fileName.split(".").pop()}`;
                const containerClient = config_azureStorage_1.default.getContainerClient(containerName);
                const blockBlobClient = containerClient.getBlockBlobClient(fileId);
                yield blockBlobClient.upload(registerImage.content, registerImage.content.length);
                return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${fileId}`;
            }
            catch (error) {
                console.error("Error al subir la imagen:", error);
                throw new Error("No se pudo subir la imagen a Azure Blob Storage.");
            }
        });
    }
    static generateSasUrl(getImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const containerClient = config_azureStorage_1.default.getContainerClient(containerName);
                const blobClient = containerClient.getBlobClient(getImage.fileName);
                // Verificar si el blob existe
                const exists = yield blobClient.exists();
                if (!exists) {
                    throw new Error(`La imagen con el nombre ${getImage.fileName} no existe.`);
                }
                // Configurar permisos SAS
                const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
                const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
                const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
                const sasOptions = {
                    containerName,
                    blobName: getImage.fileName,
                    permissions: storage_blob_1.BlobSASPermissions.parse("r"), // Permiso de lectura
                    startsOn: new Date(), // Inicio inmediato
                    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expira en 1 hora
                };
                // Generar el token SAS
                const sasToken = (0, storage_blob_1.generateBlobSASQueryParameters)(sasOptions, sharedKeyCredential).toString();
                // Construir y devolver la URL SAS
                return `${blobClient.url}?${sasToken}`;
            }
            catch (error) {
                console.error("Error al generar la URL SAS:", error);
                throw new Error("No se pudo generar la URL SAS para el blob.");
            }
        });
    }
    static deleteBlob(deleteImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const containerClient = config_azureStorage_1.default.getContainerClient(containerName);
                const blobClient = containerClient.getBlobClient(deleteImage.fileName);
                const exists = yield blobClient.exists();
                if (!exists) {
                    throw new Error(`La imagen con el nombre '${deleteImage.fileName}' no existe en el contenedor.`);
                }
                yield blobClient.delete();
            }
            catch (error) {
                console.error("Error al eliminar la imagen:", error);
                throw new Error("No se pudo eliminar la imagen de Azure Blob Storage.");
            }
        });
    }
}
;
exports.default = AzureBlobRepository;
