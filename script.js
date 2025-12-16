// ===== script.js =====
// ============================================
// GLASS NAVBAR INTERACTIVE FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    
    // إضافة تأخيرات للروابط
    navItems.forEach((link, index) => {
        link.style.setProperty('--i', index);
    });
    
    // تأثير التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // تأثير بارالاكس خفيف
        navbar.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    });
    
    // زر القائمة المنسدلة
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // إنشاء overlay عند فتح القائمة
        if (!document.querySelector('.menu-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                this.remove();
            });
            
            setTimeout(() => overlay.classList.add('active'), 10);
        } else {
            const overlay = document.querySelector('.menu-overlay');
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400);
        }
    });
    
    // تغيير النمط (داك/لايت)
    themeToggle.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const isDark = document.body.classList.toggle('light-mode');
        
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
        
      
    });
    
    // تفعيل الرابط النشط بناءً على التمرير
    const sections = document.querySelectorAll('section[id]');
    
    function activateNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', activateNavLink);
    
    // تأثيرات Hover للروابط
    navItems.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // إغلاق القائمة عند النقر على رابط
    navItems.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            const overlay = document.querySelector('.menu-overlay');
            if (overlay) overlay.remove();
        });
    });
    
    // تحميل أولي
    setTimeout(() => {
        navbar.style.opacity = '1';
        navbar.style.transform = 'translateY(0)';
    }, 100);
});

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
      if (navLinks.classList.contains("active")) navLinks.classList.remove("active");
    });
  });

  // Typing effect
  const texts = ["Full Stack Developer", "3D Visualizer", "Automation Enthusiast"];
  let i = 0, j = 0, forward = true;
  const typingEl = document.querySelector(".typing");
  setInterval(() => {
    if (forward) {
      typingEl.textContent = texts[i].slice(0, j++) + "|";
      if (j > texts[i].length) { forward = false; setTimeout(() => {}, 1500); }
    } else {
      typingEl.textContent = texts[i].slice(0, j--) + "|";
      if (j === 0) { forward = true; i = (i + 1) % texts.length; }
    }
  }, 120);

  // Fade-in on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade-in").forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Certificate modal
  window.openModal = (title, issuer) => {
    document.getElementById("certModal").style.display = "flex";
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalIssuer").textContent = issuer;
  };
  window.closeModal = () => {
    document.getElementById("certModal").style.display = "none";
  };
;

