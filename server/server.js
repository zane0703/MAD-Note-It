var loginAccount = [];
const { compare, hash } = require('bcryptjs');
const { createDecipheriv, randomBytes, createCipheriv, pbkdf2Sync } = require('crypto');
const { parse } = require("url");
const { writeFileSync, readFile, readFileSync } = require("fs");
function decrypt(data, key, salt) {
    let [iv, text] = data.split(":")
    iv = Buffer.from(iv, "base64")
    if (salt) { key = pbkdf2Sync(key, salt, 2000, 32, 'sha512') }
    let decipher = createDecipheriv("aes-256-cbc", key, iv);
    return decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
}
function encrypt(text, key, salt) {
    if (salt) { key = pbkdf2Sync(key, salt, 2000, 32, 'sha512') }
    let iv = randomBytes(16);
    var cipher = createCipheriv("aes-256-cbc", key, iv);
    return iv.toString("base64") + ":" + (cipher.update(text, 'utf8', "base64") + cipher.final("base64"));
}
require("http2").createSecureServer({
    key: readFileSync("./localhost.key"),
    cert: readFileSync("./localhost.crt")
}, function (req, res) {
    try {
        if (req.headers.cookie) { req.headers.cookie = Buffer.from(req.headers.cookie.split('id=')[1].split(';')[0], "base64"); }
        let { pathname, query } = parse(req.url, true);
        if (req.method === "GET") {
            switch (pathname) {
                case "/users": {
                    let username = require("./accounts.json")
                    if (username.some(x => x.username === query.username)) {
                        res.statusCode = 204;
                        res.end();
                    } else {
                        res.statusCode = 404
                        res.end('username not found');
                    }
                }
                    break;
                case "/note":
                    {
                        let account = loginAccount.find(x => x.id == query.userId);
                        if (decrypt(account.accessCode, req.headers.cookie) === "0ef3c87cdd85ff242212") {
                            readFile("./note/" + account.userId + ".json", 'utf8', (err, data) => {
                                try {
                                    if (err) {
                                        res.statusCode = 404;
                                        res.end()
                                    } else {
                                        let password = decrypt(account.aPassword, req.headers.cookie)
                                        data = JSON.parse(data);
                                        data.forEach((value) => {
                                            if (value.location) { value.location = JSON.parse(decrypt(value.location, password, "@hd�")) }
                                            value.title = decrypt(value.title, password, "����");
                                            value.note = decrypt(value.note, password, "=���");
                                            return value;
                                        })
                                        res.statusCode = 200;
                                        res.end(JSON.stringify(data))
                                    }
                                } catch (error) {
                                    res.statusCode = 500;
                                        res.end()
                                }
                                
                            })
                        } else {
                            res.statusCode = 401;
                            res.end("unauthorized or you have been logout");
                        }
                    }

                    break;
                case "/sharedNote": {
                    let account2 = loginAccount.find(x => x.id == query.userId);
                    if (decrypt(account2.accessCode, req.headers.cookie) === "0ef3c87cdd85ff242212") {
                        readFile("./sharedNote/" + account2.userId + ".json", 'utf8', (err, data) => {
                            if (err) {
                                res.statusCode = 404;
                                res.end()
                            } else {
                                try {
                                    data = JSON.parse(data);
                                let password = decrypt(account2.aPassword, req.headers.cookie)
                                res.statusCode = 200;
                                let sendData = data.map(value => {
                                    if (value.encrypted) {
                                        let newValue = { ...value }
                                        newValue.title = decrypt(value.title, password, "����");
                                        newValue.note = decrypt(value.note, password, "=���");
                                        return newValue;
                                    } else {
                                        return value;
                                    }

                                })
                                res.end(JSON.stringify(sendData))
                                writeFileSync("./sharedNote/" + account2.userId + ".json", JSON.stringify(data.map(value2 => {
                                    if (!value2.encrypted) {
                                        value2.title = encrypt(value2.title, password, "����");
                                        value2.note = encrypt(value2.note, password, "=���");
                                        value2.encrypted = true;
                                    }
                                    return value2;
                                }), null, 4))
                                } catch (error) {
                                    res.statusCode = 500;
                                    res.end()
                                }
                                

                            }
                        })
                    } else {
                        res.statusCode = 401;
                        res.end();
                    }
                }
                    break;
                case "/check": {
                    let check = loginAccount.some(x => x.id == query.id) ? 1 : 0;
                    res.statusCode = 200
                    res.end(`{"ans":${check}}`)
                }
                    break;
                default:
                    res.statusCode = 404;
                    res.end()
                    break;

            }
        } else {
            let body = [];
            let size = 0;
            req.on("data", (chunk) => {
                body.push(chunk);
                size += chunk.length
                if (size > 1048576) {
                    req.pause()
                    res.statusCode = 413;
                    res.end(() => setTimeout(req.destroy, 1))

                }
            })
            req.on("end", async () => {
                try {
                    body = JSON.parse(Buffer.concat(body));
                    switch (req.method) {
                        case "POST":
                            switch (pathname) {
                                case "/login": {
                                    let accounts = require("./accounts.json");
                                    let account = accounts.find(x => x.username === body.username)
                                    if (account) {
                                        compare(body.password, account.password, (err, success) => {
                                            if (success && !err) {
                                                let cookie = randomBytes(32);
                                                let aPassword = encrypt(body.password, cookie);
                                                let accessCode = encrypt("0ef3c87cdd85ff242212", cookie)
                                                let key
                                                do {
                                                    key = randomBytes(6).readIntLE(0, 6);
                                                } while (loginAccount.some(x => x.id === key))
                                                loginAccount.push({ aPassword, userId: account.id, accessCode, username: account.username, id: key });
                                                if (body.oldNote) {
                                                    readFile("./note/" + account.id + ".json", 'utf8', (err, data) => {
                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                        else {
                                                            data = JSON.parse(data);
                                                            let i = data.length;
                                                            if (Array.isArray(body.oldNote)) {
                                                                body.oldNote.forEach((x) => {
                                                                    x.key = ++i;
                                                                    if (x.location) { x.location = encrypt(JSON.stringify(x.location), body.password, "@hd�") }
                                                                    x.title = encrypt(x.title, body.password, "����");
                                                                    x.note = encrypt(x.note, body.password, "=���");
                                                                    return x;
                                                                })
                                                            }
                                                            data.push(...body.oldNote)
                                                            writeFileSync("./note/" + account.id + ".json", JSON.stringify(data, null, 4))
                                                        }

                                                    })
                                                }
                                                res.writeHead(200, { "Set-Cookie": `id=${cookie.toString('base64')};Max-Age=2147483647;` });
                                                res.end(`{"id":${key}}`)

                                            } else {
                                                res.statusCode = 401;
                                                res.end("incorrect Username or Password");
                                            }
                                        })

                                    } else {
                                        res.statusCode = 401;
                                        res.end("incorrect Username");
                                    }
                                }
                                    break;
                                case "/signUp": {
                                    let accounts = require("./accounts.json");
                                    if (accounts.some(value => value.username === body.username)) {
                                        res.statusCode = 409;
                                        res.end("username have be used");
                                    } else {
                                        if (accounts.some(value => value.email === body.email)) {
                                            res.statusCode = 409;
                                            res.end("email have be used");
                                        } else {
                                            hash(body.password, 10, (err, hashPW) => {
                                                if (err) {
                                                    res.statusCode = 500;
                                                    res.end('internal server error');
                                                } else {
                                                    body.password = hashPW
                                                    body.id = accounts.length;
                                                    accounts.push(body);
                                                    writeFileSync("./accounts.json", JSON.stringify(accounts, null, 4));
                                                    writeFileSync("./note/" + body.id + ".json", "[]");
                                                    writeFileSync("./sharedNote/" + body.id + ".json", "[]");
                                                    res.statusCode = 201;
                                                    res.end("[]");
                                                }
                                            })


                                        }
                                    }
                                }
                                    break;
                                case "/note": {
                                    let account = loginAccount.find(x => x.id == query.userId);
                                    if (decrypt(account.accessCode, req.headers.cookie) === "0ef3c87cdd85ff242212") {
                                        let password = decrypt(account.aPassword, req.headers.cookie)
                                        if (body.location) { body.location = encrypt(JSON.stringify(body.location), password, "@hd�") }

                                        readFile("./note/" + account.userId + ".json", 'utf8', (err, data) => {
                                            if (err) {
                                                console.log(err)
                                                res.statusCode = 500;
                                                res.end('internal server error')
                                            }
                                            else {
                                                data = JSON.parse(data);
                                                body.key = data.length + 1;
                                                data.push(body)
                                                if (body.shareUser.length) {
                                                    let userAcc = require("./accounts.json");
                                                    let { fontColor, fontFamily, note, backgroundColor, fontSize, title, key } = body;
                                                    let sharedNote = { encrypted: false, SharedBy: account.username, fontColor, fontFamily, note, backgroundColor, fontSize, title, noteId: key };
                                                    body.shareUser.forEach(element => {
                                                        let { id } = userAcc.find(x => x.username === element.toUpperCase())
                                                        readFile("./sharedNote/" + id + ".json", 'utf8', (err, data) => {
                                                            if (!err) {
                                                                data = JSON.parse(data);
                                                                sharedNote.key = data.length + 1;
                                                                data.push(sharedNote)
                                                                writeFileSync("./sharedNote/" + id + ".json", JSON.stringify(data, null, 4))
                                                            }
                                                        })
                                                    });
        
                                                }
                                                body.title = encrypt(body.title, password, "����");
                                                body.note = encrypt(body.note, password, "=���");
                                                writeFileSync("./note/" + account.userId + ".json", JSON.stringify(data, null, 4))
                                                res.statusCode = 201
                                                res.end("[]");
                                            }
                                        })
                                    } else {
                                        res.statusCode = 401;
                                        res.end();
                                    }
                                }
                                    break;
                                default:
                                    res.statusCode = 404;
                                    res.end()
                                    break;
                            }
                            break;
                        case "PUT":
                            switch (pathname) {
                                case "/note": {
                                    let account = loginAccount.find(x => x.id == query.userId);
                                    if (decrypt(account.accessCode, req.headers.cookie) === "0ef3c87cdd85ff242212") {
                                        readFile("./note/" + account.userId + ".json", 'utf8', (err, data) => {
                                            if (err) { console.log(err) }
                                            else {
                                                data = JSON.parse(data);
                                                let accounts = require("./accounts.json");
                                                data[query.id - 1].shareUser.filter(x => !body.shareUser.includes(x)).forEach(element => {
                                                    let { id } = accounts.find(x => x.username === element.toUpperCase())
                                                    readFile("./sharedNote/" + id + ".json", 'utf8', (err, data2) => {
                                                        if (!err) {
                                                            data2 = JSON.parse(data2);
                                                            data2 = data2.filter(x => x.SharedBy !== account.username || x.noteId != query.id)
                                                            data2.forEach((x, y) => x.key = y + 1);
                                                            writeFileSync("./sharedNote/" + id + ".json", JSON.stringify(data2, null, 4))
                                                        }
                                                    })
                                                })
                                                let addShare = body.shareUser.filter(x => !data[query.id - 1].shareUser.includes(x))
                                                if (addShare.length) {
                                                    let { fontColor, fontFamily, note, backgroundColor, fontSize, title, key } = body;
                                                    let sharedNote = { encrypted: false, SharedBy: account.username, fontColor, fontFamily, note, backgroundColor, fontSize, title, noteId: key };
                                                    addShare.forEach(element => {
                                                        let { id } = accounts.find(x => x.username === element.toUpperCase())
                                                        readFile("./sharedNote/" + id + ".json", 'utf8', (err, data2) => {
                                                            if (!err) {
                                                                data2 = JSON.parse(data2);
                                                                sharedNote.key = data2.length + 1;
                                                                data2.push(sharedNote)
                                                                writeFileSync("./sharedNote/" + id + ".json", JSON.stringify(data2, null, 4))
                                                            }
                                                        })
                                                    })
                                                }
                                                let password = decrypt(account.aPassword, req.headers.cookie)
                                                if (body.location) { body.location = encrypt(JSON.stringify(body.location), password, "@hd�") }
                                                body.title = encrypt(body.title, password, "����");
                                                body.note = encrypt(body.note, password, "=���");
                                                data[query.id - 1] = body;
                                                writeFileSync("./note/" + account.userId + ".json", JSON.stringify(data, null, 4))
                                                res.statusCode = 204;
                                                res.end()
                                            }
                                        })
                                    } else {
                                        res.statusCode = 401;
                                        res.end();
                                    }
                                }
                                    break;
                                case "/password": {
                                    let account = loginAccount.find(x => x.id == query.userId);
                                    if (decrypt(account.accessCode, req.headers.cookie) === "0ef3c87cdd85ff242212") {
                                        let accounts = require("./accounts.json")
                                        compare(body.cPass, accounts[account.userId].password, (err, success) => {
                                            if (success && !err) {
                                                readFile("./note/" + account.userId + ".json", "utf-8", (err, note) => {
                                                    if (err) {
                                                        console.log(err)
                                                        res.statusCode = 500;
                                                        res.end('internal server error')
                                                    } else {
                                                        readFile("./sharedNote/" + account.userId + ".json", "utf-8", (err, sNote) => {
                                                            if (err) {
                                                                console.log(err)
                                                                res.statusCode = 500;
                                                                res.end('internal server error')
                                                            } else {
                                                                sNote = JSON.parse(sNote)
                                                                note = JSON.parse(note)
                                                                account.aPassword = encrypt(body.pass, req.headers.cookie);
                                                                let reEncrypt = x => {
                                                                    if (x.location) { x.location = encrypt(decrypt(x.location, body.cPass, "@hd�"), body.pass, "@hd�") }
                                                                    x.title = encrypt(decrypt(x.title, body.cPass, "����"), body.pass, "����");
                                                                    x.note = encrypt(decrypt(x.note, body.cPass, "=���"), body.pass, "=���");
                                                                    return x
                                                                }
                                                                note.forEach(reEncrypt)
                                                                sNote.forEach(reEncrypt)
                                                                hash(body.pass, 10, (err, hashPW) => {
                                                                    if (err) {
                                                                        console.log(err)
                                                                        res.statusCode = 500;
                                                                        res.end('internal server error')
                                                                    } else {
                                                                        accounts[account.userId].password = hashPW;
                                                                        writeFileSync("./note/" + account.userId + ".json", JSON.stringify(note, null, 4))
                                                                        writeFileSync("./sharedNote/" + account.userId + ".json", JSON.stringify(sNote, null, 4))
                                                                        writeFileSync("./accounts.json", JSON.stringify(accounts, null, 4));
                                                                        res.statusCode = 204;
                                                                        res.end();
                                                                    }
                                                                })

                                                            }
                                                        })
                                                    }
                                                })

                                            } else {
                                                res.statusCode = 401;
                                                res.end("Invalid current Password");
                                            }
                                        })


                                    } else {
                                        res.statusCode = 401;
                                        res.end("unauthorized or you have been logout");
                                    }
                                }
                                    break;
                                default:
                                    res.statusCode = 404;
                                    res.end()
                                    break;
                            }
                            break;
                        case "DELETE":
                            switch (pathname) {
                                case "/note": {
                                    let account = loginAccount.find(x => x.id == query.userId);
                                    if (decrypt(account.accessCode, req.headers.cookie) === "0ef3c87cdd85ff242212") {
                                        readFile("./note/" + account.userId + ".json", 'utf8', (err, data) => {
                                            let accounts = require("./accounts.json");
                                            if (err) { throw err }
                                            else {
                                                data = JSON.parse(data);
                                                let [delNote] = data.splice(query.id - 1, 1)
                                                for (let i = query.id - 1; data.length > i; i++) {
                                                    data[i].key--
                                                    if (data[i].shareUser.length) {
                                                        let shareId = i + 2
                                                        data[i].shareUser.forEach(element => {
                                                            let { id } = accounts.find(x => x.username === element.toUpperCase())
                                                            readFile("./sharedNote/" + id + ".json", 'utf8', (err, data2) => {
                                                                if (!err) {
                                                                    data2 = JSON.parse(data2);
                                                                    data2.forEach(y => {
                                                                        if (y.SharedBy === account.username && y.noteId == shareId) {
                                                                            y.noteId--
                                                                        }
                                                                    })
                                                                    writeFileSync("./sharedNote/" + id + ".json", JSON.stringify(data2, null, 4))
                                                                }
                                                            })
                                                        })
                                                    }
                                                }
                                                delNote.shareUser.forEach((element) => {
                                                    let { id } = accounts.find(x => x.username === element.toUpperCase())
                                                    readFile("./sharedNote/" + id + ".json", 'utf8', (err, data2) => {
                                                        if (!err) {
                                                            data2 = JSON.parse(data2);
                                                            data2 = data2.filter(x => !(x.SharedBy == account.username && x.noteId == query.id))
                                                            data2.forEach((x, y) => x.key = y + 1);
                                                            writeFileSync("./sharedNote/" + id + ".json", JSON.stringify(data2, null, 4))
                                                        }
                                                    })
                                                })
                                                writeFileSync("./note/" + account.userId + ".json", JSON.stringify(data, null, 4))
                                                res.statusCode = 204;
                                                res.end()
                                            }
                                        })
                                    } else {
                                        res.statusCode = 401;
                                        res.end();
                                    }
                                }
                                    break;
                                case "/logOut":
                                    loginAccount = loginAccount.filter(x => x.id != query.id)
                                default:
                                    res.statusCode = 404;
                                    res.end("[]")
                                    break;
                            }
                            break;
                    }
                }
                catch (e) {
                    console.log(e)
                    if (e.message.includes("JSON")) {
                        res.statusCode = 415;
                        res.end()
                    } else {
                        res.statusCode = 500;
                        res.end('internal server error')
                    }

                }
            })
        }
    }
    catch (err) {
        console.log(err)
        res.statusCode = 500;
        res.end('internal server error')
    }
}).listen(443, () => console.log("\x1b[01;34mServer started run adb reverse tcp:443 tcp:443 to connect\x1b[0m"))