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
    rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    registeredStudents: [
      { id: 201, rollNumber: "CS101", name: "Rohan Sharma", progress: { "Online Assessment": "Registered", "Technical Interview": "Registered", "HR Interview": "Registered" }, finalStatus: "Pending" },
      { id: 202, rollNumber: "CS102", name: "Priya Patel", progress: { "Online Assessment": "Cleared", "Technical Interview": "Registered", "HR Interview": "Registered" }, finalStatus: "Pending" },
      { id: 203, rollNumber: "CS103", name: "Amit Singh", progress: { "Online Assessment": "Registered", "Technical Interview": "Registered", "HR Interview": "Registered" }, finalStatus: "Pending" },
      { id: 204, rollNumber: "CS104", name: "Sneha Reddy", progress: { "Online Assessment": "Appeared", "Technical Interview": "Registered", "HR Interview": "Registered" }, finalStatus: "Pending" },
      { id: 205, rollNumber: "CS105", name: "Vikram Kumar", progress: { "Online Assessment": "Registered", "Technical Interview": "Registered", "HR Interview": "Registered" }, finalStatus: "Pending" },
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
    rounds: ["Aptitude Test", "Group Discussion", "Technical Round", "Managerial Round"],
    registeredStudents: [
      { id: 201, rollNumber: "CS101", name: "Rohan Sharma", progress: { "Aptitude Test": "Cleared", "Group Discussion": "Cleared", "Technical Round": "Appeared", "Managerial Round": "Registered" }, finalStatus: "Pending" },
      { id: 202, rollNumber: "CS102", name: "Priya Patel", progress: { "Aptitude Test": "Cleared", "Group Discussion": "Appeared", "Technical Round": "Registered", "Managerial Round": "Registered" }, finalStatus: "Pending" },
      { id: 203, rollNumber: "CS103", name: "Amit Singh", progress: { "Aptitude Test": "Not Cleared", "Group Discussion": "Registered", "Technical Round": "Registered", "Managerial Round": "Registered" }, finalStatus: "Not Selected" },
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
    rounds: ["Coding Challenge", "System Design", "Final Interview"],
    registeredStudents: [
      { id: 201, rollNumber: "CS101", name: "Rohan Sharma", progress: { "Coding Challenge": "Cleared", "System Design": "Cleared", "Final Interview": "Cleared" }, finalStatus: "Selected" },
      { id: 202, rollNumber: "CS102", name: "Priya Patel", progress: { "Coding Challenge": "Cleared", "System Design": "Not Cleared", "Final Interview": "Registered" }, finalStatus: "Not Selected" },
      { id: 204, rollNumber: "CS104", name: "Sneha Reddy", progress: { "Coding Challenge": "Cleared", "System Design": "Cleared", "Final Interview": "Cleared" }, finalStatus: "Selected" },
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

