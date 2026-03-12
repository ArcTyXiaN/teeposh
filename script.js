const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const year = document.getElementById('year');
const leadForm = document.getElementById('lead-form');
const formMessage = document.getElementById('form-message');

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

    formMessage.textContent = 'Thank you. Your details were captured.';
    formMessage.className = 'form-message ok';
    leadForm.reset();
  });
}
