const productForm = document.querySelector("#productForm");

document.addEventListener("DOMContentLoaded", () => {
    App.init();
})

productForm.addEventListener("submit", e => {
    e.preventDefault();

    console.log(
        productForm["title"].value,
        productForm["description"].value
    );

    App.createProduct(productForm["title"].value, productForm["description"].value);
    
})