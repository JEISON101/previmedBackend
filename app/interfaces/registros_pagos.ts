export interface GetRegitroPago{
    id_registro:number;
    monto:number;
    foto?:string;
    fecha_inicio:Date | string;
    fexha_fin:Date | string;
    membresia_id:number;
    forma_pago_id:number;
}

export interface PostRegistroPago{
    monto:number;
    foto?:string|null;
    fecha_inicio:Date | string;
    fexha_fin:Date | string;
    membresia_id:number;
    forma_pago_id:number;
}