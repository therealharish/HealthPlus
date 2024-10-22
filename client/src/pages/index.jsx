//Index.jsx pages

import { Box, Typography, Backdrop, CircularProgress} from '@mui/material'
import React from 'react'
import VideoCover from 'react-video-cover'
import BackgroundVideo from '../assets/BackgroundVideo.mp4'
import logo from '../assets/tealNoBG-cropped.png'
import useEth from '../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import CustomButton from '../components/CustomButton'
import { useNavigate } from 'react-router-dom'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import '../App.css'

const Home = () => {
  const {
    state: { contract, accounts, role, loading },
    dispatch,
  } = useEth()
  const navigate = useNavigate()

  const registerHospital = async () => {
    try {
      await contract.methods.addHospital().send({ from: accounts[0] })
      dispatch({
        type: 'ADD_HOSPITAL',
      })
      console.log('hospital added')
    }
    catch (err) {
      console.error(err)
    }
  }

  const registerDiagnostic = async () => {
    try {
      await contract.methods.addDiagnostic().send({ from: accounts[0] })
      dispatch({
        type: 'ADD_DIAGNOSTIC',
      })
      console.log('diagnostic center added')
    }
    catch (err) {
      console.error(err)
    }
  }

  const registerClinic = async () => {
    try {
      await contract.methods.addClinic().send({ from: accounts[0] })
      dispatch({
        type: 'ADD_CLINIC',
      })
      console.log('diagnostic center added')
    }
    catch (err) {
      console.error(err)
    }
  }

  const ActionSection = () => {
    if (!accounts) {
      return (
        <Typography variant='h5' color='white'>
          Open your MetaMask wallet to get connected, then refresh this page
        </Typography>
      )
    } else {
      if (role === 'unknown' || role === undefined || role === null) {
        return (
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box mb={2}>
              <CustomButton text='Hospital Register' handleClick={() => registerHospital()}>
                <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
              </CustomButton>
            </Box>
            <Box mb={2}>
              <CustomButton text='Clinic Register' handleClick={() => registerClinic()}>
                <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
              </CustomButton>
            </Box>
            <Box mb={2}>
              <CustomButton text='Diagnostic Center Register' handleClick={() => registerDiagnostic()}>
                <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
              </CustomButton>
            </Box>
            <Typography variant='h5' color='white'>
              If you are a patient or a doctor, ask one of the above to register for you! 🫶
            </Typography>
          </Box>
        )
      } else if (role === 'patient') {
        return (
          <CustomButton text='Patient Portal' handleClick={() => navigate('/patient')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } else if (role === 'doctor') {
        return (
          <CustomButton text='Doctor Portal' handleClick={() => navigate('/doctor')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } else if (role === 'hospital') {
        return (
          <CustomButton text='Hospital Portal' handleClick={() => navigate('/hospital')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } else if (role === 'clinic') {
        return (
          <CustomButton text='Clinic Portal' handleClick={() => navigate('/clinic')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } else if (role === 'diagnostic') {
        return (
          <CustomButton text='Diagnostic Portal' handleClick={() => navigate('/diagnostic')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      }
    }
  }

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  } else {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        width='100vw'
        height='100vh'
        id='background'
      >
        <Box
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <VideoCover
            videoOptions={{
              src: BackgroundVideo,
              autoPlay: true,
              loop: true,
              muted: true,
            }}
          />
        </Box>
        <Box id='home-page-box' display='flex' flexDirection='column' justifyContent='center' alignItems='center' p={5}>
          <img src={logo} alt='med-chain-logo' style={{ height: 70 }} />
          <Box mt={2} mb={5}>
            <Typography variant='h4' color='white'>
              Own Your Health
            </Typography>
          </Box>
          <ActionSection />
        </Box>
      </Box>
    )
  }
}

export default Home