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
	article.className = isGrid ? 'post-grid post-w' : 'post';

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
		<br><br>
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
	if (cId === 'recents' || cId === 'blog-posts') toRender.forEach(post => container.appendChild(renderPost(post, true)));
	// toRender.forEach(post => container.appendChild(renderPost(post, cId === 'recents')));
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
	
	//id -= 1;
	const post = mp.find(p => p.id === id);
	if (!post) {
		console.log(`Post of id ${id} not found`);
		return;
	}

	postTitleTag.innerHTML = post.title;
	postImgTag.src = './public/posts/' + post.img;
	postImgTag.alt = post.title;
	postDateTag.innerHTML = post.date;
	postAuthorTag.innerHTML = post.author;
	postContentTag.innerHTML = DOMPurify.sanitize(marked.parse(post.body.toString()));
}

// modu assist
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

	async function sendMessage(message) {
		try {
			const response = await fetch("https://cablyai.com/v1/chat/completions", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',				
				},
				mode: 'cors',
				body: JSON.stringify({
					"model": "searchgpt",
					"messages": [
						{
							"role": "system",
							"content": `
							You are **ModuAssist**, created by the LearnModu Team to help beginners and experienced developers alike with the **Modu programming language**. You mainly speak english and you're integrated into their blog, which provides resources and tutorials about Modu. 

							### Key Information:
							- **Modu** was developed by Cyteon and released on **December 11, 2024**.
							- The LearnModu blog covers all features of Modu, including installation, syntax, and functionality.

							---

							### Installation
							**1. Through Cargo (Recommended)**  
							- Install **Rust**, which includes Cargo.  
							- Check if Cargo is installed: cargo --version.  
							- Run: cargo +nightly install modu.  
							- Verify installation: modu.  
							- **VSCode Users:** Download the Modu extension on GitHub.

							**2. Through Binaries**  
							- Download Modu binaries from GitHub Actions.  
							- Add them to your PATH environment variable.  
							- Verify installation: modu.  

							---

							### Syntax Overview  
							**Hello World:** 
							print("Hello, World!");

							**User Input:**  
							let string = input("Print something: ");
							print(string);

							**Variables and Types:**  
							- Automatic type assignment for variables.  
							let string = "text";
							let integer = 34;
							let boolean = true;

							**If Statements:**
							if a == b {
								print("Equal!");
							} if a !== b {
								print("Not Equal!");
							}

							**Custom Functions:**  
							fn wave(person) {
								print("Hello, ", person, "!");
							}
							wave("Alice");

							**Importing Libraries:**  
							- Import libraries with import.  
							import "math" as m;
							let value = m.sqrt(16);

							---

							### Advanced Features  
							- **Packages:** Install with modu install <package-name>.  
							- **File Imports:**  
							Example with main.modu importing something.modu:
							import "something.modu" as sm;
							sm.doSomething();
							
							Unfortunately, Modu does not support loops (workaround is the basic_loops package, that adds function loop(another_function, start, end)) and there are also no arrays or dictionaries.

							Your main goal is to assist users in debugging, fixing, and understanding Modu programs.
							`,
						},
						{
							"role": "user",
							"content": JSON.stringify(message),
						},
					],
					"stream": false,
				}),
			});
			const data = await response.json();
			return data.choices[0].message.content;
		} catch (error) {
			console.error('Error:', error);
			return 'We are working on enhancing the servers. Check back later.';
		}
	}

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'ai-message';
        messageDiv.innerHTML = marked.parse(content);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSend() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'ai-message loading';
        loadingMessage.textContent = '...';
        chatMessages.appendChild(loadingMessage);

        const response = await sendMessage(message);
        chatMessages.removeChild(loadingMessage);
        addMessage(response, false);
    }

    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
});


document.addEventListener("DOMContentLoaded", async () => {
	const themeToggle = document.querySelector('.theme-toggle');
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

	document.documentElement.setAttribute('data-theme',
		localStorage.getItem('theme') || prefersDark.matches ? "dark" : "light"
	);

	const currTheme = document.documentElement.getAttribute("data-theme");
	const sun = document.querySelector('.sun');
	const moon = document.querySelector('.moon');

	if (currTheme === "light") {
		sun.style.display = "none";
		moon.style.display = "block";
	}  if (currTheme === "dark") {
		moon.style.display = "none";
		sun.style.display = "block";
	}

	themeToggle.addEventListener("click", () => {
		const currTheme = document.documentElement.getAttribute("data-theme");
		const newTheme = currTheme === "light" ? "dark" : "light";

		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);

		if (newTheme === "light") {
			sun.style.display = "none";
			moon.style.display = "block";
		} else {
			moon.style.display = "none";
			sun.style.display = "block";
		}
	});

	const recents = document.getElementById('recents');
	if (recents) await render('recents', 4);
	const blog = document.getElementById('blog-posts');
	if (blog) await render('blog-posts', 4);

	handleRoute();
});


document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.querySelector('.menu-toggle');
	const navList = document.querySelector('.mobile-menu');
	const mobileOverlay = document.querySelector('.mobile-overlay');
  
	menuToggle.addEventListener('click', () => {
	  navList.style.display = 'flex';
	  mobileOverlay.style.display = 'block';
	});
  
	mobileOverlay.addEventListener('click', () => {
	  navList.style.display = 'none';
	  mobileOverlay.style.display = 'none';
	});
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const logoImg = document.querySelector(".logo");
 
    function getRandomRotation(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function applyRandomRotation() {

      const rotationX = getRandomRotation(-30, 30);
      const rotationY = getRandomRotation(-30, 30);

      logoImg.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
  
    setInterval(applyRandomRotation, 1500); 
  });

