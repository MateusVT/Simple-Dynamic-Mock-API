import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { Route } from '../entities/routes';
import { readFileSync } from 'fs'

async function generateDinamicRoutes(router: Router) {

    try {
        const routeRepository = getRepository(Route);
        const routes = await routeRepository.find();
        const _router = (router as any | Router)

        routes.forEach((route) => {
            let endpointUrl: string
            let searchValue: string | undefined
            let searchParam: string | undefined
            let data: (searchValue?: string) => void
            const isArrayResponse = route.responseStructure == "ArrayObject"

            switch (route.searchKey) {
                case "*":
                    endpointUrl = `${route.url}${"/:all"}`
                    searchParam = "all"
                    data = (searchValue?: string) => {
                        const data = JSON.parse(route.data) as any[]

                        return isArrayResponse ? data.filter(element => {
                            const filter = Object.keys(element).some(key =>
                                element[key] == searchValue
                            )
                            return filter
                        }) : JSON.parse(route.data)
                    }

                    break;

                case null:
                    endpointUrl = `${route.url}${"/:param?"}`
                    searchParam = "param"
                    data = (searchValue?: string) => {
                        const data = JSON.parse(route.data) as any[]
                        return searchValue ?
                            data.filter(element => {
                                const filter = Object.keys(element).some(key =>
                                    element[key] == searchValue
                                )
                                return filter
                            }) : JSON.parse(route.data)
                    }

                    break;

                default:
                    endpointUrl = `${route.url}/:${route.searchKey}`
                    searchParam = route.searchKey
                    data = (searchValue?: string) => {
                        const data = JSON.parse(route.data) as any[]
                        return isArrayResponse ? data.filter(element => element[route.searchKey!] == searchValue) : JSON.parse(route.data)
                    }
            }

            _router[route.method](endpointUrl, async (req: Request, res: Response) => {
                searchValue = searchParam ? req.params[searchParam] : undefined
                const responseData = data(searchValue)
                res.status(route.httpStatus).json(responseData);
            });

        }
        )
    } catch (err) {
        console.log(err)
    }

}

export default generateDinamicRoutes;
