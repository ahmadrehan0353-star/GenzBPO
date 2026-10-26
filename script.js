/* ==========================================================================
   GenzBPO Interactive Script (script.js)
   Handles Mobile Menu, Service Filtering, Modals, ROI Calculator & Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar & Mobile Drawer Toggle
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // 2. Service Category Filtering (All / Healthcare / Tech & HR)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selected = btn.getAttribute('data-filter');
        serviceCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (selected === 'all' || selected === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Interactive ROI & Reimbursement Calculator
  const patientInput = document.getElementById('patientRange');
  const devInput = document.getElementById('devRange');
  const patientValueEl = document.getElementById('patientVal');
  const devValueEl = document.getElementById('devVal');
  const totalRoiEl = document.getElementById('totalRoiResult');
  const breakdownEl = document.getElementById('roiBreakdown');

  function updateCalculator() {
    if (!patientInput || !devInput) return;
    const patients = parseInt(patientInput.value, 10);
    const devs = parseInt(devInput.value, 10);

    patientValueEl.textContent = `${patients} Enrolled Patients`;
    devValueEl.textContent = `${devs} Remote Specialists`;

    // Avg Medicare RPM + CCM revenue ~$118/patient/mo -> annual
    const annualHealthcareRev = patients * 118 * 12;
    // Avg Annual BPO / Remote Engineering & HR payroll savings ~$42,000 per FTE
    const annualTeamSavings = devs * 42000;
    const combinedImpact = annualHealthcareRev + annualTeamSavings;

    totalRoiEl.textContent = '$' + combinedImpact.toLocaleString();
    breakdownEl.textContent = `Includes ~$${annualHealthcareRev.toLocaleString()}/yr in RPM/CCM Medicare reimbursements + $${annualTeamSavings.toLocaleString()}/yr in remote staffing savings.`;
  }

  if (patientInput && devInput) {
    patientInput.addEventListener('input', updateCalculator);
    devInput.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // 4. Service Deep-Dive Modal System
  const serviceDetails = {
    rpm: {
      badge: 'Clinical Care & Telemetry',
      title: 'Remote Patient Monitoring (RPM)',
      desc: 'End-to-end cellular and Bluetooth vitals monitoring powered by RPMatrix (rpmatrix.com). Our clinical nurses monitor blood pressure, blood glucose, pulse oximetry, and weight 24/7 while maximizing CPT 99453, 99454, 99457, and 99458 compliance.',
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
      desc: 'Recruit, onboard, monitor, and retain top-tier remote healthcare, engineering, and BPO talent globally—backed by Genzhours (genzhours.com) workforce analytics.',
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

  document.querySelectorAll('[data-service-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-service-modal');
      const data = serviceDetails[key];
      if (!data || !modalOverlay) return;

      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalList.innerHTML = data.bullets
        .map(item => `<li><span>✓</span> ${item}</li>`)
        .join('');

      modalOverlay.classList.add('open');
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  // 5. Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName')?.value || 'Partner';
      const service = document.getElementById('serviceInterest')?.value || 'Enterprise Solution';

      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.innerHTML = `✅ Thank you, <strong>${name}</strong>! Your inquiry regarding <strong>${service}</strong> has been received. Our solutions team will reach out within 2 business hours.`;
      }
      contactForm.reset();
    });
  }
});
