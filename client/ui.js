const productForm = document.querySelector("#productForm");
const updateProductForm = document.querySelector("#updateProductForm");

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

updateProductForm.addEventListener("submit", e => {
    e.preventDefault();
    
    console.log(
        parseInt(updateProductForm["id"].value, 10),
        updateProductForm["newTitle"].value,
        updateProductForm["newDescription"].value
    );

    App.updateProduct(parseInt(updateProductForm["id"].value, 10), updateProductForm["newTitle"].value, updateProductForm["newDescription"].value);
})