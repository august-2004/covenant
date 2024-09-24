import { useState,useEffect } from 'react'
import {Html5QrcodeScanner} from 'html5-qrcode'

function App() {
  

    const [scanResult, setScanResult] = useState("") 
  
    useEffect(()=>{
      const scanner = new Html5QrcodeScanner("qrScanner", {
        qrbox:{
          width:300,
          height: 300,
        }
      })
      scanner.render(successFunc,errorFunc);
      function successFunc(result){
        scanner.clear();
        setScanResult(result);
      } 
      function errorFunc(err){
        console.log(err)
      }
    },[])
    return (
      <>
          <div id="qrScanner"></div>
      </>
    )
  }
  
  export default App