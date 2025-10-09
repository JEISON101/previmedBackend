import PacientesServices from '#services/PacientesServices'
import { type HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const paciente = new PacientesServices()


export default class PacientesController {
  private service = new PacientesServices()
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
  async readByITitular({  response }: HttpContext) {
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
      // 👇 Forzamos auth como any para evitar error TS
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

      return response.status(200).json({
        message: 'Paciente obtenido',
        data: pacienteEncontrado,
      })
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

 async createBeneficiario({ request, response }: HttpContext) {
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

    // 🧠 1️⃣ Validación básica
    if (!paciente_id) {
      return response.status(400).json({ message: 'Debe seleccionar un titular' })
    }

    const userExist = await paciente.readByDoc(numero_documento)
    if (userExist) {
      return response
        .status(409)
        .json({ message: 'El beneficiario ya se encuentra registrado' })
    }

    // 🧩 2️⃣ Asegurar valores válidos por defecto
    const hash = await bcrypt.hash(password || '123456', 10)

    const generoValido = ['Masculino', 'Femenino'].includes(genero)
      ? genero
      : 'Masculino'

    const newBeneficiario = await paciente.create(
      {
        direccion_cobro: direccion_cobro || 'N/A',
        ocupacion: ocupacion || 'N/A',
        activo: activo ?? true,
        beneficiario: beneficiario ?? true,
        paciente_id,
        usuario_id: id_usuario,
      },
      {
        id_usuario,
        nombre,
        segundo_nombre: segundo_nombre || '',
        apellido,
        segundo_apellido: segundo_apellido || '',
        email: email || `${numero_documento}@mail.com`,
        password: hash,
        direccion: direccion || 'N/A',
        numero_documento,
        fecha_nacimiento: fecha_nacimiento || '2000-01-01',
        numero_hijos: numero_hijos || 0,
        estrato: estrato || 1,
        autorizacion_datos: autorizacion_datos ?? true,
        habilitar: habilitar ?? true,
        genero: generoValido,
        estado_civil: estado_civil || 'Soltero',
        tipo_documento: tipo_documento || 'Cédula de Ciudadanía',
        eps_id: eps_id || 1,
        rol_id: rol_id || 4,
      }
    )

    return response.status(201).json({ message: 'Beneficiario creado', data: newBeneficiario })
  } catch (e) {
    console.error('❌ Error al crear beneficiario:', e)
    return response.status(500).json({ message: 'Error', error: e.message })
  }
}


 async readBeneficiarios({ response }: HttpContext) {
    try {
      const data = await paciente.readBeneficiarios()
      return response.ok({ data })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }


async updateBeneficiario({ params, request, response }: HttpContext) {
  try {
    const { id } = params;
    const body = request.body();

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
      paciente_id,
    } = body;

    // ✅ Validar género válido
    const generoValido =
      genero === "Femenino" || genero === "Masculino" ? genero : "Masculino";

    // ✅ Hashear password solo si se envía, si no, usar un dummy temporal
    const hash: string = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash("temporal123", 10);

    // ✅ Construcción de usuario completamente compatible con DataUsuario
    const userUpdate: any = {
      nombre,
      segundo_nombre: segundo_nombre ?? "",
      apellido,
      segundo_apellido: segundo_apellido ?? "",
      email,
      password: hash, // 👈 siempre string (ya no undefined)
      direccion: direccion ?? "N/A",
      numero_documento,
      fecha_nacimiento: fecha_nacimiento ?? "2000-01-01",
      numero_hijos: numero_hijos ?? "0",
      estrato: estrato ?? "1",
      autorizacion_datos:
        typeof autorizacion_datos === "boolean" ? autorizacion_datos : true,
      habilitar: typeof habilitar === "boolean" ? habilitar : true,
      genero: generoValido,
      estado_civil: estado_civil ?? "Soltero",
      tipo_documento: tipo_documento ?? "Cédula de Ciudadanía",
      eps_id: eps_id ?? 1,
      rol_id: 4,
    };

    const pacUpdate = {
      direccion_cobro: "N/A",
      ocupacion: "N/A",
      activo: true,
      beneficiario: true,
      paciente_id: paciente_id ?? null,
    };

    // ✅ Llamada al servicio sin error de tipos
    const updated = await paciente.update(id, pacUpdate, userUpdate);

    return response.ok({
      message: "Beneficiario actualizado correctamente",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error al actualizar beneficiario:", error);
    return response
      .status(500)
      .json({ message: "Error", error: error.message });
  }
}




async deleteBeneficiario({ params, response }: HttpContext) {
  try {
    const { id } = params
    const deleted = await paciente.delete(id)

    return response.ok({ message: 'Beneficiario eliminado', data: deleted })
  } catch (e) {
    if (e.message.includes('foreign key')) {
      return response.status(409).json({
        message: 'Error',
        error: 'No se puede eliminar: el beneficiario tiene registros vinculados',
      })
    }
    console.error('❌ Error al eliminar beneficiario:', e)
    return response.status(500).json({ message: 'Error', error: e.message })
  }
}




async readBeneficiarioById({ params, response }: HttpContext) {
  try {
    const { id } = params
    const data = await paciente.readBeneficiarioById(Number(id))

    if (!data) {
      return response.status(404).json({ message: 'Beneficiario no encontrado' })
    }

    return response.ok({ message: 'Beneficiario obtenido', data })
  } catch (error) {
    console.error('❌ Error al leer beneficiario por ID:', error)
    return response.status(500).json({ message: 'Error', error: error.message })
  }
}

}