import type { HttpContext } from "@adonisjs/core/http";
import BarriosServices from "../services/BarriosServices.js";

const barriosService = new BarriosServices();

export default class BarriosController {
    async crearBarrio({ request, response }: HttpContext) {
        try {
            const { nombre_barrio, latitud, longitud, estado } = request.body();
            const nuevo = await barriosService.crear({ nombre_barrio, latitud, longitud, estado });
            return response.json({ msj: "Barrio creado", data: nuevo });
        }catch (error) {
        return response.json({ error: error.message })
        }
    }
    async listarBarrio({ response }: HttpContext) {
        try {
            const lista = await barriosService.listar();
            return response.json({ msj: lista });
        }catch (error) {
            return response.json({ error: error.message })
        }
    }
    async listarBarrioId({ params, response }: HttpContext) {
        try {
            const id_barrio = Number(params.id_barrio);
            const barrio = await barriosService.listarId(id_barrio);
            return response.json({ msj: barrio });
        }catch (error) {
            return response.json({ error: error.message })
        }
    }
    async actualizarBarrio({ params, request, response }: HttpContext) {
        try {
            const id_barrio = Number(params.id_barrio);
            const { nombre_barrio, latitud, longitud, estado } = request.body();
            const actualizado = await barriosService.actualizarBarrio(id_barrio, {
                nombre_barrio,
                latitud,
                longitud,
                estado,
            });
            return response.json({ msj: actualizado });
        }catch (error) {
            return response.json({ error: error.message })

        }
    }
    async eliminarBarrio({ params, response }: HttpContext) {
        try {
            const id_barrio = Number(params.id_barrio);
            const eliminado = await barriosService.eliminar(id_barrio);
            return response.json({ msj: eliminado });
        }catch (error) {
            return response.json({ error: error.message })
        }
    }
}