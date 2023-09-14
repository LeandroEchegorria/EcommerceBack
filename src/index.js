import express from 'express';
import { __dirname } from './path.js'
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io'
import { ProductManager } from './controllers/productManager.js';
import mongoose from 'mongoose';

import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import messageRouter from './routes/messages.routes.js';

import messageModel from './models/messages.models.js';
import productModel from './models/products.models.js';

const app = express()
const PORT = 8080
const mongoURL = 'mongodb+srv://leandroechegorria:Leandro87@leandro.qvdfttf.mongodb.net/'

//Conexion BD
mongoose.connect(mongoURL)
  .then(() => console.log("DB conectada"))
  .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))



//Server
const server = app.listen(PORT, ()=> {
  console.log(`Server on port ${PORT}, http://localhost:${PORT}/`)
})

const io = new Server(server)

//Product Manager
const ProductManagerSocket = new ProductManager('./src/models/product.json')

//middlewares
app.use(express.json())
app.use(express.urlencoded ({extended: true}))
app.engine('handlebars', engine()) //def trabajo con hbs
app.set('view engine', 'handlebars') //no hace falta explicitar el .handlebars en los archivos
app.set('views', path.resolve(__dirname, './views'))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', productRouter)
app.use('/api/carts', cartRouter)   
app.use('/api/messages', messageRouter)   

app.get('/', (req,res)=> {
  res.send("Bienvenido")
})
//HBS
app.get('/static', async (req,res) => {

  res.render('home', { 
    //se mostraran los productos utilizando HBS
    titulo: "Products",
    rutaCSS: "home",
    rutaJS: "home",
    

  })
})

app.get('/static/realTimeProducts', (req,res) => {
  res.render('realTimeProducts', {
    titulo: "Real Time Products",
    rutaCSS: "realTimeProducts",
    rutaJS: "realTimeProducts",

  })
})

app.get('/static/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	})
})

app.get('/static/products', (req, res) => {
	res.render('products', {
		rutaCSS: 'products',
		rutaJS: 'products',
	})
})

app.get('/static/carts/:cid', (req, res) => {
	res.render('carts', {
		rutaCSS: 'carts',
		rutaJS: 'carts',
	})
})



//Conexion de Socket.io
io.on("connection", (socket) => {
  console.log("Conexion con Socket.io")

  socket.on('nuevoProducto', async(prod) => {
    await productModel.create(prod)
    socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
  })

  socket.on('productos', async() => {
    const prods = await productModel.find()
    socket.emit('getProducts', prods)
  })

	socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 })
		socket.emit('products', data)
	})

  socket.on('previousPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page })
		socket.emit('products', data)
	})

	socket.on('nextPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page })
		socket.emit('products', data)
	})

  socket.on('addProduct', async data => {
		const { pid, cartId } = data
		if (cartId) {
			const cart = await cartModel.findById(cartId)
			const productExists = cart.products.find(prod => prod.id_prod == pid)
			productExists
				? productExists.quantity++
				: cart.products.push({ id_prod: pid, quantity: 1 })
			await cart.save()
			socket.emit('success', cartId)
		} else {
			const cart = await cartModel.create({})
			cart.products.push({ id_prod: pid, quantity: 1 })
			await cart.save()
			socket.emit('success', cart._id.toString())
		}
	})

  socket.on('loadCart', async cid => {
		const cart = await cartModel.findById(cid)
		socket.emit('cartProducts', cart.products)
	})

  socket.on('newProduct', async product => {
		await productModel.create(product)
		const products = await productModel.find()
		socket.emit('products', products)
	})



  socket.on('mensaje', async info => {
    const {email, message} = info
    await messageModel.create({
      email,
      message
    })
    const messages = await messageModel.find()

    socket.emit('mensajes', messages)
  })

})