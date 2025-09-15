import FormasPago from "#models/formas_pago";
import { DataFormasPagos } from "../interfaces/formas_pagos.js";

export default class FormasPagosServices{
    async create(data: DataFormasPagos){
        return FormasPago.create(data);
    }

    async list(){
        return FormasPago.all();
    }

    async findById(id: number){
        return FormasPago.findOrFail(id);
    }
    async update(id: number, data: Partial<DataFormasPagos>){
        const formaPago = await FormasPago.findOrFail(id);
        formaPago.merge(data);
        await formaPago.save();
        return formaPago;
    }
    async delete(id: number){
        const formaPago = await FormasPago.findOrFail(id);
        await formaPago.delete();
        return { message: "Forma de pago eliminada correctamente"};
    }
}