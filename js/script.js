// parsing
const marked = window.marked;

function parse(content) {
	const lines = content.split('\n');
	const title = lines[0].replace('#', '').trim();
	const img = lines[1].replace('Image: ', '').trim();
	const date = lines[3].replace('Date: ', '').trim();
	const author = lines[4].replace('Author: ', '').trim();
	const body = lines.slice(5).join('\n');
	const id = Number(lines[2].replace('ID: ', '').trim());

	return {
		title,
		img,
		date,
		author,
		body,
		id
	};
}

function convertToHtml(content) {
	return DOMPurify.sanitize(marked.parse(content));
}

// fetching
async function fetchPosts() {
	const response = await fetch('../public/posts.json');
	const posts = await response.json();
	return posts.map(post => parse(post.content));
}

//rendering
function renderPost(post, isGrid=false) {
	const article = document.createElement('article');
	article.className = isGrid ? 'post-grid' : 'post';

	const postLink = document.createElement('a');
	postLink.href = `post.html?id=${post.id}`;
	postLink.className = 'post-link';
	let postImg = './public/posts/' + post.img;
	// console.log(postImg); <-- this was used for debugging (computerblade-official ADDED)
	postLink.innerHTML = `
		<img src="${postImg}" alt="${post.title}" class="post-img">
		<h2>${post.title}</h2>
		<span class="date">${post.date}</span>
		<span class="author">${post.author}</span>
	`;

	article.appendChild(postLink);
	return article;
}

async function render(cId, limit=null) {
	const container = document.getElementById(cId);
	const posts = await fetchPosts();
	const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
	const toRender = limit ? sorted.slice(0, limit) : sorted;

	container.innerHTML = '';
	if (cId === 'recents') toRender.forEach(post => container.appendChild(renderPost(post, true)));
	toRender.forEach(post => container.appendChild(renderPost(post, cId === 'recents')));
	window.addEventListener('hashchange', handleRoute);
	handleRoute();
}

function handleRoute() {
	const hash = window.location.hash;
	if (hash.startsWith('#post/')) {
		const slug = hash.replace('#post/', '');
		showPost(slug);
	}
}

async function showPost(slug) {
	const posts = await fetchPosts();
	const post = posts.find(p => {
		const postSlug = p.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
		return postSlug === slug;
	});

	if (!post) return
	document.querySelector('section').forEach(s => s.style.display = 'none');

	let postContainer = document.getElementById('single-post');
	if (!postContainer) {
		postContainer = document.createElement('section');
		postContainer.id = 'single-post';
		document.querySelector('.content').appendChild(postContainer);
	}

	const parsed = parse(post.container);
	postContainer.innerHTML = `
		<article class="post full-post">
			<h1>${parsed.title}</h1>
			<img src="${parsed.img}" alt="${parsed.title}" class="post-img">
			<div class="post-meta">
				<span class="date">${parsed.date}</span>
				<span class="author">${parsed.author}</span>
			</div>
			<div class="post-content">
				${convertToHtml(parsed.body)}
			</div>
			<a href="#" class="back-link">← Back to posts</a>
		</article>
	`;
	postContainer.style.display = 'block';
}

const style = document.createElement('style');
style.textContent = `
.full-post {
	max-width: 800px;
	margin: 0 auto;
}
.post-excerpt {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.back-link {
	display: inline-block;
	margin-top: 2rem;
	color: var(--text);
	text-decoration: none;
}
`;
document.head.appendChild(style);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = Number(urlParams.get('id'));

addEventListener("load", (event) => {
	getPostData(postId);
});

var postTitleTag = document.getElementById("postTitle");
var postImgTag = document.getElementById("post-img");
var postDateTag = document.getElementById("date");
var postAuthorTag = document.getElementById("author");
var postContentTag = document.getElementById("post-content");

async function getPostData(id) {
	const resp = await fetch('../public/posts.json');
	const posts = await resp.json();
	const p = posts.map(post => parse(post.content));
	const mp = JSON.parse(JSON.stringify(p));
	console.log(p);
	console.log(mp);
	id -= 1;
	postTitleTag.innerHTML = mp[id]['title'];
	postImgTag.src = './public/posts/' + mp[id]['img'];
	postDateTag.innerHTML = mp[id]['date'];
	postAuthorTag.innerHTML = mp[id]['author'];
	postContentTag.innerHTML = DOMPurify.sanitize(marked.parse(mp[id]['body'].toString()));
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
	}  if (currTheme === "dark") {
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

	handleRoute();
});
