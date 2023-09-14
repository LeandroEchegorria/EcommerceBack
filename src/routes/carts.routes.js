import { Router } from 'express'
//import { CartManager } from '../controllers/cartManager.js'
import cartModel from "../models/carts.models.js"
import productModel from '../models/products.models.js'

//const cartManager = new CartManager('./src/models/cart.json', './src/models/productos.json')

const cartRouter = Router()


cartRouter.get('/', async (req, res) => {
    const {limit} = req.query
    try {
        const carts = await cartModel.find().limit(limit)
        res.status(200).send({resultado: 'Ok', message: carts})
    } catch (error) {
        res.status(400).send({error: `Error al consultar carrito: ${error}`})
    }
})

cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try{
        const cart = await cartModel.findById(cid);
        cart ? res.status(200).send({resultado: 'OK', message: cart})
            : res.status(404).send({resultado:'Not Found', message: cart})

    }catch (error){
        res.status(400).send ({ error:`Error al consultar carrito: ${error}`})
    }
})


cartRouter.post('/', async (req, res) => {
    const {id_prod , quantity} = req.body
    try {
        const respuesta = await cartModel.create({
            id_prod, quantity
        });
        res.status(200).send({resultado: 'Carrito creado', message: respuesta})
    } catch (error) {
        res.status(400).send({error: `Error al crear carrito: ${error}`})
    }
})

cartRouter.put('/:cid', async (req, res) => {
	const { cid } = req.params
	const { updateProducts } = req.body

	try {
		const cart = await cartModel.findById(cid)
		updateProducts.forEach(prod => {
			const productExists = cart.product.find(cartProd => cartProd.id_prod == prod.id_prod)
			if (productExists) {
				productExists.quantity += prod.quantity
			} else {
				cart.products.push(prod)
			}
		});
		await cart.save()
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'Cart Not Found', message: cart })
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` })
	}
})

cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try{
        const cart = await cartModel.findByIdAndDelete(cid, { product : [] });
        cart ? res.status(200).send({resultado: 'OK', message: cart})
        : res.status(404).send({resultado:'Not Found', message: cart})
    } catch (error){
        res.status(400).send ({ error:`Error al eliminar carritos: ${error}`})

    }
})

cartRouter.delete('/:cid/product/:pid', async(req,res) => {
    const {cid , pid} = req.params
    try{
        const cart = await cartModel.findById(cid)
        if (cart) {
            const productIndex = cart.product.findIndex (prod => prod.id_prod == pid)
            let deletedProduct
            if (productIndex !== -1 ) {
                deletedProduct= cart.product[productIndex]
                cart.product.splice(productIndex, 1)
            } else {
                res.status(404).send({resultado: 'Product not found', message: cart})
                return
            } 
            await cart.save()
            res.status(200).send( {resultado: 'ok' , message: deletedProduct})
        } else {
            res.status(404).send({resultado: 'Cart not found', message: cart})
        }
    } catch (error) {
        res.status(400).send({error : `Error al eliminar producto: ${error}`})
    }


})

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params

    try{
        const cart = await cartModel.findById(cid)
        const product = await productModel.findById(pid)

        if (!product) {
            res.status(404).send({resultado: "Product not found", message: product})
            return false
        }
        
        if (cart) {
            const productExists = cart.product.find(prod => prod.id_prod == pid)
            productExists 
                ? productExists.quantity++ 
                : cart.products.push({ id_prod: product._id, quantity: 1 })
			await cart.save()
			res.status(200).send({ resultado: 'OK', message: cart })
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart })
		}
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` })
	}
}) 

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const {quantity} = req.body
    try{
        const cart = await cartModel.findById(cid)

        if (cart) {
            const productExists = cart.product.find(prod => prod.id_prod == pid)
            if (productExists) {
                productExists.quantity += quantity 
            } else{
                res.status(404).send({resultado: "Product not found", message: product})
                return
            }
			await cart.save()
			res.status(200).send({ resultado: 'OK', message: cart })
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart })
		}
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` })
	}
}) 


export default cartRouter;