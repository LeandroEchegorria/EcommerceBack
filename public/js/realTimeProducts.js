const socket = io()

const form = document.getElementById('formProduct')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //El formulario que disparo el evento
    const prod = Object.fromEntries(datForm) //Dado un objeto iterable, te devuelvo sus datos en un objeto simple
    
    socket.emit('nuevoProducto', prod) //handshake
    socket.on('mensajeProductoCreado', (mensaje) => {

        Swal.fire(
            mensaje
        )
    })
    e.target.reset()
})

const arrayProductos = document.getElementById('productos')

socket.emit('productos') //handshake
socket.on('getProducts', (prods) => {
    arrayProductos.innerHTML = ""
    prods.forEach(producto => {
        arrayProductos.innerHTML += 
        `<h3>Nombre: ${producto.title}</h3> 
        <p> Descripcion: ${producto.description}</p>  
        <p>Precio: ${producto.price}</p> 
        <p> Categoria: ${producto.category}</p> 
        <p>Stock: ${producto.stock}</p>
        <p>Codigo: ${producto.code}</p>  
        <p>Status: ${producto.status}</p>
        <hr>`
    })

})