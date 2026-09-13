"use strict"
import { signatureUrl } from "./signature.js";

function Toast({
  text,
  duration,
  type,
} = {
  text: string,
  duration: number,
  type: 'success' | 'error' | 'warn',
}){
  const node = document.getElementById('jd-toast');
  if (node) document.body.removeChild(node);
  const m = document.createElement('div');
  const toastId = Date.now() + '';
  m.setAttribute('toastId', toastId);
  m.className = 'Toast';
  m.id = 'jd-toast';
  m.innerHTML = `<div><p>${text}</p><div>`;
  document.body.appendChild(m);
  setTimeout(function() {
    const d = 0.5;
    m.style.webkitTransition =  '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
    m.style.opacity = '0';
    setTimeout(function() {
      const node1 = document.getElementById('jd-toast');
      if (node1?.getAttribute('toastId') == toastId)
        document.body.removeChild(node1);
    }, d * 1000);
  }, duration || 2000);
}

function CopyText(text){
  const clip = navigator.clipboard;
  if(!text){
    return
  };
  function copyToast(con, lv){
    if(!con) return;
    if(!lv) lv = 1;
    if(lv == 2){
      alert(con);
    } else if(lv == 1) {
      if(window.via){
        window.via.toast(con);
      } else {
        Toast({text: con});
      }
    }
  }
  function copy2(text){
    let cb = document.createElement("button");
    cb.id = "cb";
    cb.style.width = "1px";
    cb.style.height = "1px";
    document.body.appendChild(cb);
    let clipboardjs = new ClipboardJS("#cb", {
      text: function(){
        return text
      }
    });
    clipboardjs.on("success", () => {
      copyToast("已复制文本到剪贴板");
      cb.remove();
    });
    clipboardjs.on("error", () => {
      copyToast("已复制文本到剪贴板");
      cb.remove();
    });
    document.getElementById("cb").click();
  }
  clip.writeText(text)
    .then(() => {
      copyToast("已复制文本到剪贴板");
    })
    .catch(err => {
      if(err.name == "NotAllowedError"){
        copy2(text);
      } else {
        copyToast("复制失败：" + err);
      }
    });
}

function legado(url, beh, path){
  if(url.startsWith("/")){
    let port;
    ((location.protocol == "http:" && location.port == "80") || (location.protocol == "https:" && location.port == "443") || location.port == "") ? port = "" : port = `:${location.port}`;
    url = `${location.protocol}//${location.hostname}${port}${url}`;
  }
  beh = beh ? beh : "open";
  if(beh == "copy"){
    CopyText(url);
  } else if(beh == "open"){
    path = path ? path : "bookSource";
    open(`legado://import/${path}?src=${url}`)
  }
}
