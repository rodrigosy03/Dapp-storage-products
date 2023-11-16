const ProductsContract = artifacts.require("ProductsContract");

contract("ProductsContract", () => {
    before(async () => {
        this.productsContract = await ProductsContract.deployed();
    })

    it('Contrato desplegado con exito.', async () => {
        const address = this.productsContract.address;
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
})