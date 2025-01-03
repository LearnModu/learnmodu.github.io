document.addEventListener("DOMContentLoaded", () => {
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
	} if (currTheme === "dark") {
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
});
