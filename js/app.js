(function(){
  "use strict";
  var S = window.SITE;
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $$(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(t){ return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ---------- Theme ---------- */
  var root = document.documentElement, themeBtn = $("#themeBtn");
  function systemDark(){ return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; }
  function currentTheme(){ return root.getAttribute("data-theme") || (systemDark() ? "dark" : "light"); }
  function paintThemeBtn(){
    var dark = currentTheme() === "dark";
    themeBtn.textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  try { var saved = localStorage.getItem("ks-theme"); if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved); } catch (e) {}
  paintThemeBtn();
  themeBtn.addEventListener("click", function(){
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ks-theme", next); } catch (e) {}
    paintThemeBtn();
  });

  /* ---------- Navigation ---------- */
  var nav = $("#nav"), menu = $("#menu"), menuBtn = $("#menuBtn");
  function onScroll(){ nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  menuBtn.addEventListener("click", function(){
    var open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("a", menu).forEach(function(a){
    a.addEventListener("click", function(){ menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });
  });
  if ("IntersectionObserver" in window){
    var links = {};
    $$("a", menu).forEach(function(a){ links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          Object.keys(links).forEach(function(k){ links[k].removeAttribute("aria-current"); });
          if (links[en.target.id]) links[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(links).forEach(function(k){ var el = document.getElementById(k); if (el) io.observe(el); });
  }

  /* ---------- Placeholder drawings (shown until real screenshots are added) ---------- */
  function rng(seed){ var s = seed * 9301 + 49297; return function(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function drawing(tool, seed){
    var W = 240, H = 135, r = rng(seed), out = "", i, j;
    if (tool === "pbi"){
      var pts = [];
      for (i = 0; i < 8; i++){
        var h = 30 + r() * 62, x = 16 + i * 27;
        out += '<rect x="' + x + '" y="' + (H - 16 - h).toFixed(1) + '" width="16" height="' + h.toFixed(1) + '" fill="currentColor" opacity="' + (0.5 + r() * 0.4).toFixed(2) + '"/>';
        pts.push((x + 8) + "," + (H - 16 - h - 7 - r() * 9).toFixed(1));
      }
      out += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width="1.5"/>';
      out += '<line x1="8" y1="' + (H - 15) + '" x2="232" y2="' + (H - 15) + '" stroke="currentColor" stroke-opacity=".35"/>';
    } else if (tool === "py"){
      var y = 100, p = [];
      for (i = 0; i < 24; i++){
        y = Math.min(112, Math.max(22, y - 1.9 + (r() - 0.5) * 18));
        p.push((i * 10.4).toFixed(1) + "," + y.toFixed(1));
      }
      for (j = 1; j < 5; j++) out += '<line x1="0" y1="' + (j * 26) + '" x2="' + W + '" y2="' + (j * 26) + '" stroke="currentColor" stroke-opacity=".18"/>';
      out += '<polygon points="' + p.join(" ") + " " + W + "," + H + ' 0,' + H + '" fill="currentColor" opacity=".16"/>';
      out += '<polyline points="' + p.join(" ") + '" fill="none" stroke="currentColor" stroke-width="2"/>';
    } else if (tool === "sql"){
      out += '<rect x="14" y="16" width="212" height="14" fill="currentColor" opacity=".55"/>';
      for (i = 0; i < 6; i++){
        var yy = 40 + i * 14, a = 50 + r() * 30, b = 40 + r() * 40, c = 30 + r() * 30;
        out += '<rect x="14" y="' + yy + '" width="' + a.toFixed(1) + '" height="8" fill="currentColor" opacity=".22"/>';
        out += '<rect x="' + (22 + a).toFixed(1) + '" y="' + yy + '" width="' + b.toFixed(1) + '" height="8" fill="currentColor" opacity=".22"/>';
        out += '<rect x="' + (30 + a + b).toFixed(1) + '" y="' + yy + '" width="' + c.toFixed(1) + '" height="8" fill="currentColor" opacity=".22"/>';
      }
    } else {
      for (i = 0; i < 6; i++){
        for (j = 0; j < 8; j++){
          var on = i === 0 ? 0.4 : (r() > 0.78 ? 0.5 : 0);
          out += '<rect x="' + (12 + j * 27) + '" y="' + (14 + i * 18) + '" width="27" height="18" fill="' + (on ? "currentColor" : "none") + '" opacity="' + (on || 1) + '" stroke="currentColor" stroke-opacity=".3"/>';
        }
      }
    }
    return '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + out + "</svg>";
  }
  function thumb(tool, seed){ return '<span class="thumb">' + drawing(tool, seed) + "</span>"; }

  /* ---------- Finding the pictures and videos you add ---------- */
  function probeImage(src){
    return new Promise(function(res){ var i = new Image(); i.onload = function(){ res(true); }; i.onerror = function(){ res(false); }; i.src = src; });
  }
  function probeVideo(src){
    return new Promise(function(res){
      var v = document.createElement("video"), done = false;
      function fin(ok){ if (!done){ done = true; v.removeAttribute("src"); res(ok); } }
      v.preload = "metadata"; v.muted = true;
      v.onloadedmetadata = function(){ fin(true); };
      v.onerror = function(){ fin(false); };
      setTimeout(function(){ fin(false); }, 6000);
      v.src = src;
    });
  }
  function findImage(base){
    return probeImage(base + ".png").then(function(ok){
      if (ok) return base + ".png";
      return probeImage(base + ".jpg").then(function(ok2){ return ok2 ? base + ".jpg" : ""; });
    });
  }

  /* ---------- Avatar photo ---------- */
  findImage(S.photo).then(function(src){
    if (src) $("#avatar").innerHTML = '<img src="' + src + '" alt="Komal Sargar">';
  });

  /* ---------- Skills ---------- */
  $("#skills-grid").innerHTML = S.skills.map(function(g){
    return '<div class="skill"><h3>' + esc(g.title) + '</h3><ul class="meta">' +
      g.items.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
  }).join("");

  /* ---------- Projects ---------- */
  var grid = $("#projects-grid");
  grid.innerHTML = S.projects.map(function(p, i){
    var tool = S.toolNames[p.tool];
    return '<article class="pcard' + (p.featured ? " wide" : "") + '" data-tool="' + p.tool + '" data-i="' + i + '" style="--c:var(--' + p.tool + ')">' +
      '<button class="cover" type="button" data-open="' + i + '" aria-label="Open project: ' + esc(p.title) + '">' +
        '<span class="cover-media">' + thumb(p.tool, p.seed) + "</span>" +
        '<span class="badge">' + esc(tool) + (p.featured ? " &middot; Featured" : "") + "</span>" +
        '<span class="soon">Screenshot coming soon</span>' +
      "</button>" +
      '<div class="pbody"><h3>' + esc(p.title) + '</h3><p class="desc">' + esc(p.desc) + "</p>" +
        '<ul class="meta">' + p.stack.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<div class="prow"><button class="btn primary sm" type="button" data-open="' + i + '">View project</button>' +
        '<a class="btn sm" href="' + esc(p.github) + '" target="_blank" rel="noopener">GitHub</a></div></div>' +
    "</article>";
  }).join("");

  var cards = $$(".pcard", grid);
  var tools = [];
  S.projects.forEach(function(p){ if (tools.indexOf(p.tool) < 0) tools.push(p.tool); });
  var chipBox = $("#chips");
  chipBox.innerHTML = [["all", "All"]].concat(tools.map(function(k){ return [k, S.toolNames[k]]; })).map(function(x, i){
    var n = x[0] === "all" ? S.projects.length : S.projects.filter(function(p){ return p.tool === x[0]; }).length;
    return '<button class="chip" type="button" data-f="' + x[0] + '" aria-pressed="' + (i === 0) + '">' + esc(x[1]) + " " + n + "</button>";
  }).join("");
  chipBox.addEventListener("click", function(e){
    var b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", chipBox).forEach(function(c){ c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
    var want = b.getAttribute("data-f"), shown = 0;
    cards.forEach(function(c){
      var match = want === "all" || c.getAttribute("data-tool") === want;
      c.hidden = !match;
      c.classList.remove("pop");
      if (match){ c.style.setProperty("--n", shown++); void c.offsetWidth; c.classList.add("pop"); }
    });
  });

  /* Look for screenshots and videos, then show the first one on each card */
  S.projects.forEach(function(p, i){
    var base = "assets/projects/" + p.media;
    var imgPromises = [1, 2, 3, 4].map(function(k){ return findImage(base + "-" + k); });
    var vidPromise = probeVideo(base + "-demo.mp4").then(function(ok){ return ok ? base + "-demo.mp4" : ""; });
    Promise.all(imgPromises.concat([vidPromise])).then(function(found){
      p._video = found.pop();
      p._imgs = found.filter(Boolean);
      var card = cards[i], cover = $(".cover", card), media = $(".cover-media", cover);
      if (p._imgs.length){
        media.innerHTML = '<img src="' + p._imgs[0] + '" alt="' + esc(p.title) + ' screenshot" loading="lazy">';
      } else if (p._video){
        media.innerHTML = '<video src="' + p._video + '#t=0.1" muted playsinline preload="metadata"></video>';
      }
      if (p._imgs.length || p._video){
        var soon = $(".soon", cover); if (soon) soon.remove();
      }
      if (p._video){
        var play = document.createElement("span"); play.className = "play"; play.textContent = "Demo video";
        cover.appendChild(play);
      }
    });
  });

  /* ---------- Project viewer ---------- */
  var pv = $("#pv"), pvStage = $("#pvStage"), pvThumbs = $("#pvThumbs");
  var slides = [], slideIdx = 0, opener = null;

  function stopMedia(){ $$("video", pvStage).forEach(function(v){ v.pause(); }); }
  function showSlide(k){
    stopMedia();
    slideIdx = (k + slides.length) % slides.length;
    var s = slides[slideIdx];
    pvStage.innerHTML = s.type === "video"
      ? '<video src="' + s.src + '" controls playsinline preload="metadata"></video>'
      : '<img src="' + s.src + '" alt="' + esc(s.alt) + '">';
    if (slides.length > 1){
      pvStage.insertAdjacentHTML("beforeend",
        '<button class="nav-arrow prev" type="button" aria-label="Previous">&lsaquo;</button>' +
        '<button class="nav-arrow next" type="button" aria-label="Next">&rsaquo;</button>');
    }
    $$(".tbtn", pvThumbs).forEach(function(b, n){
      if (n === slideIdx) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
  }
  var SQLKW = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|INNER JOIN|ON|AS|AND|OR|CASE|WHEN|THEN|ELSE|END|OVER|PARTITION BY|LIMIT|WITH|DESC|ASC|DISTINCT|COUNT|SUM|AVG|ROUND|RANK|ROW_NUMBER|NOT|IN|IS|NULL)\b/g;
  function sqlHl(sql){
    return esc(sql).replace(SQLKW, '<b class="kw">$1</b>');
  }
  function openProject(i){
    var p = S.projects[i];
    pv.style.setProperty("--c", "var(--" + p.tool + ")");
    slides = [];
    if (p._video) slides.push({ type: "video", src: p._video, alt: p.title + " demo video" });
    (p._imgs || []).forEach(function(src, n){ slides.push({ type: "img", src: src, alt: p.title + " screenshot " + (n + 1) }); });

    $("#pvTag").textContent = S.toolNames[p.tool];
    $("#pvTitle").textContent = p.title;
    $("#pvDesc").textContent = p.desc;
    var extra = "";
    if (p.questions && p.questions.length){
      extra += '<div class="points"><h4>Business questions answered</h4><ul>' + p.questions.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
    }
    if (p.points.length){
      extra += '<div class="points"><h4>Key insights</h4><ul>' + p.points.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
    }
    if (p.queries && p.queries.length){
      extra += '<div class="points"><h4>Sample queries</h4>' + p.queries.map(function(q){
        return '<details class="qfig"><summary>' + esc(q.title) + '</summary><pre class="code"><code>' + sqlHl(q.sql) + "</code></pre>" + (q.img ? '<img class="qres" src="' + q.img + '" alt="Result of ' + esc(q.title) + '" loading="lazy">' : "") + "</details>";
      }).join("") + "</div>";
    }
    $("#pvPoints").innerHTML = extra;
    $("#pvStack").innerHTML = p.stack.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("");
    var git = $("#pvGit"); git.href = p.github; git.target = "_blank"; git.rel = "noopener";

    if (slides.length){
      pvThumbs.innerHTML = slides.length > 1 ? slides.map(function(s, n){
        return '<button class="tbtn" type="button" data-slide="' + n + '" aria-label="Show ' + (s.type === "video" ? "demo video" : "screenshot " + n) + '">' +
          (s.type === "video" ? '<video src="' + s.src + '#t=0.1" muted preload="metadata"></video><span class="tplay"><i class="ptri"></i></span>' : '<img src="' + s.src + '" alt="">') + "</button>";
      }).join("") : "";
      showSlide(0);
    } else {
      pvThumbs.innerHTML = "";
      pvStage.innerHTML = thumb(p.tool, p.seed) + '<div class="note">Screenshots and a demo video will appear here once they are added.</div>';
    }
    opener = document.activeElement;
    if (pv.showModal) pv.showModal(); else pv.setAttribute("open", "");
  }
  grid.addEventListener("click", function(e){
    var t = e.target.closest("[data-open]"); if (!t) return;
    openProject(+t.getAttribute("data-open"));
  });
  pvStage.addEventListener("click", function(e){
    if (e.target.closest(".prev")) showSlide(slideIdx - 1);
    else if (e.target.closest(".next")) showSlide(slideIdx + 1);
  });
  pvThumbs.addEventListener("click", function(e){
    var b = e.target.closest("[data-slide]"); if (b) showSlide(+b.getAttribute("data-slide"));
  });
  pv.addEventListener("keydown", function(e){
    if (slides.length < 2) return;
    if (e.key === "ArrowLeft") showSlide(slideIdx - 1);
    if (e.key === "ArrowRight") showSlide(slideIdx + 1);
  });

  /* ---------- Certificates ---------- */
  var certGrid = $("#cert-grid");
  function initials(issuer){ return esc(issuer.split(/[ ,]/)[0].slice(0, 2).toUpperCase()); }
  certGrid.innerHTML = S.certificates.map(function(c, i){
    return '<article class="ccard">' +
      '<button class="cimg" type="button" data-cert="' + i + '" aria-label="View certificate: ' + esc(c.name) + '">' +
        '<span class="cplace"><b>' + initials(c.issuer) + "</b>Certificate image coming soon</span>" +
      "</button>" +
      '<div class="cbody"><span class="cmeta">' + esc(c.issuer) + " &middot; " + esc(c.year) + "</span><h3>" + esc(c.name) + "</h3><p>" + esc(c.covers) + "</p></div>" +
    "</article>";
  }).join("");
  S.certificates.forEach(function(c, i){
    findImage(c.image).then(function(src){
      c._img = src;
      if (src) $$(".cimg", certGrid)[i].innerHTML = '<img src="' + src + '" alt="Certificate: ' + esc(c.name) + '" loading="lazy">';
    });
  });
  var cv = $("#cv");
  certGrid.addEventListener("click", function(e){
    var b = e.target.closest("[data-cert]"); if (!b) return;
    var c = S.certificates[+b.getAttribute("data-cert")];
    $("#cvTitle").textContent = c.name;
    $("#cvMeta").textContent = c.issuer + ", " + c.year;
    $("#cvCovers").textContent = c.covers;
    $("#cvStage").innerHTML = c._img
      ? '<img src="' + c._img + '" alt="Certificate: ' + esc(c.name) + '">'
      : '<span class="cplace"><b>' + initials(c.issuer) + "</b>Certificate image coming soon</span>";
    var v = $("#cvVerify");
    if (c.verify){ v.href = c.verify; v.target = "_blank"; v.rel = "noopener"; v.hidden = false; } else { v.hidden = true; }
    opener = document.activeElement;
    if (cv.showModal) cv.showModal(); else cv.setAttribute("open", "");
  });

  /* ---------- Closing the viewer windows ---------- */
  [pv, cv].forEach(function(d){
    d.addEventListener("click", function(e){ if (e.target === d || e.target.closest("[data-close]")) d.close(); });
    d.addEventListener("close", function(){
      stopMedia();
      if (d === pv) pvStage.innerHTML = "";
      if (opener && opener.focus) opener.focus();
    });
  });

  /* ---------- Experience and education ---------- */
  $("#experience-list").innerHTML = S.experience.map(function(j){
    return '<article class="job"><h3>' + esc(j.role) + '</h3><p class="org">' + esc(j.org) + '</p><span class="dates">' + esc(j.dates) + "</span><ul>" +
      j.points.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></article>";
  }).join("");
  $("#education-list").innerHTML = '<p class="edu-title">Education</p>' + S.education.map(function(e){
    return '<article class="school"><h3>' + esc(e.degree) + "</h3><p>" + esc(e.school) + '</p><span class="score">' + esc(e.year) + " &middot; " + esc(e.score) + "</span></article>";
  }).join("");

  /* ---------- Contact ---------- */
  var statusEl = $("#status"), emailEl = $("#email");
  $("#copyBtn").addEventListener("click", function(){
    function fallback(){
      var range = document.createRange(); range.selectNodeContents(emailEl);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      statusEl.textContent = "Press Ctrl+C or Cmd+C to copy.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(emailEl.textContent).then(function(){ statusEl.textContent = "Email copied."; }, fallback);
    } else { fallback(); }
  });
})();
