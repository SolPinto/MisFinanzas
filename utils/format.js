// Formatea un número como guaraníes: 150000 → "₲ 150.000"
export function formatGs(value) {
  const n = Math.round(Number(value) || 0);
  const abs = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${n < 0 ? '-' : ''}₲ ${abs}`;
}

// Fecha de hoy en formato YYYY-MM-DD
export function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
