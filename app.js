document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. CUSTOM CURSOR
  // ==========================================================================
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  
  // Track actual mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core cursor dot jumps instantly to position
    if(cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  // Smooth inertial tracking for cursor follower ring using interpolation
  function updateFollower() {
    const ease = 0.12; // Damping constant
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;
    
    if (follower) {
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
    }
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();
  
  // Add hover effects for cursor on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .gallery-item, .testimonial-dot, input, select, textarea, .custom-select, .custom-option');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-link');
    });
  });

  // ==========================================================================
  // 2. HEADER NAV - STICKY AUTO-HIDE ON SCROLL
  // ==========================================================================
  const header = document.querySelector('.header-nav');
  const scrollThreshold = 50;
  let lastScrollY = window.scrollY;
  
  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for glassmorphism
    if (currentScrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
      header.classList.add('nav-hidden');
    } else {
      header.classList.remove('nav-hidden');
    }
    
    lastScrollY = currentScrollY;
  }
  
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initialize on page load

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // 3. WORD REVEAL ANIMATION (HERO SECTION)
  // ==========================================================================
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    // Clear initial content
    heroTitle.textContent = '';
    
    const words = text.split(' ');
    words.forEach((word, index) => {
      const wordWrapper = document.createElement('span');
      wordWrapper.classList.add('word-wrapper');
      
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word');
      wordSpan.textContent = word + ' ';
      // Stagger transitions via inline style delays
      wordSpan.style.transitionDelay = `${index * 0.1}s`;
      
      wordWrapper.appendChild(wordSpan);
      heroTitle.appendChild(wordWrapper);
    });
    
    // Trigger the animation shortly after page load
    setTimeout(() => {
      heroTitle.classList.add('animated');
    }, 150);
  }

  // ==========================================================================
  // 4. INTERSECTION OBSERVER (SCROLL-TRIGGERED REVEALS)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once animated in
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // Active navigation link highlighting based on section scrolling
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.nav-item');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.querySelector('a').getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-10% 0px -40% 0px'
  });
  
  sections.forEach(sec => {
    if (sec.getAttribute('id')) {
      navObserver.observe(sec);
    }
  });

  // ==========================================================================
  // 5. SERVICES SCROLLER
  // ==========================================================================
  const scroller = document.querySelector('.services-scroll-container');
  const btnPrev = document.getElementById('scroller-prev');
  const btnNext = document.getElementById('scroller-next');
  
  if (scroller && btnPrev && btnNext) {
    const cardWidth = 380 + 40; // Card width + gap size
    
    btnPrev.addEventListener('click', () => {
      scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    
    btnNext.addEventListener('click', () => {
      scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 6. ANIMATED COUNTERS (STATS SECTION)
  // ==========================================================================
  const statsSection = document.querySelector('.stats-section');
  const counterElements = document.querySelectorAll('.stat-number');
  let countersTriggered = false;
  
  function runCounterAnimation() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const isPercent = counter.getAttribute('data-percent') === 'true';
      const duration = 2000; // Animation duration in ms
      const startTime = performance.now();
      
      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quad ease-out interpolation
        const ease = 1 - Math.pow(1 - progress, 2);
        const currentVal = Math.floor(ease * target);
        
        counter.textContent = currentVal + (isPercent ? '%' : '+');
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target + (isPercent ? '%' : '+');
        }
      }
      
      requestAnimationFrame(updateNumber);
    });
  }
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersTriggered) {
        countersTriggered = true;
        runCounterAnimation();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 7. OUR PROCESS - TIMELINE ANIMATION
  // ==========================================================================
  const timeline = document.querySelector('.timeline-container');
  const timelineProgressLine = document.querySelector('.timeline-progress-line');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  function checkTimelineProgress() {
    if (!timeline || !timelineProgressLine) return;
    
    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how far the timeline is relative to viewport scrolling
    const startPoint = viewportHeight * 0.8;
    const endPoint = viewportHeight * 0.3;
    
    // Translate relative positions
    let progressPercentage = 0;
    if (rect.top <= startPoint) {
      const totalHeight = rect.height;
      const scrolledInHeight = startPoint - rect.top;
      progressPercentage = Math.min((scrolledInHeight / totalHeight) * 100, 100);
    }
    
    timelineProgressLine.style.height = `${progressPercentage}%`;
    
    // Toggle active state for elements based on timeline line progress
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top <= startPoint - 40) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', checkTimelineProgress);
  checkTimelineProgress();

  // ==========================================================================
  // 8. PARALLAX EFFECTS (GALLERY MASONRY)
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  function handleParallax() {
    // Gallery grid individual image movement
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      const rect = item.getBoundingClientRect();
      const inView = (rect.top < window.innerHeight) && (rect.bottom > 0);
      
      if (inView && img) {
        // Compute progress of the image card relative to viewport
        const totalTravel = window.innerHeight + rect.height;
        const progress = (window.innerHeight - rect.top) / totalTravel;
        const offset = (progress - 0.5) * 60; // Max movement +/- 30px
        
        img.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }
  
  // Optimize scroll animations using passive events
  window.addEventListener('scroll', () => {
    requestAnimationFrame(handleParallax);
  }, { passive: true });
  
  // Run once to initialize
  handleParallax();

  // ==========================================================================
  // 8A. HERO EDITORIAL SLIDESHOW CONTROLLER
  // ==========================================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroNavItems = document.querySelectorAll('.hero-nav-item');
  let currentHeroSlide = 0;
  let heroSliderInterval;
  const heroSlideDelay = 7000; // 7 seconds per slide

  function changeHeroSlide(index) {
    if (heroSlides.length === 0) return;
    
    // Boundary wrapping
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    
    heroSlides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    heroNavItems.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    
    heroSlides[currentHeroSlide].classList.add('active');
    heroNavItems[currentHeroSlide].classList.add('active');
    heroNavItems[currentHeroSlide].setAttribute('aria-selected', 'true');
  }

  function nextHeroSlide() {
    changeHeroSlide(currentHeroSlide + 1);
  }

  function startHeroSliderTimer() {
    heroSliderInterval = setInterval(nextHeroSlide, heroSlideDelay);
  }

  // Close and reset slider
  function stopHeroSliderTimer() {
    clearInterval(heroSliderInterval);
  }

  // Bind clicks for the right-hand indicators
  heroNavItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      changeHeroSlide(index);
      stopHeroSliderTimer();
      startHeroSliderTimer(); // Reset timer so it doesn't immediately slide
    });
  });

  // Start slider if active
  if (heroSlides.length > 0) {
    changeHeroSlide(0);
    startHeroSliderTimer();
  }

  // ==========================================================================
  // 9. TESTIMONIALS CAROUSEL
  // ==========================================================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;
  let testimonialInterval;
  const slideDuration = 6000;
  
  function showTestimonial(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentTestimonial = index;
    slides[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
  }
  
  function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % slides.length;
    showTestimonial(nextIndex);
  }
  
  function startTestimonialTimer() {
    testimonialInterval = setInterval(nextTestimonial, slideDuration);
  }
  
  function stopTestimonialTimer() {
    clearInterval(testimonialInterval);
  }
  
  // Setup dot indicators click triggers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
      stopTestimonialTimer();
      startTestimonialTimer(); // Restart timer on click
    });
  });
  
  // Pause on hover
  const testimonialsContainer = document.querySelector('.testimonials-container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', stopTestimonialTimer);
    testimonialsContainer.addEventListener('mouseleave', startTestimonialTimer);
  }
  
  // Initialize Carousel
  if (slides.length > 0) {
    showTestimonial(0);
    startTestimonialTimer();
  }

  // ==========================================================================
  // 10. FLOATING LABELS & FORM SUBMISSION (INTEGRATED WITH WEB3FORMS)
  // ==========================================================================
  const quoteForm = document.getElementById('ss-quote-form');
  const successMessage = document.querySelector('.form-success-msg');
  
  if (quoteForm && successMessage) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple HTML5 constraint validation check
      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }
      
      const submitBtn = quoteForm.querySelector('.form-submit-btn');
      submitBtn.textContent = 'Sending Request...';
      submitBtn.disabled = true;
      
      const formData = new FormData(quoteForm);
      
      // Submit form dynamically via AJAX to Web3Forms API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          // Transition form into clean confirmation overlay
          quoteForm.style.display = 'none';
          successMessage.classList.add('active');
          
          // Auto scroll slightly to bring message in center
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          // Fallback if API returned error
          submitBtn.textContent = 'Error! Try Again';
          submitBtn.disabled = false;
          alert('Submission error. Please check your network or try again.');
        }
      })
      .catch(error => {
        console.error('Submission error:', error);
        submitBtn.textContent = 'Error! Try Again';
        submitBtn.disabled = false;
        alert('Network error. Please try again.');
      });
    });
  }
  
  // Form input field labels cleanup and helper state management
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    // Set placeholder to space to trigger CSS :not(:placeholder-shown) correctly
    input.setAttribute('placeholder', ' ');
  });

  // ==========================================================================
  // 11. CUSTOM PREMIUM SELECT DROPDOWN
  // ==========================================================================
  const customSelect = document.getElementById('luxury-select');
  const hiddenSelect = document.getElementById('form-space');
  const selectValueText = document.getElementById('custom-select-value');
  const customOptions = document.querySelectorAll('.custom-option');
  
  if (customSelect && hiddenSelect && selectValueText) {
    // Toggle dropdown open state
    customSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      customSelect.classList.toggle('open');
    });
    
    // Select option logic
    customOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const val = option.getAttribute('data-value');
        const text = option.textContent;
        
        // Update hidden native select and trigger change
        hiddenSelect.value = val;
        hiddenSelect.dispatchEvent(new Event('change'));
        
        // Update visual display
        selectValueText.textContent = text;
        selectValueText.classList.remove('placeholder');
        
        // Toggle active selection states
        customOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Close dropdown
        customSelect.classList.remove('open');
      });
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', () => {
      customSelect.classList.remove('open');
    });
    
    // Close keyboard navigation accessibility
    customSelect.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        customSelect.classList.toggle('open');
      } else if (e.key === 'Escape') {
        customSelect.classList.remove('open');
      }
    });
  }

  // ==========================================================================
  // 12. SERVICES DETAILS LIGHTBOX MODAL SYSTEM
  // ==========================================================================
  
  // Dynamic Service Database mapping specifications and 3-image carousel lists
  const serviceDatabase = {
    'service-kitchens': {
      tag: '01 / CONCEPT',
      title: 'Modular Kitchens',
      desc: 'Sleek handleless drawer runners, premium marble and quartz countertops, high-pressure wood veneers, and smart dry-wet layout configurations tailored specifically for contemporary culinary workflows in modern homes.',
      specs: [
        'German Engineered Hettich Sensys 3D hinges & soft-close slides',
        '18mm boiling water-resistant marine ply / HDHMR structural board cores',
        'Custom built-in drawer dividers, spice racks, and drawer inserts',
        'Seamless profile integrated LED task lighting under wall units'
      ],
      images: [
        'assets/about_kitchen.png',
        'assets/kitchen_detail_1.png',
        'assets/kitchen_detail_2.png'
      ]
    },
    'service-wardrobes': {
      tag: '02 / HABITAT',
      title: 'Bespoke Wardrobes',
      desc: 'Tinted glass sliding partitions, premium textured leather-lined shelves, sleek integrated warm LED shelf lighting, and custom accessory organizers crafted to sculpt the ultimate walk-in wardrobe dressing suite.',
      specs: [
        'Hafele heavy-duty sliding door track systems standard',
        'Integrated warm LED shelf illumination with automatic sensor switches',
        'Textured premium leather drawer partitions for accessory organizers',
        'Custom pull-out trouser hanger arrays and tie storage trays'
      ],
      images: [
        'assets/about_wardrobe.png',
        'assets/wardrobe_detail_1.png',
        'assets/wardrobe_detail_2.png'
      ]
    },
    'service-tv': {
      tag: '03 / SALON',
      title: 'TV & Accent Consoles',
      desc: 'Minimalist floating TV consoles configured with vertical timber ribbed wood panels, premium wire-routing tracks, and luxurious Calacatta stone backdrop panels to complete a sleek salon statement.',
      specs: [
        'Concealed desktop and wall wire-routing tracks',
        'High-load floating brackets for secure structural mounting',
        'Individually styled vertical timber-slat wall cladding accents',
        'Premium soft-touch push-to-open cabinet door hardware'
      ],
      images: [
        'assets/service_tv.png',
        'assets/tv_detail_1.png',
        'assets/tv_detail_2.png'
      ]
    },
    'service-crockery': {
      tag: '04 / HOST',
      title: 'Crockery Units',
      desc: 'Sophisticated dining area focal credenzas engineered with elegant fluted glass fronts, slim brushed champagne gold metal panels, integrated spot spotlights, and high-end marble shelf backing textures.',
      specs: [
        'Slim brushed champagne gold anodized aluminum shutter profiles',
        'Premium high-end fluted glass panels with modern textures',
        'Dimmable internal spot spotlight arrays for display items',
        'Solid marble quartz backing panels matching premium countertops'
      ],
      images: [
        'assets/service_crockery.png',
        'assets/crockery_detail_1.png',
        'assets/crockery_detail_2.png'
      ]
    },
    'service-office': {
      tag: '05 / FOCUS',
      title: 'Home Offices',
      desc: 'High-efficiency floating work tables integrated with overhead library shelves, concealed desktop wire channels, and built-in task ambient lighting profiles for ergonomic and aesthetic workspace perfection.',
      specs: [
        'HDHMR board cores resisting moisture and weight deflection',
        'Minimalist floating timber desk design with rounded safety margins',
        'Concealed pop-up desktop grommets and wire channel routing',
        'Soft dimmable profile warm LED lighting under structural shelves'
      ],
      images: [
        'assets/service_office.png',
        'assets/tv_detail_2.png',
        'assets/detail_lighting.png'
      ]
    },
    'service-living': {
      tag: '06 / IDENTITY',
      title: 'Modular Living Rooms',
      desc: 'Custom wall treatments, minimalist geometric bookshelves, and concealed structural cabinets engineered to outline a luxurious architectural interior signature for premium residential enclaves.',
      specs: [
        'Bespoke geometric modular floating bookshelves',
        'High-density edge-banded acoustic living room panel systems',
        'Millimeter-perfect alignments by certified installation teams',
        'Comes standard with our comprehensive 10-year structural warranty'
      ],
      images: [
        'assets/hero_living.png',
        'assets/tv_detail_1.png',
        'assets/detail_finish.png'
      ]
    }
  };

  // Lightbox DOM Selectors
  const modal = document.getElementById('services-lightbox-modal');
  const modalOverlay = document.getElementById('modal-overlay-close');
  const modalBtnClose = document.getElementById('modal-btn-close');
  const modalCtaClose = document.getElementById('modal-cta-close');
  
  const modalTag = document.getElementById('modal-service-tag');
  const modalTitle = document.getElementById('modal-service-title');
  const modalDesc = document.getElementById('modal-service-desc');
  const modalSpecList = document.getElementById('modal-spec-list');
  const modalSlider = document.getElementById('modal-slider');
  const modalDotsContainer = document.getElementById('modal-dots-container');
  
  const modalBtnPrev = document.getElementById('modal-prev-img');
  const modalBtnNext = document.getElementById('modal-next-img');
  
  let modalActiveImages = [];
  let modalCurrentSlide = 0;
  
  // Set up click listeners for all service cards in the horizontal scroller
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.id;
      const data = serviceDatabase[cardId];
      
      if (data) {
        openServiceLightbox(data);
      }
    });
  });
  
  function openServiceLightbox(data) {
    if (!modal) return;
    
    // Inject textual data
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    
    // Inject specifications list bullets
    modalSpecList.innerHTML = '';
    data.specs.forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      modalSpecList.appendChild(li);
    });
    
    // Setup images
    modalActiveImages = data.images;
    modalCurrentSlide = 0;
    
    // Render dynamic carousel slide containers
    modalSlider.innerHTML = '';
    modalActiveImages.forEach((imgSrc, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('modal-img-slide');
      if (index === 0) slideDiv.classList.add('active');
      
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = `${data.title} Detail Image ${index + 1}`;
      img.loading = 'lazy';
      
      slideDiv.appendChild(img);
      modalSlider.appendChild(slideDiv);
    });
    
    // Render carousel pagination dots
    modalDotsContainer.innerHTML = '';
    modalActiveImages.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('modal-gallery-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `View slide ${index + 1}`);
      
      // Dot click event
      dot.addEventListener('click', () => {
        setModalSlide(index);
      });
      
      modalDotsContainer.appendChild(dot);
    });
    
    // Active modal classes
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background body scrolling
  }
  
  function setModalSlide(index) {
    const slides = modalSlider.querySelectorAll('.modal-img-slide');
    const dots = modalDotsContainer.querySelectorAll('.modal-gallery-dot');
    
    if (slides.length === 0) return;
    
    // Boundary check
    modalCurrentSlide = (index + slides.length) % slides.length;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[modalCurrentSlide].classList.add('active');
    dots[modalCurrentSlide].classList.add('active');
  }
  
  // Arrow navigations
  if (modalBtnPrev && modalBtnNext) {
    modalBtnPrev.addEventListener('click', () => {
      setModalSlide(modalCurrentSlide - 1);
    });
    
    modalBtnNext.addEventListener('click', () => {
      setModalSlide(modalCurrentSlide + 1);
    });
  }
  
  // Close triggers
  function closeServiceLightbox() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Release body scrolling
  }
  
  if (modalOverlay) modalOverlay.addEventListener('click', closeServiceLightbox);
  if (modalBtnClose) modalBtnClose.addEventListener('click', closeServiceLightbox);
  if (modalCtaClose) modalCtaClose.addEventListener('click', closeServiceLightbox);
  
  // Close on Escape keyboard trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeServiceLightbox();
    }
  });

  // ==========================================================================
  // 13. PREMIUM BESPOKE PLANNER LOGIC
  // ==========================================================================
  const calcOptionBtns = document.querySelectorAll('.calc-option-btn');
  const sumScope = document.getElementById('summary-scope');
  const sumFinish = document.getElementById('summary-finish');
  const sumHardware = document.getElementById('summary-hardware');
  const calcCtaSubmit = document.getElementById('calc-cta-submit');
  
  // Dynamic material previews database
  const materialDatabase = {
    'matte': {
      title: 'Premium HDHMR Matte',
      desc: 'Velvety, zero-fingerprint polymer skin engineered for high-traffic environments. Exceptional durability and clean architectural lines.',
      background: '#8a847e'
    },
    'acrylic': {
      title: 'High-Gloss Acrylic',
      desc: 'Mirror-reflective surface that amplifies ambient lighting and visual depth. Perfect for high-end contemporary layouts.',
      background: 'linear-gradient(135deg, #e3dfd8 0%, #b2aba0 100%)'
    },
    'veneer': {
      title: 'Natural Wood Veneer',
      desc: 'Hand-selected organic wood grains sliced into ultra-thin veneers, offering warm, unique, and editorial textures.',
      background: 'linear-gradient(135deg, #8B5A2B 0%, #3E2723 100%)'
    }
  };

  const prevThumb = document.getElementById('preview-texture-thumbnail');
  const prevTitle = document.getElementById('preview-material-title');
  const prevDesc = document.getElementById('preview-material-desc');
  
  function updateSpatialBrief() {
    // Find active selections
    const activeScope = document.querySelector('.calc-option-btn[data-step="scope"].active');
    const activeFinish = document.querySelector('.calc-option-btn[data-step="finish"].active');
    const activeHardware = document.querySelector('.calc-option-btn[data-step="hardware"].active');
    
    if (activeScope && sumScope) {
      sumScope.textContent = activeScope.querySelector('.calc-option-title').textContent;
    }
    if (activeFinish && sumFinish) {
      sumFinish.textContent = activeFinish.querySelector('.calc-option-title').textContent;
      
      // Update dynamic live texture preview
      const finishVal = activeFinish.getAttribute('data-value');
      const matData = materialDatabase[finishVal];
      if (matData) {
        if (prevTitle) prevTitle.textContent = matData.title;
        if (prevDesc) prevDesc.textContent = matData.desc;
        if (prevThumb) prevThumb.style.background = matData.background;
      }
    }
    if (activeHardware && sumHardware) {
      sumHardware.textContent = activeHardware.querySelector('.calc-option-title').textContent;
    }
  }
  
  // Bind click events to options
  calcOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      
      // Remove active class from sibling options inside the same step group
      document.querySelectorAll(`.calc-option-btn[data-step="${step}"]`).forEach(sibling => {
        sibling.classList.remove('active');
      });
      
      // Add active class to clicked option
      btn.classList.add('active');
      
      // Trigger live updates
      updateSpatialBrief();
    });
  });
  
  // Bind CTA to WhatsApp Submission
  if (calcCtaSubmit) {
    calcCtaSubmit.addEventListener('click', () => {
      const activeScope = document.querySelector('.calc-option-btn[data-step="scope"].active');
      const scopeName = activeScope ? activeScope.querySelector('.calc-option-title').textContent : 'N/A';
      
      const activeFinish = document.querySelector('.calc-option-btn[data-step="finish"].active');
      const finishName = activeFinish ? activeFinish.querySelector('.calc-option-title').textContent : 'N/A';
      
      const activeHardware = document.querySelector('.calc-option-btn[data-step="hardware"].active');
      const hardwareName = activeHardware ? activeHardware.querySelector('.calc-option-title').textContent : 'N/A';
      
      // Compile WhatsApp lead message
      const messageText = `Hi SS Modulars! I have configured my bespoke spatial signature using your interactive planner and would like to request a quotation.\n\nMy Selections:\n- Spatial Scope: ${scopeName}\n- Material Finish: ${finishName}\n- Fittings & Hardware: ${hardwareName}\n\nPlease let me know the next steps for a detailed design brief. Thanks!`;
      
      // Direct WhatsApp link
      const whatsappUrl = `https://wa.me/919381393020?text=${encodeURIComponent(messageText)}`;
      
      // Open in a new tab/window
      window.open(whatsappUrl, '_blank');
    });
  }
  
  // ==========================================================================
  // 14. ROLLING WORDS ANIMATION FOR PREMIUM ESTIMATOR TITLE
  // ==========================================================================
  const rollingContainer = document.querySelector('.rolling-words-container');
  const rollingWords = document.querySelectorAll('.rolling-word');
  
  if (rollingContainer && rollingWords.length > 0) {
    let currentWordIndex = 0;
    
    function updateRollingContainerWidth() {
      const activeWord = rollingWords[currentWordIndex];
      if (activeWord) {
        const width = activeWord.getBoundingClientRect().width;
        rollingContainer.style.width = `${width}px`;
      }
    }
    
    function rotateRollingWords() {
      const currentWord = rollingWords[currentWordIndex];
      if (!currentWord) return;
      currentWord.classList.remove('active');
      currentWord.classList.add('exit');
      
      // Calculate next index
      currentWordIndex = (currentWordIndex + 1) % rollingWords.length;
      
      const nextWord = rollingWords[currentWordIndex];
      if (nextWord) {
        nextWord.classList.remove('exit');
        nextWord.classList.add('active');
      }
      
      // Smoothly update the container width to match the new word
      updateRollingContainerWidth();
      
      // Clean up exit class after animation completes (600ms matching CSS transition)
      setTimeout(() => {
        currentWord.classList.remove('exit');
      }, 600);
    }
    
    // Initial setup: Wait a small delay for fonts to load and render
    setTimeout(() => {
      updateRollingContainerWidth();
    }, 300);
    
    // Recalculate width on resize
    window.addEventListener('resize', updateRollingContainerWidth);
    
    // Roll the word every 1.8 seconds (1.8s gives a perfect 1.2s readability + 0.6s animation flow)
    setInterval(rotateRollingWords, 1800);
  }

  // ==========================================================================
  // 15. FAQ ACCORDION INTERACTION
  // ==========================================================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;
      
      // Close other panels if open (keeping it extremely clean and premium)
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanel = otherTrigger.nextElementSibling;
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
          }
        }
      });
      
      // Toggle current panel
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.style.maxHeight = null;
        }
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  });

  // ==========================================================================
  // 14. PRESTIGIOUS CLIENTS MODAL
  // ==========================================================================
  const prestigiousModal   = document.getElementById('prestigious-modal');
  const btnOpenPrestigious = document.getElementById('btn-open-prestigious');
  const btnCloseModal      = document.getElementById('prestigious-modal-close');
  const prestigiousModalOverlay = document.getElementById('prestigious-modal-overlay');

  function openPrestigiousModal() {
    if (!prestigiousModal) return;
    prestigiousModal.classList.add('is-open');
    prestigiousModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnCloseModal && btnCloseModal.focus();
  }

  function closePrestigiousModal() {
    if (!prestigiousModal) return;
    prestigiousModal.classList.remove('is-open');
    prestigiousModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    btnOpenPrestigious && btnOpenPrestigious.focus();
  }

  if (btnOpenPrestigious) {
    btnOpenPrestigious.addEventListener('click', openPrestigiousModal);
  }
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closePrestigiousModal);
  }
  if (prestigiousModalOverlay) {
    prestigiousModalOverlay.addEventListener('click', closePrestigiousModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && prestigiousModal && prestigiousModal.classList.contains('is-open')) {
      closePrestigiousModal();
    }
  });

  // Run once on load to initialize defaults
  updateSpatialBrief();

});

