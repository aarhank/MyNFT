import React from 'react'
import './Nft.css'
export default function Nft(props) {
  if(props.soldout!=null){
    return(
      <div className='nftp'>
        <img className='image' src={props.image} alt="somthing interesting"/>
        <button style={{alignSelf:'center',backgroundColor:'#252627',border:'none'}}><p style={{margin:'1vw',color:'#a9a9b3',fontSize:20,fontWeight:'bold'}}>{props.soldout}</p></button>
    </div>
    )
  }
  return (
    <div className='nftp'>
        <img className='image' src={props.image} alt="somthing interesting"/>
        <button style={{alignSelf:'center',backgroundColor:'#252627',border:'none'}} onClick={props.minting}><p style={{margin:'1vw',color:'#a9a9b3',fontSize:20,fontWeight:'bold'}}>{props.title}</p></button>
    </div>
  )
}
