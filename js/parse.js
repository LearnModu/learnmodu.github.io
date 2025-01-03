export function parse(content) {
    const lines = content.split('\n');
    const title = lines[0].replace('#', '').trim();
    const img = lines[1].replace('Image: ', '').trim();
    const date = lines[2].replace('Date: ', '').trim();
    const author = lines[3].replace('Author: ', '').trim();
    const body = lines.slice(4).join('\n');

    return {
        title,
        img,
        date,
        author,
        body,
    };
}

export function convertToHtml(content) {
    return marked.parse(content);
}
