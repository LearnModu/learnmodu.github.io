import { render } from "./render";

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
