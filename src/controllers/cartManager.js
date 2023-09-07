import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async createCart() {
    const newCart = {
      id: uuidv4(), //metodo para id unico
      products: []
    };
    this.carts.push(newCart);
    await this.saveCartsToFile();
    return newCart;
  }
/*   static incrementId(cart) {
		const ids = [];
		let newId = 1;
		cart.forEach(product => ids.push(cart.id));
		cart.length > 0 && (newId = Math.max(...ids) + 1);
		return newId;
	}
 */

  async getCarts() {
    try {
        const cartsData = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(cartsData);
    } catch (error) {
        return [];
    }
}

  async getCartById(id) {
    await this.loadCartsFromFile();
    const cart = this.carts.find(cart => cart.id === id);
    return cart;
  }

  async addProductToCart(cartId, productId, quant) {
    await this.loadCartsFromFile();
  
    const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      const cart = this.carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(product => product.product === productId);
      
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1});
      }
  
      await this.saveCartsToFile();
      console.log("Product added to cart:", cart.products);
      return true;
    } else {
      console.error("Cart not found");
      return false;
    }
  }


  async deleteCart(id) {
    await this.loadCartsFromFile();
    const initialCartCount = this.carts.length;
    this.carts = this.carts.filter(cart => cart.id !== id);

    if (this.carts.length === initialCartCount) {
      console.error("Cart not found");
      return false;
    } else {
      await this.saveCartsToFile();
      console.log("Cart deleted");
      return true;
    }
  }

  async loadCartsFromFile() {
    try {
      const cartsData = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(cartsData);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCartsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error saving carts', error);
    }
  }

  
}