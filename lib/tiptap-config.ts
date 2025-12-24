import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

// Extension to handle RTL/LTR text direction
export const TextDirection = Extension.create({
  name: "textDirection",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultDirection: "ltr",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.defaultDirection,
            parseHTML: (element) =>
              element.dir || this.options.defaultDirection,
            renderHTML: (attributes) => {
              if (!attributes.dir) {
                return {};
              }

              return { dir: attributes.dir };
            },
          },
        },
      },
    ];
  },

  //   addCommands() {
  //     return {
  //       setTextDirection:
  //         (direction) =>
  //         ({ commands }) => {
  //           return this.options.types.every((type) =>
  //             commands.updateAttributes(type, { dir: direction })
  //           );
  //         },
  //     };
  //   },
});

// Extension to detect text direction automatically
export const AutoDirection = Extension.create({
  name: "autoDirection",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("autoDirection"),
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                const text = node.textContent;
                if (text && text.trim()) {
                  // Simple RTL detection - checks if the first character is RTL
                  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
                  const isRTL = rtlRegex.test(text[0]);

                  if (isRTL) {
                    const decoration = Decoration.node(
                      pos,
                      pos + node.nodeSize,
                      {
                        style: "direction: rtl; text-align: right;",
                      }
                    );
                    decorations.push(decoration);
                  }
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
