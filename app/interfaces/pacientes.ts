export interface DataPaciente{
    id_paciente?:number,
    direccion_cobro: string,
    ocupacion: string,
    activo:boolean,
    beneficiario:boolean,
    usuario_id?:string,
    paciente_id?:number
}