const fs=require('fs'); 
const t = fs.readFileSync('C:/Users/cybra/.gemini/antigravity/brain/e54868e0-ebfd-4675-8105-0c62bec704e4/.system_generated/logs/transcript_full.jsonl',"utf8"); 
const m = t.match(/"CodeContent":"(.*class CanvasRenderer.*?)"/); 
if(m){ 
    fs.writeFileSync('d:/football coach/js/canvas.js', JSON.parse('"' + m[1] + '"')); 
    console.log('Found and wrote!'); 
}