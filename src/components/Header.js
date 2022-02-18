import React from 'react'
import './Header.css'
export default function Header(props) {
  if(props.account == null){
      return(
          <div className='header'>
              <p className='heading-h'>Note: metamask should be installed</p>
              <button style={{backgroundColor:'#252627',border:'none'}}  onClick={props.load}><p className='heading-h'>Connect you wallet</p></button>
              
          </div>
      )
  }
  return (
    <div className='header'>
        <p className='heading-h'>{props.account}</p>
        <p className='heading-h'>{props.amount} ETH</p>
    </div>
  )
}
