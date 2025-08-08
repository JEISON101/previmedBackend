import { DateTime } from "luxon";

export interface DataAuditoria{
    id_auditoria?: number,
    tabla:string,
    accion:string,
    usuario_id:string,
    registro_id:string,
    created?:DateTime
}