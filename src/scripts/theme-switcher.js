const logoTriggers = document.querySelectorAll('.js-interactive-logo-trigger');
const colors = ['#FF4438', '#004CFF', '#7000FF'];
let activeColorIndex = 0;

logoTriggers.forEach((logoTrigger) => {
  logoTrigger.addEventListener('click', () => {
    activeColorIndex = (activeColorIndex + 1) % colors.length;
    document.documentElement.style.setProperty('--color-accent', colors[activeColorIndex]);
  });
});

const themeSwitchTrigger = document.querySelector('.js-theme-switch-trigger');

if (themeSwitchTrigger) {
  themeSwitchTrigger.addEventListener('click', () => {
    document.documentElement.classList.toggle('is-dark');
  });
}
