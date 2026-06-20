/*
  NayePankh Foundation - Premium JS Logic
  Navigation, Statistics Animation, FAQ accordion, Lightbox, Donation Form, and Mock Payment Gateway.
*/

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initStatsCounter();
  initFaqAccordion();
  initLightbox();
  initDonationForm();
  initThankYouPage();
});

// 1. Header Scroll Effect
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    // Simple hamburger animation
    const lines = toggle.querySelectorAll('.hamburger-line');
    if (navLinks.classList.contains('mobile-open')) {
      lines[0].style.transform = 'translateY(8px) rotate(45deg)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('mobile-open');
      const lines = toggle.querySelectorAll('.hamburger-line');
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  });
}

// 3. Stats Counter Animation
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;
  
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;
  
  const animate = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // ~60fps
      
      const updateCount = () => {
        current += increment;
        if (current < target) {
          stat.innerText = Math.floor(current).toLocaleString('en-IN') + suffix;
          requestAnimationFrame(updateCount);
        } else {
          stat.innerText = target.toLocaleString('en-IN') + suffix;
        }
      };
      
      updateCount();
    });
  };
  
  // Intersection Observer to start animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animate();
        animated = true;
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(statsSection);
}

// 4. FAQ Accordion Toggle
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      
      // Close other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// 5. Newspaper and Certificate Lightbox Modal
function initLightbox() {
  const items = document.querySelectorAll('.zoomable');
  if (items.length === 0) return;
  
  // Create lightbox markup if not exists
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close"><i class="fas fa-times"></i> Dismiss</button>
        <img class="lightbox-img" src="" alt="Zoomed view">
      </div>
    `;
    document.body.appendChild(lightbox);
  }
  
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const src = item.getAttribute('href') || item.getAttribute('src');
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// 6. Donation form, values and calculators
function initDonationForm() {
  const donateForm = document.getElementById('donation-form');
  if (!donateForm) return;
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('custom-amount');
  const selectedCauseInput = document.getElementById('selected-cause');
  const taxSavingsSpan = document.querySelector('.tax-savings-calc strong');
  
  let currentAmount = 2000;
  
  // Cause tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCauseInput.value = btn.getAttribute('data-cause');
    });
  });
  
  // Preset amount button clicks
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAmount = parseInt(btn.getAttribute('data-amount'), 10);
      customAmountInput.value = currentAmount;
      updateTaxSavings(currentAmount);
    });
  });
  
  // Custom amount changes
  customAmountInput.addEventListener('input', (e) => {
    // Remove active styling on preset buttons if custom input doesn't match presets
    let matchedPreset = false;
    const val = parseInt(e.target.value, 10) || 0;
    
    amountBtns.forEach(btn => {
      const btnAmt = parseInt(btn.getAttribute('data-amount'), 10);
      if (btnAmt === val) {
        btn.classList.add('active');
        matchedPreset = true;
      } else {
        btn.classList.remove('active');
      }
    });
    
    currentAmount = val;
    updateTaxSavings(val);
  });
  
  function updateTaxSavings(amount) {
    if (!taxSavingsSpan) return;
    const savings = Math.floor(amount * 0.5); // 50% deduction
    taxSavingsSpan.innerText = '₹' + savings.toLocaleString('en-IN');
  }
  
  // Initial calculation
  updateTaxSavings(currentAmount);
  
  // Submit Form: Display Mock Payment Modal
  donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple verification
    const name = document.getElementById('donor-name').value.trim();
    const email = document.getElementById('donor-email').value.trim();
    const phone = document.getElementById('donor-phone').value.trim();
    const amount = customAmountInput.value;
    const cause = selectedCauseInput.value;
    
    if (!name || !email || !phone || !amount || amount <= 0) {
      alert('Please fill out all fields with valid information.');
      return;
    }
    
    // Open Payment Modal
    openPaymentModal(name, email, phone, amount, cause);
  });
}

// 7. Mock Payment Modal Control
function openPaymentModal(name, email, phone, amount, cause) {
  let modal = document.querySelector('.payment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
      <div class="payment-card">
        <div class="payment-header">
          <h3 class="payment-title"><i class="fas fa-shield-alt text-success"></i> Secure Checkout</h3>
          <button class="payment-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="payment-summary">
          <span>Supporting: <strong id="summary-cause"></strong></span>
          <span>Amount: <strong id="summary-amount"></strong></span>
        </div>
        <div class="payment-methods">
          <button class="method-btn active" data-method="upi">
            <i class="fas fa-mobile-alt"></i> UPI / QR
          </button>
          <button class="method-btn" data-method="card">
            <i class="far fa-credit-card"></i> Card
          </button>
          <button class="method-btn" data-method="netbank">
            <i class="fas fa-university"></i> Net Banking
          </button>
        </div>
        
        <!-- UPI Method -->
        <div class="method-content active" id="method-upi">
          <div class="qr-placeholder">
            <div class="qr-image" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><rect width=&quot;100&quot; height=&quot;100&quot; fill=&quot;%23fff&quot;/><path d=&quot;M10,10 h30 v30 h-30 z M20,20 v10 h10 v-10 z M60,10 h30 v30 h-30 z M70,20 v10 h10 v-10 z M10,60 h30 v30 h-30 z M20,70 v10 h10 v-10 z M60,60 h10 v10 h-10 z M80,60 h10 v10 h-10 z M70,70 h10 v10 h-10 z M60,80 h10 v10 h-10 z M80,80 h10 v10 h-10 z&quot; fill=&quot;%23000&quot;/></svg>')"></div>
            <span>Scan to Pay via UPI</span>
          </div>
          <p class="qr-help">Or enter your UPI ID below</p>
          <div class="upi-input-group form-group" style="margin-top: 10px;">
            <input type="text" class="form-control" id="upi-id" placeholder="name@upi">
          </div>
        </div>
        
        <!-- Card Method -->
        <div class="method-content" id="method-card">
          <div class="form-group">
            <label>Card Number</label>
            <input type="text" class="form-control" placeholder="4111 2222 3333 4444" maxlength="19">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label>Expiry Date</label>
              <input type="text" class="form-control" placeholder="MM/YY" maxlength="5">
            </div>
            <div class="form-group">
              <label>CVV</label>
              <input type="password" class="form-control" placeholder="***" maxlength="3">
            </div>
          </div>
        </div>
        
        <!-- Net Banking Method -->
        <div class="method-content" id="method-netbank">
          <div class="form-group">
            <label>Select Your Bank</label>
            <select class="form-control">
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Punjab National Bank</option>
            </select>
          </div>
        </div>
        
        <button class="btn-payment-confirm" id="btn-pay-now">Pay ₹<span id="pay-amount-label"></span></button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Set modal details
  modal.querySelector('#summary-cause').innerText = cause.toUpperCase();
  modal.querySelector('#summary-amount').innerText = '₹' + parseInt(amount, 10).toLocaleString('en-IN');
  modal.querySelector('#pay-amount-label').innerText = parseInt(amount, 10).toLocaleString('en-IN');
  
  // Bind actions
  const closeBtn = modal.querySelector('.payment-close');
  closeBtn.onclick = () => modal.classList.remove('active');
  
  const methodBtns = modal.querySelectorAll('.method-btn');
  const methodContents = modal.querySelectorAll('.method-content');
  
  methodBtns.forEach(btn => {
    btn.onclick = () => {
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const target = btn.getAttribute('data-method');
      methodContents.forEach(content => {
        if (content.id === `method-${target}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    };
  });
  
  const payBtn = modal.querySelector('#btn-pay-now');
  payBtn.onclick = () => {
    // Show spinner loading state
    payBtn.disabled = true;
    payBtn.innerHTML = `<div class="spinner"></div>`;
    
    // Simulate transaction delay
    setTimeout(() => {
      modal.classList.remove('active');
      // Redirect to Thank You page with URL params
      const escName = encodeURIComponent(name);
      const escAmount = encodeURIComponent(amount);
      const escCause = encodeURIComponent(cause);
      window.location.href = `thankyou.html?name=${escName}&amount=${escAmount}&cause=${escCause}`;
    }, 2000);
  };
  
  // Open modal
  modal.classList.add('active');
}

