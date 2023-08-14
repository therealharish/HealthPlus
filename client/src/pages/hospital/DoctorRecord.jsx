import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress, Table, TableBody, TableHead, TableCell, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import useAlert from '../../contexts/AlertContext/useAlert'

const DoctorRecord = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [doctorExist, setDoctorExist] = useState(false)
  const [searchDoctorAddress, setSearchDoctorAddress] = useState('')
  const [addDoctorAddress, setAddDoctorAddress] = useState('')
  const [addDoctorName, setAddDoctorName] = useState('')
  const [doctorRecord, setDoctorRecord] = useState([])

  const [doctorListExist, setDoctorListExist] = useState(false)
  const [doctorList, setDoctorList] = useState([])
//   const [viewDoctorAddress, setView]


  useEffect(() => {
    // setDoctorList
  }, doctorExist);

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
        // console.log('records :>> ', [records[0], records[1]])
        const temp = [records[0], records[1]];
        // console.log(records);
        // console.log([records[0], records[1]]);
        setDoctorExist(true);
        setDoctorRecord([records[0], records[1]]);
        setSearchDoctorAddress('');
        // setAddDoctorAddress(records[0]);
        // setAddDoctorName(records[1]);
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
      setAlert('Doctor has been registered', 'success')
      setAddDoctorAddress('');
      setAddDoctorName('');
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
     
        setDoctorListExist(false);
        const records = await contract.methods.getDoctorList(accounts[0]).call({ from: accounts[0] })
        console.log('records : ', records);
        setDoctorListExist(true);
        setDoctorList(records);
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
    <>
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
                      
                    </FormControl>
                    <FormControl fullWidth>
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

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Typography variant='h4'>View Doctor</Typography>
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
                  </Box>

                  {/* {doctorExist && doctorList.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )} */}

                  {doctorExist && doctorRecord.length == 2 && (
                    <Box display='flex' flexDirection='column' my={5} >
                        <Table m={4}>
                            <TableHead>
                                <TableRow style={{backgroundColor: 'rgba(0, 191, 165, 1)'}}>
                                    <TableCell style={{fontSize: '15px', color: 'White'}}>ID</TableCell>
                                    <TableCell style={{fontSize: '15px', color: 'White'}}>Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{backgroundColor: 'rgba(0, 191, 165, 0.1)'}}>
                                <TableCell style={{fontSize: '13px'}}>{doctorRecord[0]}</TableCell>
                                <TableCell style={{fontSize: '13px'}}>{doctorRecord[1]}</TableCell>
                            </TableBody>
                        </Table>
                        <Box my={3}>
                      <CustomButton mx={2} text={'Close'} handleClick={() => setDoctorExist(false)}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>
                  )}
                  
                <Box mt={6} mb={4}>
                    <Divider />
                  </Box>
                  
                  <Typography variant='h4'>View All Doctors</Typography>
                  <Box my={3}>
                      <CustomButton mx={2} text={'View Doctors'} handleClick={() => viewDoctor()}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    
                    {doctorListExist && doctorList.length !== 0 && (
                        <>
                    <Box display='flex' flexDirection='column' my={5} >
                        <Table m={4}>
                            <TableHead>
                                <TableRow style={{backgroundColor: 'rgba(0, 191, 165, 1)'}}>
                                    <TableCell style={{fontSize: '15px', color: 'White'}}>ID</TableCell>
                                    {/* <TableCell style={{fontSize: '15px', color: 'White'}}>Name</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody style={{backgroundColor: 'rgba(0, 191, 165, 0.1)'}}>

                                {doctorList.map((record, index) => (
                                    <TableRow key={index}>
                                    <TableCell style={{fontSize: '13px'}}>
                                        {record}
                                    </TableCell>
                                    </TableRow>
                                ))}
                                
                            </TableBody>
                        </Table>
                  </Box>
                  
                  <Box my={3}>
                  <CustomButton mx={2} text={'Close'} handleClick={() => setDoctorListExist(false)}>
                    <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                  </CustomButton>
                </Box>
                </>
                  )}
                </>
              )}
            </>
          )}
          </>
    )
  }
}

export default DoctorRecord