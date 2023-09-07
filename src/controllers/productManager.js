import { promises as fs } from 'fs'

export class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
    }

    static incrementId(prod) {
		const ids = [];
		let newId = 1;
		prod.forEach(product => ids.push(product.id));
		prod.length > 0 && (newId = Math.max(...ids) + 1);
		return newId;
	}

    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods
    }

    async getProductsById (id) {
        let products = JSON.parse(await fs.readFile(this.path, "utf-8"))
        const prodFound = products.find((product) => product.id === id)
        return prodFound
    } 

    async addProduct(prod) {
        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const { title, description, category, price, code, stock } = prod;

        if (!title || !description || !price || !category || !code || !stock) {
            console.error('Error. All product fields are mandatory')
            return
        } 

        const existProd = this.products.find(producto => producto.code === code)

        if (existProd) { 
            return false
        } else {
            prod.id = ProductManager.incrementId(this.products)
            prod.status = true
            this.products.push(prod)

        }
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
        return true
    }

    async updateProduct (id, { title, description, price, category, thumbnail, code, stock, }) { 
        let products = JSON.parse(await fs.readFile(this.path, 'utf-8')) 
        const indice = products.findIndex (prod => prod.id === parseInt(id)) 

        if (indice!= -1){
            products[indice].title = title 
            products[indice].description = description
            products[indice].price = price
            products[indice].thumbnail = thumbnail
            products[indice].code = code
            products[indice].category = category
            products[indice].stock = stock
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
            return products
        }else {
            console.error("Product not found")
            return false
        }
    }

    async deleteProduct (id) {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const buscado = await products.find(item => item.id === parseInt(id));
            
        if (buscado) {
            const prods= products.filter(prod=> prod.id !== parseInt(id)) 
            await fs.writeFile(this.path, JSON.stringify(prods, null, 2))
            return true  
        } else {
            return false
        } 
    }
}