import { Router } from "express"
import productModel from "../models/products.models.js"

const productRouter = Router()

productRouter.get('/', async (req, res)=>{
    const {limit, page, sort, category, status} = req.query
    let sortOption
	sort == 'asc' && (sortOption = 'price')
	sort == 'desc' && (sortOption = '-price')

	const options = {
		limit: limit || 10,
		page: page || 1,
		sort: sortOption || null,
	}

	const query = {}
	category && (query.category = category)
	status && (query.status = status)

	try {
		const prods = await productModel.paginate(query, options)
		res.status(200).send({ resultado: 'OK', message: prods })
	} catch (error) {
		res.status(400).send({ error: `Error al consultar productos: ${error}` })
	}
})

productRouter.get('/:pid', async (req, res)=>{
    const {pid} = req.params
    try {
        const prod = await productModel.findById(pid)
        if (prod) {
            res.status(200).send({resultado: 'Ok', message: prod})
        } else {
            res.status(404).send({resultado: 'Not found', message: prod})
        }
    } catch (error) {
        res.status(400).send({error: `Error al consultar producto: ${error}`})
    }
})
productRouter.post('/', async (req, res)=>{
    const { title, description, stock, code, price, category} = req.body
  
    try {
        const respuesta = await productModel.create({
            title, description, stock, code, price, category
        })
        res.status(200).send({resultado: 'Ok', message: respuesta})
    } catch (error) {
        res.status(400).send({error: `Error al crear producto: ${error}`})
    }
})

productRouter.put('/:pid', async (req, res)=>{
    const {pid} = req.params
    const { title, description, stock, code, price, category, status} = req.body
    try {
        const respuesta = await productModel.findByIdAndUpdate(pid, {title, description, stock, code, price, category, status})
        if (respuesta) {
            res.status(200).send({resultado: 'Ok', message: respuesta})
        } else {
            res.status(404).send({resultado: 'Not found', message: respuesta})
        }
    } catch (error) {
        res.status(400).send({error: `Error al actualizar producto: ${error}`})
    }
})

productRouter.delete('/:pid', async (req, res)=>{
    const {pid} = req.params
    try {
        const respuesta = await productModel.findByIdAndDelete(pid)
        if (respuesta) {
            res.status(200).send({resultado: 'Ok', message: respuesta})
        } else {
            res.status(404).send({resultado: 'Not found', message: respuesta})
        }
    } catch (error) {
        res.status(400).send({error: `Error al eliminar producto: ${error}`})
    }
})

export default productRouter