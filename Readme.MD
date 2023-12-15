1. Instalaciones necesarias:
    Node.js
    Ganache
    Visual Studio Code

2. Abrir proyecto en Visual Studio Code

3. Ejecutar los siguientes comandos para instalar los paquetes necesarios
    - npm truffle -g (Esto instala el entorno para el desarrollo en blockhain)
    - npm install lite-server bootstrap web3 @metamask/detect-provider @truffle/contract slyther-analyzer

4. Ejecutar los siguientes comandos para desplegar los smartcontracts en caso de no tener instalado Truffle:
    - truffle deploy

5. Finalmente usar el siguiente comando para ejecutar la DApp:
    - npm run dev