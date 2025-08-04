export const MARKDOWN_PATTERNS = [
    { type: "bolditalic", regex: /\*\*\*([\s\S]+?)\*\*\*/g },
    { type: "bold", regex: /\*\*([\s\S]+?)\*\*/g },
    { type: "italic", regex: /(?<!\*)\*([\s\S]+?)\*(?!\*)/g },
    { type: "strikethrough", regex: /~~([\s\S]+?)~~/g },
    { type: "underlined", regex: /__([\s\S]+?)__/g },
    { type: "link", regex: /(https?:\/\/[^\s<>"'`]+)(?!\w)/g },

    { type: "mention", regex: /<@(\d+)>/g },
    { type: "color", regex: /<([#a-zA-Z0-9]+)>([\s\S]+?)<\1>/g }
];
