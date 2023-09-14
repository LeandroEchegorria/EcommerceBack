import { Schema, model } from "mongoose"

const cartSchema = Schema({
    products: {
        type: [
            {
                id_prod : {
                    type: Schema.Types.ObjectId, //es el id generado en mongodb
                    ref: 'productos',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }

            }
        ],
        default: function () {
            return []
        }
    }
})
cartSchema.pre('find', function () {
	this.populate('products.id_prod')
})

const cartModel = model ('carts', cartSchema)

export default cartModel