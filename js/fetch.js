import { parse } from "./parse";

export async function fetchPosts() {
    const posts = await fetch('/public/posts/');
    const files = await posts.json();
    return files.filter(f => f.endsWith(".md"))
}

export async function getAllPosts() {
    const files = await fetchPosts();
    return Promise.all(files.map(async (file) => {
        const content = await fetch(`/public/posts/${file}`).then(r => r.text());
        return parse(content, file);
    }));
}
