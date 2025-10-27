import { HttpContext } from '@adonisjs/core/http'
import MembresiasService from '#services/MembresiasServices'
import puppeteer from 'puppeteer'
import { plantillaContrato } from '../templates/plantillaContrato.js'

export default class MembresiasController {
  private service = new MembresiasService()

  async listar({ response }: HttpContext) {
    try {
      const datos = await this.service.listar()
      const serializados = datos.map((m) => m.toJSON()) // Incluye relaciones
      return response.ok(serializados)
    } catch (error) {
      return response.status(500).send({ error: error.message })
    }
  }

  async obtenerPorId({ params, response }: HttpContext) {
    try {
      const dato = await this.service.obtenerPorId(params.id)
      return response.ok(dato.toJSON()) //  También serializado
    } catch (error) {
      return response.status(404).send({ error: error.message })
    }
  }

  async crear({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'firma',
        'forma_pago',
        'numero_contrato',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'plan_id'
      ])
      const paciente_id = request.input('paciente_id')

      const nueva = await this.service.crear(
        {
          ...data,
          plan_id: Number(data.plan_id),
          estado: Boolean(data.estado)
        },
        paciente_id ? Number(paciente_id) : undefined
      )
      return response.created(nueva.toJSON())
    } catch (error) {
      return response.status(500).send({ error: error.message })
    }
  }

  async actualizar({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'firma',
        'forma_pago',
        'numero_contrato',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'plan_id'
      ])

      const actualizada = await this.service.actualizar(params.id, {
        ...data,
        plan_id: Number(data.plan_id),
        estado: Boolean(data.estado)
      })
      return response.ok(actualizada.toJSON())
    } catch (error) {
      return response.status(404).send({ error: error.message })
    }
  }

  async eliminar({ params, response }: HttpContext) {
    try {
      const msg = await this.service.eliminar(params.id)
      return response.ok({ mensaje: msg })
    } catch (error) {
      return response.status(404).send({ error: error.message })
    }
  }
}

export async function generarContratoPDF(data: any) {
  const htmlFinal = plantillaContrato(data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setContent(htmlFinal, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' },
  })

  await browser.close()
  return pdf
}

