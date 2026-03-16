const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const year = document.getElementById('year');
const leadForm = document.getElementById('lead-form');
const formMessage = document.getElementById('form-message');
const bookingForm = document.getElementById('booking-form');
const bookingMessage = document.getElementById('booking-message');

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

    const fullName = String(bookingForm['full-name'].value || '').trim();
    const email = String(bookingForm['business-email'].value || '').trim();
    const businessName = String(bookingForm['business-name'].value || '').trim();
    const supportType = String(bookingForm['support-type'].value || '').trim();
    const needs = String(bookingForm.needs.value || '').trim();
    const meetingTime = String(bookingForm['meeting-time'].value || '').trim();

    if (!fullName || !email || !supportType || !needs || !meetingTime) {
      bookingMessage.textContent = 'Please complete all required fields.';
      bookingMessage.className = 'form-message error';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      bookingMessage.textContent = 'Please enter a valid email address.';
      bookingMessage.className = 'form-message error';
      return;
    }

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
        bookingForm.reset();
      })
      .catch(() => {
        bookingMessage.textContent = 'Unable to send right now. Please try again.';
        bookingMessage.className = 'form-message error';
      });
  });
}
