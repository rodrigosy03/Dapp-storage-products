const ProductsContract = artifacts.require("ProductsContract");

module.exports = function (deployer) {
    deployer.deploy(ProductsContract);
};
