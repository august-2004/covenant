import {QRCodeSVG} from 'qrcode.react'

function QrMaker({value}){
    return(
        <QRCodeSVG value={value}/>
    )
}

export default QrMaker