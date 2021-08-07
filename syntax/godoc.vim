if exists("b:current_syntax")
  finish
endif

syntax case ignore
syntax include @go syntax/go.vim
syntax region goDefinition start=+^\%(package\|const\|var\|type\|func\)\s+ end=+\(\n\|$\)\(\S\)\@=+ keepend contains=@go
syntax region goExample start=/\%(^\s\+\)\@<=\S/ end=+$+ keepend contains=@go
