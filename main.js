document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Optional: Add simple parallax effect to background glows on mouse move
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  
  if (glow1 && glow2) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      glow1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      glow2.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
    });
  }

  // --- Google Analytics Event Tracking ---
  const trackEvent = (eventName, params) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  };

  // Track Download Button Clicks
  document.querySelectorAll('a[download], a[href*=".dmg"], a[href*="releases"]').forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('download_click', { event_category: 'Engagement' });
    });
  });

  // Track Privacy/Terms Clicks
  document.querySelectorAll('a[href*="PRIVACY.md"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('privacy_click', { event_category: 'Legal' }));
  });
  document.querySelectorAll('a[href*="TERMS.md"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('terms_click', { event_category: 'Legal' }));
  });

  // Track Time Stayed on Page
  let startTime = performance.now();
  let totalTimeSpent = 0;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const timeSpentThisSession = (performance.now() - startTime) / 1000;
      totalTimeSpent += timeSpentThisSession;
      trackEvent('time_on_page', { 
        event_category: 'Engagement', 
        value: Math.round(totalTimeSpent) 
      });
    } else {
      startTime = performance.now();
    }
  });

  // Track If User Read Features
  const featuresSection = document.getElementById('features');
  if (featuresSection && window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackEvent('read_features', { event_category: 'Engagement' });
          observer.disconnect(); // Only track once
        }
      });
    }, { threshold: 0.3 }); // Trigger when 30% of the section is visible
    observer.observe(featuresSection);
  }

  // --- Promo Video & Media Switcher ---
  const videoWrapper = document.getElementById('video-wrapper');
  const promoVideo = document.getElementById('hero-promo-video');
  const screenshotImg = document.getElementById('hero-screenshot-img');
  const showVideoBtn = document.getElementById('show-video-btn');
  const showScreenBtn = document.getElementById('show-screen-btn');
  const watchPromoBtn = document.getElementById('watch-promo-btn');
  const mediaTitle = document.getElementById('media-title');

  function setMode(mode) {
    if (mode === 'video') {
      videoWrapper.style.display = 'block';
      screenshotImg.style.display = 'none';
      showVideoBtn?.classList.add('active');
      showScreenBtn?.classList.remove('active');
      if (mediaTitle) mediaTitle.textContent = 'Power App — Promo Video';
    } else {
      videoWrapper.style.display = 'none';
      screenshotImg.style.display = 'block';
      showVideoBtn?.classList.remove('active');
      showScreenBtn?.classList.add('active');
      if (promoVideo && !promoVideo.paused) promoVideo.pause();
      if (mediaTitle) mediaTitle.textContent = 'Power App — macOS Native Interface';
    }
  }

  showVideoBtn?.addEventListener('click', () => {
    setMode('video');
    trackEvent('view_promo_video_tab', { event_category: 'Engagement' });
  });

  showScreenBtn?.addEventListener('click', () => {
    setMode('screenshot');
    trackEvent('view_screenshot_tab', { event_category: 'Engagement' });
  });

  watchPromoBtn?.addEventListener('click', () => {
    setMode('video');
    trackEvent('click_watch_promo_btn', { event_category: 'Engagement' });
    if (promoVideo) {
      promoVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      promoVideo.play().catch(() => {});
    }
  });

  promoVideo?.addEventListener('play', () => {
    trackEvent('promo_video_play', { event_category: 'Engagement' });
  });
});
