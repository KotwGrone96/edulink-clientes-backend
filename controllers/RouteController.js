export default class RouteController {
    
    routeService;

    constructor(routeService){
        this.routeService = routeService;
    }

    async findAll(req,res){
        const where = {}
        if(req.query['type']){
            where['type'] = req.query['type']
        }
        try {
            const routes = await this.routeService.findAll(where)
            return res.json({
                ok:true,
                message:'Todas las rutas',
                routes
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async createRouteByRol(req,res){
        if('route_id' in req.body === false || 'rol_id' in req.body === false){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }
        try {
            const routeByRol = await this.routeService.createRouteByRol(req.body)
            return res.json({
                ok:true,
                message:'Permiso asignado',
                routeByRol
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

    async deleteRouteByRol(req,res){
        if('route_id' in req.body === false || 'rol_id' in req.body === false){
            return res.json({
                ok:false,
                message:'Faltan datos por enviar'
            })
        }
        try {
            await this.routeService.deleteRouteByRol(req.body['route_id'],req.body['rol_id'])
            return res.json({
                ok:true,
                message:'Permiso eliminado',
               
            })
        } catch (error) {
            return res.json({
                ok:false,
                message:'Error en el servidor',
                error
            })
        }
    }

};
