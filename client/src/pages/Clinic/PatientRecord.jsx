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

const PatientRecord = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [patientExist, setPatientExist] = useState(false)
  const [searchPatientAddress, setSearchPatientAddress] = useState('')
  const [addPatientAddress, setAddPatientAddress] = useState('')
  const [addPatientName, setAddPatientName] = useState('')
  const [records, setRecords] = useState([])
  const [addRecord, setAddRecord] = useState(false)

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
        setSearchPatientAddress('');
      } else {
        setAlert('Patient does not exist', 'error')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const registerPatient = async () => {
    try {
      await contract.methods.addPatient(addPatientAddress, addPatientName).send({ from: accounts[0] })
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

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  } else {
    return (
        <>
          {!accounts ? (
            <Box display='flex' justifyContent='center'>
              <Typography variant='h6'>Open your MetaMask wallet to get connected, then refresh this page</Typography>
            </Box>
          ) : (
            <>
              {role === 'clinic' && (
                <>
                  <Modal open={addRecord} onClose={() => setAddRecord(false)}>
                    <AddRecordModal
                      handleClose={() => setAddRecord(false)}
                      handleUpload={addRecordCallback}
                      patientAddress={searchPatientAddress}
                    />
                  </Modal>

                  <Typography variant='h4'>Register Patient</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Enter Patient Wallet Address'
                        value={addPatientAddress}
                        onChange={e => setAddPatientAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <FormControl fullWidth mx={2}>
                      <TextField
                        variant='outlined'
                        placeholder='Enter Patient Name'
                        value={addPatientName}
                        onChange={e => setAddPatientName(e.target.value)}
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

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

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
                    {/* <CustomButton text={'New Record'} handleClick={() => setAddRecord(true)} disabled={!patientExist}>
                      <CloudUploadRoundedIcon style={{ color: 'white' }} />
                    </CustomButton> */}
                  </Box>

                  {patientExist && records.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {patientExist && records.length > 0 && (
                    <>
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      {records.map((record, index) => (
                        <Box mb={2}>
                          <Record key={index} record={record} />
                        </Box>
                      ))}
                    </Box>
                    <Box my={3}>
                    <CustomButton mx={2} text={'Close'} handleClick={() => setPatientExist(false)}>
                      <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
                  </Box>
                  </>
                  )}

                <Box mt={6} mb={4}>
                    <Divider />
                </Box>

                </>
              )}
            </>
          )}
          </>
    )
  }
}

export default PatientRecord