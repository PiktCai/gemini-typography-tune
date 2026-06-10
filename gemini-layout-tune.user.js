// ==UserScript==
// @name         Gemini Layout Tune for Chinese
// @namespace    https://github.com/PiktCai/ai-chat-typography-tune
// @version      0.1.0
// @description  Tune Gemini reading rhythm for Chinese without changing any font family.
// @author       local
// @match        https://gemini.google.com/*
// @match        https://bard.google.com/*
// @run-at       document-start
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_ID = "gemini-layout-tune-style";
  const DATA_ATTR = "data-gemini-layout-tune";
  const STORAGE_KEY = "geminiLayoutTuneMode";

  const MODES = {
    balanced: {
      label: "Balanced Layout",
      contentSize: "16.75px",
      lineHeight: "1.56",
      paragraphGap: "0",
      listGap: "0",
      maxMeasure: "42em",
    },
    editorial: {
      label: "Roomier Layout",
      contentSize: "17.5px",
      lineHeight: "1.62",
      paragraphGap: "0.08em",
      listGap: "0.03em",
      maxMeasure: "40em",
    },
    compact: {
      label: "Compact Layout",
      contentSize: "15.5px",
      lineHeight: "1.5",
      paragraphGap: "0",
      listGap: "0",
      maxMeasure: "44em",
    },
  };

  function safeGet(key, fallback) {
    try {
      return typeof GM_getValue === "function" ? GM_getValue(key, fallback) : localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      if (typeof GM_setValue === "function") {
        GM_setValue(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (_) {
      // Visual enhancement only. If storage is unavailable, keep the current page mode.
    }
  }

  function getModeName() {
    const stored = safeGet(STORAGE_KEY, "balanced");
    return MODES[stored] ? stored : "balanced";
  }

  function css(modeName) {
    const mode = MODES[modeName] || MODES.balanced;

    return `
      :root {
        --glt-content-size: ${mode.contentSize};
        --glt-line-height: ${mode.lineHeight};
        --glt-paragraph-gap: ${mode.paragraphGap};
        --glt-list-gap: ${mode.listGap};
        --glt-max-measure: ${mode.maxMeasure};
        --glt-ink: light-dark(#202124, #eef0f3);
        --glt-muted: light-dark(#5f6368, #b8bec7);
      }

      body {
        letter-spacing: 0 !important;
        color: var(--glt-ink);
      }

      /* Gemini response text. No font-family rules in this experiment. */
      message-content,
      model-response,
      response-container,
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      .model-response-text,
      .response-container-content,
      .presented-response-container,
      .markdown,
      .markdown-main-panel,
      .ms-cmark-node,
      [data-response-index],
      [data-test-id*="response"],
      [data-test-id*="conversation-turn"] {
        font-size: var(--glt-content-size) !important;
        line-height: var(--glt-line-height) !important;
        letter-spacing: 0 !important;
        word-break: auto-phrase;
        overflow-wrap: anywhere;
      }

      message-content,
      model-response,
      response-container,
      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      .model-response-text,
      .response-container-content,
      .presented-response-container,
      .markdown,
      .markdown-main-panel,
      .ms-cmark-node {
        max-width: var(--glt-max-measure);
        width: min(100%, var(--glt-max-measure));
      }

      .math-inline,
      .math-inline *,
      .katex,
      .katex *,
      .katex-display,
      .katex-display * {
        letter-spacing: 0 !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      .math-inline,
      .katex,
      .katex-display {
        max-width: none !important;
      }

      message-content a[class*="source"],
      message-content a[class*="citation"],
      message-content a[class*="file"],
      message-content a[class*="chip"],
      message-content span[class*="source"],
      message-content span[class*="citation"],
      message-content span[class*="file"],
      message-content span[class*="chip"],
      message-content div[class*="source"],
      message-content div[class*="citation"],
      message-content div[class*="file"],
      message-content div[class*="chip"],
      .markdown-main-panel a[class*="source"],
      .markdown-main-panel a[class*="citation"],
      .markdown-main-panel a[class*="file"],
      .markdown-main-panel a[class*="chip"],
      .markdown-main-panel span[class*="source"],
      .markdown-main-panel span[class*="citation"],
      .markdown-main-panel span[class*="file"],
      .markdown-main-panel span[class*="chip"],
      .markdown-main-panel div[class*="source"],
      .markdown-main-panel div[class*="citation"],
      .markdown-main-panel div[class*="file"],
      .markdown-main-panel div[class*="chip"] {
        font-size: 14px !important;
        line-height: 1.28 !important;
        letter-spacing: 0 !important;
        max-width: none !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      message-content p,
      model-response p,
      .model-response-text p,
      .response-container-content p,
      .presented-response-container p,
      .markdown p,
      .markdown-main-panel p,
      .ms-cmark-node p {
        margin-block: 0 var(--glt-paragraph-gap) !important;
        line-height: var(--glt-line-height) !important;
      }

      .markdown-main-panel > p:last-child,
      message-content p:last-child,
      .model-response-text p:last-child {
        margin-block-end: 0 !important;
      }

      message-content h1,
      message-content h2,
      message-content h3,
      model-response h1,
      model-response h2,
      model-response h3,
      .presented-response-container h1,
      .presented-response-container h2,
      .presented-response-container h3,
      .markdown h1,
      .markdown h2,
      .markdown h3,
      .markdown-main-panel h1,
      .markdown-main-panel h2,
      .markdown-main-panel h3,
      .ms-cmark-node h1,
      .ms-cmark-node h2,
      .ms-cmark-node h3 {
        letter-spacing: 0 !important;
        line-height: 1.32 !important;
        margin-block: 0.78em 0.24em !important;
        color: var(--glt-ink) !important;
      }

      message-content h1,
      model-response h1,
      .presented-response-container h1,
      .markdown h1,
      .markdown-main-panel h1,
      .ms-cmark-node h1 {
        font-size: calc(var(--glt-content-size) * 1.44) !important;
      }

      message-content h2,
      model-response h2,
      .presented-response-container h2,
      .markdown h2,
      .markdown-main-panel h2,
      .ms-cmark-node h2 {
        font-size: calc(var(--glt-content-size) * 1.28) !important;
      }

      message-content h3,
      model-response h3,
      .presented-response-container h3,
      .markdown h3,
      .markdown-main-panel h3,
      .ms-cmark-node h3 {
        font-size: calc(var(--glt-content-size) * 1.13) !important;
      }

      message-content blockquote,
      model-response blockquote,
      .presented-response-container blockquote,
      .markdown blockquote,
      .markdown-main-panel blockquote,
      .ms-cmark-node blockquote {
        margin: 0.45em 0 0.5em !important;
        padding: 0.08em 0 0.08em 1em !important;
        border-inline-start: 3px solid color-mix(in srgb, var(--glt-muted), transparent 38%) !important;
        color: var(--glt-muted) !important;
      }

      .markdown-main-panel :not(pre) > code,
      message-content :not(pre) > code {
        letter-spacing: 0 !important;
      }

      .markdown-main-panel :not(pre) > code,
      message-content :not(pre) > code {
        border-radius: 5px !important;
        padding: 0.08em 0.34em !important;
        font-size: 0.91em !important;
      }

      user-query,
      .user-query,
      .query-text,
      .query-text-line,
      [data-test-id*="user-query"],
      [data-test-id*="prompt-text"] {
        font-size: var(--glt-content-size) !important;
        line-height: 1.64 !important;
        letter-spacing: 0 !important;
      }

      .query-text,
      .query-text-line {
        text-wrap: pretty;
      }

      @supports not (word-break: auto-phrase) {
        message-content,
        model-response,
        response-container,
        user-query,
        .markdown,
        .markdown-main-panel,
        .ms-cmark-node {
          word-break: normal;
          overflow-wrap: break-word;
        }
      }

      @media (max-width: 720px) {
        :root {
          --glt-content-size: clamp(15.5px, 4.15vw, ${mode.contentSize});
          --glt-max-measure: 100%;
        }

        message-content,
        model-response,
        response-container,
        .model-response-text,
        .response-container-content,
        .presented-response-container,
        .markdown,
        .markdown-main-panel,
        .ms-cmark-node {
          line-height: 1.7 !important;
        }
      }
    `;
  }

  function applyStyle() {
    const modeName = getModeName();
    document.documentElement.setAttribute(DATA_ATTR, modeName);

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.type = "text/css";
      const target = document.head || document.documentElement;
      target.appendChild(style);
    }

    style.textContent = css(modeName);
  }

  function installMenu() {
    if (typeof GM_registerMenuCommand !== "function") return;

    Object.keys(MODES).forEach((modeName) => {
      GM_registerMenuCommand(`Gemini Layout: ${MODES[modeName].label}`, () => {
        safeSet(STORAGE_KEY, modeName);
        applyStyle();
      });
    });
  }

  applyStyle();
  installMenu();

  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) applyStyle();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
