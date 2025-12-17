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