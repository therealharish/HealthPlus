//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract EHR{
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
        string patName;
        Record[] records;
        //just view their own file
    }

    struct Diagnostics{
        address id;
        //same as hospital
        //add doctor
        //get patient exists
        //getdoctorlist
        //getpatientlist
        //get records
        //add patient
        //add records
    }
    struct Clinic{
        address id;
        //can't register patient
    }

    struct Hospital{
        address id;
        Doctor[] docts;
        Patient[] pats;
        //can view patient list
        //can register patient
    }
//MAPPINGS------------------------------------------------------
    mapping (address => Patient) public patients;
    mapping (address => Doctor) public doctors;
    mapping (address => Hospital) public hospitals;
    mapping (address => Clinic) public clinics;
    mapping (address => Diagnostics) public diags;
//--------------------------------------------------------------
//EVENTS--------------------------------------------------------
    event DoctorAdded(address doctorId); 
    event PatientAdded(address patientId); 
    event HospitalAdded(address patientId);  
    event DiagnosticAdded(address patientId); 
    event ClinicAdded(address patientId);  
    event RecordAdded(string cid, address patientId, address doctorId); 
//--------------------------------------------------------------

//MODIFIERS-----------------------------------------------------
  modifier senderExists {
    require(clinics[msg.sender].id == msg.sender || doctors[msg.sender].id == msg.sender || patients[msg.sender].id == msg.sender ||hospitals[msg.sender].id == msg.sender || diags[msg.sender].id == msg.sender, "Sender does not exist");
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
  modifier senderIsHospitalorDoctororDiagnostic {
        require(hospitals[msg.sender].id == msg.sender || doctors[msg.sender].id == msg.sender || diags[msg.sender].id == msg.sender, "Sender is not a authorized.");
    _;
  }
  modifier senderIsHospitalorClinic {
        require(hospitals[msg.sender].id == msg.sender || clinics[msg.sender].id == msg.sender , "Sender is not a authorized.");
    _;
  }
  modifier senderIsHospitalorDiagnosticorClinic {
        require(hospitals[msg.sender].id == msg.sender || diags[msg.sender].id == msg.sender || clinics[msg.sender].id ==msg.sender , "Sender is not a authorized.");
    _;
  }
  modifier senderIsDoctorOrClinic{
    require(doctors[msg.sender].id == msg.sender || clinics[msg.sender].id==msg.sender, "Sender is not a authorized.");
    _;
  }

//------------------------------------------------------------------
//FUNCITONS---------------------------------------------------------
    function addHospital() public {
      require(hospitals[msg.sender].id != msg.sender, "This hospital already exists.");
      hospitals[msg.sender].id = msg.sender;
      emit HospitalAdded(msg.sender);
  }
    function addDiagnostic() public {
      require(diags[msg.sender].id != msg.sender, "This diagnostic already exists.");
      diags[msg.sender].id = msg.sender;
      emit DiagnosticAdded(msg.sender);
  }
    function addClinic() public {
      require(clinics[msg.sender].id != msg.sender, "This diagnostic already exists.");
      clinics[msg.sender].id = msg.sender;
      emit ClinicAdded(msg.sender);
  }
    function getSenderRole() public view returns (string memory) {
      if (doctors[msg.sender].id == msg.sender) {
      return "doctor";
    } else if (patients[msg.sender].id == msg.sender) {
      return "patient";
    } else if (hospitals[msg.sender].id == msg.sender){
      return "hospital";
    } else if (diags[msg.sender].id == msg.sender){
      return "diagnostic";
    } else if (clinics[msg.sender].id == msg.sender){
      return "clinic";
    } else{
      return "unknown";
    }
  }
    

    function addPatient(address _patientId, string memory _patName) public senderIsHospitalorDoctororDiagnostic {
        require(patients[_patientId].id != _patientId, "This patient already exists.");
        patients[_patientId].id = _patientId;
        patients[_patientId].patName = _patName;
        emit PatientAdded(_patientId);
    } 
    //temp
    function getPatient(address _patientId) public view senderIsHospitalorDoctororDiagnostic returns(address, string memory){
        return (patients[_patientId].id,patients[_patientId].patName);

    }
    //end temp
    function checkPatientExists(address _patientId) public view senderIsHospitalorDoctororDiagnostic returns (bool) {
    return patients[_patientId].id == _patientId;
    }

    function checkDoctorExists(address _doctorId) public view senderIsHospitalorDiagnosticorClinic returns (bool) {
    return doctors[_doctorId].id == _doctorId;
    }
  
    function addDoctor(address _doctorId, string memory _docName) public senderIsHospitalorClinic {
        require(doctors[_doctorId].id != _doctorId, "This doctor already exists.");
        Doctor memory doc_details = Doctor(_doctorId, _docName);
        // doctors[msg.sender].id = msg.sender;
        doctors[_doctorId] = doc_details;
        // doctors[_doctorId].id = _doctorId;
        hospitals[msg.sender].docts.push(doctors[_doctorId]);
        emit DoctorAdded(_doctorId);
  }
    function addRecord(string memory _cid, string memory _fileName, address _patientId) public senderIsDoctor patientExists(_patientId) {
    Record memory record = Record(_cid, _fileName, _patientId, msg.sender, block.timestamp);
    patients[_patientId].records.push(record);

    emit RecordAdded(_cid, _patientId, msg.sender);
  } 

  function getDoctor(address _doctorId) public view senderIsHospitalorDiagnosticorClinic returns(address, string memory) {
    return (doctors[_doctorId].id,doctors[_doctorId].docName);
  }

//     function getDoctorList(address _hospitalId) public view senderIsHospitalorClinic returns(Doctor[] memory){
//     return hospitals[_hospitalId].docts;  
//   }

    function getDoctorList(address _hospitalId) public view senderIsHospitalorClinic returns(address[] memory){
        uint256 doctorCount = hospitals[_hospitalId].docts.length;
        address[] memory doctorIds = new address[](doctorCount);

        for (uint256 i = 0; i < doctorCount; i++) {
            doctorIds[i] = hospitals[_hospitalId].docts[i].id;
        }

        return doctorIds;
  }

    function getRecords(address _patientId) public view senderExists patientExists(_patientId) returns (Record[] memory) {
    return patients[_patientId].records;
  }

}