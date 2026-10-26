document.addEventListener('DOMContentLoaded',()=>{
const hr=document.getElementById('hr'),ox=document.getElementById('ox');
if(hr&&ox)setInterval(()=>{hr.textContent=70+Math.floor(Math.random()*6);ox.textContent=96+Math.floor(Math.random()*3)},1800);
const f=document.getElementById('f');
if(f)f.addEventListener('submit',e=>{e.preventDefault();document.getElementById('ok').textContent='Request sent. We will reply to '+f.e.value+' shortly.';f.reset()});
});
