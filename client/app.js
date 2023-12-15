App = {
    contracts: {},
    web3Provider: null,

    init: async () => {
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        await App.renderProducts()       
    },

    loadEthereum: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            console.log('Esta conectado a Ethereum');

            await window.ethereum.request({ method: 'eth_requestAccounts' })

        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
            console.log('kpasaoooooo')
        } else {
            console.log('No esta conectado a una wallet, intente conectarse a una wallet para continuar.');
        }
    },

    loadAccount: async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            // console.log(accounts);

            App.account = accounts[0];
        } catch (error) {
            console.error("Error al cargar la cuenta:", error);
        }
    },

    loadContracts: async () => {
        const res = await fetch("ProductsContract.json");
        const productsContractJSON = await res.json();

        App.contracts.productsContract = await TruffleContract(productsContractJSON);

        //Conectando nuestro contrato a nuestra cuenta de Metamask
        App.contracts.productsContract.setProvider(App.web3Provider);

        App.productsContract = await App.contracts.productsContract.deployed();

        // console.log(productsContractJSON);
    },

    //De forma analogica, pinta datos
    render: () => {
        console.log(App.account);
        document.getElementById("account").innerText = App.account;
    },

    renderProducts: async () => {
        const productsCounter = await App.productsContract.productsCounter();
        const productsCounterNumber = productsCounter.toNumber();

        console.log(productsCounter);
        console.log("Hay un total de: " + productsCounterNumber + " contratos.");

        let html = "";
        
        // for (let i = 1; i <= productsCounterNumber; i++) {
        for (let i = productsCounterNumber; i >= 1; i--) {
            const product = await App.productsContract.products(i)

            const productID = product[0];
            const productTittle = product[1];
            const productDescription = product[2];
            const productPublished = product[3];
            const productCreatedAT = product[4];

            if (productTittle != "" || productDescription != "") {
                let productElements = `
                    <div class="card text-center mb-3">
                        <div class="card-header navbar">
                            <div class="container-fluid">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-start">
                                    <li class="nav-item">
                                        <h1 class="card-title pr-7">${productID}. ${productTittle}</h1>
                                    </li>
                                </ul>   
                                
                                <div class="d-flex form-check form-switch mx-3 align-items-end"> 
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        data-id="${productID}"
                                        ${productPublished && "checked"} 
                                        onchange="App.togglePublished(this)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="card-body">
                            <p class="card-text">${productDescription}</p>
                        </div>

                        

                        <div class="card-footer text-muted">
                            <p class="text-muted">${productPublished} /// Creado el ${new Date(productCreatedAT*1000).toLocaleString()}</p>
                        </div>
                        
                        <!-- Botones -->
                        <div class="py-2 bg-secondary"> 
                            <button
                                class="btn btn-danger mx-auto"
                                data-id="${productID}"
                                onclick="App.deleteProduct(this)"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                `
                html += productElements;
            }
        }

        document.querySelector("#productsList").innerHTML = html;
    },

    createProduct: async (title, description) => {
        const result = await App.productsContract.createProduct(title, description, {
            from: App.account
        });

        window.location.reload();
        console.log(result.logs[0].args);
    },

    togglePublished: async (element) => {
        // console.log(element);
        // console.log(element.dataset.id);

        const productID = element.dataset.id;
        
        await App.productsContract.togglePublished(productID, {
            from: App.account
        })

        window.location.reload();
    },

    deleteProduct: async (element) => {
        try {
            console.log(element);
            console.log(element.dataset.id);
            const productID = element.dataset.id;
            
            await App.productsContract.deleteProduct(productID, {
                from: App.account
            });
            console.log(`Producto con ID ${productID} eliminado con éxito.`);
        
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }        
    },
    
    updateProduct: async (id, newTitle, newDescription) => {
        try {            
            await App.productsContract.updateProduct(id, newTitle, newDescription, {
                from: App.account
            });
            console.log(`Producto con ID ${id} actualizado con éxito.`);
        
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }        
    }
}