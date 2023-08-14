const actions = {
  init: 'INIT',
  addDoctor: 'ADD_DOCTOR',
  addHospital: 'ADD_HOSPITAL',
  addDiagnostic: 'ADD_DIAGNOSTIC',
  addClinic: 'ADD_CLINIC',
}

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  role: 'unknown',
  loading: true,
}

const reducer = (state, action) => {
  const { type, data } = action
  switch (type) {
    case actions.init:
      return { ...state, ...data }
    case actions.addDoctor:
      return { state: { ...state, role: 'doctor' } }
    case actions.addHospital:
      return { state: { ...state, role: 'hospital' } }
    case actions.addDiagnostic:
      return { state: { ...state, role: 'diagnostic' } }
    case actions.addClinic:
      return { state: { ...state, role: 'clinic' } }
    default:
      throw new Error('Undefined reducer action type')
  }
}

export { actions, initialState, reducer }
