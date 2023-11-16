// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

contract ProductsContract {
    uint256 public productsCounter = 0;

    constructor () {
        createProduct("Producto de ejemplo", "Ejemplo de descripcion del producto");
    }

    struct Product {
        uint id;
        string title;
        string description;
        bool published;
        uint createdAT;
    }

    event ProductCreated(
        uint id,
        string title,
        string description,
        bool published,
        uint createdAT
    ); 

    event ProductTogglePublished(uint id, bool published);

    mapping(uint256 => Product) public products;

    function createProduct(string memory _title, string memory _description) public {        
        productsCounter++;
        products[productsCounter] = Product(productsCounter, _title, _description, false, block.timestamp);
        emit ProductCreated(productsCounter, _title, _description, false, block.timestamp);
    }

    // Función para actualizar el estado de un producto 
    function togglePublished(uint256 _id) public {
        Product memory _product = products[_id];
        _product.published = !_product.published;

        products[_id] = _product;

        emit ProductTogglePublished(_id, _product.published);
    }


}