const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../public/posts');
const output = path.join(__dirname, '../public/posts.json');

function readPost(filename) {
	const content = fs.readFileSync(path.join(postsDir, filename), 'utf-8');
	return {
		filename,
		content,
	};
}

const files = fs.readdirSync(postsDir);
const posts = files
	.filter(f => f.endsWith('.md'))
	.map(readPost);
fs.writeFileSync(output, JSON.stringify(posts, null, 2));
console.log(`Generated ${posts.length} new posts`);
