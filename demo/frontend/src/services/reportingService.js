import api from './api'

export const getTableauDeBord = () =>
  api.get('/reporting/tableau-de-bord').then((r) => r.data)

export const getPhasesTermineesNonFacturees = () =>
  api.get('/reporting/phases/terminees-non-facturees').then((r) => r.data)

export const getPhasesFactureesNonPayees = () =>
  api.get('/reporting/phases/facturees-non-payees').then((r) => r.data)

export const getPhasesPayees = () =>
  api.get('/reporting/phases/payees').then((r) => r.data)

export const getProjetsEnCours = () =>
  api.get('/reporting/projets/en-cours').then((r) => r.data)

export const getProjetsClotures = () =>
  api.get('/reporting/projets/clotures').then((r) => r.data)
