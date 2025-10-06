export interface DataBeneficiario {
  direccion_cobro: string
  ocupacion: string
  activo: boolean
  beneficiario: boolean
  usuario_id?: string
  paciente_id: number  // titular
}
