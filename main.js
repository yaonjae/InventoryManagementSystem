async function getData() {
    try {
        const call = await fetch("https://fakestoreapi.com/products?limit=20");
        if (!call.ok) {
            throw new Error("API request failed");
        }
        const data = await call.json();
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            alert("Type Error Occurred!!!");
        } 
        else {
            alert("An Error Occurred!!!");
        }
    }
}

async function display() {
    const productsContainer = document.getElementById("products");
    const data = await getData();

    if (!data) return;

    data.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productDiv.appendChild(productImage);

        const productTitle = document.createElement("h4");
        productTitle.textContent = product.title;
        productDiv.appendChild(productTitle);

        const productPrice = document.createElement("p");
        productPrice.textContent = `$${product.price}`;
        productDiv.appendChild(productPrice);

        productsContainer.appendChild(productDiv);
    });
}
window.onload = display;