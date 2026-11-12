/* ==========================================================================
   GenzBPO interactive script
   Theme toggle, mobile menu, service filtering, ROI calculator,
   service detail modal and the contact form handler.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Theme -------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  let darkModeEnabled = false;
  try {
    darkModeEnabled = localStorage.getItem('genzbpo-theme') === 'dark';
  } catch {
    darkModeEnabled = false;
  }
  document.body.classList.toggle('dark-mode', darkModeEnabled);

  if (themeToggle) {
    const updateThemeButton = () => {
      const isDark = document.body.classList.contains('dark-mode');
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
      themeToggle.setAttribute('aria-pressed', String(isDark));
    };
    updateThemeButton();
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      try {
        localStorage.setItem('genzbpo-theme', isDark ? 'dark' : 'light');
      } catch {
        // The page still switches theme when storage is unavailable.
      }
      updateThemeButton();
    });
  }

  // ---- Sticky header & mobile menu --------------------------------------
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (mobileToggle && navLinks) {
    const setMenu = (open) => {
      navLinks.classList.toggle('active', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    mobileToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        setMenu(false);
        mobileToggle.focus();
      }
    });
  }

  // ---- Service filtering -------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const selected = btn.getAttribute('data-filter');
      serviceCards.forEach(card => {
        const match = selected === 'all' || selected === card.getAttribute('data-category');
        card.hidden = !match;
      });
    });
  });

  // ---- ROI calculator ----------------------------------------------------
  const patientInput = document.getElementById('patientRange');
  const devInput = document.getElementById('devRange');
  const patientValueEl = document.getElementById('patientVal');
  const devValueEl = document.getElementById('devVal');
  const totalRoiEl = document.getElementById('totalRoiResult');
  const breakdownEl = document.getElementById('roiBreakdown');

  const paintFill = (input) => {
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const pct = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.setProperty('--fill', `${pct}%`);
  };

  function updateCalculator() {
    if (!patientInput || !devInput) return;
    const patients = parseInt(patientInput.value, 10);
    const devs = parseInt(devInput.value, 10);

    patientValueEl.textContent = `${patients.toLocaleString()} Enrolled Patients`;
    devValueEl.textContent = `${devs} Remote Specialists`;

    // Avg Medicare RPM + CCM revenue ~$118/patient/mo -> annual
    const annualHealthcareRev = patients * 118 * 12;
    // Avg annual BPO / remote engineering & HR payroll savings ~$42,000 per FTE
    const annualTeamSavings = devs * 42000;
    const combinedImpact = annualHealthcareRev + annualTeamSavings;

    totalRoiEl.textContent = '$' + combinedImpact.toLocaleString();
    breakdownEl.textContent = `Includes ~$${annualHealthcareRev.toLocaleString()}/yr in RPM/CCM Medicare reimbursements + $${annualTeamSavings.toLocaleString()}/yr in remote staffing savings.`;

    paintFill(patientInput);
    paintFill(devInput);
  }

  if (patientInput && devInput) {
    patientInput.addEventListener('input', updateCalculator);
    devInput.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // ---- Service detail modal ---------------------------------------------
  const serviceDetails = {
    rpm: {
      badge: 'Clinical Care & Telemetry',
      title: 'Remote Patient Monitoring (RPM)',
      desc: 'End-to-end cellular and Bluetooth vitals monitoring powered by RPMatrix. Our clinical nurses monitor blood pressure, blood glucose, pulse oximetry, and weight 24/7 while maximizing CPT 99453, 99454, 99457, and 99458 compliance.',
      bullets: [
        'FDA-cleared cellular devices shipped directly to patients',
        'Real-time red-flag escalation by dedicated clinical staff',
        'Automated 16-day transmission & 20-minute time tracking logs',
        'Seamless EHR integration & audit-ready monthly billing reports'
      ]
    },
    ccm: {
      badge: 'Proactive Patient Retention',
      title: 'Chronic Care Management (CCM)',
      desc: 'Dedicated care coordinators engage patients with two or more chronic conditions every month, reducing hospital readmissions and capturing CPT 99490, 99439, and 99487 reimbursements.',
      bullets: [
        'Personalized comprehensive care plans & medication reconciliation',
        '24/7 patient access line for urgent chronic care guidance',
        'Bilingual clinical outreach specialists to boost adherence',
        'Zero upfront staffing burden for your medical practice'
      ]
    },
    software: {
      badge: 'Enterprise Engineering',
      title: 'Custom Software Development',
      desc: 'Scalable microservices, HIPAA-compliant healthcare platforms, SaaS ecosystems, and AI-assisted enterprise automation engineered for mission-critical reliability.',
      bullets: [
        'Python, Django, Node.js, PostgreSQL & cloud-native Docker architectures',
        'HL7 / FHIR interoperability & custom EHR/EMR integrations',
        'End-to-end automated QA, DevSecOps & SOC2/HIPAA security patterns',
        'Dedicated Agile squads aligned with your timezone'
      ]
    },
    web: {
      badge: 'Full-Stack Web',
      title: 'Modern Web Development',
      desc: 'Ultra-fast, SEO-optimized web applications, enterprise portals, and high-converting digital storefronts built with modern frameworks.',
      bullets: [
        'React, Next.js, TypeScript, Tailwind CSS & scalable REST/GraphQL APIs',
        'Core Web Vitals optimization (99+ Lighthouse performance)',
        'Interactive analytics dashboards & SaaS multi-tenant portals',
        'WCAG accessibility & enterprise-grade responsive design'
      ]
    },
    app: {
      badge: 'iOS & Android',
      title: 'Mobile App Development',
      desc: 'Intuitive native and cross-platform mobile applications for telehealth, on-demand commerce, IoT device pairing, and workforce productivity.',
      bullets: [
        'React Native & Flutter cross-platform mobile engineering',
        'Bluetooth Low Energy (BLE) medical device & wearable integration',
        'Biometric authentication, offline sync & push notification pipelines',
        'Full App Store (iOS) & Google Play lifecycle management'
      ]
    },
    hr: {
      badge: 'Global Talent & Workforce',
      title: 'Remote HR & Workforce Management',
      desc: 'Recruit, onboard, monitor, and retain top-tier remote healthcare, engineering, and BPO talent globally, backed by Genzhours (genzhours.com) workforce analytics.',
      bullets: [
        'Rapid talent sourcing & technical/clinical vetting within 7 days',
        'Automated attendance, shift scheduling & productivity tracking via Genzhours',
        'Global payroll compliance, benefits administration & KPI reviews',
        'Up to 60% reduction in operational overhead costs'
      ]
    }
  };

  const modalOverlay = document.getElementById('serviceModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalList = document.getElementById('modalList');
  let lastTrigger = null;

  const openModal = (data, trigger) => {
    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalList.replaceChildren(...data.bullets.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    lastTrigger = trigger;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  };

  const closeModal = () => {
    if (!modalOverlay?.classList.contains('open')) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  document.querySelectorAll('[data-service-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const data = serviceDetails[button.getAttribute('data-service-modal')];
      if (data && modalOverlay) openModal(data, button);
    });
  });

  if (modalOverlay) {
    modalClose?.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (!modalOverlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const focusable = modalOverlay.querySelectorAll('a[href], button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // ---- Contact form ------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const serviceInterest = document.getElementById('serviceInterest');

  if (serviceInterest && new URLSearchParams(window.location.search).get('interest') === 'rpmatrix') {
    serviceInterest.value = 'RPMatrix Product Demo';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submission = new FormData(contactForm);
      const name = submission.get('fullName')?.toString().trim() || 'Partner';
      const email = submission.get('email')?.toString().trim() || '';
      const phone = submission.get('phone')?.toString().trim() || 'Not provided';
      const service = submission.get('serviceInterest')?.toString() || 'Enterprise Solution';
      const message = submission.get('message')?.toString().trim() || 'Not provided';
      const subject = `GenzBPO inquiry: ${service}`;
      const body = [
        `Name: ${name}`,
        `Work email: ${email}`,
        `Phone / WhatsApp: ${phone}`,
        `Service or product: ${service}`,
        '',
        'Project details:',
        message
      ].join('\r\n');
      const mailtoUrl = `mailto:info@genzbpo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.textContent = 'Your email app should open with this inquiry addressed to info@genzbpo.com. Review the message and press Send. If it does not open, email info@genzbpo.com directly.';
      }
      window.location.href = mailtoUrl;
    });
  }
});
