" @return {String}
function! dps#godoc#internal#get_godoc_executable() abort
  return get(g:, 'dps_godoc_executable', 'go')
endfunction

" @param {String} pacakge
" @return {String[]}
function! dps#godoc#internal#get_godoc_args(package) abort
  return map(get(g:, 'dps_godoc_args', ['doc', '--', v:null]), 'v:val is# v:null ? a:package : v:val')
endfunction

function! dps#godoc#internal#setup() abort
  augroup dps-godoc-internal
    autocmd BufReadCmd godoc://* call denops#request_async('godoc', 'godocSetup', [bufnr()], {->0}, {->0})
    autocmd SessionLoadPost godoc://* call denops#request_async('godoc', 'godocSetup', [bufnr()], {->0}, {->0})
  augroup END
endfunction

" @param {Number} bufnr
function! dps#godoc#internal#setup_buffer(bufnr) abort
  if getbufinfo('%')[0].linecount == 1
    call dps#godoc#internal#setbufline(a:bufnr, 1, 'processing...')
  endif
  call setbufvar(a:bufnr, '&filetype', 'godoc')
  call setbufvar(a:bufnr, '&modifiable', 0)
  call setbufvar(a:bufnr, '&readonly', 1)
  call setbufvar(a:bufnr, '&modified', 0)
endfunction

" @param {Number} bufnr
" @param {Number} linenr
" @param {String | String[]} line
function! dps#godoc#internal#setbufline(bufnr, linenr, line) abort
  call setbufvar(a:bufnr, '&modifiable', 1)
  call setbufvar(a:bufnr, '&readonly', 0)

  try
    call setbufline(a:bufnr, a:linenr, a:line)
  finally
    call setbufvar(a:bufnr, '&modifiable', 0)
    call setbufvar(a:bufnr, '&readonly', 1)
    call setbufvar(a:bufnr, '&modified', 0)
  endtry
endfunction