// 8. Thank You Page Receipt Generation
function initThankYouPage() {
  const receiptCard = document.querySelector('.receipt-card');
  if (!receiptCard) return;
  
  // Read params
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || 'Generous Donor';
  const amount = parseInt(params.get('amount'), 10) || 1000;
  const cause = params.get('cause') || 'General Support';
  
  const dateObj = new Date();
  const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const txRef = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);
  
  // Inject details
  document.getElementById('receipt-name').innerText = name;
  document.getElementById('receipt-date').innerText = dateStr;
  document.getElementById('receipt-ref').innerText = txRef;
  document.getElementById('receipt-cause').innerText = cause.toUpperCase();
  document.getElementById('receipt-subtotal').innerText = '₹' + amount.toLocaleString('en-IN');
  document.getElementById('receipt-total-val').innerText = '₹' + amount.toLocaleString('en-IN');
  
  const taxSavings = Math.floor(amount * 0.5);
  document.getElementById('receipt-savings').innerText = '₹' + taxSavings.toLocaleString('en-IN');
  
  // Share buttons
  const shareText = `I just supported the NayePankh Foundation in their mission for ${cause}. You can make a difference too and get 80G tax benefits! #NayePankh`;
  const shareUrl = 'https://nayepankh.com';
  
  const twitterBtn = document.getElementById('share-twitter');
  const whatsappBtn = document.getElementById('share-whatsapp');
  
  if (twitterBtn) {
    twitterBtn.onclick = () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
  }
  
  if (whatsappBtn) {
    whatsappBtn.onclick = () => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    };
  }
}
