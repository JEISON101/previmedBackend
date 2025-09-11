import Barrio from "#models/barrio";

class BarriosServices{
    async crear(data:{
        nombre_barrio:string,
            latitud:number,
            longitud:number,
            estado:boolean
    }){
        return await Barrio.create(data)
    }
    async listar(){
        return await Barrio.query()
    }
    async listarId(id:number){
        return await Barrio.find(id)
    }
    async actualizarBarrio(id:number, data:{
            nombre_barrio?:string,
            latitud?:number,
            longitud?:number,
            estado?:boolean
    }){
        const barrio = await Barrio.query().where('id_barrio',id).firstOrFail()
        return await barrio.merge(data).save()

    }
    async eliminar(id:number){
    const encontrado = await Barrio.find(id)
            if (encontrado) {
              await encontrado.delete()
              return 'Barrio eliminado correctamente'
            } else {
              return 'No se eliminó'
            }
        }
}

export default BarriosServices;