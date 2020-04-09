var allowedTags = [
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
];
var allowedAttributes = {
    a: ['href'],
    img: ['src']
};
var schemaLimitedAttributes = ['href', 'src'];
var allowedSchemas = ['http', 'https'];
var enforceAttributes = {
    a: {
        target: '_blank',
        rel: 'noopener noreferrer'
    }
};
export function sanitize(html) {
    var retDoc = document.createElement('div');
    var doc = document.createElement('div');
    doc.innerHTML = html;
    for (var _i = 0, _a = Array.from(doc.childNodes); _i < _a.length; _i++) {
        var node = _a[_i];
        for (var _b = 0, _c = sanitizeElement(node); _b < _c.length; _b++) {
            var sanitizedNode = _c[_b];
            retDoc.appendChild(sanitizedNode);
        }
    }
    return retDoc.innerHTML;
}
var protocolMatcher = /^(\w+):/;
function sanitizeElement(node) {
    if (node.nodeType !== Node.ELEMENT_NODE)
        return [node];
    var el = node;
    var ret = [];
    var tagName = el.tagName.toLowerCase();
    if (allowedTags.includes(tagName)) {
        ret.push(el);
        var attrs = Array.prototype.slice.call(el.attributes);
        var allowedAttrs = allowedAttributes[tagName] || [];
        for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
            var attr = attrs_1[_i];
            if (!allowedAttrs.includes(attr.name)) {
                el.removeAttribute(attr.name);
            }
            else if (schemaLimitedAttributes.includes(attr.name)) {
                var protocolMatch = attr.value.match(protocolMatcher);
                if (protocolMatch && !allowedSchemas.includes(protocolMatch[1])) {
                    el.removeAttribute(attr.name);
                }
            }
        }
        var enforce = enforceAttributes[tagName];
        if (enforce) {
            for (var attrName in enforce) {
                if (!enforce.hasOwnProperty(attrName))
                    continue;
                el.setAttribute(attrName, enforce[attrName]);
            }
        }
    }
    else {
        ret.push(document.createTextNode("<" + tagName + ">"));
        for (var _a = 0, _b = el.childNodes; _a < _b.length; _a++) {
            var subNode = _b[_a];
            ret = ret.concat(sanitizeElement(subNode));
        }
        ret.push(document.createTextNode("</" + tagName + ">"));
    }
    return ret;
}
