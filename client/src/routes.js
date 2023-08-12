// Guards
import Layout from './components/layouts/Layout'
import AlertPopup from './components/layouts/AlertPopup'

// Pages
import Home from './pages'
import Patient from './pages/patient'
import Doctor from './pages/doctor'
import Hospital from './pages/hospital'
import HeaderAppBar from './components/layouts/Layout'

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
            <Hospital />
          </>
        ),
      },
      {
        path: 'diagnostic',
        element: (
          <>
            <HeaderAppBar />
            <AlertPopup />
            <Hospital />
          </>
        ),
      },
    ],
  },
]

export default routes