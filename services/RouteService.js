import Route from "../models/routes.model.js";
import RouteByRol from "../models/routesByRole.model.js";

export default class RouteService {
    
    async findAll(where){
        
        if(Object.keys(where).length === 0){
            where = undefined;
        }

        const routes = await Route.findAll(
            {
                where,
                include:[
                    {
                        model:RouteByRol
                    }
                ]
            }
        )
        return routes
    }

    async findAllRoutesByRol(where){
        
        if(Object.keys(where).length === 0){
            where = undefined;
        }

        const routesByRol = await RouteByRol.findAll(
            {
                where,
            }
        )
        return routesByRol
    }

    async createRouteByRol(routeByRol){
        const {route_id, rol_id} = routeByRol;

        const newRouteByRol = RouteByRol.build({route_id,rol_id})
        const n_routeByRol = await newRouteByRol.save()
        return n_routeByRol
    }

    async deleteRouteByRol(route_id,rol_id){
        const delRouteByRol = await RouteByRol.destroy({
            where:{
                route_id,
                rol_id
            }
        })
        return delRouteByRol
    }
};
