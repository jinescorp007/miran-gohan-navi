
:root{
  --bg:#f4f7f6;--card:#fff;--text:#20302c;--muted:#68746f;
  --primary:#1f6f5f;--primary2:#175347;--border:#d8e3df;
  --danger:#a62b22;--warning:#8a6300;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans JP",sans-serif}
header{position:sticky;top:0;z-index:10;background:var(--primary);color:#fff;padding:13px 16px;display:flex;justify-content:space-between;align-items:center}
header h1{margin:0;font-size:1.25rem} header p{margin:2px 0 0;font-size:.78rem;opacity:.95}
button,input,textarea,select{font:inherit}
button{border:0;border-radius:10px;padding:11px 13px;font-weight:700;background:#e7efec;color:var(--text);cursor:pointer}
button.primary{width:100%;background:var(--primary);color:#fff}
button.danger{width:100%;background:var(--danger);color:#fff}
.icon-btn{background:transparent;color:inherit;font-size:1.2rem}
.tabs{position:sticky;top:59px;z-index:9;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-bottom:1px solid var(--border)}
.tab{border-radius:0;background:#fff;font-size:.85rem;padding:11px 4px;color:var(--muted)}
.tab.active{color:var(--primary);border-bottom:3px solid var(--primary)}
main{max-width:820px;margin:auto;padding:13px}
.panel{display:none}.panel.active{display:block}
.card,.notice{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:15px;margin-bottom:13px;box-shadow:0 2px 8px #0000000b}
.notice{background:#fff8d8;border-color:#ead57e;line-height:1.5;font-size:.88rem}
.hero{border:2px solid var(--primary)}
.danger-card{border:2px solid #d9938e}
h2{font-size:1.06rem;margin:0 0 10px}
label{font-size:.88rem;font-weight:650}
input,textarea,select{width:100%;border:1px solid var(--border);border-radius:9px;padding:10px;margin:5px 0 10px;background:#fff}
fieldset{border:1px solid var(--border);border-radius:10px;margin:8px 0 12px}
legend{font-size:.9rem;font-weight:700}
.selector-grid,.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px}
.check-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:5px 0}
.check-grid label{font-weight:500}.check-grid input{width:auto;margin-right:6px}
.small{font-size:.82rem;color:var(--muted);line-height:1.5}
.title-row{display:flex;justify-content:space-between;gap:10px;align-items:center}
.title-row h2{margin:0}
.recommend-card,.catalog-card,.incident-card,.menu-result,.watch-card{border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:9px}
.rank{font-size:1.15rem;font-weight:800;color:var(--primary)}
.tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
.tag,.badge{font-size:.75rem;padding:4px 8px;border-radius:999px;font-weight:700}
.tag{background:#eef3f1;color:#41504b}
.green{background:#d9f4df;color:#176629}.yellow{background:#fff0b5;color:#765300}.red{background:#ffd8d5;color:#981d15}
.catalog-head,.menu-head{display:flex;justify-content:space-between;gap:10px}
.score-line{font-size:.82rem;color:var(--muted);margin-top:5px}
.camera{display:block;background:var(--primary);color:#fff;text-align:center;border-radius:10px;padding:13px;font-weight:700}
.camera input{display:none}
#preview{width:100%;max-height:390px;object-fit:contain;background:#edf3f0;border-radius:10px;margin:10px 0}
dialog{width:min(94vw,680px);max-height:90vh;border:0;border-radius:16px;padding:0}
dialog::backdrop{background:#0007}.dialog-form{padding:17px}
.setting-row{display:grid;grid-template-columns:1fr 145px;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)}
.setting-row select{margin:0}
footer{max-width:820px;margin:auto;padding:10px 18px 30px;color:#8b271f;font-size:.84rem;font-weight:700;line-height:1.5}
@media(max-width:600px){
  .selector-grid,.form-grid,.check-grid{grid-template-columns:1fr}
  .tabs{top:58px}
  .setting-row{grid-template-columns:1fr 125px}
}
