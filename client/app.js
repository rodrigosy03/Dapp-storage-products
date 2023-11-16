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
        document.getElementById("account").innerText= App.account;
    },

    renderProducts: async () => {
        const productsCounter = await App.productsContract.productsCounter();
        const productsCounterNumer = productsCounter.toNumber();

        console.log(productsCounter);
        console.log("Hay un total de: " + productsCounterNumer + " contratos.");

        let html = "";

        for (let i = 1; i <= productsCounterNumer; i++) {
            const product = await App.productsContract.products(i)

            const productID = product[0];
            const productTittle = product[1];
            const productDescription = product[2];
            const productPublished = product[3];
            const productCreatedAT = product[4];

            let productElements = `
                <div class="card bg-dark rounded-0 mb-2 text-light">
                    <div class="card-heeader">
                        <span>${productTittle}</span>
                        <div class="form-check form-switch">
                            <input 
                                class="form-check-input" 
                                type="checkbox" 
                                data-id="${productID}"
                                ${productPublished && "checked"} 
                                onchange="App.togglePublished(this)"
                            />
                            - ${productPublished}
                        </div>
                        <span>${productDescription}</span>
                    </div>
                    <div class="card-body">
                        <div>
                            <span>ID: ${productID}</span>
                            <p class="text-muted text-light">Creado: ${new Date(productCreatedAT*1000).toLocaleString()}</p>
                        </div>
                    </div>
                    
                </div>
            `
            html += productElements;
        }

        document.querySelector("#productsList").innerHTML = html;
    },

    createProduct: async (title, description) => {
        const result = await App.productsContract.createProduct(title, description, {
            from: App.account
        });

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
    }
}