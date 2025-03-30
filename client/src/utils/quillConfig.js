export const TOOLBAR_OPTIONS = [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ["blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    ["link", "image", "video", "formula"],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];
  
  export const TOOLBAR_TITLES = {
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strike: "Strikethrough",
    blockquote: "Blockquote",
    "code-block": "Code Block",
    link: "Insert Link",
    image: "Insert Image",
    video: "Insert Video",
    formula: "Insert Formula",
    header: "Header",
    list: "List",
    script: "Subscript/Superscript",
    indent: "Indent",
    direction: "Text Direction",
    size: "Font Size",
    color: "Text Color",
    background: "Background Color",
    font: "Font Family",
    align: "Text Alignment",
    clean: "Clear Formatting",
  };
  
  export function addTooltipsToToolbar() {
    const toolbar = document.querySelector(".ql-toolbar");
    if (toolbar) {
      toolbar.querySelectorAll("button, select").forEach((button) => {
        const format = button.className.split("-")[1];
        if (TOOLBAR_TITLES[format]) {
          button.setAttribute("title", TOOLBAR_TITLES[format]);
        }
      });
    }
  }
  