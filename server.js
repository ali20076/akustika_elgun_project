const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const databasePath = path.join(root, 'data', 'users.json');
const port = 3000;

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png'
};

function readUsers() {
    return JSON.parse(fs.readFileSync(databasePath, 'utf8'));
}

function writeUsers(users) {
    fs.writeFileSync(databasePath, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function passwordMatches(password, storedPassword) {
    const [salt, storedHash] = storedPassword.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(data));
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => { body += chunk; });
        request.on('end', () => {
            try { resolve(JSON.parse(body || '{}')); }
            catch { reject(new Error('Invalid JSON')); }
        });
        request.on('error', reject);
    });
}

async function handleApi(request, response) {
    try {
        const body = await readBody(request);
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const users = readUsers();

        if (request.url === '/api/register' && request.method === 'POST') {
            if (!email || password.length < 8 || !body.firstName || !body.lastName || !body.role) {
                return sendJson(response, 400, { message: 'Заполните все обязательные поля.' });
            }
            if (users.some((user) => user.email === email)) {
                return sendJson(response, 409, { message: 'Пользователь с таким email уже существует.' });
            }
            users.push({
                id: crypto.randomUUID(),
                firstName: String(body.firstName).trim(),
                lastName: String(body.lastName).trim(),
                email,
                role: String(body.role),
                password: hashPassword(password)
            });
            writeUsers(users);
            return sendJson(response, 201, { message: 'Регистрация завершена.' });
        }

        if (request.url === '/api/login' && request.method === 'POST') {
            const user = users.find((candidate) => candidate.email === email);
            if (!user || !passwordMatches(password, user.password)) {
                return sendJson(response, 401, { message: 'Неверный email или пароль.' });
            }
            return sendJson(response, 200, { message: `Добро пожаловать, ${user.firstName}!` });
        }

        sendJson(response, 404, { message: 'API route not found.' });
    } catch {
        sendJson(response, 400, { message: 'Не удалось обработать запрос.' });
    }
}

function serveStatic(request, response) {
    const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const relativePath = requestedPath === '/' ? '/registration/registration.html' : requestedPath;
    const filePath = path.resolve(root, `.${relativePath}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404);
        response.end('Not found');
        return;
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(response);
}

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
if (!fs.existsSync(databasePath)) writeUsers([]);

http.createServer((request, response) => {
    if (request.url.startsWith('/api/')) return handleApi(request, response);
    serveStatic(request, response);
}).listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
