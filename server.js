//0xBdA7c80807466A5160F93B1B750B03037de179df
const express =require("express")
 const ABI=require("./ABI.json")
 const cors=require("cors")
const {Web3}= require('web3')
 
const app=express()
const web3=new Web3('https://virulent-fabled-county.ethereum-goerli.quiknode.pro/68ed9f0ca4452fbddda0ead0c15796c24c5be12b');
const contractAddress="";
const contract=new web3.eth.Contract(ABI,contractAddress)
//console.log(contract);

/* const viewTask = async()=>{
    const task=await contract.methods.viewTask(1).call();
    console.log(task);
} 

viewTask(); */
app.use(express.json())
app.use(cors())

app.get("/api/ethereum/view-task/:uid",async(req,res)=>{
    try{
        const {uid}=req.params
        let task=await contract.methods.viewTask(uid).call();
        const conv=Number(task["id"])
        task["id"]=conv
        res.status(200).json({status:200,data:{id:task.id,name:task.name,date:task.date}})
        //console.log(task);
    }catch(err){
        console.error(err);
    }
})

app.get("/api/ethereum/view-all-task",async(req,res)=>{
    try{
        const tasks = await contract.methods.allTask().call();
        if(tasks.length<0){
            res.status(404).json({status:404,message:"Task list does not exist"})
        }else{
            const taskList = tasks.map(({id,name,date})=>{
               const taskId=Number(id);
               return {taskId,name,date}
            })
            res.status(200).json({status:200,taskList,message:"Task Exist"})
        }
    }catch(error){
        console.error(error)
    } 
})

app.post("/api/ethereum/create-task",async(req,res)=>{
    const{taskName}=req.body
    console.log(taskName);
    const tasks= await contract.methods.allTask().call()
    const foundName=tasks.find(task=>task.name===taskName)
    try{
        if(!foundName){
            res.status(200).json({status:200,message:"data can be added"})
        }else{
            res.status(409).json({status:409,message:"data can't be added"})
        }
    }
    catch(e){
        console.error(e)
    }
})


 const port=5000;
 app.listen(port,()=>{
    console.log("server is listening to port:",port);
 })
