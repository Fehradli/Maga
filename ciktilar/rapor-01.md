**Patron Paneli Özəllikləri**

| Bölmə | Nə edə bilərsən? | Qısa izah |
|-------|------------------|-----------|
| **🏠 Patron Paneli** | • Yeni əmr göndər <br>• Agentlərin cavablarını oxu | Əsas əmrlər paneli. Buradan `Ajanlara Yeni Əmr Göndər` bölməsində yazdığın əmr `ajan.js`-ə göndərilir və nəticə “Ajanların Hesabatı / Cavablar” kartında görünür. |
| **🤖 İşçi Ajanlar** | • Aktiv agentlərin statusunu gör <br>• Agentlərin vəziyyətini yenilə | Agentlərin hazırda aktiv olub olmadığını, hansı modeli işlədiyini və quraşdırılmış fayl idarəçisini görə bilirsən. |
| **📊 Sistem Raporları** | • Son icra hesabatını oxu | `/son-rapor` API-sindən gələn markdown raporu göstərilir. |
| **⚙️ Ayarlar** | • Mühit konfiqurasiyasını gör <br>• API, port, patron məlumatları | Serverin mövcud konfiqurasiyasını incələyə və lazım gələrsə dəyişdirə bilərsən. |

**Əmrlərin icra axını**

1. **Əmr göndər** → `/calis` POST endpointinə JSON `{emir: "..."}` göndərilir.  
2. Server `sen/01-isler.md` faylına əmr yazır.  
3. `ajan.js` skripti işə düşür (`exec('node ajan.js')`).  
4. Agentlər bu əmr əsasında fayl əməliyyatları və ya model çağırışları həyata keçirir.  
5. Nəticə `ciktilar/rapor-01.md` faylına yazılır və browserə JSON `{rapor}` kimi göndərilir.

**Nə əlavə etmək olar?**

- **İşçi Ajanlar panelində real‑vaxt status** (WebSocket, SSE).  
- **Əmrlər üçün təsdiq və tarixçə** (audit trail).  
- **İstifadəçi idarəetməsi** (multi‑user, rollər).  
- **Yükləmə və fayl idarəetməsi** (GitHub, S3, local).  
- **Yüksək səviyyəli təhlükəsizlik** (JWT, rate‑limit).  

Əgər hər hansı yeni xüsusiyyətə ehtiyac varsa, onu soruş, mən kodu yeniləyərəm.