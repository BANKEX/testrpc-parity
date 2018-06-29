#!/usr/bin/env node
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const defaultGenesis = require('./genesis.json');
const http = require('http');

const argv = require('optimist').argv;
//
// if (argv.maxCodeSize) {
//     // convert decimal to hex number
//     defaultGenesis.maxCodeSize = '0x' + argv.maxCodeSize.toString(16);
// }

function removePreviousBlockchain() {
    child_process.exec(`rm -rf ${__dirname}/DevelopmentChain`);
    // child_process.exec(`rm ${__dirname}/history`);
    // child_process.exec(`rm ${__dirname}/geth.ipc`);
}

function printAccountsWithPrivateKeys() {
    console.log('|************* Account ********************* | ************************ Private Key ***************************** |');
    console.log('| 0x19c3ee4435342b8e6fe3e18d6d1d0ec762baffad | 0xbb7b719667412ea1e47412f910b6d4c1c09b6fb586c0a9d2cb51ae844b8779fc |');
    console.log('| 0x4e191d5c0d3efef9c1f262322977b3989bee18ba | 0x47dea899f09ca9f8da7efdca4aff5e434e05562ca30b3a66e78ee72c38dd9a4a |');
    console.log('| 0xde5e36d16d1fd00236a70b6e9c6feb3ede87f245 | 0x258d77969030b3fd95741a8c2f051d3b6a257f343dfd38f540293a2ef1a2b932 |');
    console.log('| 0xa2cd78b13e5f11f759ffd5125b6a9192e4fba16a | 0xfa6ea0f20039c2fb3cdfbccc9ccfa36ddaa8b620b3cbec8149cd0fe8f6869fd3 |');
    console.log('| 0xdff65efc28a8312a402a96e9077e607625c95c70 | 0x73f2dabb29e353338cc90e4b3be447560f41a36f24922016ec61db09868740fa |');
    console.log('| 0x594fea497b8adbfebfa2352cb12c6fee0de12929 | 0x62c1360a7e581388b67dbd5b5e02952de97c98435e5a6d22fd820683b2c841c0 |');
    console.log('| 0xa1d35d5677a2f5d49e3e359d25f069958d025efa | 0x096b7d771e57dd52eb6b87cd3bcb465e3aec2ab1be23bb02ef094f12ff656408 |');
    console.log('| 0x41ba6e2c3f3bd5b049e8779447e0837be3eb7760 | 0x6beca4cc6c7d06d95f5f86247d5ed054e295ac97b241861fe66d134d3d3d7a5f |');
    console.log('| 0x56c80739ac898d2d28f30e67e04902ae293a6a06 | 0x0ccedd490e0b0b4666c3bb03bfb5ac43b93de850262b30b150300e527439fded |');
    console.log('| 0x1eea65ad4c6c0fdf73d5c253162678086ca62196 | 0xa5de7c3875b7434c670b5f1c857c85130686b75fa1c5e27de14e4053f7545509 |');
    console.log('|******************************************* | *******************************************************************|');
}

function startGeth() {
    const datadir = path.join(__dirname, './');
    const genesis = path.join(__dirname, './genesis.custom.json');
    const password = path.join(__dirname, './password.txt');

    // console.log(`DATADIR: ${datadir}`);

    const accountsResponse = child_process.execSync(`parity --chain dev --db-path ${datadir} --keys-path ${datadir}keys account list | tail -n 10`).toString();
    const accounts = accountsResponse.split('\n').slice(0, 10);

    //
    // const child = child_process.exec(`parity daemon --chain dev --geth --unlock 0x00a329c0648769a73afac7f9381e08fb43dbea72 --password '<(echo "")' parity.pid`);

    // const p = child_process.execSync(`<echo'("123")'`);
    // console.log(p.toString());

    // let data;
    // const options = {
    //     host: 'localhost',
    //     port: 8545,
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // };
    //
    // for(let account in a) {
    //     data = `{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0x00a329c0648769a73afac7f9381e08fb43dbea72","to":"${account}","value":"0x52b7d2dcc80cd2e4000000","gas":"0x5208"}],"id":1}`;
    //     options.headers['Content-Length'] = Buffer.byteLength(data);
    //
    //     const r = http.request(options);
    //     r.write(data);
    //     r.end();
    // }

    // child_process.execSync('"./transfer.sh"', {stdio: 'inherit'});

    const command = `parity  --chain dev --db-path ${datadir} --keys-path ${datadir}keys --reseal-min-period 0 --gasprice 0 --network-id 5777 --rpcport 8545 --geth  --unlock 0x5ee9d66311f097b530042ad02a094160e899d13e,0xf7e49462a2e4e567267e652609d85cc848af9a41,0xa85f2bc63e3b269d562ed7b82c51426929a89f3a,0xc6c2bfe802c1c7c95e3bfeae0aa3220290415cf0,0xf0ce5cd92cfb505e67231a409f62d69be6f0e32a,0xa2c380f2f27c2e400aadd2d9e37a38dcca9caaa9,0x37b24d5bad5f29760c80a7bf8629c5fe7cfaa3f8,0x74bff67501fe041ef3c9891d19402612df154200,0x860ee6f764a02e680eae61d126f8318b742df14e,0x795521614966a59d9f3aa142ad672ff415f90b79 --password="${password}"`;

    const gethExec = child_process.exec(command);



    gethExec.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    gethExec.stderr.on('data', function(data) {
        console.log(data.toString());
    });

    gethExec.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });


    setTimeout(function() {
        let data;
        const options = {
            host: 'localhost',
            port: 8545,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };


        unlockPrimaryAccount(function() {

            for(let i = 0; i < accounts.length; i++) {

                data = `{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0x00a329c0648769a73afac7f9381e08fb43dbea72","to":"${accounts[i]}","value":"0x52b7d2dcc80cd2e4000000","gas":"0x5208"}],"id":1}`;
                options.headers['Content-Length'] = Buffer.byteLength(data);

                const r = http.request(options, function(res) {
                    res.setEncoding('utf8');
                    // res.on('data', function (chunk) {
                    //     console.log('Response: ' + chunk);
                    // });

                    res.on('error', function(err) {
                        console.log(err.message);
                    });
                });

                r.write(data);
                r.end();
            }

        });

    }, 5000);
}

function unlockPrimaryAccount(callback) {
    let unlockRequest = '{"method":"personal_unlockAccount","params":["0x00a329c0648769a73afac7f9381e08fb43dbea72","",null],"id":1,"jsonrpc":"2.0"}';
    const options = {
        host: 'localhost',
        port: 8545,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(unlockRequest)
        }
    };

    const r = http.request(options, callback);
    r.write(unlockRequest);
    r.end();

}

function updateGenesis() {
    const genesis = path.join(__dirname, './genesis.custom.json');
    fs.writeFileSync(genesis, JSON.stringify(defaultGenesis));
}

function init() {
    removePreviousBlockchain();

    updateGenesis();

    printAccountsWithPrivateKeys();

    startGeth();
}

init();