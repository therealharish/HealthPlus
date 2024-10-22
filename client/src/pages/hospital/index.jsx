import { Box, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useCallback } from 'react'
import { useState } from 'react'
import useEth from '../../contexts/EthContext/useEth'
import useAlert from '../../contexts/AlertContext/useAlert'
import ipfs from '../../ipfs'
import Record from '../../components/Record'
import PatientRecord from './PatientRecord'
import DoctorRecord from './DoctorRecord'

const Hospital = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [patientExist, setPatientExist] = useState(false)
  const [searchPatientAddress, setSearchPatientAddress] = useState('')
  const [addPatientAddress, setAddPatientAddress] = useState('')
  const [records, setRecords] = useState([])
  const [addRecord, setAddRecord] = useState(false)

  const [doctorExist, setDoctorExist] = useState(false)
  const [searchDoctorAddress, setSearchDoctorAddress] = useState('')
  const [addDoctorAddress, setAddDoctorAddress] = useState('')
  const [doctorList, setDoctorList] = useState([])
  const [addDoctorName, setAddDoctorName] = useState('')
  const [doctorRecord, setDoctorRecord] = useState([])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCount((count) => count + 1);
  //   }, 1000);
  // });


  const searchPatient = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchPatientAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      const patientExists = await contract.methods.checkPatientExists(searchPatientAddress).call({ from: accounts[0] })
      if (patientExists) {
        const records = await contract.methods.getRecords(searchPatientAddress).call({ from: accounts[0] })
        console.log('records :>> ', records)
        setRecords(records)
        setPatientExist(true)
      } else {
        setAlert('Patient does not exist', 'error')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const registerPatient = async () => {
    try {
      await contract.methods.addPatient(addPatientAddress).send({ from: accounts[0] })
    } catch (err) {
      console.error(err)
    }
  }

  const addRecordCallback = useCallback(
    async (buffer, fileName, patientAddress) => {
      if (!patientAddress) {
        setAlert('Please search for a patient first', 'error')
        return
      }
      try {
        const res = await ipfs.add(buffer)
        const ipfsHash = res[0].hash
        if (ipfsHash) {
          await contract.methods.addRecord(ipfsHash, fileName, patientAddress).send({ from: accounts[0] })
          setAlert('New record uploaded', 'success')
          setAddRecord(false)

          // refresh records
          const records = await contract.methods.getRecords(patientAddress).call({ from: accounts[0] })
          setRecords(records)
        }
      } catch (err) {
        setAlert('Record upload failed', 'error')
        console.error(err)
      }
    },
    [addPatientAddress, accounts, contract]
  )


  // Search and Register Doctor (by Hospital)
  const searchDoctor = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchDoctorAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      console.log(searchDoctorAddress)
      const doctorExists = await contract.methods.checkDoctorExists(searchDoctorAddress).call({ from: accounts[0] })
      console.log(doctorExists)
      console.log(doctorRecord)
      if (doctorExists) {
        const records = await contract.methods.getDoctor(searchDoctorAddress).call({ from: accounts[0] })
        console.log('records :>> ', [records[0], records[1]])
        const temp = [records[0], records[1]];
        setDoctorExist(true)
        setAddDoctorAddress(records[0]);
        setAddDoctorName(records[1]);
        // setDoctorRecord(temp);
        // console.log("records: ", temp);
        // console.log("doctor record ", doctorRecord);
      } else {
        setAlert('Doctor does not exist', 'error')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const registerDoctor = async () => {
    try {
      await contract.methods.addDoctor(addDoctorAddress, addDoctorName).send({ from: accounts[0] })
      // console.log("doctor added")
      // const records = await contract.methods.getDoctorList(addDoctorAddress).call({ from: accounts[0] })
      //   console.log('records :>> ', records)
      //   setDoctorList(records)
      //   setDoctorExist(true)
    } catch (err) {
      console.error(err)
    }
  }

  const viewDoctor = async () => {
    try {
      // const records = await contract.methods.getDoctorList(searchDoctorAddress).call({ from: accounts[0] })
      const records = await contract.methods.getDoctorList(accounts[0]).call({ from: accounts[0] })
      console.log('records : ', records)
      setDoctorExist(true)
      setDoctorList(records)
      console.log(doctorList);
    }
    catch (err) {
      console.log("View Doctor Error: ", err);
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
      <Box display='flex' justifyContent='center' width='100vw'>
        <Box width='60%' my={5}>
          {!accounts ? (
            <Box display='flex' justifyContent='center'>
              <Typography variant='h6'>Open your MetaMask wallet to get connected, then refresh this page</Typography>
            </Box>
          ) : (
            <>
              {role === 'unknown' && (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>You're not registered, please go to home page</Typography>
                </Box>
              )}
              {(role === 'patient' || role === 'doctor' || role === 'clinic' || role === 'diagnostic')&& (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>Only hospital can access this page</Typography>
                </Box>
              )}
              {role === 'hospital' && (
                <>            
                  <PatientRecord />
                  <DoctorRecord />
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default Hospital