import { useState } from 'react'
import './App.css'
import OrderMenu from './components/OrderMenu'

function App() {
  

  return (
    <>
      <OrderMenu value="breakfast"/>
      <hr></hr>
      <OrderMenu value="lunch"/>
      <hr></hr>
      <OrderMenu value="dinner"/>
    </>
  )
}

export default App
