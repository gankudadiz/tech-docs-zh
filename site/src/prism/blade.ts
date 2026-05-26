import {Prism} from 'prism-react-renderer';

const directivePattern =
  /@(?!\s)(?:auth|can|cannot|case|checked|choice|class|continue|csrf|dd|disabled|dump|each|else|elseif|empty|endauth|endcan|endcannot|endcase|endempty|endenv|enderror|endfor|endforeach|endforelse|endif|endisset|endonce|endphp|endproduction|endpush|endsection|endswitch|endunless|endwhile|env|error|extends|for|foreach|forelse|fragment|hasSection|if|include|includeFirst|includeIf|includeUnless|inject|isset|js|json|lang|method|once|php|production|props|push|pushIf|section|selected|session|show|stack|stop|style|switch|unless|vite|while|yield)\b(?:\s*\([^)]*\))?/;

Prism.languages.blade = {
  comment: /\{\{--[\s\S]*?--\}\}/,
  echo: {
    pattern: /\{\{\{?[\s\S]*?\}?\}\}/,
    greedy: true,
    inside: Prism.languages.php,
  },
  directive: {
    pattern: directivePattern,
    greedy: true,
    alias: 'keyword',
    inside: Prism.languages.php,
  },
  'livewire-attribute': {
    pattern:
      /\b(?:wire:[\w.-]+|x-[\w:-]+|:[\w.-]+|@[\w.-]+)(?=(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)/,
    alias: 'attr-name',
  },
  markup: {
    pattern: /<\/?[A-Za-z][\s\S]*?>/,
    inside: Prism.languages.markup,
  },
};
