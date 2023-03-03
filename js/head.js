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
  const imageCount = images.length - 1;
  const styleCount = styles.length - 1;
  const allStyleClasses = styles.map(style => style[0]).join(" ");
  const presets = JSON.parse(localStorage.getItem("presets")) || [];
  var currentImage = 0;
  var currentStyle = 0;

  var backgroundColor = "--background-color: 0 0% 0%;";
  var headColor = "--head-color: 0 0% 0%;";
  var textColor = "--text-color: 0 0% 100%;"
  var backgroundPosition = "--background-position: 50%";
  var backgroundOverlayColor = "--background-overlay-color: 0 0% 0%;";
  var backgroundMixBlendMode = "--background-mix-blend-mode: normal;";
  var displayOverlay = "--display-overlay: none;";

  $(".content-background-color").on("input", getBackgroundColor);
  $("input[name=text-color]").on("input", getTextColor);
  $(".head-color").on("input", getHeadColor);
  $(".overlay-color").on("input", getOverlayColor);
  $("input[type=range]").on("input", getPosition);
  $(".mix-blend-mode").on("change", getMixBlendMode);
  $(".save-preset").on("click", savePreset);
  $(".load-preset").on("click", loadPreset);
  $("select.presets-selector").on("change", canLoadPreset);

  function setStyle() {
    $("style.head-style").html(`
      .head {
        ${backgroundColor}
        ${headColor}
        ${textColor}
        ${backgroundPosition}
        ${backgroundOverlayColor}
        ${backgroundMixBlendMode}
        ${displayOverlay}
      }
    `);
  }

  function setCurrentImage(index) {
    $('.head-background').css('background-image', `url(${images[index][0]})`);
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

    backgroundColor = `--background-color: ${color.h} ${color.s}% ${color.l}%;`;

    if (color.l < 45) {
      textColor = "--text-color: 0 0% 100%;";

      if (headColor == "--head-color: 0 0% 0%;") {
        headColor = `--head-color: 0 0% 100%;`
      }

    } else {
      textColor = "--text-color: 0 0% 0%;";

      if (headColor == "--head-color: 0 0% 100%;") {
        headColor = `--head-color: 0 0% 0%;`
      }
    }


    setStyle();
  }

  function getTextColor() {
    let color = $("input[name=text-color]:checked").val();

    textColor = `--text-color: ${color};`;
    setStyle();
  }

  function getHeadColor() {
    let color = HexToHSL($(".head-color").val());

    headColor = `--head-color: ${color.h} ${color.s}% ${color.l}%;`;
    setStyle();
  }

  function getOverlayColor() {
    let color = HexToHSL($(".overlay-color").val());

    backgroundOverlayColor = `--background-overlay-color: ${color.h} ${color.s}% ${color.l}%;`;
    setStyle();
  }

  function getMixBlendMode() {
    let mode = $(".mix-blend-mode").val();
    displayOverlay = `--display-overlay: ${mode == "none" ? "none" : "block"};`;

    backgroundMixBlendMode = `--background-mix-blend-mode: ${mode};`;
    setStyle();
  }

  function getPosition() {
    let input = $("input[type=range]")[0];
    let value = input.value;

    backgroundPosition = `--background-position: ${value}%;`;
    setStyle();
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
      overlayColor: $(".overlay-color").val(),
      mixBlendMode: $(".mix-blend-mode").val(),
      position: $("input[type=range]").val()
    };

    presets.push(preset);

    updatePresetsList();

    localStorage.setItem("presets", JSON.stringify(presets));
  }

  function loadPreset() {
    console.log("load");
    let index = $("select.presets-selector").val();
    let preset = presets[index];

    setCurrentImage(preset.image);
    setCurrentStyle(preset.style);

    $(".content-background-color").val(preset.backgroundColor);
    $("input[name=text-color][value='" + preset.textColor + "']").prop("checked", true);
    $(".head-color").val(preset.headColor);
    $(".overlay-color").val(preset.overlayColor);
    $(".mix-blend-mode").val(preset.mixBlendMode);
    $("input[type=range]")[0].value = preset.position;

    getBackgroundColor();
    getTextColor();
    getHeadColor();
    getOverlayColor();
    getMixBlendMode();
    getPosition();
  }

  function updatePresetsList() {
    $("select.presets-selector").html("<option>None</option><option disabled>──────────</option>");

    presets.forEach((preset, index) => {
      $("select.presets-selector").append(`<option value="${index}">${preset.name}</option>`);
    });
  }

  function canLoadPreset() {
    $(".load-preset").prop("disabled", $("select.presets-selector").val() == "None");
  }

  function init() {
    updatePresetsList();

    getBackgroundColor();
    getTextColor();
    getHeadColor();
    getOverlayColor();
    getMixBlendMode();
    getPosition();
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
