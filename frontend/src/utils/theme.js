export const getThemeClasses = (theme) => ({
  text: {
    primary: theme === 'dark' ? 'text-white' : 'text-slate-900',
    secondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    tertiary: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
  },
  bg: {
    primary: theme === 'dark' ? 'bg-white/[0.02]' : 'bg-white',
    secondary: theme === 'dark' ? 'bg-white/5' : 'bg-slate-100',
    input: theme === 'dark' ? 'bg-white/5' : 'bg-white',
    button: theme === 'dark' ? 'bg-white/[0.03]' : 'bg-slate-100',
  },
  ring: {
    primary: theme === 'dark' ? 'ring-white/10' : 'ring-slate-200',
    hover: theme === 'dark' ? 'hover:ring-white/20' : 'hover:ring-slate-300',
    focus: theme === 'dark' ? 'focus:ring-indigo-500/60' : 'focus:ring-indigo-500',
  },
  placeholder: theme === 'dark' ? 'placeholder-slate-500' : 'placeholder-slate-400',
});
