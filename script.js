"use strict";

const profile = {
  handle: "karashi",
  role: "security researcher",
  focus: ["memory forensics", "binary exploitation"],
  based_in: "Jakarta, ID",
  status: "available for CTF collabs",
  bio:
    "I pull binaries apart and put timelines back together. Most weeks I'm somewhere between a disassembler and a memory dump, chasing the difference between what a program says it does and what it actually did.",
};

const writeups = [
  {
    file: "itechnocup2026_penyisihan.md",
    title: "ITechnoCup 2026 CTF Penyisihan (Team BOEDOET AK DRAGON 47)",
    date: "2026-08-27",
    size: "22.6K",
    level: "crit",
    tags: ["forensics", "cryptography", "reverse-engineering", "pwn", "osint"],
    summary:
      "Full qualification writeup across five categories: unpacking layered ZIPs, cracking hash preimages in Merkle trees, reversing stripped PE keygen checks, exploiting range-check flaws to hijack function pointers, and tracing OSINT clues across social media, GitHub releases, and chemistry hints to identify a real-world venue.",
    href: "writeups/itechnocup2026.html",
  },
  {
    file: "code2026_penyisihan.md",
    title: "C.O.D.E Challenge 2026 CTF Penyisihan (Team D'Blanc)",
    date: "2026-09-19",
    size: "14.1K",
    level: "warn",
    tags: ["web-security", "misc", "forensics"],
    summary:
      "Partial qualification writeup (write-up tidak dikumpulkan, hanya setengah soal dikerjakan): JWT audience confusion untuk impersonasi identitas executive, reverse-engineering protokol C2 Ghost Agent untuk RCE berantai, polyglot JPEG+ZIP dan ZIP bertingkat untuk steganografi, dekripsi XOR berkunci SHA-256 pada dump memori forensik, dan pemulihan binary log biner wtmp/btmp.",
    href: "writeups/code2026.html",
  },
];

const awards = [
  {
    title: "1st Place Winner — Cyber Security Competition",
    subtitle: "High School Student Category",
    event: "ITechno Cup 2026, organized by HIMATIK, Politeknik Negeri Jakarta",
    date: "August 17 – September 29, 2026",
    team: "BOEDOET AK DRAGON 47 — Raka Wirya Kusuma, Hans Nathanael Kusuma, Rifqi Al Muzhaky",
    certNo: "1701/PL3.13/SRt/ITECHNO CUP/HIMATIK PNJ/IX/2026",
    cert: "writeups/img/awards/itechnocup2026-certificate.jpg",
    gallery: [
      "writeups/img/awards/itechnocup2026-doc-1.jpg",
      "writeups/img/awards/itechnocup2026-team-photo.jpg",
    ],
  },
];

const tools = [
  { name: "python", category: "lang", weight: 3 },
  { name: "c", category: "lang", weight: 2 },
  { name: "x86 / arm asm", category: "lang", weight: 2 },
  { name: "bash", category: "lang", weight: 3 },
  { name: "ghidra", category: "static", weight: 3 },
  { name: "ida free", category: "static", weight: 2 },
  { name: "binary ninja", category: "static", weight: 1 },
  { name: "gdb + pwndbg", category: "dynamic", weight: 3 },
  { name: "volatility 3", category: "dynamic", weight: 3 },
  { name: "autopsy", category: "dynamic", weight: 2 },
  { name: "wireshark", category: "network", weight: 3 },
  { name: "yara", category: "network", weight: 2 },
  { name: "docker", category: "os", weight: 2 },
  { name: "arch linux", category: "os", weight: 3 },
];

const timeline = [
  { date: "2026-08-27", text: "Advanced to the Finals ITechnoCup 2026 CTF, playing with team BOEDOET AK DRAGON 47" },
  { date: "2026-09-19", text: "Top 1 kategori SMA/K di C.O.D.E Challenge 2026 CTF Penyisihan, playing with team D'Blanc (KiiOrg: First Blood Cryptography Wave 1 & 2; karashi: First Blood Forensic)" },
  { date: "2026-09-29", text: "1st Place - Cyber Security Competition | ITechno Cup 2026, playing with team BOEDOET AK DRAGON 47" },
];

