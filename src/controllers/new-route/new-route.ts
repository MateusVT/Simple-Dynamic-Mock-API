import { Request, Response } from 'express';
import { check } from 'express-validator';
import * as HttpStatus from 'http-status-codes';
import { getRepository } from 'typeorm';
import { Route } from '../../entities/routes';
import generateDinamicRoutes from '../../routes/dinamic';
import router from '../../routes/routes';


export async function create(req: Request, res: Response) {

  const routeRepository = getRepository(Route);
  const body: Endpoints = req.body;
  const staticRoutes: string[] = router.stack.map(route => {
    if (route.route && route.route.path) {
      return route.route.path
    }
  })

  const dinamicRoutes = (await routeRepository!.find()).map(route => route.url);
  const routeAlreadyExists = [...staticRoutes, ...dinamicRoutes].some(route => route == body.url)

  if (routeAlreadyExists) {
    res.status(HttpStatus.OK).json({ error: { message: "Route already exists." } })
  } else {
    const { url, httpStatus, method, responseStructure, searchKey, data } = body
    let route = new Route(url, method, httpStatus, data, responseStructure, searchKey);

    await routeRepository!.save(route);
    generateDinamicRoutes(router)
    res.status(HttpStatus.OK).end();
  }
}



//TODO duplicated, could use class declaration
export type Endpoints = {
  url: string,
  method: string,
  httpStatus: number,
  data: {} | any[],
  responseStructure: "ArrayObject" | "Object",
  searchKey?: string
}