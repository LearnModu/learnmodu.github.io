// parsing
const marked = window.marked;

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

// fetching
export async function fetchPosts() {
    const response = await fetch('../public/posts.json');
    const posts = await response.json();
    return posts.map(post => parse(post.content));
}

//rendering
async function render(cId, limit=null) {
    const container = document.getElementById(cId);
    const posts = await getAllPosts();
    const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const toRender = limit ? sorted.slice(0, limit) : sorted;

    toRender.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post';

        const postLink = document.createElement('a');
        postLink.href = `post.html?${post.id}`;
        postLink.className = 'post-link';

        postLink.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="./static/styles.css">
            <script src="./js/script.js"></script>
            <link rel="icon" type="image/x-icon" href="/static/logo.png">
            <title>LearnModu</title>
        </head>
        <body>
            <nav class="nav">
                <ul class="nav-list">
                    <li><img src="./static/animated-light.gif" alt="LearnModu" class="logo-light"></li>
                    <li><img src="./static/animated-dark.gif" alt="LearnModu" class="logo-dark"></li>
                    <li><a href="#" class="nav-link">Home</a></li>
                    <li><a href="#recent" class="nav-link">Recent Posts</a></li>
                    <li><a href="blog.html" class="nav-link">Blog</a></li>
                    <li><a href="#about" class="nav-link">About</a></li>
                    <li><button class="theme-toggle">
                        <svg class="sun" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
                        <svg class="moon" viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></svg>
                    </button></li>
                </ul>
            </nav>

            <main class="content">
            <h1>${post.title}</h1>
            <img src="${post.img}" alt="${post.title}" class="post-img">
            <div class="meta>
                <span class="date">${post.date}</span>
                <span class="author">${post.author}</span>
            </div>
            <div class="content">
                ${convertToHtml(post.body)}
            </div>
        `;
        article.appendChild(postLink);
        container.appendChild(article);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
	const themeToggle = document.querySelector('.theme-toggle');
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

	document.documentElement.setAttribute('data-theme',
		localStorage.getItem('theme') || prefersDark.matches ? "dark" : "light"
	);

	const currTheme = document.documentElement.getAttribute("data-theme");
	const sun = document.querySelector('.sun');
	const moon = document.querySelector('.moon');
	const logoLight = document.querySelector('.logo-light');
	const logoDark = document.querySelector('.logo-dark');

	if (currTheme === "light") {
		sun.style.display = "none";
		moon.style.display = "block";
		logoLight.style.display = "block";
		logoDark.style.display = "none";
	} if (currTheme === "dark") {
		moon.style.display = "none";
		sun.style.display = "block";
		logoDark.style.display = "block";
		logoLight.style.display = "none";
	}

	themeToggle.addEventListener("click", () => {
		const currTheme = document.documentElement.getAttribute("data-theme");
		const newTheme = currTheme === "light" ? "dark" : "light";

		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);

		if (newTheme === "light") {
			sun.style.display = "none";
			moon.style.display = "block";
			logoLight.style.display = "block";
			logoDark.style.display = "none";
		} else {
			moon.style.display = "none";
			sun.style.display = "block";
			logoDark.style.display = "block";
			logoLight.style.display = "none";
		}
	});

	const recents = document.getElementById('recents');
	if (recents) await render('recents', 4);
	const blog = document.getElementById('blog-posts');
	if (blog) await render('blog-posts');
});
