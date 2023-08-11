import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useCallback } from 'react'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import AddRecordModal from '../doctor/AddRecordModal'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import ipfs from '../../ipfs'
import Record from '../../components/Record'

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
  // const [addRecord, setAddRecord] = useState(false)

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
      if (doctorExists) {
        const records = await contract.methods.getDoctor(searchDoctorAddress).call({ from: accounts[0] })
        console.log('records :>> ', records)
        // console.log('records 1: ', records.id);
        // console.log('records 2', records.docName)
        const doctorRecord = {};
        doctorRecord.id = records.id;
        doctorRecord.docName = records.docName;
        console.log("doctorrecord: ", [doctorRecord]);

        setDoctorList([doctorRecord]);
        console.log("doctor list ", doctorList);
        setDoctorExist(true)
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
      setDoctorList({records})
      setDoctorExist(true)
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
              {role === 'patient' && (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>Only hospital can access this page</Typography>
                </Box>
              )}
              {role === 'hospital' && (
                <>
                  <Modal open={addRecord} onClose={() => setAddRecord(false)}>
                    <AddRecordModal
                      handleClose={() => setAddRecord(false)}
                      handleUpload={addRecordCallback}
                      patientAddress={searchPatientAddress}
                    />
                  </Modal>

                  <Typography variant='h4'>Patient Records</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search patient by wallet address'
                        value={searchPatientAddress}
                        onChange={e => setSearchPatientAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() => searchPatient()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    <CustomButton text={'New Record'} handleClick={() => setAddRecord(true)} disabled={!patientExist}>
                      <CloudUploadRoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
                  </Box>

                  {patientExist && records.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {patientExist && records.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      {records.map((record, index) => (
                        <Box mb={2}>
                          <Record key={index} record={record} />
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Typography variant='h4'>Register Patient</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Register patient by wallet address'
                        value={addPatientAddress}
                        onChange={e => setAddPatientAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Register'} handleClick={() => registerPatient()}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>

                  {/* <Box mt={6} mb={4}>
                    <Divider />
                  </Box> */}



                  {/* <Typography variant='h4'>Registered Doctors</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search doctor by wallet address'
                        value={searchDoctorAddress}
                        onChange={e => setSearchDoctorAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() => searchDoctor()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    <CustomButton text={'New Record'} handleClick={() => setAddRecord(true)} disabled={!patientExist}>
                      <CloudUploadRoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
                  </Box> */}

                  {doctorExist && doctorList.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {doctorExist && doctorList.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      <ul>
                      {doctorList.map((record, index) => (
                        <Box mb={2}>
                          {record}
                          <li>{record.id}</li>
                          <li>{record.docName}</li>
                          {/* <Record key={index} record={record} /> */}
                        </Box>
                      ))}
                      </ul>
                    </Box>
                  )}

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>



                  <Typography variant='h4'>Register Doctor</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Register doctor by wallet address'
                        value={addDoctorAddress}
                        onChange={e => setAddDoctorAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                      <TextField
                        variant='outlined'
                        placeholder='Enter Doctor Name'
                        value={addDoctorName}
                        onChange={e => setAddDoctorName(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Register'} handleClick={() => registerDoctor()}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>



                  <Box mx={2}>
                      <CustomButton text={'View'} handleClick={() => viewDoctor()}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
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