$(function() {
  const images = [
    ["img/1.jpg", "Peukie"],
    ["img/2.jpg", "Bij"],
    ["img/3.jpg", "Sjimmie"],
    ["img/4.jpg", "Vuurtoren"],
    ["img/5.jpg", "Tankstation"],
    ["img/6.jpg", "Mexicaan"],
    ["img/7.jpg", "Tennis"],
    ["img/8.jpg", "Olieblobs"]
  ];
  const styles = [
    ["left-slanted", "Links scheef"],
    ["right-slanted", "Rechts scheef"],
    ["left-floating", "links los"],
    ["right-floating", "Rechts los"]
  ];
  const overlayEffects = [
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "hue",
    "color"
  ];

  const imageCount = images.length - 1;
  const styleCount = styles.length - 1;
  const allStyleClasses = styles.map(style => style[0]).join(" ");
  const presets = JSON.parse(localStorage.getItem("presets")) || [];
  var currentImage = 0;
  var currentStyle = 0;

  var backgroundColor = [0, 0, 0];
  var headColor = [0, 0, 0];
  var headColorAuto = true;
  var textColor = [0, 0, 100];
  var backgroundOverlayColor = [0, 0, 0];
  var mixBlendMode = "normal";
  var poi = [50, 50];

  $(".content-background-color").on("input", getBackgroundColor);
  $("select[name=text-color]").on("input", getTextColor);
  $(".head-color").on("input", getHeadColor);
  $(".head-color-auto").on("input", getHeadColorAuto);
  $(".overlay-color").on("input", getOverlayColor);
  $(".set-poi").on("click", getPoi);
  $(".set-overlay-effect").on("click", getOverlayEffect);
  $(".save-preset").on("click", savePreset);
  $(".load-preset").on("click", loadPreset);
  $(".delete-preset").on("click", deletePreset);
  $("select.presets-selector").on("change", enablePresetButtons);

  function setStyle() {
    $("style.head-style").html(`
      .head, dialog {
        --background-color: ${backgroundColor[0]} ${backgroundColor[1]}% ${backgroundColor[2]}%;
        --head-color: ${headColor[0]} ${headColor[1]}% ${headColor[2]}%;
        --text-color: ${textColor[0]} ${textColor[1]}% ${textColor[2]}%;
        --background-overlay-color: ${backgroundOverlayColor[0]} ${backgroundOverlayColor[1]}% ${backgroundOverlayColor[2]}%;
        --background-mix-blend-mode: ${mixBlendMode};
        --display-overlay: ${mixBlendMode === "normal" || mixBlendMode === "none" ? "none" : "block"};
        --poi: ${poi[0]}% ${poi[1]}%;
      }
    `);
  }

  function setCurrentImage(index) {
    $(".head-background").css("background-image", `url(${images[index][0]})`);
    $(".current-img .current").text(images[index][1]);
  }

  function setCurrentStyle(index) {
    $(".head").removeClass(allStyleClasses).addClass(styles[index][0]);
    $(".current-style .current").text(styles[currentStyle][1]);
  }

  setCurrentImage(currentImage);
  setCurrentStyle(currentStyle);

  $(".browse-img").click(function() {
    currentImage += $(this).data("direction");
    if (currentImage < 0) currentImage = imageCount;
    if (currentImage > imageCount) currentImage = 0;

    setCurrentImage(currentImage);
  });

  $(".browse-style").click(function() {
    currentStyle += $(this).data("direction");
    if (currentStyle < 0) currentStyle = styleCount;
    if (currentStyle > styleCount) currentStyle = 0;

    setCurrentStyle(currentStyle)
  });

  function getBackgroundColor() {
    let color = HexToHSL($(".content-background-color").val());
    let threshold = 55;

    if ($("select[name=text-color]").val() == "auto") {
      textColor = color.l < threshold ? [0, 0, 100] : [0, 0, 0];
    }
    if (headColorAuto) {
      headColor = textColor;
    }

    backgroundColor = [color.h, color.s, color.l];

    setStyle();
  }

  function getTextColor() {
    let color = $("select[name=text-color]").val();

    if (color != "auto") {
      textColor = color === "white" ? [0, 0, 100] : [0, 0, 0];
    }

    getBackgroundColor();
  }

  function getHeadColor() {
    let color = HexToHSL($(".head-color").val());

    if (headColorAuto) return;

    headColor = [color.h, color.s, color.l];
    setStyle();
  }

  function getHeadColorAuto() {
    headColorAuto = $(".head-color-auto").is(":checked");
    $(".head-color").prop("disabled", headColorAuto);
    getBackgroundColor();
  }

  function getOverlayEffect() {
    const $dialog = $("dialog#set-overlay-effect");
    const $demos = $dialog.find(".image-demos").html("");

    for (let i = 0; i < overlayEffects.length; ++i) {
      const effect = overlayEffects[i];
      $demos.append(`
        <div class="image-demo"
             style="background-image: url(${images[currentImage][0]})"
             data-effect="${effect}">
          <div class="overlay" style="--mix-blend-mode: ${effect}"></div>
        </div>
      `);
    }
    $demos.append(`
      <div class="image-demo" data-effect="none">
        None
      </div>`);

    $dialog.show();

    $dialog.find(".image-demo").on("click", function() {
      $(this).addClass("selected").siblings().removeClass("selected");
      mixBlendMode = $(this).data("effect");
      displayOverlay = mixBlendMode == "none" ? "none" : "block";
      setStyle();
    });

    $dialog.find("button").on("click", function() {
      $dialog.hide();
    });
  }

  function getOverlayColor() {
    let color = HexToHSL($(".overlay-color").val());

    backgroundOverlayColor = [color.h, color.s, color.l];
    setStyle();
  }

  function getPoi() {
    const $dialog = $("dialog#set-poi");
    const $poiDot = $(".poi");
    $dialog.find("img").attr("src", images[currentImage][0]);
    $dialog.show();

    $dialog.find(".image-container").on("mousedown", function(e) {
      let x = e.offsetX;
      let y = e.offsetY;
      let width = $(this).width();
      let height = $(this).height();

      let positionX = (x / width) * 100;
      let positionY = (y / height) * 100;

      $poiDot.css("left", `${positionX}%`);
      $poiDot.css("top", `${positionY}%`);

      poi = [positionX, positionY];
      setStyle();
    });

    $dialog.find("button").on("click", function() {
      $dialog.hide();
    });
  }

  function savePreset() {
    let name = prompt("Naam van preset");
    if (name == null) return;

    let preset = {
      name: name,
      image: currentImage,
      style: currentStyle,
      backgroundColor: $(".content-background-color").val(),
      textColor: $("input[name=text-color]:checked").val(),
      headColor: $(".head-color").val(),
      headColorAuto: $(".head-color-auto").is(":checked"),
      overlayColor: $(".overlay-color").val(),
      mixBlendMode: mixBlendMode,
      poi: poi
    };

    presets.push(preset);

    updatePresetsList();

    localStorage.setItem("presets", JSON.stringify(presets));
  }

  function loadPreset() {
    let index = $("select.presets-selector").val();
    let preset = presets[index];

    setCurrentImage(currentImage = preset.image);
    setCurrentStyle(currentStyle = preset.style);

    $(".content-background-color").val(preset.backgroundColor);
    $(".head-color").val(preset.headColor);
    $(".head-color-auto").prop("checked", preset.headColorAuto || false);
    $(".overlay-color").val(preset.overlayColor);
    $("input[name=text-color][value=" + preset.textColor + "]").prop("checked", true);

    poi = preset.poi;
    mixBlendMode = preset.mixBlendMode;

    getData();
  }

  function deletePreset() {
    let index = $("select.presets-selector").val();

    presets.splice(index, 1);

    updatePresetsList();

    localStorage.setItem("presets", JSON.stringify(presets));
  }

  function updatePresetsList() {
    $("select.presets-selector").html("<option>None</option><option disabled>──────────</option>");

    presets.forEach((preset, index) => {
      $("select.presets-selector").append(`<option value="${index}">${preset.name}</option>`);
    });
  }

  function enablePresetButtons() {
    $(".load-preset, .delete-preset").prop("disabled", $("select.presets-selector").val() == "None");
  }

  function init() {
    updatePresetsList();
    getData();
  }

  function getData() {
    getBackgroundColor();
    getHeadColorAuto();
    getHeadColor();
    getOverlayColor();
    getTextColor();
  }

  init();
});

function HexToHSL(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  s = s*100;
  s = Math.round(s);
  l = l*100;
  l = Math.round(l);
  h = Math.round(360*h);

  return {h, s, l};
}
