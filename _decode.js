const fs = require('fs');
const path = require('path');
const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'Kashmir - Fighting for Peace.html'), 'utf8');
const m = html.match(/<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/);
if (!m) { console.error('template not found'); process.exit(1); }
const decoded = JSON.parse(m[1]);
fs.writeFileSync(path.join(dir, '_prototype-decoded.html'), decoded);
console.log('decoded', decoded.length, 'chars,', decoded.split('\n').length, 'lines');
