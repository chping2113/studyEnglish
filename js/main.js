document.querySelectorAll('.category-soon').forEach(function (card) {
  card.addEventListener('click', function (e) {
    e.preventDefault();
    card.style.animation = 'shake 0.4s ease';
    setTimeout(function () {
      card.style.animation = '';
    }, 400);
  });
});

var shakeStyle = document.createElement('style');
shakeStyle.textContent =
  '@keyframes shake {' +
  '0%, 100% { transform: translateX(0); }' +
  '25% { transform: translateX(-6px); }' +
  '75% { transform: translateX(6px); }' +
  '}';
document.head.appendChild(shakeStyle);
