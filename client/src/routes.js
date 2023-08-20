// Guards
import AlertPopup from './components/layouts/AlertPopup'

// Pages
import Home from './pages'
import Patient from './pages/patient'
import Doctor from './pages/doctor'
import Hospital from './pages/hospital'
import Diagnostic from './pages/Diagnostic'
import HeaderAppBar from './components/layouts/Layout'
import Clinic from './pages/Clinic'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        element: (
          <>
            <AlertPopup />
            <Home />
          </>
        ),
      },
      {
        path: 'patient',
        element: (
          <>
            <HeaderAppBar />
            <AlertPopup />
            <Patient />
          </>
        ),
      },
      {
        path: 'doctor',
        element: (
          <>
            <HeaderAppBar />
            <AlertPopup />
            <Doctor />
          </>
        ),
      },
      {
        path: 'hospital',
        element: (
          <>

            <HeaderAppBar />
            <AlertPopup />
            <Hospital />
          </>
        ),
      },
      {
        path: 'clinic',
        element: (
          <>
            <HeaderAppBar />
            <AlertPopup />
            <Clinic />
          </>
        ),
      },
      {
        path: 'diagnostic',
        element: (
          <>
            <HeaderAppBar />
            <AlertPopup />
            <Diagnostic />
          </>
        ),
      },
    ],
  },
]

export default routes