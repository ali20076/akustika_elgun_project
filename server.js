const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const usersDatabasePath = path.join(root, 'data', 'users.json');
const eventsDatabasePath = path.join(root, 'data', 'events.json');
const registrationsDatabasePath = path.join(root, 'data', 'event-registrations.json');
const port = 3000;
const adminCode = process.env.AKUSTIKA_ADMIN_CODE || 'AKUSTIKA2026';

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png'
};

function readJson(databasePath, fallback = []) {
    if (!fs.existsSync(databasePath)) return fallback;
    try { return JSON.parse(fs.readFileSync(databasePath, 'utf8')); }
    catch { return fallback; }
}

function writeJson(databasePath, data) {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

function readUsers() {
    return readJson(usersDatabasePath);
}

function writeUsers(users) {
    writeJson(usersDatabasePath, users);
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
            const name = String(body.name || [body.firstName, body.lastName].filter(Boolean).join(' ')).trim();
            const roleMap = { student: 'shagird', teacher: 'muellim', parent: 'valideyn' };
            const role = roleMap[String(body.role || 'shagird')] || String(body.role || 'shagird');
            const mode = String(body.mode || 'user');

            if (!name || name.length < 2 || password.length < 6 || !email) {
                return sendJson(response, 400, { message: 'Ad, e-poçt və şifrəni düzgün doldurun.' });
            }
            if (!['shagird', 'muellim', 'valideyn'].includes(role)) {
                return sendJson(response, 400, { message: 'Yanlış istifadəçi növü.' });
            }
            if (!['user', 'admin'].includes(mode)) {
                return sendJson(response, 400, { message: 'Yanlış giriş rejimi.' });
            }
            if (mode === 'admin' && String(body.adminCode || '') !== adminCode) {
                return sendJson(response, 403, { message: 'Admin giriş kodu yanlışdır.' });
            }
            if (users.some((user) => user.email === email && user.role === role && user.mode === mode)) {
                return sendJson(response, 409, { message: 'Bu rol və rejim üçün hesab artıq mövcuddur.' });
            }

            users.push({
                id: crypto.randomUUID(),
                name,
                email,
                role,
                mode,
                password: hashPassword(password),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            writeUsers(users);
            return sendJson(response, 201, { message: 'Qeydiyyat tamamlandı.', account: { name, email, role, mode } });
        }

        if (request.url === '/api/login' && request.method === 'POST') {
            const role = String(body.role || 'shagird');
            const mode = String(body.mode || 'user');

            if (mode === 'admin' && String(body.adminCode || '') !== adminCode) {
                return sendJson(response, 403, { message: 'Admin giriş kodu yanlışdır.' });
            }

            const user = users.find((candidate) => candidate.email === email && candidate.role === role && candidate.mode === mode);
            if (!user || !passwordMatches(password, user.password)) {
                return sendJson(response, 401, { message: 'E-poçt, şifrə, rol və ya rejim yanlışdır.' });
            }
            return sendJson(response, 200, {
                message: `Xoş gəldiniz, ${user.name}!`,
                account: { id: user.id, name: user.name, email: user.email, role: user.role, mode: user.mode }
            });
        }

        if (request.url === '/api/events' && request.method === 'GET') {
            return sendJson(response, 200, { events: readJson(eventsDatabasePath, []) });
        }

        if (request.url === '/api/event-register' && request.method === 'POST') {
            const eventId = String(body.eventId || '').trim();
            const participantName = String(body.name || '').trim();
            const participantEmail = String(body.email || '').trim().toLowerCase();
            const phone = String(body.phone || '').trim();
            const instrument = String(body.instrument || '').trim();

            if (!eventId || !participantName || !participantEmail) {
                return sendJson(response, 400, { message: 'Ad, e-poçt və tədbir mütləqdir.' });
            }

            const events = readJson(eventsDatabasePath, []);
            const event = events.find((item) => item.id === eventId);
            if (!event) return sendJson(response, 404, { message: 'Tədbir tapılmadı.' });

            const registrations = readJson(registrationsDatabasePath);
            if (registrations.some((item) => item.eventId === eventId && item.email === participantEmail)) {
                return sendJson(response, 409, { message: 'Bu tədbirə artıq qeydiyyatdan keçmisiniz.' });
            }

            registrations.push({
                id: crypto.randomUUID(),
                eventId,
                eventTitle: event.title,
                name: participantName,
                email: participantEmail,
                phone,
                instrument,
                createdAt: new Date().toISOString()
            });
            writeJson(registrationsDatabasePath, registrations);
            return sendJson(response, 201, { message: 'Konsert tədbirinə qeydiyyat tamamlandı!' });
        }

        sendJson(response, 404, { message: 'API route not found.' });
    } catch (error) {
        sendJson(response, 400, { message: 'Server sorğunu emal edə bilmədi.' });
    }
}

function serveStatic(request, response) {
    const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const relativePath = requestedPath === '/' ? '/incesenet_akustika_merkezi/main.html' : requestedPath;
    const filePath = path.resolve(root, `.${relativePath}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404);
        response.end('Not found');
        return;
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(response);
}

fs.mkdirSync(path.dirname(usersDatabasePath), { recursive: true });
if (!fs.existsSync(usersDatabasePath)) writeUsers([]);
if (!fs.existsSync(eventsDatabasePath)) {
    writeJson(eventsDatabasePath, [
        { id: 'spring-concert', title: 'Bahara qədər', date: '2026-04-18', time: '19:00', venue: 'Akustika Konsert Zalı', category: 'Böyük konsert', description: 'Tar, saz, gitara və skripka sənətçiləri ilə birlikdə mövsümün ən canlı proqramı.', image: 'spring' },
        { id: 'young-musicians', title: 'Gənc istedadlar gecəsi', date: '2026-05-24', time: '18:30', venue: 'Akustika Səhnəsi', category: 'Şagirdlər tədbiri', description: 'Mərkəzin şagirdləri üçün solo və ansambl çıxışlarının təqdimatı.', image: 'young' },
        { id: 'mugam-evening', title: 'Muğam axşamı', date: '2026-06-12', time: '20:00', venue: 'Tarixin İşığı Zalı', category: 'Tematik axşam', description: 'Klassik muğam dastgahları və zəngin sənət proqramı.', image: 'mugam' }
    ]);
}
if (!fs.existsSync(registrationsDatabasePath)) writeJson(registrationsDatabasePath, []);

const server = http.createServer((request, response) => {
    if (request.url.startsWith('/api/')) return handleApi(request, response);
    serveStatic(request, response);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        const fallbackPort = 3001;
        console.error(`Port ${port} is busy. Trying port ${fallbackPort}...`);
        server.listen(fallbackPort, '127.0.0.1', () => {
            console.log(`Server started: http://localhost:${fallbackPort}`);
        });
        return;
    }

    console.error(`Server could not start: ${error.message}`);
    process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Server started: http://localhost:${port}`);
});
