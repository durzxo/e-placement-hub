export const mockDrives = [
  {
    driveId: 1,
    companyId: 101,
    companyName: "Tech Solutions Inc.",
    companyLogo: "https://placehold.co/100x40/0D9488/FFFFFF?text=TechCo",
    companyWebsite: "techsolutions.com",
    companyDescription: "A leading provider of innovative tech solutions, specializing in cloud computing and AI.",
    driveDate: "2025-09-20",
    status: "Upcoming",
    rounds: ["Aptitude", "Technical", "HR", "Online Assessment", "Case Study", "Final Interview", "Technical Test", "Managerial Round", "Group Discussion"],
    registeredStudents: [
      { id: 201, rollNumber: "CS101", name: "Rohan Sharma", progress: { "Aptitude": "Registered", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Registered", "Case Study": "Registered", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Registered" }, finalStatus: "Pending" },
      { id: 202, rollNumber: "CS102", name: "Priya Patel", progress: { "Aptitude": "Cleared", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Cleared", "Case Study": "Registered", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Registered" }, finalStatus: "Pending" },
      { id: 203, rollNumber: "CS103", name: "Amit Singh", progress: { "Aptitude": "Registered", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Registered", "Case Study": "Registered", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Registered" }, finalStatus: "Pending" },
      { id: 204, rollNumber: "CS104", name: "Sneha Reddy", progress: { "Aptitude": "Appeared", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Appeared", "Case Study": "Registered", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Registered" }, finalStatus: "Pending" },
      { id: 205, rollNumber: "CS105", name: "Vikram Kumar", progress: { "Aptitude": "Registered", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Registered", "Case Study": "Registered", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Registered" }, finalStatus: "Pending" },
    ]
  },
  {
    driveId: 2,
    companyId: 102,
    companyName: "Innovate Global",
    companyLogo: "https://placehold.co/100x40/4F46E5/FFFFFF?text=Innovate",
    companyWebsite: "innovateglobal.com",
    companyDescription: "A global consultancy firm driving digital transformation for Fortune 500 companies.",
    driveDate: "2025-09-15",
    status: "In Progress",
    rounds: ["Aptitude", "Technical", "HR", "Online Assessment", "Case Study", "Final Interview", "Technical Test", "Managerial Round", "Group Discussion"],
    registeredStudents: [
      { id: 201, rollNumber: "CS101", name: "Rohan Sharma", progress: { "Aptitude": "Cleared", "Technical": "Cleared", "HR": "Registered", "Online Assessment": "Cleared", "Case Study": "Cleared", "Final Interview": "Registered", "Technical Test": "Appeared", "Managerial Round": "Registered", "Group Discussion": "Cleared" }, finalStatus: "Pending" },
      { id: 202, rollNumber: "CS102", name: "Priya Patel", progress: { "Aptitude": "Cleared", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Cleared", "Case Study": "Appeared", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Appeared" }, finalStatus: "Pending" },
      { id: 203, rollNumber: "CS103", name: "Amit Singh", progress: { "Aptitude": "Not Cleared", "Technical": "Registered", "HR": "Registered", "Online Assessment": "Not Cleared", "Case Study": "Registered", "Final Interview": "Registered", "Technical Test": "Registered", "Managerial Round": "Registered", "Group Discussion": "Registered" }, finalStatus: "Not Selected" },
    ]
  },
  {
    driveId: 3,
    companyId: 103,
    companyName: "Data Wave Analytics",
    companyLogo: "https://placehold.co/100x40/059669/FFFFFF?text=DataWave",
    companyWebsite: "datawave.com",
    companyDescription: "Pioneers in big data analytics and machine learning services.",
    driveDate: "2025-08-28",
    status: "Completed",
    rounds: ["Aptitude", "Technical", "HR", "Online Assessment", "Case Study", "Final Interview", "Technical Test", "Managerial Round", "Group Discussion"],
    registeredStudents: [
      { id: 201, rollNumber: "CS101", name: "Rohan Sharma", progress: { "Aptitude": "Cleared", "Technical": "Cleared", "HR": "Cleared", "Online Assessment": "Cleared", "Case Study": "Cleared", "Final Interview": "Cleared", "Technical Test": "Cleared", "Managerial Round": "Cleared", "Group Discussion": "Cleared" }, finalStatus: "Selected" },
      { id: 202, rollNumber: "CS102", name: "Priya Patel", progress: { "Aptitude": "Cleared", "Technical": "Not Cleared", "HR": "Registered", "Online Assessment": "Cleared", "Case Study": "Cleared", "Final Interview": "Registered", "Technical Test": "Not Cleared", "Managerial Round": "Registered", "Group Discussion": "Cleared" }, finalStatus: "Not Selected" },
      { id: 204, rollNumber: "CS104", name: "Sneha Reddy", progress: { "Aptitude": "Cleared", "Technical": "Cleared", "HR": "Cleared", "Online Assessment": "Cleared", "Case Study": "Cleared", "Final Interview": "Cleared", "Technical Test": "Cleared", "Managerial Round": "Cleared", "Group Discussion": "Cleared" }, finalStatus: "Selected" },
    ]
  }
];

// This is the list of students who have registered for a specific drive.
export const mockStudentsForDrive = [
    { id: 201, rollNumber: "CS101", name: "Rohan Sharma" },
    { id: 202, rollNumber: "CS102", name: "Priya Patel" },
    { id: 203, rollNumber: "CS103", name: "Amit Singh" },
    { id: 204, rollNumber: "CS104", name: "Sneha Reddy" },
    { id: 205, rollNumber: "CS105", name: "Vikram Kumar" },
];

