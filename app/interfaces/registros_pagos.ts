import { DataUsuario } from "./usuarios.js";

export interface GetRegitroPago{
    idRegistro:number;
    monto:number;
    foto?:string;
    fechaInicio:Date;
    fechaFin:Date;
    fechaPago: Date;
    membresiaId:number;
    formaPagoId:number;
    membresia:object;
    formaPago:object;
    cobrador_id: string;
    cobrador: DataUsuario;
    estado: string;
    numero_recibo: string;
}

export interface PostRegistroPago{
    monto:number;
    foto?:string;
    fecha_inicio:Date;
    fecha_fin:Date;
    fecha_pago: Date;
    membresia_id:number;
    forma_pago_id:number;
    estado: string;
    cobrador_id: string;
    numero_recibo : string;
}