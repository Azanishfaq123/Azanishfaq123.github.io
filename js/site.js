window.portfolio = {
    ready: function () {
        if (this._ready) {
            this.bindReveal();
            return;
        }
        this._ready = true;
        document.documentElement.classList.add("is-ready");
        this.bindReveal();
        this.bindSpy();
        this.bindAnchors();
        this.bindProgress();
        this.bindHeader();
        this.bindParallax();
        this.bindCounters();
        this.bindType();
    },

    bindAnchors: function () {
        document.addEventListener("click", function (e) {
            var a = e.target.closest('a[href^="#"]');
            if (!a) return;
            var id = a.getAttribute("href");
            if (!id || id.length < 2) return;
            var el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", id);
        });
    },

    bindReveal: function () {
        var nodes = document.querySelectorAll(".reveal:not(.in)");
        if (!nodes.length) return;

        if (!("IntersectionObserver" in window)) {
            nodes.forEach(function (el) { el.classList.add("in"); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in");
                io.unobserve(entry.target);
            });
        }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });

        nodes.forEach(function (el) { io.observe(el); });
    },

    bindSpy: function () {
        var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
        var sections = links
            .map(function (a) { return document.querySelector(a.getAttribute("href")); })
            .filter(Boolean);
        if (!sections.length) return;

        var setActive = function () {
            var y = window.scrollY + 120;
            var current = sections[0];
            sections.forEach(function (sec) {
                if (sec.offsetTop <= y) current = sec;
            });
            links.forEach(function (a) {
                a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
            });
        };

        window.addEventListener("scroll", setActive, { passive: true });
        setActive();
    },

    bindHeader: function () {
        var header = document.querySelector(".header");
        if (!header) return;
        var update = function () {
            header.classList.toggle("scrolled", window.scrollY > 12);
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
    },

    bindProgress: function () {
        var bar = document.querySelector(".progress span");
        if (!bar) return;

        var update = function () {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var value = max > 0 ? (window.scrollY / max) * 100 : 0;
            bar.style.width = value + "%";
        };

        window.addEventListener("scroll", update, { passive: true });
        update();
    },

    bindParallax: function () {
        var photo = document.querySelector(".portrait img");
        if (!photo) return;

        window.addEventListener("scroll", function () {
            var y = Math.min(window.scrollY * 0.08, 36);
            photo.style.transform = "translateY(" + y + "px) scale(1.04)";
        }, { passive: true });
    },

    bindCounters: function () {
        var items = document.querySelectorAll("[data-count]");
        if (!items.length) return;

        var run = function (el) {
            var end = parseInt(el.getAttribute("data-count"), 10);
            if (!end) return;
            var suffix = el.getAttribute("data-suffix") || "";
            var start = 0;
            var t0 = performance.now();
            var dur = 900;

            var tick = function (now) {
                var p = Math.min((now - t0) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(end * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        if (!("IntersectionObserver" in window)) {
            items.forEach(run);
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                run(entry.target);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        items.forEach(function (el) { io.observe(el); });
    },

    bindType: function () {
        var el = document.querySelector(".typed");
        if (!el) return;
        var text = el.getAttribute("data-text") || "";
        var i = 0;
        el.textContent = "";
        var tick = function () {
            i += 1;
            el.textContent = text.slice(0, i);
            if (i < text.length) window.setTimeout(tick, 55);
        };
        window.setTimeout(tick, 450);
    }
};
