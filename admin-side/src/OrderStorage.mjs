import xlsx from "xlsx";
import fs from "fs";
import lockfile from "proper-lockfile";
import schedule from "node-schedule";

const writeQueue =[];
let isWriting = false;
const mainFilePath = process.env.mainFilePath;
const tempFilePath = process.env.tempFilePath;

function formatFileName(){
  const currentDate=new Date();
  let month=currentDate.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month];
}

function appendDataToQueue(newData){
  writeQueue.push(newData);
  processQueue();
}

async function processQueue() {
  if(isWriting || writeQueue.length===0) return;

  isWriting=true;
  const newData= writeQueue.shift();

  try{
    await appendData(newData);
  }catch(err){
    console.log(err);
    writeQueue.unshift(newData);
    console.log("Data re-enqueued for retry");
  }finally{
    isWriting=false;
    processQueue();
  }
}

async function writeToTempFile(newData) {
  try{
    let workbook;

      if(fs.existsSync(tempFilePath)){
        workbook=xlsx.readFile(tempFilePath);
      }else{
        workbook=xlsx.utils.book_new();
      }

      const sheetName=formatFileName();
      let worksheet=workbook.Sheets[sheetName];
      
      if(!worksheet){
        worksheet=xlsx.utils.json_to_sheet([],{ header: ["id", "userID", "itemName", "mealTime", "quantity", "createdAt", "date"] });
        xlsx.utils.book_append_sheet(workbook,worksheet,sheetName);
      }
      
      
      const existingData=xlsx.utils.sheet_to_json(worksheet);
      const newOrderData = newData.map(order => ({
        id:order._id.toString(),
        userID: order.userID,
        itemName: order.itemName,
        mealTime: order.mealTime,
        quantity: order.quantity,
        createdAt: order.createdAt,
        date: order.date
      }));
      existingData.push(...newOrderData);

      const updatedWorksheet= xlsx.utils.json_to_sheet(existingData);

      workbook.Sheets[sheetName]=updatedWorksheet;

      fs.writeFileSync(tempFilePath, xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' }));

      console.log("Data written to temporary file successfully");
  }catch(err){
    console.log(`Error : ${err}`);
  }
}

async function appendData(newData){
    try{
      await writeToTempFile(newData);
    }catch(err){
    console.log(`Error writing onto temporary file ${err}`);
    }
  }

async function mergeFiles() {
  let release;
  try{

    release=await lockfile.lock(mainFilePath, {retries:5});

    let mainWorkbook, tempWorkbook;

    if(fs.existsSync(mainFilePath)){
      mainWorkbook = xlsx.readFile(mainFilePath);
    } else {
      mainWorkbook = xlsx.utils.book_new();
    }

    if(!fs.existsSync(tempFilePath)){
      console.log("Temporary file not found");
      return;
    }

    tempWorkbook = xlsx.readFile(tempFilePath);
    const sheetName= formatFileName();
    const tempSheet= tempWorkbook.Sheets[sheetName];
    const tempData = xlsx.utils.sheet_to_json(tempSheet);
    const mainWorkSheet = mainWorkbook.Sheets[sheetName];

    if(!mainWorkbook){
      mainWorkbook=xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(mainWorkbook,mainWorkSheet,sheetName);
    }

    const mainData = xlsx.utils.sheet_to_json(mainWorkSheet);
    mainData.push(...tempData);

    const updatedMainWorksheet = xlsx.utils.json_to_sheet(mainData);
    mainWorkbook.Sheets[sheetName] = updatedMainWorksheet;

    fs.writeFileSync(mainFilePath, xlsx.write(mainWorkbook, { booktype: "xlsx", type: "buffer"}));
    console.log("Main file updated Successfully");

    fs.unlinkSync(tempFilePath);
    console.log("Temporary file cleared");
  }catch(err){
    console.log(`Error :${err}`);
  }finally{
    if(release) await release();
  }
}

schedule.scheduleJob('0 0 * * *', mergeFiles);
export default appendDataToQueue;