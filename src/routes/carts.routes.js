import { Router } from 'express';
//import { CartManager } from '../controllers/cartManager.js';
import cartModel from "../models/carts.models.js"

//const cartManager = new CartManager('./src/models/cart.json', './src/models/productos.json');

const cartRouter = Router();

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
});



cartRouter.get('/', async (req, res) => {
    const {limit} = req.query
    try {
        const prods = await cartModel.find().limit(limit)
        res.status(200).send({resultado: 'Ok', message: prods})
    } catch (error) {
        res.status(400).send({error: `Error al consultar carrito: ${error}`})
    }
});


cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try{
        const cart = await cartModel.findById(cid);
        cart ? res.status(200).send({resultado: 'OK', message: cart})
            : res.status(404).send({resultado:'Not Found', message: cart})

    }catch (error){
        res.status(400).send ({ error:`Error al consultar carrito: ${error}`});
    }
});

cartRouter.put('/:cid', async (req, res) => {
    const {cid} = req.params;
    const {id_prod, quantity} =req.body;

    try {
        const cart = await cartModel.findByIdAndUpdate(cid, {
            id_prod,
            quantity,
        });
        cart ? res.status(200).send({resultado: 'OK', message: cart})
            : res.status(404).send({resultado:'Not Found', message: cart})
    } catch(error){
        res.status(400).send ({ error:`Error al actualizar carritos: ${error}`});
    };
});

cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try{
        const cart = await cartModel.findByIdAndDelete(cid);
        cart ? res.status(200).send({resultado: 'OK', message: cart})
        : res.status(404).send({resultado:'Not Found', message: cart})
    } catch (error){
        res.status(400).send ({ error:`Error al eliminar carritos: ${error}`});

    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    const success = await cartModel.addProductToCart(cid, pid, quantity);
    
    (success) ? res.status(200).send("Product added to cart") : res.status(404).send("Cart not found");
    
});


export default cartRouter;