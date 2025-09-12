import Ep from "#models/ep";
import { DataEps } from "../interfaces/eps.js";

export default class EpsServices {
    
    // crear
    async create(data: DataEps) {
        return Ep.create(data);
    }

    // Listar todas las EPS
    async list() {
        return Ep.all();
    }

    // buscar una EPS por ID
    async findById(id: number) {
        return Ep.findOrFail(id);
    }

    // actualizar EPS por ID
    async update(id: number, data: Partial<DataEps>) {
        const eps = await Ep.findOrFail(id);
        eps.merge(data);
        await eps.save();
        return eps;
    }

    // eliminar EPS por ID
    async delete(id: number) {
        const eps = await Ep.findOrFail(id);
        await eps.delete();
        return { message: "EPS eliminada correctamente" };
    }
}