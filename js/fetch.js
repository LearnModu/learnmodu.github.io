import { parse } from "./parse";

export async function fetchPosts() {
    const response = await fetch('/public/posts.json');
    const posts = await response.json();
    return posts.map(post => parse(post.content));
}

export async function getAllPosts() {
    const files = await fetchPosts();
    return Promise.all(files.map(async (file) => {
        const content = await fetch(`/public/posts/${file}`).then(r => r.text());
        return parse(content, file);
    }));
}
