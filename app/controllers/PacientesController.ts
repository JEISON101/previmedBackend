import PacientesServices from '#services/PacientesServices'
import { type HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'


const posInt = (v: any) => {
  const n = Number(v)
  return Number.isInteger(n) && n > 0 ? n : null
}
const asBool = (v: any) => v === true || v === 'true' || v === 1 || v === '1'

export default class PacientesController {
  private service = new PacientesServices()

  // Crear paciente
  async create({ request, response }: HttpContext) {
    try {
      const body = request.body()
      const id_usuario = uuidv4()
      const hash = await bcrypt.hash(body.password || '123456', 10)

      const newPaciente = await this.service.create(
        //PACIENTE
        {
          direccion_cobro: body.direccion,
          ocupacion: body.ocupacion,
          activo: body.activo ?? false,
          beneficiario: body.beneficiario ?? false,
          usuario_id: id_usuario,
          paciente_id: body.paciente_id
        },
        // USUARIO
        {
          id_usuario,
          nombre: body.nombre,
          segundo_nombre: body.segundo_nombre,
          apellido: body.apellido,
          segundo_apellido: body.segundo_apellido,
          email: body.email,
          password: hash,
          direccion: body.direccion,
          numero_documento: body.numero_documento,
          fecha_nacimiento: body.fecha_nacimiento,
          numero_hijos: body.numero_hijos,
          estrato: body.estrato,
          autorizacion_datos: body.autorizacion_datos ?? false,
          habilitar: body.habilitar ?? false,
          genero: body.genero,
          estado_civil: body.estado_civil,
          tipo_documento: body.tipo_documento,
          eps_id: body.eps_id,
          rol_id:4,
        }
      )

      return response.status(201).json({ message: 'Creado', data: newPaciente })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  async readAll({ response }: HttpContext) {
    try {
      const users = await this.service.read()
      return response.ok({ message: 'Información obtenida', data: users })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  async readByTitular({ response }: HttpContext) {
    try {
      const data = await this.service.readByTitular()
      return response.ok({ message: 'Información obtenida', data })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  // actualizar SOLO la tabla pacientes 
  async updateCamposPaciente({ params, request, response }: HttpContext) {
    try {
      const id = posInt(params.id)
      if (!id) return response.badRequest({ message: 'ID inválido' })

      const body = request.body()
      // Tipo local de patch que permite null
      type PacientePatch = {
        direccion_cobro?: string
        ocupacion?: string
        activo?: boolean
        beneficiario?: boolean
        paciente_id?: number | null
      }
      const patch: PacientePatch = {}

      if (body.direccion_cobro !== undefined) {
        if (typeof body.direccion_cobro !== 'string' || !body.direccion_cobro.trim()) {
          return response.badRequest({ message: 'direccion_cobro inválida' })
        }
        patch.direccion_cobro = body.direccion_cobro.trim()
      }
      if (body.ocupacion !== undefined) {
        if (typeof body.ocupacion !== 'string' || !body.ocupacion.trim()) {
          return response.badRequest({ message: 'ocupacion inválida' })
        }
        patch.ocupacion = body.ocupacion.trim()
      }
      if (body.activo !== undefined) patch.activo = asBool(body.activo)
      if (body.beneficiario !== undefined) patch.beneficiario = asBool(body.beneficiario)

      if (body.paciente_id !== undefined) {
        // permite null para desasociar
        patch.paciente_id = body.paciente_id === null ? null : posInt(body.paciente_id)
        if (patch.paciente_id === null && body.paciente_id !== null) {
          return response.badRequest({ message: 'paciente_id inválido' })
        }
      }

      // Reglas de consistencia
      if (patch.beneficiario === false) {
        patch.paciente_id = null
      }
      if (patch.beneficiario === true && (patch.paciente_id == null)) {
        return response.badRequest({ message: 'Indique titular (paciente_id) para beneficiario' })
      }

      if (patch.paciente_id != null) {
        if (patch.paciente_id === id) {
          return response.badRequest({ message: 'paciente_id no puede ser el mismo paciente' })
        }
        const titular = await this.service.readById(patch.paciente_id)
        if (!titular) return response.badRequest({ message: 'El titular indicado no existe' })
        if ((titular as any).beneficiario) {
          return response.badRequest({ message: 'El paciente indicado no es titular' })
        }
      }

      const updated = await this.service.updatePacienteCampos(id, patch as any)
      return response.ok({ message: 'Paciente actualizado', data: updated })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  async delete({ params, response }: HttpContext) {
    try {
      const id = posInt(params.id)
      if (!id) return response.badRequest({ message: 'ID inválido' })

      const deleted = await this.service.delete(id)
      return response.ok({ message: 'Paciente eliminado', data: deleted })
    } catch (e: any) {
      if (String(e.message).includes('foreign key')) {
        return response.status(409).json({
          message: 'Error',
          error: 'No se puede eliminar: el paciente tiene registros vinculados',
        })
      }
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  //BENEFICIARIOS 

  // Crear beneficiario (puede quedar sin titular y asociarse luego)
  async createBeneficiario({ request, response }: HttpContext) {
    try {
      const body = request.body()
      const id_usuario = uuidv4()
      const hash = await bcrypt.hash(body.password || '123456', 10)

      // si viene paciente_id, validar que sea un titular válido
      let titularId: number | null = null
      if (body.paciente_id !== undefined && body.paciente_id !== null) {
        const pid = posInt(body.paciente_id)
        if (!pid) return response.badRequest({ message: 'paciente_id inválido' })
        const titular = await this.service.readById(pid)
        if (!titular) return response.badRequest({ message: 'El titular indicado no existe' })
        if ((titular as any).beneficiario) {
          return response.badRequest({ message: 'El paciente indicado no es titular' })
        }
        titularId = pid
      }

      const newBeneficiario = await this.service.create(
        {
          direccion_cobro: body.direccion_cobro,
          ocupacion: body.ocupacion,
          activo: true,
          beneficiario: true,
          paciente_id: titularId ?? null, // ✅ sin cambiar DataPaciente en prod
          usuario_id: id_usuario,
        },
        {
          id_usuario,
          nombre: body.nombre,
          segundo_nombre: body.segundo_nombre,
          apellido: body.apellido,
          segundo_apellido: body.segundo_apellido,
          email: body.email || `${body.numero_documento}@mail.com`,
          password: hash,
          direccion: body.direccion,
          numero_documento: body.numero_documento,
          fecha_nacimiento: body.fecha_nacimiento,
          numero_hijos: body.numero_hijos,
          estrato: body.estrato,
          autorizacion_datos: true,
          habilitar: true,
          genero: body.genero,
          estado_civil: body.estado_civil,
          tipo_documento: body.tipo_documento,
          eps_id: body.eps_id,
          rol_id: 4,
        }
      )

      return response.status(201).json({ message: 'Beneficiario creado', data: newBeneficiario })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  async readBeneficiarios({ response }: HttpContext) {
    try {
      const data = await this.service.readBeneficiarios()
      return response.ok({ data })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  async readBeneficiarioById({ params, response }: HttpContext) {
    try {
      const id = posInt(params.id)
      if (!id) return response.badRequest({ message: 'ID inválido' })

      const data = await this.service.readBeneficiarioById(id)
      if (!data) return response.status(404).json({ message: 'Beneficiario no encontrado' })
      return response.ok({ message: 'Beneficiario obtenido', data })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: (e as Error).message })
    }
  }

  async deleteBeneficiario({ params, response }: HttpContext) {
    try {
      const id = posInt(params.id)
      if (!id) return response.badRequest({ message: 'ID inválido' })

      const deleted = await this.service.delete(id)
      return response.ok({ message: 'Beneficiario eliminado', data: deleted })
    } catch (e: any) {
      if (String(e.message).includes('foreign key')) {
        return response.status(409).json({
          message: 'Error',
          error: 'No se puede eliminar: el beneficiario tiene registros vinculados',
        })
      }
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  // Asociar / Desvincular / Obtener usuario //

  // POST /pacientes/beneficiarios/asociar  { beneficiario_id, titular_id }
  async asociarBeneficiario({ request, response }: HttpContext) {
    try {
      const { beneficiario_id, titular_id } = request.only(['beneficiario_id', 'titular_id'])
      const benId = posInt(beneficiario_id)
      const titId = posInt(titular_id)
      if (!benId || !titId) return response.badRequest({ message: 'IDs inválidos' })
      if (benId === titId) return response.badRequest({ message: 'No puede asociarse a sí mismo' })

      // Titular debe existir y no ser beneficiario
      const titular = await this.service.readById(titId)
      if (!titular) return response.badRequest({ message: 'El titular indicado no existe' })
      if ((titular as any).beneficiario) {
        return response.badRequest({ message: 'El paciente indicado no es titular' })
      }

      const updated = await this.service.asociarBeneficiario(benId, titId)
      return response.ok({ message: 'Beneficiario asociado', data: updated })
    } catch (e) {
      return response.status(400).json({ message: 'Error', error: (e as Error).message })
    }
  }

  // POST /pacientes/beneficiarios/desvincular  { beneficiario_id, desactivar? }
  async desvincularBeneficiario({ request, response }: HttpContext) {
    try {
      const { beneficiario_id, desactivar } = request.only(['beneficiario_id', 'desactivar'])
      const benId = posInt(beneficiario_id)
      if (!benId) return response.badRequest({ message: 'beneficiario_id inválido' })
      const desact = desactivar === undefined ? true : asBool(desactivar)

      const updated = await this.service.desvincularBeneficiario(benId, desact)
      return response.ok({ message: 'Beneficiario desvinculado', data: updated })
    } catch (e) {
      return response.status(400).json({ message: 'Error', error: (e as Error).message })
    }
  }

  // GET /pacientes/beneficiarios/:id/usuario
  async getUsuarioDeBeneficiario({ params, response }: HttpContext) {
    try {
      const id = posInt(params.id)
      if (!id) return response.badRequest({ message: 'ID inválido' })

      const data = await this.service.usuarioDeBeneficiario(id)
      return response.ok({ message: 'Usuario del beneficiario', data })
    } catch (e) {
      return response.status(404).json({ message: 'Error', error: (e as Error).message })
    }
  }
}
