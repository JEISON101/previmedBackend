import FormasPago from "#models/formas_pago";
import { DataFormasPagos } from "../interfaces/formas_pagos.js";

export default class FormasPagosServices{
    async create(data: DataFormasPagos){
        return FormasPago.create(data);
    }
}