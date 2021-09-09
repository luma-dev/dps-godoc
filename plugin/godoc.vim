command! -bar -complete=customlist,go#complete#Package -nargs=? Godoc
    \ execute "edit godoc://" . (
    \     empty(<q-args>) ? dps#godoc#util#goimport_cword() : <q-args>
    \ )

augroup dps-godoc-internal
  autocmd BufReadCmd godoc://* call dps#godoc#internal#setup_buffer(bufnr())
  autocmd SessionLoadPost godoc://* call dps#godoc#internal#setup_buffer(bufnr())
augroup END
