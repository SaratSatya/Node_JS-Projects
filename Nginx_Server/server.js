const http=require('http');
const fs=require('fs');
const path=require('path');

const port=3000;

const server=http.createServer((req,res)=>{
    // console.log(req.url);
    const filepath=path.join(__dirname,req.url==='/'?'index.html':req.url);
    const extname=String(path.extname(filepath)).toLowerCase();
    // console.log(extname);
    // console.log(typeof extname);
    const mimeTypes={
        '.html':'text/html',
        '.css':'text/css',
        '.js':'text/javascript',
        '.png':'text/png',
    }
    const contentType=mimeTypes[extname] || 'application/octet-steam'; 
    fs.readFile(filepath,(err,content)=>{
        if(err){
            if(err.code==="ENOENT"){
                res.writeHead(404,{'Content-Type':'text/html'});
                res.end('404: File Not Found')
            }
        }else{
            // writeHead(statusCode[, statusMessage][, headers]) sets the status code, optionally a status message, and headers for the outgoing HTTP response.
            res.writeHead(200);
            res.end(content, 'utf-8');
        }
    })
});


server.listen(port,()=>{
    console.log(`Server is listening on the port ${port}`)
})
