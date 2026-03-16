const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const year = document.getElementById('year');
const leadForm = document.getElementById('lead-form');
const formMessage = document.getElementById('form-message');
const bookingForm = document.getElementById('booking-form');
const bookingMessage = document.getElementById('booking-message');
const carousel = document.querySelector('[data-carousel]');
const carouselTrack = document.querySelector('[data-carousel-track]');
const carouselPrev = document.querySelector('[data-carousel-prev]');
const carouselNext = document.querySelector('[data-carousel-next]');
const carouselDots = document.querySelectorAll('[data-carousel-dot]');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});

if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = String(leadForm.name.value || '').trim();
    const email = String(leadForm.email.value || '').trim();
    const ownerEmail = String(leadForm.dataset.ownerEmail || '').trim();

    if (!name || !email) {
      formMessage.textContent = 'Please enter your name and email.';
      formMessage.className = 'form-message error';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      formMessage.className = 'form-message error';
      return;
    }

    if (!ownerEmail || !ownerEmail.includes('@')) {
      formMessage.textContent = 'Owner email is missing. Please update the form email first.';
      formMessage.className = 'form-message error';
      return;
    }

    const subject = encodeURIComponent('New email list subscriber');
    const pageLink = window.location.href;
    const body = encodeURIComponent(
      `A new subscriber joined your email list.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Reply: mailto:${email}\n` +
        `Signup page: ${pageLink}\n`
    );

    window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    formMessage.textContent = 'Opening your email app to notify the site owner...';
    formMessage.className = 'form-message ok';
    leadForm.reset();
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const successBadge = document.getElementById('booking-success');
    const fullName = bookingForm['full-name'];
    const email = bookingForm['business-email'];
    const businessName = bookingForm['business-name'];
    const supportType = bookingForm['support-type'];
    const needs = bookingForm.needs;
    const meetingTime = bookingForm['meeting-time'];

    const fullNameValue = String(fullName.value || '').trim();
    const emailValue = String(email.value || '').trim();
    const supportTypeValue = String(supportType.value || '').trim();
    const needsValue = String(needs.value || '').trim();
    const meetingTimeValue = String(meetingTime.value || '').trim();
    const businessNameValue = String(businessName.value || '').trim();

    const setFieldState = (field, ok) => {
      if (!field) return;
      field.classList.toggle('field-error', !ok);
      field.classList.toggle('field-ok', ok);
      field.setAttribute('aria-invalid', String(!ok));
    };

    const requiredFields = [
      [fullName, fullNameValue],
      [email, emailValue],
      [supportType, supportTypeValue],
      [needs, needsValue],
      [meetingTime, meetingTimeValue],
    ];

    let missingRequired = false;
    requiredFields.forEach(([field, value]) => {
      const ok = Boolean(value);
      setFieldState(field, ok);
      if (!ok) missingRequired = true;
    });

    if (successBadge) {
      successBadge.classList.remove('show');
    }

    if (missingRequired) {
      bookingMessage.textContent = 'Please complete all required fields.';
      bookingMessage.className = 'form-message error';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      setFieldState(email, false);
      bookingMessage.textContent = 'Please enter a valid email address.';
      bookingMessage.className = 'form-message error';
      return;
    }
    setFieldState(email, true);

    bookingMessage.textContent = 'Sending your booking request...';
    bookingMessage.className = 'form-message ok';

    const formData = new FormData(bookingForm);
    fetch(bookingForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Submission failed');
        }
        bookingMessage.textContent = 'Booking request sent successfully.';
        bookingMessage.className = 'form-message ok';
        if (successBadge) {
          successBadge.classList.add('show');
        }
        bookingForm.reset();
        requiredFields.forEach(([field]) => {
          if (field) {
            field.classList.remove('field-error', 'field-ok');
            field.removeAttribute('aria-invalid');
          }
        });
      })
      .catch(() => {
        bookingMessage.textContent = 'Unable to send right now. Please try again.';
        bookingMessage.className = 'form-message error';
      });
  });
}

if (carousel && carouselTrack) {
  const slides = Array.from(carouselTrack.querySelectorAll('.testimonial-slide'));
  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (currentIndex < 0) {
    currentIndex = 0;
    slides[0]?.classList.add('is-active');
  }

  const setActive = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    currentIndex = index;
  };

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    setActive(nextIndex);
  };

  const goPrev = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    setActive(prevIndex);
  };

  if (carouselNext) {
    carouselNext.addEventListener('click', goNext);
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', goPrev);
  }

  carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => setActive(index));
  });

  let autoRotate = setInterval(goNext, 6000);

  const pauseAuto = () => {
    if (autoRotate) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  };

  const resumeAuto = () => {
    if (!autoRotate) {
      autoRotate = setInterval(goNext, 6000);
    }
  };

  carousel.addEventListener('mouseenter', pauseAuto);
  carousel.addEventListener('mouseleave', resumeAuto);
  carousel.addEventListener('focusin', pauseAuto);
  carousel.addEventListener('focusout', resumeAuto);

  let startX = null;
  carouselTrack.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    pauseAuto();
  });
  carouselTrack.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const endX = event.changedTouches[0].clientX;
    const delta = endX - startX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    startX = null;
    resumeAuto();
  });
}
