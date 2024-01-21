let isBoldApplied = false;

function toggleBoldFirstPartOfWords() {
    function processTextNode(node) {
        let words = node.textContent.split(/\s+/);
        let processedText = words.map(word => {
            const boldLength = Math.max(2, Math.ceil(word.length * 0.2));
            return `<span style="font-weight: bold;">${word.substring(0, boldLength)}</span><span style="font-weight: 300">${word.substring(boldLength)}</span>`;
        }).join(' ');

        let span = document.createElement('span');
        span.innerHTML = processedText; // this is safe since the content is from the webpage itself
        span.classList.add("bionic-ff-plugin");
        node.parentNode.replaceChild(span, node);
    }

    function walkTheDOM(node, func) {
        if (node.nodeType === 3 && node.textContent.trim() !== '') { // Text node
            func(node);
        } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") { // Element node, skip SCRIPT and STYLE tags
            Array.from(node.childNodes).forEach(child => walkTheDOM(child, func));
        }
    }

    function applyStyles() {
        walkTheDOM(document.body, processTextNode);
    }

    function removeStyles() {
        document.querySelectorAll('.bionic-ff-plugin').forEach(span => {
            let newText = span.textContent;
            let newTextNode = document.createTextNode(newText);
            span.parentNode.replaceChild(newTextNode, span);
        });
    }

    if (!isBoldApplied) {
        applyStyles();
        isBoldApplied = true;
    } else {
        removeStyles();
        isBoldApplied = false;
    }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleBold") {
    toggleBoldFirstPartOfWords();
    sendResponse({ isBoldEnabled: isBoldApplied });
  }
});
