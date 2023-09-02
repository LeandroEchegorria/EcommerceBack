import { Schema, model } from "mongoose";

const productSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    price:  {
        type: Number,
        required: true
    },
    category:  {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    thumbnail: [],
    code: {
        type: String,
        unique: true,
        required: true
    }, 
    stock:  {
        type: Number,
        required: true
    },
}
)

export default productModel = model('products', productSchema)

