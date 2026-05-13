export const initLang = () => {
    let savedLang = "zh";
    try {
        savedLang = localStorage.getItem("aca-lang") || "zh";
    } catch (e) {
        console.warn("LocalStorage access denied in incognito mode.");
    }
    document.documentElement.className = `lang-${savedLang}`;

    const buttons = document.querySelectorAll(
        "#lang-switcher button"
    );
    buttons.forEach((el) => {
        const btn = el as HTMLElement;
        if (btn.dataset.lang === savedLang) {
            btn.classList.add(
                "bg-white",
                "shadow-sm",
                "text-blue-600"
            );
        } else {
            btn.classList.remove(
                "bg-white",
                "shadow-sm",
                "text-blue-600"
            );
        }

        btn.onclick = () => {
            const lang = btn.dataset.lang;
            if (lang) {
                try {
                    localStorage.setItem("aca-lang", lang);
                } catch (e) {
                    // Silently fail in incognito
                }
                document.documentElement.className = `lang-${lang}`;

                buttons.forEach((b) =>
                    b.classList.remove(
                        "bg-white",
                        "shadow-sm",
                        "text-blue-600"
                    )
                );
                btn.classList.add(
                    "bg-white",
                    "shadow-sm",
                    "text-blue-600"
                );
            }
        };
    });
};

export const initModeSwitcher = () => {
    const buttons = document.querySelectorAll("#mode-switcher button, #mode-switcher a");
    const manualSection = document.getElementById("nav-section-manual");
    const rubricSection = document.getElementById("nav-section-rubric");
    const curriculumSection = document.getElementById("nav-section-curriculum");
    const skirtSection = document.getElementById("nav-section-skirt");
    const boatSpecsSection = document.getElementById("nav-section-boat-specs");

    const path = window.location.pathname;
    
    // Determine current mode more robustly
    let currentMode = 'manual';
    if (path.includes('assessment-guide')) currentMode = 'rubric';
    else if (path.includes('river-kayaking-curriculum')) currentMode = 'curriculum';
    else if (path.includes('skirt-fit')) currentMode = 'skirt';
    else if (path.includes('boat-specs')) currentMode = 'boat-specs';

    // Initial state based on determined mode
    buttons.forEach(btn => {
        const href = btn.getAttribute('href');
        let isBtnActive = false;
        
        if (href) {
            if (currentMode === 'rubric' && href.includes('assessment-guide')) isBtnActive = true;
            else if (currentMode === 'curriculum' && href.includes('river-kayaking-curriculum')) isBtnActive = true;
            else if (currentMode === 'skirt' && href.includes('skirt-fit')) isBtnActive = true;
            else if (currentMode === 'boat-specs' && href.includes('boat-specs')) isBtnActive = true;
            else if (currentMode === 'manual' && !href.includes('assessment-guide') && 
                     !href.includes('river-kayaking-curriculum') && 
                     !href.includes('skirt-fit') && 
                     !href.includes('boat-specs')) isBtnActive = true;
        }

        if (isBtnActive) {
            btn.classList.add("bg-white", "shadow-sm", "text-blue-600", "active-mode");
            btn.classList.remove("text-slate-500");
        } else {
            btn.classList.remove("bg-white", "shadow-sm", "text-blue-600", "active-mode");
            btn.classList.add("text-slate-500");
        }
    });

    // Handle section visibility
    [manualSection, rubricSection, curriculumSection, skirtSection, boatSpecsSection].forEach(s => s?.classList.add("hidden"));
    
    if (currentMode === 'manual') manualSection?.classList.remove("hidden");
    else if (currentMode === 'rubric') rubricSection?.classList.remove("hidden");
    else if (currentMode === 'curriculum') curriculumSection?.classList.remove("hidden");
    else if (currentMode === 'skirt') skirtSection?.classList.remove("hidden");
    else if (currentMode === 'boat-specs') boatSpecsSection?.classList.remove("hidden");

    // Click handler for instant UI feedback
    buttons.forEach(el => {
        const btn = el as HTMLElement;
        btn.onclick = () => {
            buttons.forEach(el_b => {
                const b = el_b as HTMLElement;
                b.classList.remove("bg-white", "shadow-sm", "text-blue-600", "active-mode");
                b.classList.add("text-slate-500");
            });
            btn.classList.add("bg-white", "shadow-sm", "text-blue-600", "active-mode");
            btn.classList.remove("text-slate-500");
        };
    });
};

