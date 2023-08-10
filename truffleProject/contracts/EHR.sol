//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract health_record{
    struct Doctor{
        address id;
        string docName;
        //should have right to upload patient files
        //and have access to patient list
    }
    struct Record {
        string cid;
        string fileName; 
        address patientId;
        address doctorId;
        uint256 timeAdded;
    }

    struct Patient{
        address id;
        Record[] records;
        //just view their own file
    }

    struct Diagnostics{
        address diag_id;
        //files upload
    }
    struct Clinic{
        address clinicid;
        string clinic_name;
        //can register patient
    }

    struct Hospital{
        address id;
        Doctor[] docts;
        //can view patient list
        //can register patient
    }
//MAPPINGS------------------------------------------------------
    mapping (address => Patient) public patients;
    mapping (address => Doctor) public doctors;
    mapping (address => Hospital) public hospitals;
    mapping (address => Clinic) public clinics;
//--------------------------------------------------------------
//EVENTS--------------------------------------------------------
    event DoctorAdded(address doctorId); 
    event PatientAdded(address patientId);   
    event RecordAdded(string cid, address patientId, address doctorId); 
//--------------------------------------------------------------

//MODIFIERS-----------------------------------------------------
  modifier senderExists {
    require(doctors[msg.sender].id == msg.sender || patients[msg.sender].id == msg.sender, "Sender does not exist");
    _;
  }

  modifier patientExists(address patientId) {
    require(patients[patientId].id == patientId, "Patient does not exist");
    _;
  }
  modifier doctorExists(address doctorId) {
    require(doctors[doctorId].id == doctorId, "Doctor does not exist");
    _;
  }

  modifier senderIsDoctor {
    require(doctors[msg.sender].id == msg.sender, "Sender is not a doctor");
    _;
  }
  modifier senderIsHospital {
        require(hospitals[msg.sender].id == msg.sender, "Sender is not a authorized hospital");
    _;
  }
//------------------------------------------------------------------
//FUNCITONS---------------------------------------------------------
    function addPatient(address _patientId) public senderIsDoctor {
        require(patients[_patientId].id != _patientId, "This patient already exists.");
        patients[_patientId].id = _patientId;
        emit PatientAdded(_patientId);
  } 
    function getSenderRole() public view returns (string memory) {
    if (doctors[msg.sender].id == msg.sender) {
      return "doctor";
    } else if (patients[msg.sender].id == msg.sender) {
      return "patient";
    } else if (hospitals[msg.sender].id == msg.sender){
      return "hospital";
    } else{
      return "unknown";
    }
  }
    function getPatientExists(address _patientId) public view senderIsDoctor returns (bool) {
    return patients[_patientId].id == _patientId;
    }
  
    function addDoctor(address _doctorId, string memory _docName) public senderIsHospital doctorExists(_doctorId){
        require(doctors[msg.sender].id != msg.sender, "This doctor already exists.");
        Doctor memory doc_details = Doctor(_doctorId, _docName);
        doctors[msg.sender].id = msg.sender;
        hospitals[_doctorId].docts.push(doc_details);
        emit DoctorAdded(msg.sender);
  }
    function addRecord(string memory _cid, string memory _fileName, address _patientId) public senderIsDoctor patientExists(_patientId) {
    Record memory record = Record(_cid, _fileName, _patientId, msg.sender, block.timestamp);
    patients[_patientId].records.push(record);

    emit RecordAdded(_cid, _patientId, msg.sender);
  } 
//   function getDoctorList(address _doctorId) public view senderIsHospital returns(address[] memory){
//       return doctors[_doctorId];
//   }
    function getDoctorList(address _doctorId) public view senderIsHospital returns(Doctor[] memory){
      return hospitals[_doctorId].docts;  //has error in this line comment out this function
  }
    function getRecords(address _patientId) public view senderExists patientExists(_patientId) returns (Record[] memory) {
    return patients[_patientId].records;
  }

//-----------------------------------------------------------------------------
}