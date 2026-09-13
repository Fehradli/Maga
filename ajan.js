import fs from 'fs';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error("HATA: GROQ_API_KEY tanımlı değil!");
  process.exit(1);
}

async function calis() {
  let emir = "";
  if (fs.existsSync('sen/01-isler.md')) {
    emir = fs.readFileSync('sen/01-isler.md', 'utf8');
  }

  let serverKod = "";
  if (fs.existsSync('server.js')) {
    serverKod = fs.readFileSync('server.js', 'utf8');
  }

  console.log("Maga AI patronun emrini işliyor ve kendini güncelliyor...");

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { 
            role: 'system', 
            content: `Sen Maga projesinin otonom yapay zeka yöneticisisin. Patronun verdiği emir doğrultusunda kendi patron panelini (server.js) güncellemeli veya yeni özellikler eklemelisin. 
            Eğer patron tasarımın değiştirilmesini veya yeni özellik eklenmesini isterse, yanıtının EN ALTINDA tam olarak şu formatta güncellenmiş komple server.js kodunu vermelisin:
            ---KOD_BASLANGICI---
            [buraya güncel server.js kodunun tamamını yaz]
            ---KOD_BITISI---
            Eğer kod değişikliği gerekmiyorsa sadece rapor ver.` 
          },
          { role: 'user', content: `Patronun Emri:\n${emir}\n\nMevcut Sunucu Kodu (server.js):\n${serverKod}` }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const yanit = data.choices[0].message.content;
      
      // Eğer ajan kod güncellemesi verdiyse, server.js dosyasını otomatik üzerine yazalım!
      if (yanit.includes('---KOD_BASLANGICI---') && yanit.includes('---KOD_BITISI---')) {
        const parcalar = yanit.split('---KOD_BASLANGICI---');
        const kodBolumu = parcalar[1].split('---KOD_BITISI---')[0].trim();
        fs.writeFileSync('server.js', kodBolumu);
        fs.writeFileSync('ciktilar/rapor-01.md', "✅ Ajan başarıyla kendini güncelledi! Lütfen sunucuyu yeniden başlat veya sayfayı yenile.\n\n" + parcalar[0]);
        console.log("Sistem başarıyla kendini güncelledi!");
      } else {
        fs.writeFileSync('ciktilar/rapor-01.md', yanit);
        console.log("Rapor oluşturuldu.");
      }
    } else {
      console.error("API Yanıt Hatası:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Bağlantı Hatası:", err.message);
  }
}

calis();
