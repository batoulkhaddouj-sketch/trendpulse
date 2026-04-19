// #TASK4 - Batoul khaddouj

// =================== Raw Posts & Cleaning ===================
const rawPosts = [
  { id: "p1", author: "  Mira  ", content: "JS Arrays are amazing! #javascript #coding", likes: "120", shares: 18, comments: 40, createdAt: "2026-03-27T09:30:00Z" },
  { id: "p2", author: "rami", content: "  check this out #Coding  ", likes: 75, shares: "11", comments: "13", createdAt: "2026-03-28T06:10:00Z" },
  { id: "p3", author: "SARA", content: "", likes: "22", shares: 2, comments: 1, createdAt: "invalid-date" },
  { id: "p4", author: "leo", content: "Node + Date + Timers #nodejs #javascript", likes: "210", shares: "35", comments: 70, createdAt: "2026-03-28T08:50:00Z" },
  { id: "p5", author: "Mira", content: "  #coding tips for loops and conditions  ", likes: "95", shares: 20, comments: "25", createdAt: "2026-03-28T07:40:00Z" }
];

// 1. تنظيف البيانات وتوحيد الأنواع 
function normalizePost(post) {
  return {
    ...post,
    author: post.author.trim().toLowerCase(),
    content: post.content.trim().toLowerCase(),
    likes: Number(post.likes) || 0,
    shares: Number(post.shares) || 0,
    comments: Number(post.comments) || 0
  };
}

// 2. فحص الصلاحية 
function isPostValid(post) {
  if (!post.content) return { valid: false, reason: "محتوى فارغ" };
  if (post.createdAt === "invalid-date") return { valid: false, reason: "تاريخ خطأ" };
  return { valid: true };
}

// 3. معادلة التفاعل 
const getScore = (p) => (p.likes * 1) + (p.comments * 2) + (p.shares * 3);

// أسلوب Non-Mutating: بيخلق مصفوفة جديدة تماماً وبيترك الأصلية متل ما هي
function getSafeRankedFeed(posts) {
  return [...posts].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.id.localeCompare(b.id); 
  });
}

// 4. استخراج الهاشتاجات 
function getTopHashtags(posts, limit = 1) {
  const counts = {};
  posts.forEach(p => {
    const tags = p.content.match(/#\w+/g) || [];
    tags.forEach(t => counts[t] = (counts[t] || 0) + 1);
  });
  return Object.keys(counts)
    .map(t => ({ tag: t, count: counts[t] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// 5. نظام إدارة المنشورات 
const db = {
  add: (list, item) => list.push(item),
  delete: (list, id) => {
    const i = list.findIndex(p => p.id === id);
    if (i !== -1) list.splice(i, 1);
  },
  search: (list, term) => list.filter(p => p.content.includes(term.toLowerCase())),
  stats: (list) => ({
    count: list.length,
    avg: list.reduce((s, p) => s + p.score, 0) / list.length || 0
  })
};

// 6. تشغيل المسار بالكامل 
let validFeed = [];
let rejectedFeed = [];

rawPosts.forEach(raw => {
  const clean = normalizePost(raw);
  const check = isPostValid(clean);
  if (check.valid) {
    clean.score = getScore(clean);
    validFeed.push(clean);
  } else {
    rejectedFeed.push({ id: raw.id, reason: check.reason });
  }
});

// ترتيب الفيد 
const finalFeed = getSafeRankedFeed(validFeed);

// 7. تقرير الموديريشن 
function generateReport(valid, rejected) {
  const stats = db.stats(valid);
  const trend = getTopHashtags(valid, 1)[0]?.tag || "N/A";
  
  console.log(`--- TrendPulse Report ---`);
  console.log(`Accepted: ${valid.length} | Rejected: ${rejected.length}`);
  console.log(`Top Tag: ${trend} | Avg Score: ${stats.avg.toFixed(2)}`);
  console.log(`-------------------------`);
}

generateReport(validFeed, rejectedFeed);

// =================== Phase 2: Rich Post Model & Async ===================
const database = {
  p1: {
    id: "p1",
    author: { name: "Mira", email: "mira@trendpulse.dev", verified: true },
    content: "Meet @sara at the hub #js #async",
    engagement: { likes: 12, shares: 2, comments: 4 },
    createdAt: "2026-04-01T09:00:00.000Z"
  },
  p2: {
    id: "p2",
    author: { name: "Rami", email: "invalid-email", verified: false },
    content: "Checkout #node tutorials",
    engagement: { likes: 3 },
    createdAt: "2026-04-02T11:30:00.000Z"
  }
};

// 1) Rich Post Model
function describePostForUi(post) {
  const merged = { ...post, meta: { channel: "web" } };
  const { author: { name: authorName } = {} } = merged;
  return {

> Lily^_^:
title: merged.id,
    authorName,
    keysCount: Object.keys(merged).length
  };
}

// 2) Safe Nested Reads
function getEngagementTotals(post) {
  return {
    likes: post.engagement?.likes ?? 0,
    shares: post.engagement?.shares ?? 0,
    comments: post.engagement?.comments ?? 0
  };
}

// 3) Simulated Async Fetch
function fetchPostById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (database[id]) resolve({ ...database[id] });
      else reject("NOT_FOUND");
    }, 30);
  });
}

async function demoFetch() {
  try {
    const post = await fetchPostById("p1");
    console.log("Fetched:", post.id);
  } catch (e) {
    console.log("Error:", e);
  } finally {
    console.log("done");
  }
}

// 4) Regex Analysis: Email, Hashtags, Mentions
function analyzePostText(post) {
  const emailOk = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  const hashTag = /#[\w؀-ۿ]+/g;
  const mention = /@[\w]+/g;

  return {
    emailValid: emailOk.test(post.author?.email ?? ""),
    tags: post.content?.match(hashTag) || [],
    mentions: post.content?.match(mention) || []
  };
}

// 6) Date Format + Live Refresh Timer
function formatIsoDateOnly(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "invalid-date";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return ${yyyy}-${mm}-${dd};
}

function startRefreshDemo(onTick) {
  let n = 0;
  const id = setInterval(() => {
    n++;
    onTick(n);
    if (n >= 3) clearInterval(id);
  }, 200);
}

// 7) Final Orchestrator
async function runTrendPulsePhase2() {
  const ids = ["p1", "p2"];
  let loaded = 0;
  let validEmails = 0;
  let invalidAuthorId = null;
  const datesFormatted = [];

  for (const id of ids) {
    try {
      const post = await fetchPostById(id);
      loaded++;

      const analysis = analyzePostText(post);
      if (analysis.emailValid) validEmails++;
      else if (!invalidAuthorId) invalidAuthorId = id;

      datesFormatted.push(formatIsoDateOnly(post.createdAt));

      console.log(`Post ${id}:`, describePostForUi(post));
      console.log(`Engagement:`, getEngagementTotals(post));
      console.log(`Text Analysis:`, analysis);

    } catch (e) {
      console.log(`Post ${id} fetch error:`, e);
    }
  }

  return { loaded, validEmails, invalidAuthorId, datesFormatted };
}

// =================== Run Demo ===================
(async () => {
  console.log("=== Original Feed Phase ===");
  generateReport(validFeed, rejectedFeed);

  await demoFetch();

  console.log("=== Phase 2 Summary ===");
  const summary = await runTrendPulsePhase2();
  console.log(summary);

  console.log("Starting live refresh demo:");
  startRefreshDemo((tick) => console.log("Tick:", tick));
})();
