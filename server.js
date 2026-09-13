import http from "http";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
        fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Server xətası");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(data);
        });
    } else if (req.url === "/git-push" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const msg = data.message || "Prodify AI avtomatik yenilənmə";
                const cmd = `git add . && (git diff --cached --quiet || git commit -m "${msg}") && git push`;
                
                exec(cmd, (error, stdout, stderr) => {
                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    if (error) {
                        res.end(JSON.stringify({ success: false, error: stderr || error.message }));
                    } else {
                        res.end(JSON.stringify({ success: true, output: stdout }));
                    }
                });
            } catch(e) {
                res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                res.end(JSON.stringify({ success: false, error: "Yanlış məlumat formatı" }));
            }
        });
    } else {
        res.writeHead(404);
        res.end("Səhifə tapılmadı");
    }
});

server.listen(PORT, () => {
    console.log(`Prodify AI Server işləyir: http://localhost:${PORT}`);
});
