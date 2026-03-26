const {app }= require("./app.js");

const PORT = 3000;



app.listen(PORT,()=>{
    console.log(`server started at  http://localhost:${PORT}`);
});