(function (jsPDFAPI) {
  var font =
    "data:font/truetype;base64,AAEAAAAPAIAAAwBgT1MvMg8SAVYAAAC8AAAAYGNtYXAFhAMAAABHAAAA..."; // Base64 string here

  var callAddFont = function () {
    this.addFileToVFS("NotoSansDevanagari-VariableFont_wdth,wght.ttf", font);
    this.addFont(
      "NotoSansDevanagari-VariableFont_wdth,wght.ttf",
      "NotoSansDevanagari.ttf",
      "normal"
    );
  };
  jsPDFAPI.events.push(["addFonts", callAddFont]);
})(jsPDF.API);
