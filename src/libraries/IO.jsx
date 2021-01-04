export function downloadFileBlob(fileName, data, mime="octet/stream") {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var blob = new Blob([data], {type: mime}), url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

export async function uploadFileInBackground() {
    return new Promise((resolve, reject)=>{
    var f=document.createElement('input');
    f.style.display='none';
    f.type='file';
    f.name='file';
    document.body.appendChild(f);
    f.click();
    f.onchange = function(evt) { var reader = new FileReader(), fh = evt.target.files[0]; reader.onload = function(ev) { console.log(fh); resolve(reader.result, fh.type); f.remove(); }; reader.readAsText(evt.target.files[0]); }
    });
}