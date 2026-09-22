// Runs before hydration (rendered as the first thing in <head>, see app/layout.tsx) so the
// `dark` class is on <html> before the browser paints — otherwise the page would flash light
// and then snap to dark once React mounts. Kept out of any bundle: it's inline, blocking HTML.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
