import Auditoria from "#models/auditoria";
import { DataAuditoria } from "../interfaces/auditorias.js";

export default class AuditoriasServices{
    async create(data:DataAuditoria){
        return Auditoria.create(data)
    }
}