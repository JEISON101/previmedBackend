import { DateTime } from "luxon";

export type TipoGenero = 'Masculino' | 'Femenino' | 'otro'
export type TipoEstadoCivil = 'Soltero'| 'Casado'| 'Viudo'| 'Divorciado'|'Unión marital'
export type TipoDocumento ='Registro Civil'| 'Tarjeta de Identidad'| 'Cédula de Ciudadanía'| 'Tarjeta de Extranjería'|'Cédula de Extranjería'| 'Pasaporte'| 'Documento de Identificación Extranjero (DIE)'| 'Permiso Especial de Permanencia (PEP)'


export interface DataUsuario{
    id_usuario?: string;
    nombre: string;
    segundo_nombre?: string;
    apellido: string;
    segundo_apellido?: string;
    email: string;
    password: string;
    direccion: string;
    numero_documento: string;
    fecha_nacimiento: DateTime<boolean>;
    numero_hijos: string;
    estrato: string;
    autorizacion_datos: boolean;
    habilitar: boolean;
    genero: TipoGenero;
    estado_civil: TipoEstadoCivil;
    tipo_documento: TipoDocumento;
    eps_id: number;
    rol_id: number;
}