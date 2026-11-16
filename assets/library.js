(function(){
  const SHELVES = {
    "Memoir & fiction": ["var(--tenmoku)", "var(--paper)"],
    "Ecology & place":  ["var(--sea)",     "var(--paper)"],
    "Philosophy":       ["var(--ink)",     "var(--paper)"],
    "Minds & math":     ["var(--celadon)", "var(--ink)"],
    "Advice":           ["var(--shino)",   "var(--ink)"]
  };

  // short name printed on the spine, now = currently reading
const BOOKS = [
    {t:"Stay True", a:"Hua Hsu", s:"Hsu", cat:"Memoir & fiction", note:"A memoir of a college friendship at Berkeley in the ’90s, and of the grief after it was cut short."},
    {t:"The Metamorphosis", a:"Franz Kafka", s:"Kafka", cat:"Memoir & fiction", note:"A salesman wakes up as an insect, and his family’s patience turns out to have limits. Alienation, duty and work."},
    {t:"Crying in H Mart", a:"Michelle Zauner", s:"Zauner", cat:"Memoir & fiction", note:"Losing a mother, and finding her again through Korean food, language and memory."},
    {t:"The Uninhabitable Earth", a:"David Wallace-Wells", s:"Wallace-Wells", cat:"Ecology & place", now:true, note:"A clear-eyed survey of what warming could mean for heat, food, water and economies if we don’t change course."},
    {t:"Being Ecological", a:"Timothy Morton", s:"Morton", cat:"Ecology & place", note:"An argument that we’re already ecological, and that thinking this way needn’t start from guilt."},
    {t:"The Atlas of Vanishing Places", a:"Travis Elborough", s:"Elborough", cat:"Ecology & place", note:"Places that are disappearing, or already gone, told through their geography and history."},
    {t:"The Silk Roads", a:"Peter Frankopan", s:"Frankopan", cat:"Ecology & place", note:"World history retold from the trade routes that linked east and west."},
    {t:"Climate Optimism", a:"Zahra Biabani", s:"Biabani", cat:"Ecology & place", note:"Stories of climate progress around the world, as a counterweight to doom."},
    {t:"The Ethics of Ambiguity", a:"Simone de Beauvoir", s:"de Beauvoir", cat:"Philosophy", now:true, note:"Existentialist ethics: freedom isn’t a solo project, because willing yourself free means willing others free too."},
    {t:"A Philosophy of Walking", a:"Frédéric Gros", s:"Gros", cat:"Philosophy", note:"Walking as a way of thinking, through Nietzsche, Rousseau, Thoreau and others who did their best work on foot."},
    {t:"Think", a:"Simon Blackburn", s:"Blackburn", cat:"Philosophy", note:"A friendly tour of philosophy’s big questions: knowledge, mind, free will, God and the good."},
    {t:"The Myth of Sisyphus", a:"Albert Camus", s:"Camus", cat:"Philosophy", note:"On living with the absurd, and finding meaning in the effort itself."},
    {t:"Field Experiments", a:"Alan S. Gerber & Donald P. Green", s:"Gerber & Green", cat:"Minds & math", now:true, note:"How to design, analyze and interpret randomized experiments in the real world."},
    {t:"Algorithms to Live By", a:"Brian Christian & Tom Griffiths", s:"Christian", cat:"Minds & math", note:"Computer science ideas like optimal stopping and explore/exploit, applied to everyday decisions."},
    {t:"Gödel, Escher, Bach", a:"Douglas Hofstadter", s:"Hofstadter", cat:"Minds & math", note:"Self-reference in math, art and music, and how minds might emerge from formal systems."},
    {t:"Weapons of Math Destruction", a:"Cathy O’Neil", s:"O’Neil", cat:"Minds & math", note:"How opaque, large-scale algorithms can quietly reinforce inequality."},
    {t:"The Art of Statistics", a:"David Spiegelhalter", s:"Spiegelhalter", cat:"Minds & math", note:"Learning from data through real questions, with the reasoning put ahead of the formulas."},
    {t:"The Signal and the Noise", a:"Nate Silver", s:"Silver", cat:"Minds & math", note:"Why most predictions fail, and what separates good forecasters, from weather to elections."},
    {t:"Naked Statistics", a:"Charles Wheelan", s:"Wheelan", cat:"Minds & math", note:"The core ideas of statistics, explained with plain language and humor."},
    {t:"Race After Technology", a:"Ruha Benjamin", s:"Benjamin", cat:"Minds & math", note:"How supposedly neutral technologies can encode and extend racial bias."},
    {t:"Principles", a:"Ray Dalio", s:"Dalio", cat:"Advice", note:"Dalio’s operating rules for decisions, work and teams."},
    {t:"Ikigai", a:"Héctor García & Francesc Miralles", s:"García", cat:"Advice", note:"The Japanese idea of a reason for being, drawn from long-lived communities in Okinawa."},
    {t:"Tiny Experiments", a:"Anne-Laure Le Cunff", s:"Le Cunff", cat:"Advice", note:"Treating goals as small experiments rather than rigid plans."}
  ];

  const $ = id => document.getElementById(id);
  const filtersEl = $("lib-filters"), spinesEl = $("lib-spines"), wrap = $("lib-wrap");
  const idxEl = $("lib-idx"), bodyEl = $("lib-body");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let filter = "all", current = BOOKS.findIndex(b => b.now);
  if (current < 0) current = 0;

  const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const visible = b => filter === "all" || (filter === "now" ? !!b.now : b.cat === filter);
  const visibleIdx = () => BOOKS.map((b, i) => visible(b) ? i : -1).filter(i => i >= 0);

  // Filters
  const opts = [["all", "All", null, BOOKS.length],
    ...Object.keys(SHELVES).map(k => [k, k, SHELVES[k][0], BOOKS.filter(b => b.cat === k).length]),
    ["now", "Reading now", "var(--iron)", BOOKS.filter(b => b.now).length]];
  opts.forEach(([key, label, color, n]) => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "filter"; btn.dataset.key = key;
    btn.setAttribute("aria-pressed", key === filter);
    btn.innerHTML = (color ? `<span class="sw" style="--c:${color}"></span>` : "") + `${esc(label)} <span class="c">${n}</span>`;
    btn.addEventListener("click", () => setFilter(key));
    filtersEl.appendChild(btn);
  });

  const spines = BOOKS.map((b, i) => {
    const el = document.createElement("button");
    el.type = "button"; el.className = "spine";
    const [c, t] = SHELVES[b.cat];
    const h = Math.min(320, Math.max(228 + ((i * 37) % 5) * 16, b.t.length * 8.4 + 100));
    const w = 42 + Math.min(b.t.length, 26) * 0.9;
    el.style.cssText = `--h:${h}px;--w:${w}px;--c:${c};--t:${t}`;
    if (b.now) el.dataset.now = "";
    el.setAttribute("aria-label", `${b.t} by ${b.a}${b.now ? ", reading now" : ""}`);
    el.innerHTML = `<span class="s-title">${esc(b.t)}</span><span class="s-auth">${esc(b.s)}</span>`;
    el.addEventListener("click", () => select(i));
    el.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault(); step(e.key === "ArrowRight" ? 1 : -1, true);
    });
    spinesEl.appendChild(el);
    return el;
  });

  function setFilter(key){
    filter = key;
    filtersEl.querySelectorAll(".filter").forEach(f => f.setAttribute("aria-pressed", f.dataset.key === key));
    BOOKS.forEach((b, i) => {
      const on = visible(b);
      spines[i].classList.toggle("is-dim", !on);
      spines[i].tabIndex = on ? 0 : -1;
    });
    if (!visible(BOOKS[current])) select(visibleIdx()[0]); else render(false);
  }

  function select(i, focus){
    current = i;
    spines.forEach((s, j) => s.setAttribute("aria-pressed", j === i));
    const el = spines[i];
    wrap.scrollTo({left: el.offsetLeft - wrap.clientWidth / 2 + el.offsetWidth / 2, behavior: reduce ? "auto" : "smooth"});
    if (focus) el.focus({preventScroll: true});
    render(true);
  }

  function step(dir, focus){
    const v = visibleIdx(), pos = v.indexOf(current);
    select(v[(pos + dir + v.length) % v.length], focus);
  }

  function render(animate){
    const b = BOOKS[current], v = visibleIdx(), pos = v.indexOf(current) + 1;
    idxEl.innerHTML = `${String(pos).padStart(2, "0")}<small>of ${v.length}</small>`;
    bodyEl.innerHTML =
      `<p class="book-cat"><span class="sw" style="--c:${SHELVES[b.cat][0]}"></span>${esc(b.cat)}${b.now ? ' <span class="now">· Reading now</span>' : ""}</p>` +
      `<h3 class="book-title">${esc(b.t)}</h3>` +
      `<p class="book-auth">${esc(b.a)}</p>` +
      `<p class="book-note">${esc(b.note)}</p>`;
    if (animate){ bodyEl.classList.remove("swap"); void bodyEl.offsetWidth; bodyEl.classList.add("swap"); }
  }

  $("lib-prev").addEventListener("click", () => step(-1));
  $("lib-next").addEventListener("click", () => step(1));
  $("lib-pick").addEventListener("click", () => {
    const v = visibleIdx().filter(i => i !== current);
    if (v.length) select(v[Math.floor(Math.random() * v.length)]);
  });

  setFilter("all");
  spines.forEach((s, j) => s.setAttribute("aria-pressed", j === current));
  requestAnimationFrame(() => { const el = spines[current]; wrap.scrollLeft = el.offsetLeft - wrap.clientWidth / 2 + el.offsetWidth / 2; });
})();
