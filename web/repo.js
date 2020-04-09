var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var authors;
var data;
export function init() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            var req;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch('./repo.json')];
                                    case 1:
                                        req = _a.sent();
                                        return [4 /*yield*/, req.json()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })(),
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            var req;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch('./people.json')];
                                    case 1:
                                        req = _a.sent();
                                        return [4 /*yield*/, req.json()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })(),
                    ])];
                case 1:
                    _a = _b.sent(), data = _a[0], authors = _a[1];
                    render();
                    return [2 /*return*/];
            }
        });
    });
}
init();
function render() {
    var existing = document.getElementById('packList');
    if (existing)
        existing.remove();
    var filtered = data;
    var table = document.createElement('table');
    table.id = 'packList';
    var headers = document.createElement('tr');
    for (var _i = 0, _a = ['Pack', 'Character', 'Type', 'By']; _i < _a.length; _i++) {
        var header = _a[_i];
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(header));
        headers.appendChild(th);
    }
    table.appendChild(headers);
    for (var _b = 0, data_1 = data; _b < data_1.length; _b++) {
        var pack = data_1[_b];
        var row = document.createElement('tr');
        var nameCell = document.createElement('td');
        nameCell.appendChild(document.createTextNode(pack.name));
        row.appendChild(nameCell);
        var charCell = document.createElement('td');
        charCell.appendChild(document.createTextNode(pack.characters.join(', ')));
        row.appendChild(charCell);
        var typeCell = document.createElement('td');
        typeCell.appendChild(document.createTextNode(pack.kind.join(', ')));
        row.appendChild(typeCell);
        var byCell = document.createElement('td');
        row.appendChild(byCell);
        for (var _c = 0, _d = pack.authors; _c < _d.length; _c++) {
            var author = _d[_c];
            renderAuthor(byCell, author);
        }
        table.appendChild(row);
    }
    var contents = document.getElementById('contents');
    contents.appendChild(table);
}
var linkablePlatforms = [
    ['reddit', 'https://reddit.com/u/%1', 'reddit.png'],
    ['deviantart', 'https://www.deviantart.com/%1', 'deviantart.png'],
    ['twitter', 'https://twitter.com/%1', 'twitter.svg'],
    ['pixiv', 'https://www.pixiv.net/users/%1', 'pixiv.ico'],
    ['website', '%1', 'website.svg'],
];
var expandablePlatforms = [
    ['discord', 'discord.svg'],
];
function renderAuthor(parent, author) {
    var authorDiv = document.createElement('div');
    parent.appendChild(authorDiv);
    var authorJSON = authors[author];
    if (!authorJSON) {
        authorDiv.appendChild(document.createTextNode(author));
        return;
    }
    authorDiv.appendChild(document.createTextNode(authorJSON.currentName || author));
    /*

    for (const linkablePlatform of linkablePlatforms) {
        const value = authorJSON[linkablePlatform[0]];
        if (!value) continue;
        const link = document.createElement('a');
        link.href = linkablePlatform[1].replace('%1', value);
        const img = document.createElement('img');
        img.src = 'icons/' + linkablePlatform[2];
        img.height = 32;
        img.width = 32;
        img.title =
            linkablePlatform[0][0].toUpperCase() + linkablePlatform[0].slice(1);
        link.appendChild(img);
        authorDiv.appendChild(link);
    }
    */
}