const CATEGORY_LABEL = {
  lang: "languages",
  static: "static analysis",
  dynamic: "dynamic analysis",
  network: "network / detection",
  os: "systems",
};



function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child) node.appendChild(child);
  }
  return node;
}

function mount(parent, ...children) {
  for (const c of children) parent.appendChild(c);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealOnScroll(root) {
  const targets = root.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter() {
  return Math.random() * 14;
}



async function typeLines(container, lines, speedMs = 18) {
  const reduced = prefersReducedMotion();

  for (const line of lines) {
    const row = document.createElement("div");
    row.className = `term-line ${line.className ?? ""}`;
    container.appendChild(row);

    if (line.prompt) {
      const p = document.createElement("span");
      p.className = "term-prompt";
      p.textContent = line.prompt + " ";
      row.appendChild(p);
    }

    const textSpan = document.createElement("span");
    row.appendChild(textSpan);

    if (reduced) {
      textSpan.textContent = line.text;
    } else {
      for (const ch of line.text) {
        textSpan.textContent += ch;
        await sleep(speedMs + jitter());
      }
    }

    if (line.pauseAfter && !reduced) {
      await sleep(line.pauseAfter);
    }
  }

  const cursor = document.createElement("span");
  cursor.className = "term-cursor";
  cursor.setAttribute("aria-hidden", "true");
  container.appendChild(cursor);
}



const HEX_COLS = 8;
const HEX_ROWS = 12;

function randomByte() {
  return Math.floor(Math.random() * 256);
}

function toHex(n) {
  return n.toString(16).padStart(2, "0");
}

function toAscii(n) {
  return n >= 32 && n <= 126 ? String.fromCharCode(n) : "\u00b7";
}

function mountHexDump(host, baseOffset = 0x1a40) {
  const table = Array.from({ length: HEX_ROWS }, () =>
    Array.from({ length: HEX_COLS }, randomByte)
  );

  const rows = [];
  const wrap = el("div", { class: "hexdump", attrs: { "aria-hidden": "true" } });

  for (let r = 0; r < HEX_ROWS; r++) {
    const offsetEl = el("span", {
      class: "hex-offset",
      text: (baseOffset + r * HEX_COLS).toString(16).padStart(8, "0"),
    });

    const byteEls = table[r].map((b) => el("span", { class: "hex-byte", text: toHex(b) }));

    const asciiEl = el("span", { class: "hex-ascii", text: table[r].map(toAscii).join("") });

    const row = el("div", { class: "hex-row" }, [
      offsetEl,
      el("span", { class: "hex-bytes" }, byteEls),
      asciiEl,
    ]);

    rows.push({ byteEls, asciiEl });
    wrap.appendChild(row);
  }

  host.appendChild(wrap);

  if (prefersReducedMotion()) return;

  window.setInterval(() => {
    const r = Math.floor(Math.random() * HEX_ROWS);
    const c = Math.floor(Math.random() * HEX_COLS);
    const nb = randomByte();
    table[r][c] = nb;

    const cell = rows[r].byteEls[c];
    cell.textContent = toHex(nb);
    cell.classList.add("hex-flag");
    window.setTimeout(() => cell.classList.remove("hex-flag"), 900);

    rows[r].asciiEl.textContent = table[r].map(toAscii).join("");
  }, 420);
}



function renderNav() {
  const dots = el("span", { class: "term-dots" }, [
    el("span", { class: "dot dot-r" }),
    el("span", { class: "dot dot-y" }),
    el("span", { class: "dot dot-g" }),
  ]);

  const links = ["case-files", "awards", "toolset", "log", "about"].map((id) =>
    el("a", { class: "nav-link", text: `./${id}`, attrs: { href: `#${id}` } })
  );

  return el("header", { class: "titlebar" }, [
    el("div", { class: "titlebar-left" }, [
      dots,
      el("span", { class: "titlebar-path", text: `~/${profile.handle} --zsh` }),
    ]),
    el("nav", { class: "nav" }, links),
  ]);
}

function renderHero() {
  const left = el("div", { class: "hero-term" }, [
    el("div", { class: "hero-term-body", attrs: { id: "hero-type" } }),
  ]);

  const hexHost = el("div", { class: "hero-hex" });

  const hero = el("section", { class: "hero" }, [
    left,
    el("div", { class: "hero-hex-frame" }, [
      el("div", { class: "hex-frame-title", text: "core.dmp --live" }),
      hexHost,
    ]),
  ]);

  queueMicrotask(() => {
    mountHexDump(hexHost);
    const target = document.getElementById("hero-type");
    if (target) {
      void typeLines(target, [
        { prompt: "$", text: "whoami" },
        { prompt: ">", text: profile.handle, className: "term-out", pauseAfter: 250 },
        { prompt: "$", text: "cat role.txt" },
        {
          prompt: ">",
          text: `${profile.role} — ${profile.focus.join(" · ")}`,
          className: "term-out",
          pauseAfter: 250,
        },
        { prompt: "$", text: "./whoami.sh --verbose" },
        { prompt: ">", text: profile.bio, className: "term-out term-bio" },
      ]);
    }
  });

  return hero;
}

function levelLabel(level) {
  return level === "crit" ? "CRIT" : level === "warn" ? "WARN" : "INFO";
}

function renderWriteups() {
  const rows = writeups.map((w, i) =>
    el(
      "article",
      {
        class: "case-card",
        attrs: { "data-reveal": "", style: `transition-delay:${(i % 3) * 70}ms` },
      },
      [
        el("div", { class: "case-titlebar" }, [
          el("span", { class: "term-dots small" }, [
            el("span", { class: "dot dot-r" }),
            el("span", { class: "dot dot-y" }),
            el("span", { class: "dot dot-g" }),
          ]),
          el("span", { class: "case-file", text: w.file }),
          el("span", { class: `level level-${w.level}`, text: levelLabel(w.level) }),
        ]),
        el("div", { class: "case-body" }, [
          el("h3", { class: "case-title", text: w.title }),
          el("div", { class: "case-meta" }, [
            el("span", { text: w.date }),
            el("span", { class: "meta-dim", text: w.size }),
          ]),
          el("p", { class: "case-summary", text: w.summary }),
          el(
            "div",
            { class: "case-tags" },
            w.tags.map((t) => el("span", { class: "tag", text: `#${t}` }))
          ),
          el("a", { class: "case-link", text: "read writeup →", attrs: { href: w.href } }),
        ]),
      ]
    )
  );

  return el("section", { class: "section", attrs: { id: "case-files" } }, [
    el("div", { class: "section-head" }, [
      el("span", { class: "section-prompt", text: "$ ls -la ./writeups" }),
      el("h2", { class: "section-title", text: "case files" }),
    ]),
    el("div", { class: "case-grid" }, rows),
  ]);
}

let lightboxEl = null;
let lightboxState = { images: [], index: 0 };

function ensureLightbox() {
  if (lightboxEl) return lightboxEl;

  const imgEl = el("img", { class: "lightbox-img", attrs: { alt: "" } });
  const captionEl = el("div", { class: "lightbox-caption" });
  const closeBtn = el("button", { class: "lightbox-close", text: "✕", attrs: { "aria-label": "close" } });
  const prevBtn = el("button", { class: "lightbox-nav lightbox-prev", text: "‹", attrs: { "aria-label": "previous" } });
  const nextBtn = el("button", { class: "lightbox-nav lightbox-next", text: "›", attrs: { "aria-label": "next" } });

  const overlay = el("div", { class: "lightbox-overlay", attrs: { role: "dialog", "aria-modal": "true" } }, [
    closeBtn,
    prevBtn,
    el("div", { class: "lightbox-stage" }, [imgEl, captionEl]),
    nextBtn,
  ]);

  function update() {
    const { images, index } = lightboxState;
    const item = images[index];
    imgEl.src = item.src;
    imgEl.alt = item.alt ?? "";
    captionEl.textContent = item.caption ?? "";
    const multi = images.length > 1;
    prevBtn.style.display = multi ? "" : "none";
    nextBtn.style.display = multi ? "" : "none";
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("lightbox-locked");
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  prevBtn.addEventListener("click", () => {
    lightboxState.index = (lightboxState.index - 1 + lightboxState.images.length) % lightboxState.images.length;
    update();
  });
  nextBtn.addEventListener("click", () => {
    lightboxState.index = (lightboxState.index + 1) % lightboxState.images.length;
    update();
  });
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  });

  overlay._update = update;
  document.body.appendChild(overlay);
  lightboxEl = overlay;
  return overlay;
}

function openLightbox(images, startIndex = 0) {
  const overlay = ensureLightbox();
  lightboxState = { images, index: startIndex };
  overlay._update();
  overlay.classList.add("is-open");
  document.body.classList.add("lightbox-locked");
}

function renderAwards() {
  const cards = awards.map((a, i) => {
    const images = [
      { src: a.cert, alt: `Certificate — ${a.title}`, caption: `Certificate — ${a.title}` },
      ...a.gallery.map((src) => ({ src, alt: `Dokumentasi — ${a.event}`, caption: `Dokumentasi — ${a.event}` })),
    ];

    const certImg = el("img", {
      attrs: { src: a.cert, alt: `Certificate — ${a.title}, ${a.event}`, loading: "lazy" },
    });

    const media = el(
      "button",
      { class: "award-media", attrs: { type: "button", "aria-label": "Lihat dokumentasi" } },
      [certImg, el("span", { class: "award-media-hint", text: "lihat dokumentasi →" })]
    );
    media.addEventListener("click", () => openLightbox(images, 0));

    return el(
      "article",
      { class: "award-card", attrs: { "data-reveal": "", style: `transition-delay:${(i % 3) * 70}ms` } },
      [
        media,
        el("div", { class: "award-body" }, [
          el("h3", { class: "award-title", text: a.title }),
          el("div", { class: "award-subtitle", text: a.subtitle }),
          el("div", { class: "award-meta" }, [
            el("span", { text: a.event }),
            el("span", { class: "meta-dim", text: a.date }),
          ]),
          el("div", { class: "award-team", text: a.team }),
          el("div", { class: "award-certno", text: `cert no. ${a.certNo}` }),
        ]),
      ]
    );
  });

  return el("section", { class: "section", attrs: { id: "awards" } }, [
    el("div", { class: "section-head" }, [
      el("span", { class: "section-prompt", text: "$ ls -la ./awards" }),
      el("h2", { class: "section-title", text: "awards" }),
    ]),
    el("div", { class: "award-grid" }, cards),
  ]);
}

function renderToolset() {
  const byCategory = new Map();
  for (const t of tools) {
    const list = byCategory.get(t.category) ?? [];
    list.push(t);
    byCategory.set(t.category, list);
  }

  const groups = Array.from(byCategory.entries()).map(([cat, list]) =>
    el("div", { class: "tool-group", attrs: { "data-reveal": "" } }, [
      el("div", { class: "tool-group-label", text: CATEGORY_LABEL[cat] }),
      el(
        "ul",
        { class: "tool-list" },
        list.map((t) =>
          el("li", { class: "tool-row" }, [
            el("span", { class: "tool-name", text: t.name }),
            el("span", {
              class: "tool-meter",
              attrs: { "aria-label": `proficiency ${t.weight} of 3` },
              text: "●".repeat(t.weight) + "○".repeat(3 - t.weight),
            }),
          ])
        )
      ),
    ])
  );

  return el("section", { class: "section", attrs: { id: "toolset" } }, [
    el("div", { class: "section-head" }, [
      el("span", { class: "section-prompt", text: "$ which --all" }),
      el("h2", { class: "section-title", text: "toolset" }),
    ]),
    el("div", { class: "tool-grid" }, groups),
  ]);
}

function renderLog() {
  const lines = timeline.map((t) =>
    el("li", { class: "log-line", attrs: { "data-reveal": "" } }, [
      el("span", { class: "log-date", text: `[${t.date}]` }),
      el("span", { class: "log-text", text: t.text }),
    ])
  );

  return el("section", { class: "section", attrs: { id: "log" } }, [
    el("div", { class: "section-head" }, [
      el("span", { class: "section-prompt", text: "$ tail -f ./activity.log" }),
      el("h2", { class: "section-title", text: "recent log" }),
    ]),
    el("ul", { class: "log-list" }, lines),
  ]);
}

function renderAbout() {
  const json = el("pre", { class: "json-block" }, [
    el("code", {
      html:
        `{\n` +
        `  <span class="json-key">"handle"</span>: <span class="json-str">"${profile.handle}"</span>,\n` +
        `  <span class="json-key">"role"</span>: <span class="json-str">"${profile.role}"</span>,\n` +
        `  <span class="json-key">"focus"</span>: [\n` +
        profile.focus.map((f) => `    <span class="json-str">"${f}"</span>`).join(",\n") +
        `\n  ],\n` +
        `  <span class="json-key">"based_in"</span>: <span class="json-str">"${profile.based_in}"</span>,\n` +
        `  <span class="json-key">"status"</span>: <span class="json-str">"${profile.status}"</span>\n` +
        `}`,
    }),
  ]);

  return el("section", { class: "section", attrs: { id: "about" } }, [
    el("div", { class: "section-head" }, [
      el("span", { class: "section-prompt", text: "$ cat profile.json | jq ." }),
      el("h2", { class: "section-title", text: "about" }),
    ]),
    el("div", { class: "about-grid" }, [
      el("div", { class: "about-window", attrs: { "data-reveal": "" } }, [
        el("div", { class: "case-titlebar" }, [
          el("span", { class: "term-dots small" }, [
            el("span", { class: "dot dot-r" }),
            el("span", { class: "dot dot-y" }),
            el("span", { class: "dot dot-g" }),
          ]),
          el("span", { class: "case-file", text: "profile.json" }),
        ]),
        json,
      ]),
      el("p", { class: "about-text", text: profile.bio, attrs: { "data-reveal": "" } }),
    ]),
  ]);
}

function renderFooter() {
  const links = [
    { label: "github", href: "https://github.com/sinsrakzz" },
    { label: "linkedin", href: "https://www.linkedin.com/in/sinsrakzz/" },
  ];

  return el("footer", { class: "footer" }, [
    el("div", { class: "footer-links" }, links.map((l) => el("a", { text: l.label, attrs: { href: l.href } }))),
    el("div", { class: "footer-prompt" }, [
      el("span", { class: "term-prompt", text: `root@${profile.handle}:~$` }),
      el("span", { class: "term-cursor", attrs: { "aria-hidden": "true" } }),
    ]),
    el("div", {
      class: "footer-meta",
      text: `© 2026 ${profile.handle}. built with plain html, css & javascript.`,
    }),
  ]);
}



function main() {
  const root = document.getElementById("app");
  if (!root) return;

  mount(
    root,
    renderNav(),
    renderHero(),
    renderWriteups(),
    renderAwards(),
    renderToolset(),
    renderLog(),
    renderAbout(),
    renderFooter()
  );

  revealOnScroll(root);
}

document.addEventListener("DOMContentLoaded", main);