export const initMobileMenu = () => {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const sidebar = document.getElementById("main-sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const hamburgerIcon = document.getElementById("hamburger-icon");
    const closeIcon = document.getElementById("close-icon");
    const sidebarClose = document.getElementById("sidebar-close");
    const navLinks = document.querySelectorAll(".nav-link");

    document.body.style.overflow = "";

    // Guard: Ensure core elements exist
    if (!sidebar || !overlay || !hamburgerIcon || !closeIcon) return;

    const toggleMenu = (shouldOpen?: boolean) => {
        const isDesktop = window.innerWidth >= 1024;
        const nextState = shouldOpen !== undefined ? shouldOpen : !sidebar.classList.contains("translate-x-0");
        
        if (nextState) {
            sidebar.classList.add("translate-x-0");
            sidebar.classList.remove("-translate-x-full");
            overlay.classList.remove("hidden", "opacity-0", "pointer-events-none");
            overlay.classList.add("opacity-100", "pointer-events-auto");
            hamburgerIcon.classList.add("hidden");
            closeIcon.classList.remove("hidden");
            if (!isDesktop) document.body.style.overflow = "hidden";
        } else {
            sidebar.classList.remove("translate-x-0");
            sidebar.classList.add("-translate-x-full");
            overlay.classList.add("hidden", "opacity-0", "pointer-events-none");
            overlay.classList.remove("opacity-100", "pointer-events-auto");
            hamburgerIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
            document.body.style.overflow = "";
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('menu') === 'open' && window.innerWidth < 1024) {
        (sidebar as HTMLElement).style.transition = 'none';
        (overlay as HTMLElement).style.transition = 'none';
        toggleMenu(true); 
        setTimeout(() => {
            (sidebar as HTMLElement).style.transition = '';
            (overlay as HTMLElement).style.transition = '';
        }, 10);
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
    }

    if (toggleBtn && sidebar && overlay) {
        (toggleBtn as HTMLElement).onclick = () => toggleMenu();
        (overlay as HTMLElement).onclick = () => toggleMenu(false); 
        if (sidebarClose) (sidebarClose as HTMLElement).onclick = () => toggleMenu(false); 

        navLinks.forEach((el) => {
            const link = el as HTMLElement;
            link.onclick = () => {
                if (window.innerWidth < 1024) toggleMenu(false); 
            };
        });
    }
};

export const initScrollSpy = () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (sections.length === 0) {
        const path = window.location.pathname;
        const slug = path.split("/").filter(Boolean).pop();
        if (slug) {
            navLinks.forEach((el) => {
                const link = el as HTMLElement;
                if (link.dataset.navId === slug) link.classList.add("active-nav");
            });
        }
        return;
    }

    const observerOptions = {
        rootMargin: "-15% 0px -75% 0px",
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                const mobileUnitDisplay = document.getElementById("mobile-current-unit");

                navLinks.forEach((el) => {
                    const link = el as HTMLElement;
                    if (link.dataset.navId === id) {
                        link.classList.add("active-nav");
                        if (mobileUnitDisplay) {
                            const unitZh = link.querySelector(".zh")?.textContent;
                            if (unitZh && mobileUnitDisplay.textContent !== unitZh) {
                                mobileUnitDisplay.style.opacity = "0";
                                setTimeout(() => {
                                    mobileUnitDisplay.textContent = unitZh;
                                    mobileUnitDisplay.style.opacity = "1";
                                }, 200);
                            }
                        }
                    } else {
                        link.classList.remove("active-nav");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
};

export const initAnchorLinks = () => {
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(el => {
        const link = el as HTMLAnchorElement;
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.includes('#')) {
                const [path, hash] = href.split('#');
                const currentPath = window.location.pathname.replace(/\/$/, '');
                const targetPath = path.replace(/\/$/, '');
                
                // If it's the same page, scroll manually
                if (targetPath === '' || targetPath === currentPath) {
                    const targetId = hash;
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        
                        // Close mobile menu if open
                        const sidebar = document.getElementById("main-sidebar");
                        if (sidebar && sidebar.classList.contains("translate-x-0")) {
                            const overlay = document.getElementById("sidebar-overlay");
                            const hamburgerIcon = document.getElementById("hamburger-icon");
                            const closeIcon = document.getElementById("close-icon");
                            
                            sidebar.classList.remove("translate-x-0");
                            sidebar.classList.add("-translate-x-full");
                            if (overlay) {
                                overlay.classList.add("hidden", "opacity-0", "pointer-events-none");
                                overlay.classList.remove("opacity-100", "pointer-events-auto");
                            }
                            if (hamburgerIcon) hamburgerIcon.classList.remove("hidden");
                            if (closeIcon) closeIcon.classList.add("hidden");
                            document.body.style.overflow = "";
                        }
                    }
                }
            }
        });
    });
};
