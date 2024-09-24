import { useState,useEffect } from 'react'
import {Html5QrcodeScanner} from 'html5-qrcode'

function QrScanner() {
    const [deleteResult,setDeleteResult] = useState("")
  
    useEffect(()=>{
      const scanner = new Html5QrcodeScanner("qrScanner", {
        qrbox:{
          width:300,
          height: 300,
        },
        fps:1
      })
      scanner.render(successFunc,errorFunc);

      function successFunc(result){  
        deleteData(result);
        scanner.clear();
        setTimeout(() => {
            scanner.render(successFunc,errorFunc);
        }, 5000);
      } 
      function errorFunc(err){
        console.log(err)
      }


      const deleteData = async (id) => {
        try {
                console.log(id);
                const response = await fetch(`http://localhost:3000/orders/${id}`, {
                method: 'DELETE',
            });
    
            if (response.status === 404) {
                setDeleteResult(`NOT approved`);
            } 
            else if (!response.ok) {
                throw new Error(`Unexpected error: ${response.status}`);
            }
            else{
                const result = await response.json();
                setDeleteResult(`Order is approved`);
            }
        } catch (error) {
          setDeleteResult(`Error in approving order, error: ${error}`);
        }
      };

    },[])
    return (
      <>
            <div id="delete result">{deleteResult}</div>
            <div id="qrScanner"></div>
      </>
    )
  }export default QrScanner