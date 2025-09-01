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
}

export interface PostRegistroPago{
    monto:number;
    foto?:string;
    fecha_inicio:Date;
    fecha_fin:Date;
    fecha_pago: Date;
    membresia_id:number;
    forma_pago_id:number;
}