import express from 'express'
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';

//Recreate 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Path to the vite frontend
const DIST_DIR = path.resolve(__dirname, "../client/dist")
const index_html = path.join(DIST_DIR, "index.html")


const app = express()
const port = process.env.PORT || 3200;

//Path to front-end
// const DIST_DIR = path.resolve()


//Let express read form bodies like www-form-urlencoded
app.use(express.urlencoded({extended:true}));

//Let express read JSON request bodies
app.use(express.json());

// Simple health check so we can confirm the backend is alive
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Unknown API
app.use("/api", (req, res) => {
    res.status(404).json({message: "API route not found"})
})



//built files exist:
if (fs.existsSync(index_html)){
    app.use(express.static(DIST_DIR))

    app.get("/{*path}", (req,res) => {
        res.sendFile(index_html)
    })

} else{
    console.log("client/dist not found, starting backend in API-only mode")

}






app.listen(port, () => {
    console.log(`API server running at ${port}`)
})
