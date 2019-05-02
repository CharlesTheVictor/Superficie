var navigation = document.getElementById('navigation');
var page = document.querySelector('main');

navigation.addEventListener('click', function (e) {
  
  if (page.classList.contains('__transitional')) {
    page.classList.remove('__transitional');  
  } else {
    page.classList.add('__transitional');
  }
  
});

// setTimeout(() => window.open('http://google.com'), 1000);

// let newWindow = open('/', 'example', 'width=300,height=300')
// newWindow.focus();

// newWindow.onload = function() {
//   let html = `<div style="font-size:30px">Welcome!</div>`;
//   newWindow.document.body.insertAdjacentHTML('afterbegin', html);
// };

