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


// ============================================
// TIMELINE SECTION - INTERACTIVE FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.line-progress');
    const yearButtons = document.querySelectorAll('.year-btn');
    const controlButtons = document.querySelectorAll('.control-btn');
    const statNumbers = document.querySelectorAll('.stat-number');
    const itemButtons = document.querySelectorAll('.item-btn');
    
    let currentFilter = 'all';
    let currentIndex = 0;
    let visibleItems = Array.from(timelineItems);
    
    // Initialize timeline
    function initTimeline() {
        // Set initial visibility
        checkVisibility();
        
        // Initialize stats counter
        initStatsCounter();
        
        // Initialize scroll progress
        initScrollProgress();
        
        // Initialize filter system
        initFilterSystem();
        
        // Initialize control buttons
        initControlButtons();
        
        // Initialize item buttons
        initItemButtons();
        
        // Add scroll event listener
        window.addEventListener('scroll', checkVisibility);
    }
    
    // Check item visibility
    function checkVisibility() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        timelineItems.forEach((item, index) => {
            const itemTop = item.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;
            
            // Check if item is in viewport
            if (itemBottom >= windowTop && itemTop <= windowBottom) {
                item.classList.add('visible');
                
                // Update progress line
                const progress = ((index + 1) / timelineItems.length) * 100;
                timelineLine.style.height = `${progress}%`;
                
                // Update current index
                currentIndex = index;
            }
        });
    }
    
    // Initialize stats counter
    function initStatsCounter() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            
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
    
    // Initialize scroll progress
    function initScrollProgress() {
        // Add scroll hint animation
        const scrollHint = document.querySelector('.timeline-scroll-hint');
        if (scrollHint) {
            setTimeout(() => {
                scrollHint.style.opacity = '0.5';
            }, 1000);
            
            // Hide hint after first scroll
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    scrollHint.style.opacity = '0';
                    setTimeout(() => {
                        scrollHint.style.display = 'none';
                    }, 500);
                }
            }, { once: true });
        }
    }
    
    // Initialize filter system
    function initFilterSystem() {
        yearButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                yearButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                currentFilter = this.getAttribute('data-year');
                
                // Filter items
                timelineItems.forEach(item => {
                    const itemYear = item.getAttribute('data-year');
                    
                    if (currentFilter === 'all' || 
                        currentFilter === 'future' && item.classList.contains('future') ||
                        currentFilter === itemYear) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(30px)';
                            setTimeout(() => {
                                item.classList.add('visible');
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100);
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                            item.classList.remove('visible');
                        }, 300);
                    }
                });
                
                // Update visible items array
                updateVisibleItems();
            });
        });
    }
    
    // Initialize control buttons
    function initControlButtons() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                    scrollToItem(currentIndex);
                }
            });
            
            nextBtn.addEventListener('click', function() {
                if (currentIndex < visibleItems.length - 1) {
                    currentIndex++;
                    scrollToItem(currentIndex);
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') {
                    if (currentIndex > 0) {
                        currentIndex--;
                        scrollToItem(currentIndex);
                    }
                } else if (e.key === 'ArrowRight') {
                    if (currentIndex < visibleItems.length - 1) {
                        currentIndex++;
                        scrollToItem(currentIndex);
                    }
                }
            });
        }
    }
    
    // Initialize item buttons
    function initItemButtons() {
        itemButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const buttonType = this.classList[1];
                const item = this.closest('.timeline-item');
                const title = item.querySelector('.item-title').textContent;
                
                switch(buttonType) {
                    case 'view-projects':
                        // Scroll to projects section
                        const projectsSection = document.getElementById('projects');
                        if (projectsSection) {
                            projectsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        break;
                        
                    case 'view-certificate':
                        // Open certificate modal or scroll to certificates
                        const certificatesSection = document.getElementById('certificates');
                        if (certificatesSection) {
                            certificatesSection.scrollIntoView({ behavior: 'smooth' });
                            
                            // Trigger certificate filter if needed
                            setTimeout(() => {
                                const certFilter = item.querySelector('.item-type.certification') ? 'all' : null;
                                if (certFilter) {
                                    const filterBtn = document.querySelector(`[data-filter="${certFilter}"]`);
                                    if (filterBtn) filterBtn.click();
                                }
                            }, 500);
                        }
                        break;
                        
                    case 'verify-online':
                        // Already has link, just track click
                        trackButtonClick('verify_online', title);
                        break;
                        
                    case 'contact-me':
                        // Scroll to contact section
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        break;
                        
                    case 'view-skills':
                        // Scroll to skills section
                        const skillsSection = document.getElementById('skills');
                        if (skillsSection) {
                            skillsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        break;
                        
                    case 'view-portfolio':
                        // Could open image gallery or scroll to projects
                        const portfolioSection = document.getElementById('projects');
                        if (portfolioSection) {
                            portfolioSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        break;
                }
                
                // Add click animation
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.transform = '';
                }, 1000);
            });
        });
    }
    
    // Scroll to specific item
    function scrollToItem(index) {
        if (visibleItems[index]) {
            visibleItems[index].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the item
            visibleItems.forEach(item => item.classList.remove('highlighted'));
            visibleItems[index].classList.add('highlighted');
            
            setTimeout(() => {
                visibleItems[index].classList.remove('highlighted');
            }, 2000);
        }
    }
    
    // Update visible items array
    function updateVisibleItems() {
        visibleItems = Array.from(timelineItems).filter(item => 
            item.style.display !== 'none'
        );
        currentIndex = 0;
    }
    
    // Track button clicks (for analytics)
    function trackButtonClick(action, label) {
        console.log(`Timeline action: ${action} - ${label}`);
        // You can integrate with Google Analytics here
        // gtag('event', 'timeline_click', {
        //     'event_category': 'engagement',
        //     'event_label': label,
        //     'value': action
        // });
    }
    
    // Add hover effects for markers
    function initMarkerHover() {
        timelineItems.forEach(item => {
            const marker = item.querySelector('.marker-circle');
            if (marker) {
                marker.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.2) rotate(15deg)';
                });
                
                marker.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0)';
                });
            }
        });
    }
    
    // Add CSS for highlighted items
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
        .timeline-item.highlighted .item-content {
            border: 2px solid #00ffff;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.4),
                        0 30px 80px rgba(0, 0, 0, 0.5) !important;
            animation: highlight-pulse 2s ease;
        }
        
        @keyframes highlight-pulse {
            0%, 100% { 
                border-color: #00ffff;
                box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
            }
            50% { 
                border-color: #8a2be2;
                box-shadow: 0 0 60px rgba(138, 43, 226, 0.6);
            }
        }
    `;
    document.head.appendChild(highlightStyle);
    
    // Run initialization
    initTimeline();
    initMarkerHover();
    
    // Add parallax effect for background shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.timeline-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
});



// ============================================
// SKILLS SECTION - INTERACTIVE FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');
    const progressCircles = document.querySelectorAll('.progress-circle');
    const progressBars = document.querySelectorAll('.progress-fill');
    let skillsChart = null;
    
    // Initialize skills section
    function initSkillsSection() {
        // Initialize progress animations
        initProgressAnimations();
        
        // Initialize filter system
        initSkillsFilter();
        
        // Initialize tooltips
        initTooltips();
        
        // Initialize chart
        initSkillsChart();
        
        // Initialize hover effects
        initHoverEffects();
        
        // Initialize click events
        initClickEvents();
    }
    
    // Initialize progress animations
    function initProgressAnimations() {
        // Animate progress bars on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressFill = entry.target;
                    const width = progressFill.getAttribute('data-width');
                    
                    setTimeout(() => {
                        progressFill.style.width = `${width}%`;
                    }, 300);
                    
                    observer.unobserve(progressFill);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
        
        // Animate progress circles
        progressCircles.forEach(circle => {
            const percent = circle.getAttribute('data-percent');
            const progress = circle.querySelector('.progress');
            
            if (progress) {
                const circumference = 2 * Math.PI * 15.9155;
                const offset = circumference - (percent / 100) * circumference;
                
                setTimeout(() => {
                    progress.style.strokeDashoffset = offset;
                }, 500);
            }
        });
    }
    
    // Initialize skills filter
    function initSkillsFilter() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter categories
                skillCategories.forEach(category => {
                    const categoryType = category.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === categoryType) {
                        category.style.display = 'block';
                        setTimeout(() => {
                            category.style.opacity = '1';
                            category.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        category.style.opacity = '0';
                        category.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            category.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Initialize tooltips
    function initTooltips() {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        document.body.appendChild(tooltip);
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function(e) {
                const tooltipText = this.getAttribute('data-tooltip');
                if (tooltipText) {
                    tooltip.textContent = tooltipText;
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                    
                    // Position tooltip
                    const rect = this.getBoundingClientRect();
                    const tooltipWidth = tooltip.offsetWidth;
                    
                    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                    let top = rect.top - tooltip.offsetHeight - 10;
                    
                    // Adjust if tooltip goes off screen
                    if (left < 10) left = 10;
                    if (left + tooltipWidth > window.innerWidth - 10) {
                        left = window.innerWidth - tooltipWidth - 10;
                    }
                    
                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                }
            });
            
            item.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
            });
        });
        
        // Hide tooltip on scroll
        window.addEventListener('scroll', function() {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        });
    }
    
    // Initialize skills chart
    function initSkillsChart() {
        const chartCanvas = document.getElementById('skillsChart');
        if (!chartCanvas) return;
        
        const ctx = chartCanvas.getContext('2d');
        
        // Skills data
        const skillsData = {
            labels: ['Python', 'C', 'C#', 'Bash', 'Web', 'Docker', 'Git', 'Linux', 'NGINX', 'SQL', 'SketchUp', 'Lumion', 'AutoCAD', 'Photoshop', 'Premiere', 'PowerPoint', 'Word'],
            datasets: [{
                label: 'Skill Level',
                data: [60, 70, 40, 65, 80, 85, 90, 95, 70, 75, 65, 80, 85, 80, 70, 95, 98],
                backgroundColor: [
                    '#06d6a0', '#06d6a0', '#ffd166', '#06d6a0', '#118ab2',
                    '#118ab2', '#118ab2', '#ef476f', '#06d6a0', '#06d6a0',
                    '#06d6a0', '#118ab2', '#118ab2', '#118ab2', '#06d6a0',
                    '#ef476f', '#ef476f'
                ],
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: [
                    '#0af7b6', '#0af7b6', '#ffe0a3', '#0af7b6', '#1ab2e8',
                    '#1ab2e8', '#1ab2e8', '#ff6b8b', '#0af7b6', '#0af7b6',
                    '#0af7b6', '#1ab2e8', '#1ab2e8', '#1ab2e8', '#0af7b6',
                    '#ff6b8b', '#ff6b8b'
                ]
            }]
        };
        
        // Create chart
        skillsChart = new Chart(ctx, {
            type: 'bar',
            data: skillsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(20, 20, 40, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(138, 43, 226, 0.4)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        // Update chart on filter
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                updateChartData(filter);
            });
        });
    }
    
    // Update chart data based on filter
    function updateChartData(filter) {
        if (!skillsChart) return;
        
        let filteredData = [...skillsChart.data.datasets[0].data];
        let filteredLabels = [...skillsChart.data.labels];
        let filteredColors = [...skillsChart.data.datasets[0].backgroundColor];
        let filteredHoverColors = [...skillsChart.data.datasets[0].hoverBackgroundColor];
        
        if (filter !== 'all') {
            // Define which skills belong to which category
            const categories = {
                programming: [0, 1, 2, 3, 4], // Python, C, C#, Bash, Web
                devops: [5, 6, 7, 8, 9], // Docker, Git, Linux, NGINX, SQL
                design: [10, 11, 12, 13, 14, 15, 16] // SketchUp to Word
            };
            
            const indicesToKeep = categories[filter] || [];
            
            filteredData = filteredData.filter((_, index) => indicesToKeep.includes(index));
            filteredLabels = filteredLabels.filter((_, index) => indicesToKeep.includes(index));
            filteredColors = filteredColors.filter((_, index) => indicesToKeep.includes(index));
            filteredHoverColors = filteredHoverColors.filter((_, index) => indicesToKeep.includes(index));
        }
        
        skillsChart.data.datasets[0].data = filteredData;
        skillsChart.data.labels = filteredLabels;
        skillsChart.data.datasets[0].backgroundColor = filteredColors;
        skillsChart.data.datasets[0].hoverBackgroundColor = filteredHoverColors;
        skillsChart.update();
    }
    
    // Initialize hover effects
    function initHoverEffects() {
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const stars = this.querySelectorAll('.skill-stars i');
                stars.forEach((star, index) => {
                    setTimeout(() => {
                        star.style.transform = 'scale(1.3)';
                        setTimeout(() => {
                            star.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 100);
                });
                
                // Pulse animation for progress circle
                const progressValue = this.querySelector('.progress-value');
                if (progressValue) {
                    progressValue.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    progressValue.style.color = '#8a2be2';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const progressValue = this.querySelector('.progress-value');
                if (progressValue) {
                    progressValue.style.transform = 'translate(-50%, -50%) scale(1)';
                    progressValue.style.color = '#fff';
                }
            });
        });
    }
    
    // Initialize click events
    function initClickEvents() {
        skillItems.forEach(item => {
            item.addEventListener('click', function() {
                // Get skill details
                const skillName = this.querySelector('h4').textContent;
                const skillLevel = this.querySelector('.progress-value').textContent;
                const skillDesc = this.querySelector('.skill-desc').textContent;
                
                // Show skill details modal or alert
                showSkillDetails(skillName, skillLevel, skillDesc);
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            });
        });
    }
    
    // Show skill details
    function showSkillDetails(name, level, description) {
        // Create modal or use existing one
        const modal = document.createElement('div');
        modal.className = 'skill-modal glass-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="skill-level-display">
                        <div class="level-label">Proficiency Level</div>
                        <div class="level-value">${level}</div>
                        <div class="level-bar">
                            <div class="level-fill" style="width: ${level}"></div>
                        </div>
                    </div>
                    <div class="skill-description">
                        <h4>Description</h4>
                        <p>${description}</p>
                    </div>
                    <div class="skill-projects">
                        <h4>Related Projects</h4>
                        <p>Check my projects section to see this skill in action.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary view-projects">
                        <i class="fas fa-eye"></i> View Projects
                    </button>
                    <button class="btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles for modal
        const style = document.createElement('style');
        style.textContent = `
            .skill-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            .skill-modal .modal-content {
                background: rgba(20, 20, 50, 0.95);
                backdrop-filter: blur(30px);
                border: 1px solid rgba(138, 43, 226, 0.4);
                border-radius: 25px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
                transform: scale(0.9);
                animation: scaleIn 0.3s ease forwards;
            }
            
            @keyframes scaleIn {
                to { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Show modal
        setTimeout(() => modal.style.display = 'flex', 10);
        
        // Close modal handlers
        const closeButtons = modal.querySelectorAll('.modal-close, .close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.animation = 'fadeOut 0.3s ease forwards';
                modal.querySelector('.modal-content').style.animation = 'scaleOut 0.3s ease forwards';
                
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            });
        });
        
        // View projects button
        const viewProjectsBtn = modal.querySelector('.view-projects');
        viewProjectsBtn.addEventListener('click', function() {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
                modal.remove();
                style.remove();
            }
        });
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
                style.remove();
            }
        });
    }
    
    // Run initialization
    initSkillsSection();
    
    // Add skill level indicators
    function addSkillLevelIndicators() {
        skillItems.forEach(item => {
            const level = parseInt(item.getAttribute('data-level'));
            const levelText = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][level - 1] || 'Beginner';
            
            const levelIndicator = document.createElement('div');
            levelIndicator.className = 'skill-level-indicator';
            levelIndicator.textContent = levelText;
            levelIndicator.style.background = getLevelColor(level);
            
            item.appendChild(levelIndicator);
        });
    }
    
    function getLevelColor(level) {
        const colors = {
            1: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            2: 'linear-gradient(135deg, #ffd166, #ffe0a3)',
            3: 'linear-gradient(135deg, #06d6a0, #0af7b6)',
            4: 'linear-gradient(135deg, #118ab2, #1ab2e8)',
            5: 'linear-gradient(135deg, #8a2be2, #9400d3)'
        };
        return colors[level] || colors[1];
    }
    
    // Add level indicators CSS
    const levelStyle = document.createElement('style');
    levelStyle.textContent = `
        .skill-level-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.7rem;
            font-weight: 600;
            color: white;
            opacity: 0.8;
            transition: all 0.3s ease;
        }
        
        .skill-item:hover .skill-level-indicator {
            opacity: 1;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(levelStyle);
    
    // Add level indicators
    addSkillLevelIndicators();
});


// ============================================
// PROJECTS SECTION - INTERACTIVE FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.projects-filter .filter-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const projectModal = document.getElementById('projectModal');
    const detailsButtons = document.querySelectorAll('.details-btn');
    const closeModalButtons = document.querySelectorAll('.modal-close, .close-modal');
    const statNumbers = document.querySelectorAll('.projects-stats .stat-number');
    
    let currentFilter = 'all';
    let visibleCount = 6; // عدد المشاريع المعروضة بداية
    const totalProjects = projectCards.length;
    
    // Initialize projects section
    function initProjectsSection() {
        // Initialize stats counter
        initStatsCounter();
        
        // Initialize filter system
        initFilterSystem();
        
        // Initialize modal system
        initModalSystem();
        
        // Initialize load more functionality
        initLoadMore();
        
        // Initialize hover effects
        initHoverEffects();
        
        // Initialize click animations
        initClickAnimations();
        
        // Initialize project cards
        updateVisibleProjects();
    }
    
    // Initialize stats counter
    function initStatsCounter() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            
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
                currentFilter = this.getAttribute('data-filter');
                
                // Reset visible count
                visibleCount = 6;
                
                // Filter and show projects
                updateVisibleProjects();
                
                // Update load more button text
                updateLoadMoreButton();
            });
        });
    }
    
    // Initialize modal system
    function initModalSystem() {
        detailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const projectCard = this.closest('.project-card');
                openProjectModal(projectCard);
            });
        });
        
        // Project preview buttons
        const previewButtons = document.querySelectorAll('.project-preview-btn');
        previewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectCard = this.closest('.project-card');
                openProjectModal(projectCard);
            });
        });
        
        // Demo buttons
        const demoButtons = document.querySelectorAll('.project-demo-btn');
        demoButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectCard = this.closest('.project-card');
                const title = projectCard.querySelector('.project-title').textContent;
                alert(`Launching demo for: ${title}\n\nDemo would open in a new window.`);
            });
        });
        
        // Share buttons
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectCard = this.closest('.project-card');
                shareProject(projectCard);
            });
        });
        
        // Close modal handlers
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close modal on outside click
        projectModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Initialize load more functionality
    function initLoadMore() {
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                visibleCount += 3;
                updateVisibleProjects();
                updateLoadMoreButton();
                
                // Add loading animation
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // Scroll to newly loaded projects
                    const newProjects = document.querySelectorAll('.project-card:not(.hidden)');
                    if (newProjects.length > 0) {
                        const lastProject = newProjects[newProjects.length - 1];
                        lastProject.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 500);
            });
        }
    }
    
    // Initialize hover effects
    function initHoverEffects() {
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const badges = this.querySelectorAll('.badge');
                badges.forEach(badge => {
                    badge.style.transform = 'translateY(-3px)';
                });
                
                const techTags = this.querySelectorAll('.tech-tag');
                techTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.transform = 'translateY(-2px)';
                    }, index * 50);
                });
            });
            
            card.addEventListener('mouseleave', function() {
                const badges = this.querySelectorAll('.badge');
                badges.forEach(badge => {
                    badge.style.transform = 'translateY(0)';
                });
                
                const techTags = this.querySelectorAll('.tech-tag');
                techTags.forEach(tag => {
                    tag.style.transform = 'translateY(0)';
                });
            });
        });
    }
    
    // Initialize click animations
    function initClickAnimations() {
        projectCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Only trigger if not clicking on interactive elements
                if (!e.target.closest('a') && !e.target.closest('button')) {
                    openProjectModal(this);
                }
            });
        });
    }
    
    // Update visible projects based on filter and count
    function updateVisibleProjects() {
        let visibleIndex = 0;
        
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = (currentFilter === 'all' || currentFilter === category) && 
                              visibleIndex < visibleCount;
            
            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
                card.style.animationDelay = `${visibleIndex * 0.1}s`;
                card.classList.add('animate-in');
                visibleIndex++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
                card.classList.remove('animate-in');
            }
        });
    }
    
    // Update load more button text and visibility
    function updateLoadMoreButton() {
        if (!loadMoreBtn) return;
        
        const filteredProjects = Array.from(projectCards).filter(card => {
            const category = card.getAttribute('data-category');
            return currentFilter === 'all' || currentFilter === category;
        }).length;
        
        if (visibleCount >= filteredProjects) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
            const remaining = filteredProjects - visibleCount;
            loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> Load More (${remaining} remaining)`;
        }
    }
    
    // Open project modal with details
    function openProjectModal(projectCard) {
        // Get project details
        const title = projectCard.querySelector('.project-title').textContent;
        const description = projectCard.querySelector('.project-description').textContent;
        const imageSrc = projectCard.querySelector('.project-img').src;
        const date = projectCard.querySelector('.project-date').textContent;
        const category = projectCard.getAttribute('data-category');
        const githubLink = projectCard.querySelector('a[href*="github"]')?.href || '#';
        
        // Get technologies
        const techTags = Array.from(projectCard.querySelectorAll('.tech-tag'))
            .map(tag => tag.textContent);
        
        // Get features
        const features = Array.from(projectCard.querySelectorAll('.feature span'))
            .map(feature => feature.textContent);
        
        // Set modal content
        document.getElementById('modalProjectTitle').textContent = title;
        document.getElementById('modalProjectDescription').textContent = description;
        document.getElementById('modalProjectImage').src = imageSrc;
        document.getElementById('modalProjectYear').textContent = date.replace('Year: ', '');
        document.getElementById('modalProjectCategory').textContent = getCategoryName(category);
        document.getElementById('modalProjectGithub').href = githubLink;
        
        // Set technologies
        const techContainer = document.getElementById('modalProjectTech');
        techContainer.innerHTML = techTags.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        // Set features
        const featuresContainer = document.getElementById('modalProjectFeatures');
        featuresContainer.innerHTML = features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
        
        // Set team info (simulated)
        const teamSize = Math.random() > 0.7 ? 'Team of 3' : 'Solo Project';
        document.getElementById('modalProjectTeam').textContent = teamSize;
        
        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Share project function
    function shareProject(projectCard) {
        const title = projectCard.querySelector('.project-title').textContent;
        const description = projectCard.querySelector('.project-description').textContent;
        const githubLink = projectCard.querySelector('a[href*="github"]')?.href || window.location.href;
        
        const shareText = `Check out my project "${title}": ${description}\n\nView on GitHub: ${githubLink}`;
        
        if (navigator.share) {
            navigator.share({
                title: `${title} - My Project`,
                text: shareText,
                url: githubLink
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    const shareBtn = projectCard.querySelector('.share-btn');
                    const originalHTML = shareBtn.innerHTML;
                    shareBtn.innerHTML = '<i class="fas fa-check"></i>';
                    shareBtn.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)';
                    
                    setTimeout(() => {
                        shareBtn.innerHTML = originalHTML;
                        shareBtn.style.background = '';
                    }, 2000);
                });
        }
    }
    
    // Helper function to get category name
    function getCategoryName(category) {
        const categories = {
            'web': 'Web Development',
            'mobile': 'Mobile App',
            'devops': 'DevOps',
            'ai': 'AI & Machine Learning',
            'design': 'Design & 3D',
            'programming': 'Programming'
        };
        return categories[category] || category;
    }
    
    // Add animation for project cards
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .project-card.animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .project-card.hidden {
            display: none;
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Run initialization
    initProjectsSection();
    
    // Add parallax effect for background shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.project-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
});