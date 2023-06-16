class Producto {
    constructor(nombre, precio, cantidad, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.imagen = imagen;
    }
    vender() {
        if (this.cantidad > 0) {
            this.cantidad -= 1;
            console.log(`Se vendió un/a ${this.nombre}`);
        } else {
            console.log(`No hay stock de ${this.nombre}`);
        }
    }
}

const productos = [
    new Producto("consola", 249990, 5, "https://arsonyb2c.vtexassets.com/arquivos/ids/361930/711719555360_003.jpg?v=638143176509630000"),
    new Producto("monitor", 59900, 7, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrVRw9Z1uHXoQogrpKiJVvldf-dcs3R8BhLg&usqp=CAU"),
    new Producto("Pc", 359900, 4, "https://d10mhq06fikmnr.cloudfront.net/catalog/product/thumbnail/22ce9fd9aff2fc026120e5de57e72a7466a85d4a2df93bff9fca04c4/image/238719/500x500/110/0/a/z/azza-mp_main-min_1_7.jpg")
];

console.log(productos);

let carrito = [];
let precioTotal = 0;

const mostrarProductos = () => {
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = "";

    productos.forEach((producto) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <p>${producto.nombre} - Precio: $${producto.precio}</p>
            <p>Cantidad disponible: ${producto.cantidad}</p>
            <img class="img-producto" src=${producto.imagen} alt=${producto.nombre}>
            <button class="comprar-btn"><img src="./img/btn comprar.png" alt=""></button>
        `;

        const comprarBtn = li.querySelector(".comprar-btn");
        comprarBtn.addEventListener("click", () => {
            agregarAlCarrito(producto);
            actualizarProductos(); // Actualizar el listado de productos en HTML
        });

        listaProductos.appendChild(li);
    });
};

const agregarAlCarrito = (producto) => {
    if (producto.cantidad > 0) {
        const productoEnCarrito = carrito.find((item) => item.producto.nombre === producto.nombre);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            carrito.push({ producto, cantidad: 1 });
        }
        producto.vender();
        precioTotal += producto.precio;
        actualizarCarrito();
        almacenarCarritoEnLocalStorage();
    } else {
        console.log(`No hay stock de ${producto.nombre}`);
        Swal.fire({
            title: "NO HAY STOCK!!!",
            text: "Gracias por Entender!",
            icon: "error",
            confirmButtonText: "OK",
        });
    }
};

const actualizarCarrito = () => {
    const carritoElement = document.getElementById("carrito");
    carritoElement.innerHTML = "";

    carrito.forEach((item) => {
        const { producto, cantidad } = item;
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} - Precio: $${producto.precio} - Cantidad: ${cantidad}`;
        carritoElement.appendChild(li);
    });

    const precioTotalElement = document.getElementById("precio-total");
    precioTotalElement.textContent = `Precio total: $${precioTotal}`;
};

const almacenarCarritoEnLocalStorage = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("precioTotal", precioTotal);
};

const cargarCarritoDesdeLocalStorage = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    const precioTotalGuardado = localStorage.getItem("precioTotal");

    if (carritoGuardado && precioTotalGuardado) {
        carrito = JSON.parse(carritoGuardado);
        precioTotal = parseFloat(precioTotalGuardado);
        actualizarCarrito();
    }
};

cargarCarritoDesdeLocalStorage();

const finalizarCompraBtn = document.getElementById("finalizar-compra-btn");
finalizarCompraBtn.addEventListener("click", () => {
    carrito.forEach((item) => {
        const { producto, cantidad } = item;
        producto.cantidad += cantidad;
    });
    carrito = [];
    precioTotal = 0;
    actualizarCarrito();
    almacenarCarritoEnLocalStorage();
    Swal.fire({
        title: "Compra finalizada con éxito!!!",
        text: "Gracias por su compra!",
        icon: "success",
        confirmButtonText: "OK",
    });

});

const actualizarProductos = () => {
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = "";
    mostrarProductos();
};


mostrarProductos();

console.log("Carrito de compras:");
carrito.forEach((item) => {
    const { producto, cantidad } = item;
    console.log(`${producto.nombre} - Precio: $${producto.precio} - Cantidad: ${cantidad}`);
});

let title = document.getElementById("title");

fetch("./titulos.json")
    .then((response) => response.json())
    .then((titulo) => {
        titulo.forEach((titulos) =>{
            const li = document.createElement("li");
            li.innerHTML = `
            <h2>${titulos.titulo}</h2>
            <div><p>${titulos.subtitulo}</p></div>
            `;

            title.append(li);
        })
    } )