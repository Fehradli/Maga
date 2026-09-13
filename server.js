import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (fs.existsSync('index.html')) {
      const html = fs.readFileSync('index.html', 'utf8');
      res.end(html);
    } else {
      res.end("index.html tapılmadı!");
    }
  } else if (req.url === '/kod-oku') {
    let kod = "Kod tapılmadı.";
    if (fs.existsSync('server.js')) {
      kod = fs.readFileSync('server.js', 'utf8');
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ kod }));
  } else if (req.url === '/kod-kaydet' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync('server.js', data.kod);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ mesaj: "✅ Kod uğurla yadda saxlanıldı! Dəyişikliyin aktivləşməsi üçün serveri yenidən başlatmaq lazımdır." }));
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ mesaj: "❌ Xəta baş verdi." }));
      }
    });
  } else if (req.url === '/git-push' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const msg = data.mesaj || "Prodify AI update";
        const gitKomutlari = `git add . && (git diff --cached --quiet || git commit -m "Prodify AI avtomatik yenilənmə") && git push`;
        
        exec(gitKomutlari, (err, stdout, stderr) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ sonuc: "❌ Git Xətası:\n" + (stderr || err.message) }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ sonuc: "✅ Uğurla GitHub-a göndərildi!\n\n" + stdout }));
        });
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ sonuc: "Yanlış sorğu" }));
      }
    });
  } else if (req.url === '/son-rapor') {
    let rapor = "Hələ ki hesabat yoxdur.";
    if (fs.existsSync('ciktilar/rapor-01.md')) {
      rapor = fs.readFileSync('ciktilar/rapor-01.md', 'utf8');
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ rapor }));
  } else if (req.url === '/calis' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync('sen/01-isler.md', data.emir);
        
        exec('node ajan.js', (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ rapor: "Xəta baş verdi: " + err.message }));
            return;
          }
          const rapor = fs.readFileSync('ciktilar/rapor-01.md', 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ rapor }));
        });
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ rapor: "Yanlış sorğu" }));
      }
    });
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log("---------------------------------------------------");
  console.log("👑 Prodify AI Komanda Mərkəzi (GitHub İnteqrasiyası ilə) Hazırdır!");
  console.log("👉 http://localhost:3000 ünvanına daxil ol.");
  console.log("---------------------------------------------------");
});
