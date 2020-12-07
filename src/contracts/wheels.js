import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import wheelsabi from './wheelsabi.json';

async function wheels(address) {
    const fm = new Fortmatic('pk_test_272D468A58C4CA24');
    let web3 = new Web3(fm.getProvider());

    const tokenContractInstance = await web3.eth.contract(wheelsabi).at('0x8EBC7785b83506AaA295Bd9174e6A7Ad5681fb80');
    // const balance = await tokenContractInstance.balanceOf(address).call(function(error, result) {
    //     if (error) throw error;
    //     console.log(result);
    // });
    console.table(tokenContractInstance);
    // return balance;
}

export default wheels;