(function () {
  document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    var btn = quiz.querySelector('.reveal-btn');
    var answer = quiz.querySelector('.answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      answer.classList.add('show');
      btn.classList.add('used');
      btn.disabled = true;
    });
  });
})();
