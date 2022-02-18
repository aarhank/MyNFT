import React, { useEffect, useState } from 'react'
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import Juit from '../abis/Juit.json';
import './App.css'
import Header from './Header'
import Nft from './Nft'
export default function App() {
    const [account,setAccount] = useState('');
    const [contract,setContract] = useState(null);
    const [totalSupply, setTotalSupply] = useState()
    const [juit,setJuit] = useState([])
    const [owned,setOwned] = useState([]);
    const [amount,setAmount] = useState()
    useEffect(async() => {
        await loadWeb3();
        
        return () => {
            console.log("This will be logged on unmount");
          }
    },[])

    async function loadWeb3() {
        const provider = await detectEthereumProvider();
        if(provider){
            
            await window.ethereum.enable(provider);
            window.web3 = new Web3(provider);
            loadBlockchainData();
        }
        else {
            console.log('no wallet')
        }
    }

    async function loadBlockchainData(){
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts);
        const networkId = await web3.eth.net.getId();
        const networkData = Juit.networks[networkId];
        if(networkData){
            const abi = Juit.abi;
            const address = networkData.address;
            const contracts = new web3.eth.Contract(abi, address);
            setContract(contracts);
            const totalSupply = await contracts.methods.totalSupply().call();
            setTotalSupply(totalSupply);
            web3.eth.getBalance(accounts[0])
                .then(function (balance) {
                    setAmount(web3.utils.fromWei(balance));
                }).catch(function(e) {
                    console.log(e);
                });
            console.log(amount);
            for(let i =1;i<=totalSupply;i++) {
                const Juit = await contracts.methods.juit(i-1).call();
                setJuit(juit => [...juit, Juit]);
                const add = await contracts.methods.ownerOf(i-1).call();
                if(add == accounts[0]){
                    setOwned(owned => [...owned, Juit])
                }
            }
            
            
        }else{
            alert("smart contract not deployeed");
        }
    }   
    
    const mint = (Juit) => {
        if(contract){
        contract.methods.mint(Juit).send({from:account[0]})
        .once("receipt",(receipt) => {
            setJuit(juit => [...juit, Juit])
        })
    }
        else {
            alert("Metamask not connected or smart contract not hosted");
    }
        
    }

    const transfer = (from,to,id) =>{
        contract.methods.transferFrom(from,to,id).send({from:account[0]})
        .once("receipt",(receipt) => {
            console.log("tokens transferred")
        })
    }
    const transfernft = async (nftt) => {
        let actualIndex = tokenId(nftt);
        let to = prompt("Transfer to address");
        if(window.web3.utils.isAddress(to)){
            transfer(account[0],to,actualIndex);
        }
        else{
            alert("Enter correct eth address");
        }
    } 
    const tokenId = async (nftt) => {
        let Id;
        for(let i =1;i<=totalSupply;i++) {
            let string = await contract.methods.juit(i-1).call();
            if(string == nftt) {
                Id = i-1;
                break;
            }
        }
        return Id;
    }
   
    let nfts = [
        "https://i.ibb.co/86fNgnC/J1.jpg",
        "https://i.ibb.co/sHTCCP5/J2.jpg",
        "https://i.ibb.co/7QcCxFm/J3.jpg",
        "https://i.ibb.co/PZrZXVK/J4.jpg",
        "https://i.ibb.co/8jfrLWn/J6.jpg",
        "https://i.ibb.co/Kj81rMv/J8.jpg",
    ];
    return(
        <div className='home'>
            <Header account={account[0]} amount={amount} load={() => loadWeb3()} />
            <div style={{paddingLeft:'2vw'}}>
            <p className='heading'>My<span className='color'>NFT</span></p>
            <p className='heading2'>OwnedNFTs</p>
            <div className='owned'>
            <div className='all'>
            {owned.map(something => {
                return(

                    <Nft image={something} title="Transfer" minting={() => transfernft(something)} />
                )
            })}
            </div>
            </div>
            <p className='heading2'>MarketPlace</p>
            <div className='all'>
                {nfts.map(nftz=>  {
                    return(   
                    <Nft image={nftz} title="Mint" minting={() => mint(nftz)} />
                    )
                })}               
            </div>
            </div>
        </div>
    )
}
