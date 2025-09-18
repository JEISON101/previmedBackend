import Plane from "#models/plane";

class PlanesServices{
async crear(data:{
    tipo_plan: string, 
    descripcion: string, 
    precio: number, 
    estado: boolean, 
    cantidad_beneficiarios: number
}){
    return await Plane.create(data)
}

async listar() {
  return Plane.query()
    .preload('planXBeneficios', (query) => query.preload('beneficio'))
}


async listarId(id: number) {
    return await Plane.find(id)
  }

async actualizar(id: number, data: { 
    tipo_plan?: string, 
    descripcion?: string, 
    precio?: number, 
    estado?: boolean, 
    cantidad_beneficiarios?: number 
  }) {
    const plan = await Plane.query().where('id_plan', id).firstOrFail()
    return await plan.merge(data).save()
  }

async eliminar(id: number) {
    const encontrado = await Plane.find(id)
    if (encontrado) {
      await encontrado.delete()
      return 'Plan eliminado'
    } else {
      return 'No se eliminó'
    }
  }

  async conteo() {
    const resultado = await Plane.query().count('* as total')
    return resultado[0].$extras.total
  }
}

export default PlanesServices;