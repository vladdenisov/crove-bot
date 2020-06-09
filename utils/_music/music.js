
nums = document.getElementsByClassName('prob_nums');
inps = document.getElementsByClassName('test_inp');
[...nums].map(e => {
$.get('/problem?id=' + e.children[0].innerHTML).then(html => {
let answer;
answer_txt = $(html).find('.answer')[0].innerText
if (answer_txt.indexOf('|') !== -1) {
 answer = answer_txt.slice(7, answer_txt.indexOf('|'))}
else { answer = answer_txt.slice(7)}
inps[i+5].value = answer
}, () => {
    console.log('Ошибка доступа')
});}