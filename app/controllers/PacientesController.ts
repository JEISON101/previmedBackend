import PacientesServices from '#services/PacientesServices'
import { type HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import UsuarioService from '#services/UsuariosServices'

const paciente = new PacientesServices()

export default class PacientesController {
  async create({ request, response }: HttpContext) {
    try {
      const id_usuario = uuidv4()
      const {
        nombre,
        segundo_nombre,
        apellido,
        segundo_apellido,
        email,
        password,
        direccion,
        numero_documento,
        fecha_nacimiento,
        numero_hijos,
        estrato,
        autorizacion_datos,
        habilitar,
        genero,
        estado_civil,
        tipo_documento,
        eps_id,
        rol_id,
        direccion_cobro,
        ocupacion,
        activo,
        beneficiario,
        paciente_id,
      } = request.body()

      const userExist = await paciente.readByDoc(numero_documento)
      if (userExist) {
        return response.status(500).json({ message: 'El usuario ya se encuentra registrado' })
      }

      const hash = await bcrypt.hash(password, 10)

      const newPaciente = await paciente.create(
        {
          direccion_cobro,
          ocupacion,
          activo,
          beneficiario,
          paciente_id,
          usuario_id: id_usuario,
        },
        {
          id_usuario,
          nombre,
          segundo_nombre,
          apellido,
          segundo_apellido,
          email,
          password: hash,
          direccion,
          numero_documento,
          fecha_nacimiento,
          numero_hijos,
          estrato,
          autorizacion_datos,
          habilitar,
          genero,
          estado_civil,
          tipo_documento,
          eps_id,
          rol_id,
        }
      )

      return response.status(201).json({ message: 'Creado', data: newPaciente })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async readAll({ response }: HttpContext) {
    try {
      const users = await paciente.read()
      return response.status(201).json({ message: 'Información obtenida', data: users })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async readById({ params, response }: HttpContext) {
    try {
      const { id } = params
      const userid = await paciente.readById(id)
      return response.status(200).json({ message: 'Información obtenida', data: userid })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async readByITitular({ response }: HttpContext) {
    try {
      const userTi = await paciente.readByTitular()
      return response.status(200).json({ message: 'Información obtenida', data: userTi })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async deleteById({ params, response }: HttpContext) {
    try {
      const { id } = params
      const userid = await paciente.delete(id)
      return response.status(200).json({ message: 'Eliminado', data: userid })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async updateById({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const {
        nombre,
        segundo_nombre,
        apellido,
        segundo_apellido,
        email,
        password,
        direccion,
        numero_documento,
        fecha_nacimiento,
        numero_hijos,
        estrato,
        autorizacion_datos,
        habilitar,
        genero,
        estado_civil,
        tipo_documento,
        eps_id,
        rol_id,
        direccion_cobro,
        ocupacion,
        activo,
        beneficiario,
        paciente_id,
      } = request.body()

      const hash = await bcrypt.hash(password, 10)
      const userid = await paciente.update(
        id,
        {
          direccion_cobro,
          ocupacion,
          activo,
          beneficiario,
          paciente_id,
        },
        {
          nombre,
          segundo_nombre,
          apellido,
          segundo_apellido,
          email,
          password: hash,
          direccion,
          numero_documento,
          fecha_nacimiento,
          numero_hijos,
          estrato,
          autorizacion_datos,
          habilitar,
          genero,
          estado_civil,
          tipo_documento,
          eps_id,
          rol_id,
        }
      )
      return response.status(200).json({ message: 'Actualizado', data: userid })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async readByUsuarioLogueado({ request, response }: HttpContext) {
    try {
      const auth: any = (request as any).auth
      if (!auth) {
        return response.status(401).json({ message: 'No se encontró autenticación en el contexto' })
      }

      const user = await auth.use('api').authenticate()
      const usuarioId = user.id_usuario ?? user.id
      if (!usuarioId) {
        return response.status(400).json({ message: 'Usuario no encontrado en la sesión' })
      }

      const pacienteEncontrado = await paciente.readByUsuarioId(usuarioId)
      if (!pacienteEncontrado) {
        return response.status(404).json({ message: 'No existe paciente para este usuario' })
      }

      return response.status(200).json({ message: 'Paciente obtenido', data: pacienteEncontrado })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async readByUsuarioId({ params, response }: HttpContext) {
    try {
      const { usuario_id } = params
      const pacienteData = await paciente.readByUsuarioId(usuario_id)
      if (!pacienteData) {
        return response.status(404).json({ message: 'Paciente no encontrado' })
      }
      return response.status(200).json({ message: 'Paciente obtenido', data: pacienteData })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }

  async readBeneficiarios({ params, response }: HttpContext) {
    try {
      const { paciente_id } = params
      const data = await paciente.readBeneficiarios(Number(paciente_id))
      return response
        .status(200)
        .json({ message: 'Beneficiarios del titular obtenidos correctamente', data })
    } catch (e) {
      return response
        .status(500)
        .json({ message: 'Error al obtener beneficiarios del titular', error: e.message })
    }
  }

  /**
   * ✅ Asociar beneficiario con titular
   * PUT /pacientes/asociar/:id
   * Body: { paciente_id: number }
   */
  async asociarBeneficiario({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const { paciente_id } = request.only(['paciente_id'])

      if (!paciente_id) {
        return response.status(400).json({ message: 'Se requiere paciente_id (id del titular)' })
      }

      const idBeneficiario = Number(id)
      const idTitular = Number(paciente_id)

      if (isNaN(idBeneficiario) || isNaN(idTitular)) {
        return response.status(400).json({ message: 'IDs inválidos' })
      }

      const beneficiarioActualizado = await paciente.asociarBeneficiario(idBeneficiario, idTitular)

      return response.status(200).json({
        message: 'Beneficiario asociado correctamente',
        data: beneficiarioActualizado,
      })
    } catch (e) {
      console.error('Error asociarBeneficiario:', e)
      return response
        .status(500)
        .json({ message: 'Error al asociar beneficiario', error: e.message })
    }
  }

    //crear titular, flujo completo
    public async registroCompletoTitular({ request, response }: HttpContext) {
    try {
      const user = new UsuarioService
      const data = request.all()

      if (!data.titular || !data.contrato || !data.pago) {
        return response.status(400).json({
          message: 'Datos incompletos, se requiere titular, contrato y pago'
        })
      }
      // Verificar que el titular no esté registrado
      const titular = await user.doc(data.titular.usuario.numero_documento)
      if (titular != null) {
        return response.status(400).json({
          message: `El documento del titular ${await data.titular.usuario.nombre} ${await data.titular.usuario.apellido} ya se encuentra registrado`
        })
      }

      // Datos del titular
      data.titular.usuario.id_usuario = uuidv4()
      data.titular.usuario.password = await bcrypt.hash(data.titular.usuario.password, 10)
      data.titular.paciente.direccion_cobro = data.titular.usuario.direccion
      data.titular.usuario.rol_id = 4

      // Datos del contrato
      data.contrato.firma =` ${data.titular.usuario.nombre} ${data.titular.usuario.apellido}`
      data.contrato.estado = false // estará innactivo hasta que se verifique el pago
      // Datos del pago
      data.pago.fecha_pago = data.pago.fecha_inicio

      // Beneficiarios
      if (data.beneficiarios && Array.isArray(data.beneficiarios)) {
      for (const beneficiario of data.beneficiarios) {
        // Validar que el beneficiario no venga nulo
        if(
          !beneficiario.usuario.nombre ||
          !beneficiario.usuario.apellido ||
          !beneficiario.usuario.numero_documento ||
          !beneficiario.usuario.tipo_documento ||
          !beneficiario.usuario.fecha_nacimiento ||
          !beneficiario.usuario.email ||
          !beneficiario.usuario.direccion ||
          !beneficiario.usuario.autorizacion_datos
        ){
          return response.status(400).json({
            message: `Beneficiario con campos nulos`
          })
        }

        // Validar que el beneficiario no esté registrado
        const pacienteBeneficiario = await user.doc(beneficiario.usuario.numero_documento)
        if (pacienteBeneficiario) {
          return response.status(400).json({
            message: `El docuemento del beneficiario ${beneficiario.usuario.nombre} ${beneficiario.usuario.apellido} ya se encuentra registrado`
          })
        }

        beneficiario.usuario.id_usuario = uuidv4()
        // si no llega la contraseña se hereda la del titular (ya viene hasheada)
        if (!beneficiario.usuario.password) {
          beneficiario.usuario.password = data.titular.usuario.password
        } else {
          beneficiario.usuario.password = await bcrypt.hash(beneficiario.usuario.password, 10)
        }
        // si no llega una direccion se hereda la del titular
        beneficiario.paciente.direccion_cobro = beneficiario.usuario.direccion || data.titular.usuario.direccion
        beneficiario.usuario.rol_id = 4
        beneficiario.paciente.beneficiario = true
      }
    }
      
    const resultado = await paciente.registroCompletoTitular(data)

    return response.status(201).json({
      message: 'Registro exitoso',
      data: resultado,
    })

    } catch (error) {
      return response.status(500).json({
        message: 'Error en el registro',
        error: error.message
      })
    }
  }

  async getUsuariosId({params, response}:HttpContext){
    const user = new PacientesServices
    try {
      const {id} = params
      const res = await user.getUsuariosId(id)
      return  response.status(200).json(res)
    } catch (error) {
      return response.status(500).json(error.message)
    }
  }
}
