async function calculateHmacSha1(key, message, headerEncoding = "utf8") {
  const keyBuffer = new TextEncoder().encode(key);
  const importedKey = await crypto.subtle.importKey("raw", keyBuffer, {name: "HMAC", hash: "SHA-1"}, false, ["sign"]);
  const messageBuffer = new TextEncoder().encode(message, "utf8");
  const signature = await crypto.subtle.sign("HMAC", importedKey, messageBuffer);
  const signatureArray = Array.from(new Uint8Array(signature));
  return btoa(signatureArray.map((byte) => String.fromCharCode(byte)).join(''));
}

function computeSignature(accessKeySecret, canonicalString, headerEncoding = 'utf-8') {
  if(typeof global != "undefined"){
    const crypto = require("crypto");
    const signature = crypto.createHmac('sha1', accessKeySecret);
    return signature.update(Buffer.from(canonicalString, headerEncoding)).digest('base64');
  } else if(typeof window != "undefined"){
    return calculateHmacSha1(accessKeySecret, canonicalString, headerEncoding);
  } else return new Error("Environment does not support.");
};

export function signatureUrl({method = "GET", bucket, region = "oss-cn-hangzhou", accessKeyId, accessKeySecret, object, expires = 60} = {}){
  const timestamp = Math.floor(Date.now() / 1000);
  expires = timestamp + expires;
  const canonicalString = `${method}\n\n\n${expires}\n/${bucket}/${object}`;
  const signature = computeSignature(accessKeySecret, canonicalString);
  if(typeof signature != "string"){
    return new Promise(resolve => {
      signature.then(key => {
        resolve(`https://${bucket}.${region}.aliyuncs.com/${encodeURIComponent(object)}?OSSAccessKeyId=${accessKeyId}&Expires=${expires}&Signature=${encodeURIComponent(key)}`);
      });
    });
  }
  const resource = `https://${bucket}.${region}.aliyuncs.com/${encodeURIComponent(object)}?OSSAccessKeyId=${accessKeyId}&Expires=${expires}&Signature=${encodeURIComponent(signature)}`
  return resource
}
