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

// ============================================
// CERTIFICATES SECTION - INTERACTIVE FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificateItems = document.querySelectorAll('.certificate-item');
    const certModal = document.getElementById('certificateModal');
    const viewCertButtons = document.querySelectorAll('.view-cert-btn, .quick-view-btn');
    const closeModalButtons = document.querySelectorAll('.modal-close, .close-modal');
    const statNumbers = document.querySelectorAll('.stat-number');
    const downloadCertBtn = document.getElementById('downloadCert');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const modalImage = document.getElementById('modalImage');
    
    let currentZoom = 1;
    
    // Initialize stats counter
    function initStatsCounter() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    // Initialize filter system
    function initFilterSystem() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter certificates
                certificateItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Animate grid items
                animateGridItems();
            });
        });
    }
    
    // Initialize modal system
    function initModalSystem() {
        viewCertButtons.forEach(button => {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-title') || 
                             this.closest('.certificate-item').querySelector('.cert-title').textContent;
                const issuer = this.getAttribute('data-issuer') || 
                               this.closest('.certificate-item').querySelector('.cert-issuer').textContent;
                const year = this.getAttribute('data-year') || 
                             this.closest('.certificate-item').querySelector('.cert-date').textContent;
                const image = this.getAttribute('data-image') || 
                              this.closest('.certificate-image').querySelector('img').src;
                const verifyLink = this.getAttribute('data-verify') || '#';
                
                // Set modal content
                document.getElementById('modalTitle').textContent = title;
                document.getElementById('infoTitle').textContent = title;
                document.getElementById('infoIssuer').textContent = issuer;
                document.getElementById('infoYear').textContent = year;
                document.getElementById('modalImage').src = image;
                document.getElementById('verifyLink').href = verifyLink;
                
                // Generate credential ID
                const credId = 'CRED-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                document.getElementById('infoId').textContent = credId;
                
                // Reset zoom
                currentZoom = 1;
                modalImage.style.transform = `scale(${currentZoom})`;
                
                // Show modal
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                certModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close modal on outside click
        certModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                certModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Image zoom functionality
    function initImageZoom() {
        if (zoomInBtn && zoomOutBtn && modalImage) {
            zoomInBtn.addEventListener('click', function() {
                currentZoom = Math.min(currentZoom + 0.2, 3);
                modalImage.style.transform = `scale(${currentZoom})`;
                updateZoomButtons();
            });
            
            zoomOutBtn.addEventListener('click', function() {
                currentZoom = Math.max(currentZoom - 0.2, 0.5);
                modalImage.style.transform = `scale(${currentZoom})`;
                updateZoomButtons();
            });
            
            // Reset zoom on modal close
            certModal.addEventListener('transitionend', function() {
                if (!this.classList.contains('active')) {
                    currentZoom = 1;
                    modalImage.style.transform = `scale(${currentZoom})`;
                    updateZoomButtons();
                }
            });
            
            // Mouse wheel zoom
            modalImage.addEventListener('wheel', function(e) {
                e.preventDefault();
                
                if (e.deltaY < 0) {
                    // Zoom in
                    currentZoom = Math.min(currentZoom + 0.1, 3);
                } else {
                    // Zoom out
                    currentZoom = Math.max(currentZoom - 0.1, 0.5);
                }
                
                modalImage.style.transform = `scale(${currentZoom})`;
                updateZoomButtons();
            });
        }
    }
    
    function updateZoomButtons() {
        if (zoomInBtn && zoomOutBtn) {
            zoomInBtn.disabled = currentZoom >= 3;
            zoomOutBtn.disabled = currentZoom <= 0.5;
            
            zoomInBtn.style.opacity = zoomInBtn.disabled ? '0.5' : '1';
            zoomOutBtn.style.opacity = zoomOutBtn.disabled ? '0.5' : '1';
        }
    }
    
    // Download certificate
    function initDownloadFunction() {
        if (downloadCertBtn) {
            downloadCertBtn.addEventListener('click', function() {
                const imageUrl = modalImage.src;
                const certificateTitle = document.getElementById('infoTitle').textContent;
                
                // Create download link
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `${certificateTitle.replace(/\s+/g, '_')}_Certificate.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show download confirmation
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                this.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        }
    }
    
    // Share certificate functionality
    function initShareFunction() {
        const shareBtn = document.querySelector('.share-cert');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                const title = document.getElementById('infoTitle').textContent;
                const issuer = document.getElementById('infoIssuer').textContent;
                const year = document.getElementById('infoYear').textContent;
                const shareText = `Check out my ${title} certificate from ${issuer} (${year})!`;
                
                if (navigator.share) {
                    navigator.share({
                        title: `${title} Certificate`,
                        text: shareText,
                        url: window.location.href
                    });
                } else {
                    // Fallback: Copy to clipboard
                    navigator.clipboard.writeText(shareText + ' ' + window.location.href)
                        .then(() => {
                            const originalHTML = this.innerHTML;
                            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            this.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)';
                            
                            setTimeout(() => {
                                this.innerHTML = originalHTML;
                                this.style.background = '';
                            }, 2000);
                        });
                }
            });
        }
    }
    
    // Animate grid items on load
    function animateGridItems() {
        certificateItems.forEach((item, index) => {
            if (item.style.display !== 'none') {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }
    
    // Hover effects for certificate items
    function initHoverEffects() {
        certificateItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const badge = this.querySelector('.cert-badge');
                if (badge) {
                    badge.style.transform = 'scale(1.1)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const badge = this.querySelector('.cert-badge');
                if (badge) {
                    badge.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // Portfolio verification buttons
    function initPortfolioVerification() {
        const portfolioBtns = document.querySelectorAll('.portfolio-verify');
        portfolioBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const certificateTitle = this.closest('.certificate-item').querySelector('.cert-title').textContent;
                
                // Scroll to projects section
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Highlight relevant projects
                    setTimeout(() => {
                        const projectItems = document.querySelectorAll('.project-item');
                        projectItems.forEach(project => {
                            const projectTitle = project.querySelector('p').textContent.toLowerCase();
                            const certTitle = certificateTitle.toLowerCase();
                            
                            if (projectTitle.includes(certTitle.split(' ')[0].toLowerCase())) {
                                project.style.animation = 'highlight-project 2s ease';
                            }
                        });
                    }, 500);
                }
            });
        });
    }
    
    // Initialize everything
    function initCertificatesSection() {
        initStatsCounter();
        initFilterSystem();
        initModalSystem();
        initImageZoom();
        initDownloadFunction();
        initShareFunction();
        initHoverEffects();
        initPortfolioVerification();
        animateGridItems();
        
        // Add highlight animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes highlight-project {
                0%, 100% { 
                    box-shadow: 0 20px 50px rgba(0,0,0,0.6); 
                }
                50% { 
                    box-shadow: 0 0 40px rgba(138, 43, 226, 0.6),
                                0 30px 70px rgba(0,255,255,0.3); 
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Run initialization
    initCertificatesSection();
});