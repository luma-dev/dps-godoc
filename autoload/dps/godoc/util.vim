" @return {String}
function! dps#godoc#util#goimport_cword() abort
  let l:iskeyword_saved = &l:iskeyword
  let &l:iskeyword = '@,_,/,.,-,48-57'
  let goimport_cword = expand('<cword>')
  let &l:iskeyword = l:iskeyword_saved
  return goimport_cword
endfunction
