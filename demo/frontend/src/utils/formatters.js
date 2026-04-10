// Formate une date ISO en dd/mm/yyyy
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR')
}

// Formate un montant en euros
export const formatMontant = (montant) => {
  if (montant == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(montant)
}

// Tronque un texte long
export const truncate = (str, max = 40) => {
  if (!str) return '—'
  return str.length > max ? str.slice(0, max) + '…' : str
}