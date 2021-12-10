import ImageTool from "@editorjs/image";
import { API } from "./extras";
// import EditorJSStyle from 'editorjs-style'

const Header = require("@editorjs/header");
const List = require("@editorjs/list");
const Checklist = require("@editorjs/checklist");
const Quote = require("@editorjs/quote");
const Delimiter = require("@editorjs/delimiter");
const Embed = require("@editorjs/embed");
const Table = require("@editorjs/table");
const Link = require("@editorjs/link");
const Warning = require("@editorjs/warning");
const Marker = require("@editorjs/marker");
const InlineCode = require("@editorjs/inline-code");
const EditorJSStyle = require('editorjs-style')

export const tools = {
  /**
   * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
   */
  header: {
    class: Header,
    inlineToolbar: ["marker", "link"],
    config: {
      placeholder: "Header",
    },
    shortcut: "CMD+SHIFT+H",
  },

  /**
   * Or pass class directly without any configuration
   */
  // image: {
  //     class: ImageTool,
  //     config: {
  //         endpoints: {
  //         byFile: `${API}/uploadImg`, // Your backend file uploader endpoint
  //         byUrl: `${API}/fetchUrl`, // Your endpoint that provides uploading by Url
  //         }
  //     },
  //     inlineToolbar: true,
  // },

  image: {
    class: ImageTool,
    config: {
      /**
       * Custom uploader
       */
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        async uploadByFile(file) {
          console.log(file);
          const requestOptions = {
            method: "POST",
            headers: {},
            body: JSON.stringify(file),
          };
          const response = await fetch(`${API}/uploadImg`, requestOptions);
          let downloadURL = "";
          if (!response) {
            return {
              success: 0,
              file: {
                url: downloadURL,
              },
            };
          }
          const data = await response.json();
          if (data.err) {
            return {
              success: 0,
              file: {
                url: downloadURL,
              },
            };
          }
          downloadURL = data.file_path;
          return {
            success: 1,
            file: {
              url: downloadURL,
            },
          };
        },

        /**
         * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
         * @param {string} url - pasted image URL
         * @return {Promise.<{success, file: {url}}>}
         */
        async uploadByUrl(url) {
          return {
            success: 1,
            file: {
              url: url,
            },
          };
        },
      },
    },
  },

  list: {
    class: List,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+L",
  },

  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },

  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
    shortcut: "CMD+SHIFT+O",
  },

  warning: Warning,

  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  delimiter: Delimiter,

  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C",
  },

  embed: Embed,

  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: "CMD+ALT+T",
  },
  style: EditorJSStyle.StyleInlineTool,
  Link: Link,
};
