import { Editor } from "slate-react";
import Html from "slate-html-serializer";
import React from "react";
import ReactDOM from "react-dom";
import { css } from "emotion";
import { Button, IconBlock, Menu } from "./components";
import Icon from "react-icons-kit";
import { bold } from "react-icons-kit/fa/bold";
import { italic } from "react-icons-kit/fa/italic";
import { pencil } from "react-icons-kit/fa/pencil";

const AppStyles = {
  color: "rgb(17, 17, 17)",
  padding: "5px 20px",
  maxWidth: "840px",
  width: "100%",
  fontSize: "1.6rem"
};

const DEFAULT_NODE = "paragraph";

const BLOCK_TAGS = {
  p: "paragraph",
  img: "image",
  iframe: "video",
  ol: "numbered-list",
  li: "list-item",
  input: "input"
};

const INLINE_TAGS = {
  a: "link",
  span: "comment",
  span: "translation"
};

const MARK_TAGS = {
  i: "italic",
  strong: "bold",
  header: "header",
  input: "input"
};

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: "block",
          type: type,
          data: {
            className: el.src
          },
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object == "block") {
        switch (obj.type) {
          case "paragraph":
            return <p className={obj.data.get("className")}>{children}</p>;
        }
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: "mark",
          type: type,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object == "mark") {
        console.log(obj.type);
        switch (obj.type) {
          case "bold":
            return <strong>{children}</strong>;
          case "italic":
            return <i>{children}</i>;
          case "pencil":
            return <input id="text" />;
        }
      }
    }
  }
  // {
  //   deserialize(el, next) {
  //     console.log(el);
  //     // if (el.tagName !== "A" && el.tagName !== "SPAN" && el.tagName !== "DIV") {
  //     //   return;
  //     // }
  //     // const type = INLINE_TAGS[el.tagName.toLowerCase()];
  //     // if (type) {
  //     //   return {
  //     //     // inline to show that Inline nodes may contain nested inline nodes and text nodes—just like in the DOM.
  //     //     object: "inline",
  //     //     type: type,
  //     //     nodes: next(el.childNodes),
  //     //     data: {
  //     //       href:
  //     //         Array.from(el.attributes).find(({ name }) => name == "href") !==
  //     //         undefined
  //     //           ? Array.from(el.attributes).find(({ name }) => name == "href")
  //     //               .value
  //     //           : null
  //     //     }
  //     //   };
  //     // }
  //   },
  //   serialize: function(object, children) {
  //     if (object.object == "inline") {
  //       console.log(object.type);
  //       switch (object.type) {
  //         case "link":
  //           return (
  //             <LinkStyle href={object.data._root.entries[0][1]} target="_blank">
  //               {children}
  //             </LinkStyle>
  //           );
  //       }
  //     }
  //   }
  // }
];

const html = new Html({
  rules
});

// onClickInput = event => {
//   event.preventDefault();
//   console.log("Click the link!")
//   const { editor } = this;
//   const { value } = editor;
//   const hasLinks = this.hasLinks();
//   // console.log(value.selection)
//   if (hasLinks) {
//     // console.log("hasLinks")
//     this.editor.command(this.unwrapLink);
//   } else if (value.selection.isExpanded) {
//     // console.log("selection.isExpanded")
//     const href = window.prompt("Enter the URL of the link:");
//     if (href == null) {
//       return;
//     } else {
//       this.editor.command(this.wrapLink, href);
//       // console.log("Ссылка создана!")
//     }
//   } else {
//     console.log("else");
//     const href = window.prompt("Enter the URL of the link:");
//     console.log(href);
//     if (href == null) {
//       return;
//     } else {
//       const text = window.prompt("Enter the text for the link:");
//       console.log(text);

//       if (text == null) {
//         return;
//       }

//       editor
//         .insertText(text)
//         .moveFocusBackward(text.length)
//         .command(this.wrapLink, href);
//     }
//   }
// };

const MarkButton = ({ editor, type, icon }) => {
  const { value } = editor;
  const isActive = value.activeMarks.some(mark => mark.type === type);
  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault();
        editor.toggleMark(type);
      }}
    >
      <IconBlock>
        <Icon icon={icon} />
      </IconBlock>
    </Button>
  );
};

// const InlineButton = ({ editor, type, icon }) => {
//   const { value } = editor;
//   const isActive = value.activeMarks.some(mark => mark.type === type);
//   return (
//     <Button
//     // reversed
//     // active={isActive}
//     // onMouseDown={event => {
//     //   event.preventDefault();
//     //   this.onClickInput;
//     // }}
//     >
//       <IconBlock>
//         <Icon icon={icon} />
//       </IconBlock>
//     </Button>
//   );
// };

// function insertInput(editor, src, target) {
//   if (target) {
//     editor.select(target);
//   }

//   editor.insertBlock({
//     type: "input",
//     data: { src }
//   });
// }

const HoverMenu = React.forwardRef(({ editor }, ref) => {
  const root = window.document.getElementById("root");
  return ReactDOM.createPortal(
    <Menu
      ref={ref}
      className={css`
        padding: 8px 12px 6px;
        position: absolute;
        z-index: 1;
        top: -10000px;
        left: -10000px;
        margin: -6px;
        opacity: 0;
        background-color: #222;
        border-radius: 4px;
        transition: opacity 0.75s;
      `}
    >
      <MarkButton editor={editor} type="bold" icon={bold} />
      <MarkButton editor={editor} type="italic" icon={italic} />
      {/* <InlineButton editor={editor} type="pencil" icon={pencil} /> */}
    </Menu>,
    root
  );
});

/**
 * The hovering menu example.
 *
 * @type {Component}
 */

class HoveringMenu extends React.Component {
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: this.props.placeholder
      ? html.deserialize(this.props.placeholder)
      : html.deserialize(``)
  };

  menuRef = React.createRef();

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

  onChange = ({ value }) => {
    this.setState({ value });
    this.props.getEditorText(html.serialize(this.state.value), this.props.name);
  };

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const menu = this.menuRef.current;
    if (!menu) return;

    const { value } = this.state;
    const { fragment, selection } = value;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === "") {
      menu.removeAttribute("style");
      return;
    }

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`;

    menu.style.left = `${rect.left +
      window.pageXOffset -
      menu.offsetWidth / 2 +
      rect.width / 2}px`;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Editor
          style={AppStyles}
          // placeholder="Напишите что-нибудь..."
          value={this.state.value}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          renderMark={this.renderMark}
          renderBlock={this.renderBlock}
          // renderInline={this.renderInline}
        />
      </div>
    );
  }

  /**
   * Render the editor.
   *
   * @param {Object} props
   * @param {Function} next
   * @return {Element}
   */

  renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <>
        {children}
        <HoverMenu ref={this.menuRef} editor={editor} />
      </>
    );
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      default:
        return next();
    }
  };

  // renderInline = (props, editor, next) => {
  //   const { attributes, children, node } = props;
  //   switch (node.type) {
  //     case "input":
  //       return <input data={node.data.get("href")} />;
  //     default:
  //       return next();
  //   }
  // };
}

/**
 * Export.
 */

export default HoveringMenu;
