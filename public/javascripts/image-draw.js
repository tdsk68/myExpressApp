var canvas = new fabric.Canvas('cvs');
var canvas_inference = new fabric.Canvas('cvs_inference');
var org_img;
var labels = [];

// 画面ロードの操作
window.onload = function (){
  // 切り出し枠の情報をクリア
  switchDetailCrop("none");
}

// 画像ファイルの読み込み
document.getElementById('file').addEventListener("change", function (e){
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = function (f){
    var data = f.target.result;
    fabric.Image.fromURL(data, function (img){
      org_img = img;
      img.scaleX = canvas.width / img.width;
      img.scaleY = img.scaleX;
      canvas.scaleY = img.height * img.scaleY / canvas.height;
      var oImg = img.set({left: 0, top: 0, angle: 0, width: img.width, height: img.height}).scale(img.scaleY);

      canvas.setBackgroundImage(oImg, () => {
        canvas.setDimensions({width: canvas.width, height: canvas.height*canvas.scaleY})
        canvas.renderAll.bind(canvas);
      });
    });
  };
  reader.readAsDataURL(file);
});

// 推論用画像ファイルの読み込み
document.getElementById('file_inference').addEventListener("change", function (e){
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function (f){
    let data = f.target.result;
    fabric.Image.fromURL(data, function (img){
      img.scaleX = canvas_inference.width / img.width;
      img.scaleY = img.scaleX;
      canvas_inference.scaleY = img.height * img.scaleY / canvas_inference.height;
      let oImg = img.set({left: 0, top: 0, angle: 0, width: img.width, height: img.height}).scale(img.scaleY);

      canvas_inference.setBackgroundImage(oImg, () => {
        canvas_inference.setDimensions({width: canvas.width, height: canvas_inference.height*canvas_inference.scaleY})
        canvas_inference.renderAll.bind(canvas_inference);
      });
    });
  };
  reader.readAsDataURL(file);
});

// 枠追加
function btnClkNewRect(){
  let rect = new fabric.Rect({
    left: 80, top: 80, width: 120, height: 80,
    fill: 'rgba(0, 0, 0, 0)',
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 4
  });
  canvas.add(rect);
  labels.push("");
  // 切り出し枠の情報をクリア
  switchDetailCrop("none");
}

// 枠削除
function btnClkDeleteRect(){
  var rect = canvas.getActiveObject();
  if(rect){
    let i = canvas.getObjects().indexOf(rect);

    canvas.remove(canvas.getActiveObject());
    labels.splice(i,1);
  }
}

// 推論実行
function btnClkInference(){

}

// ラベル入力
function txtInput(){
  var rect = canvas.getActiveObject();

  if(rect){
    let i = canvas.getObjects().indexOf(rect);
    labels[i] = document.getElementById("class_name").value;
  }
}

// クリック処理
canvas.on('mouse:up', function(options){
  if(options.target){
    // 切り出し枠の情報を表示
    switchDetailCrop("block");

    // 枠画像を切り出して表示
    fabric.Image.fromURL(org_img.toDataURL(), function (img){
      var oImg = img.toDataURL({
        left: options.target.left,
        top: options.target.top,
        width: options.target.width*options.target.scaleX,
        height: options.target.height*options.target.scaleY
      });
      document.getElementById("img_crop").src = oImg;
    });

    // ラベル名を表示
    let i = canvas.getObjects().indexOf(options.target);
    document.getElementById("class_name").value = labels[i]
  }

  // 枠情報一覧を表示
  let objs = canvas.getObjects();
  document.getElementById("info").value = "";
  for(i = 0; i<objs.length; i++){
    let rect = canvas.item(i);
    document.getElementById("info").value = 
      document.getElementById("info").value
      + Math.round(rect.top) + " " + Math.round(rect.left) + " " 
      + Math.round(rect.width*rect.scaleX) + " " + Math.round(rect.height*rect.scaleY) + "\n";
  }

});

// 選択解除
canvas.on('selection:cleared', function(options){
  switchDetailCrop("none");
});

// 内部関数 ----------
function switchDetailCrop(flag){
  document.getElementById("detail_crop").style.display = flag;
}

document.addEventListener('DOMContentLoaded', function(){
  // タブに対してクリックイベントを適用
  const tabs = document.getElementsByClassName('tab');
  for(let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', tabSwitch, false);
  }

  // タブをクリックすると実行する関数
  function tabSwitch(){
    // タブのclassの値を変更
    document.getElementsByClassName('is-active')[0].classList.remove('is-active');
    this.classList.add('is-active');
    // コンテンツのclassの値を変更
    document.getElementsByClassName('is-show')[0].classList.remove('is-show');
    const arrayTabs = Array.prototype.slice.call(tabs);
    const index = arrayTabs.indexOf(this);
    document.getElementsByClassName('panel')[index].classList.add('is-show');
  };
}, false);