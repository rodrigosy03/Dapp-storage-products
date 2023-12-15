const ProductsContract = artifacts.require("ProductsContract");

contract("ProductsContract", () => {
    before(async () => {
        this.productsContract = await ProductsContract.deployed();
    })

    it('Contrato desplegado con exito.', async () => {
        const address = await this.productsContract.address;
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it('Obtener lista de productos.', async () => {
        const productsCounter = await this.productsContract.productsCounter();
        const product = await this.productsContract.products(productsCounter);

        assert.equal(product.id.toNumber(), productsCounter);
        assert.equal(product.title, "Producto de ejemplo");
        assert.equal(product.description, "Ejemplo de descripcion del producto");
        assert.equal(product.published, false);
        assert.equal(productsCounter, 1);
    })

    it('Producto creado con exito.', async () => {
        const result = await this.productsContract.createProduct("Test titulo de producto", "Test decripcion de producto");
        const productEvent = result.logs[0].args;
        const productsCounter = await this.productsContract.productsCounter();

        assert.equal(productEvent.id.toNumber(), 2);
        assert.equal(productEvent.title, "Test titulo de producto");
        assert.equal(productEvent.description, "Test decripcion de producto");
        assert.equal(productEvent.published, false);
        assert.equal(productsCounter, 2);
    })    

    it('Alternar publicacion del producto.', async () => {
        const result = await this.productsContract.togglePublished(1);
        const productEvent = result.logs[0].args;
        const product = await this.productsContract.products(1);

        assert.equal(product.published, true);
        assert.equal(productEvent.published, true);
        assert.equal(productEvent.id.toNumber(), 1);
    })

    it('Modificar producto.', async () => {
        const result = await this.productsContract.updateProduct(0, "Titulo cambiado", "Decripcion cambiada");
        const productEvent = result.logs[0].args;
        const product = await this.productsContract.products(0);
        
        assert.equal(productEvent.id.toNumber(), 0);
        assert.equal(product.title, "Titulo cambiado");
        assert.equal(product.description, "Decripcion cambiada");
    })

    it('Eliminar datos de un producto.', async () => {
        await this.productsContract.deleteProduct(1);
        // const productEvent = result.logs[0].args;
        const product = await this.productsContract.products(1);
        
        assert.equal(product.id.toNumber(), 1);
        assert.equal(product.title, "");
        assert.equal(product.description, "");
    })
})