import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import MarkChatReadOutlinedIcon from "@mui/icons-material/MarkChatReadOutlined";
// import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

export const apps = [
  { id: 1, name: "Gmail" },
  { id: 2, name: "Calendar" },
  { id: 3, name: "Projects" },
  { id: 4, name: "Onboarding" },
  { id: 5, name: "Intercom" },
  { id: 6, name: "Google Drive" },
  { id: 7, name: "Figma" },
];
export const tasks = [
  { id: 1, name: "Common first day questions", img: 4 },
  { id: 2, name: "Teams/Projects Workshop Synthesis", img: 11 },
  { id: 3, name: "Remote working guide", img: 10 },
  { id: 4, name: "Sales opportunities Q4", img: 9 },
  { id: 5, name: "Quarterly goals", img: 9 },
  { id: 6, name: "Quarterly goals prioritization", img: 11 },
];

export const events = [
  {
    day: "today",
    time: "10:30-11:30 AM",
    event: "Software Engineer Interview",
    join_link: "Join",
    attendees: {
      you: true,
      others: 14,
      attendees_list: [
        {
          name: "Attendee 1",
          status: "confirmed",
        },
        {
          name: "Attendee 2",
          status: "declined",
        },
        {
          name: "Attendee 3",
          status: "pending",
        },
      ],
    },
    documents: [
      {
        name: "Eng Interview Guide",
        additional_docs: 2,
      },
    ],
  },
  {
    day: "yesterday",
    time: "11:30 AM-12:30 PM",
    event: "Kelvin/Cindy 1:1",
    attendees: [],
  },
  {
    day: "tomorrow",
    time: "2:30-3:30 PM",
    event: "PM Design working session",
    attendees: [],
  },
  {
    time: "4:00-5:00 PM",
    event: "Team Retrospective",
    join_link: "Join",
    attendees: {
      you: true,
      others: 6,
      attendees_list: [
        {
          name: "Attendee 4",
          status: "confirmed",
        },
        {
          name: "Attendee 5",
          status: "confirmed",
        },
      ],
    },
    documents: [],
  },
  {
    time: "5:30-6:30 PM",
    event: "Project Kickoff Meeting",
    join_link: "Join",
    attendees: {
      you: false,
      others: 8,
      attendees_list: [
        {
          name: "Attendee 6",
          status: "confirmed",
        },
        {
          name: "Attendee 7",
          status: "pending",
        },
        {
          name: "Attendee 8",
          status: "declined",
        },
      ],
    },
    documents: [
      {
        name: "Project Brief",
        additional_docs: 1,
      },
    ],
  },
];

export const event = {
  day: "today",
  time: "10:30-11:30 AM",
  event: "Software Engineer Interview",
  join_link: "Join",
  attendees: {
    you: true,
    others: 14,
    attendees_list: [
      {
        name: "Attendee 1",
        status: "confirmed",
      },
      {
        name: "Attendee 2",
        status: "declined",
      },
      {
        name: "Attendee 3",
        status: "pending",
      },
    ],
  },
  schedule: [
    {
      time: "11:30 AM - 12:30 PM",
      event: "Kelvin/Cindy 1:1",
    },
    {
      time: "2:30 PM - 3:30 PM",
      event: "PM Design working session",
    },
    {
      time: "4:00 PM - 4:30 PM",
      event: "Team Check-in",
    },
    {
      time: "5:00 PM - 6:00 PM",
      event: "Project Roadmap Review",
    },
    {
      time: "6:30 PM - 7:30 PM",
      event: "Client Sync-up",
    },
  ],
  documents: [
    {
      name: "Eng Interview Guide",
      additional_docs: 2,
    },
  ],
};

export const goalsArray = [
  {
    title: "Company quarterly goals",
    titleSideIcon: (
      <ShareRoundedIcon
        sx={{ fontSize: "19px", color: "#9900a1" }}
        className="bg-[#f6d8ff] rounded-[50%] p-[2px]"
      />
    ),
    updated: "30min ago",
    author: "Kunal Verma",
    authorImageUrl: "/people/kv.jpeg",
    department: "Engineering",
    description:
      "These are goals that the exec team has set ahead of quarterly planning. The focus is on improving team collaboration and meeting quarterly sales targets. We aim to increase efficiency by 15% by the next quarter.",
    frequency: "Weekly, monthly, quarterly goals",
    tags: ["teamwork", "efficiency", "sales"],
    status: "In Progress",
    dueDate: "2024-12-15",
    priority: "High",
    img: 11,
    platform: "slack",
  },
  {
    title: "2021 Sales Goals and Roadmap Themes",
    updated: "1 week ago",
    titleSideIcon: (
      <VerifiedUserIcon sx={{ fontSize: "19px", color: "#17b400" }} />
    ),
    author: "Dushyant Kumar",
    authorImageUrl: "/people/dk.png",
    department: "Sales",
    description:
      "Product goals for Q1 2024. We need to release version 2.0 of our main product by the end of Q1, focusing on improving the user interface and reducing bugs by 40%.",
    frequency: "Quarterly goals",
    tags: ["product", "Q1", "version 2.0", "bug fixes"],
    status: "Pending",
    dueDate: "2024-03-31",
    priority: "Medium",
    img: 6,
    platform: "google",
  },
  {
    title: "#product-team",
    updated: "Aug 30",
    author: "Kunal Verma",
    authorImageUrl: "/people/kv.jpeg",
    department: "Product Team",
    description:
      "Creating more cross-functional organization and commitment with quarterly goals. We are establishing new communication channels and tracking project milestones in real-time.",
    frequency: "Quarterly goal",
    tags: ["cross-functional", "communication", "milestones"],
    status: "Completed",
    dueDate: "2024-08-30",
    priority: "Low",
    img: 12,
    platform: "skype",
  },
  {
    title: "Marketing Strategy Q4 2024",
    updated: "2 days ago",
    author: "Abhinav Dhir",
    authorImageUrl: "/people/abhinav.jpeg",
    department: "Marketing",
    description:
      "Develop a marketing campaign targeting Gen Z for our upcoming product. The goal is to increase social media engagement by 25% by the end of Q4.",
    frequency: "Quarterly goal",
    tags: ["marketing", "Gen Z", "social media", "engagement"],
    status: "In Progress",
    dueDate: "2024-12-31",
    priority: "High",
    img: 11,
    platform: "skype",
  },
  {
    title: "HR: Onboarding Improvements",
    updated: "5 days ago",
    author: "Himanshu Jadon",
    authorImageUrl: "/people/himanshu.jpeg",
    department: "Human Resources",
    description:
      "Streamline the onboarding process by reducing the time it takes for new employees to be fully integrated into the company by 20%. We will focus on better documentation and mentorship.",
    frequency: "Annual goal",
    tags: ["HR", "onboarding", "efficiency", "mentorship"],
    status: "In Progress",
    dueDate: "2024-10-01",
    priority: "Medium",
    img: 17,
    platform: "meet",
  },
  {
    title: "R&D: New Product Research",
    updated: "1 week ago",
    author: "Shubh Wadekar",
    authorImageUrl: "/people/shubh.jpeg",
    department: "Research & Development",
    description:
      "Research new product lines for our eco-friendly initiative. We aim to launch a prototype by mid-2024. The focus will be on sustainability and reducing manufacturing waste.",
    frequency: "Biannual goal",
    tags: ["R&D", "eco-friendly", "sustainability", "prototype"],
    status: "Pending",
    dueDate: "2024-06-30",
    priority: "High",
    img: 9,
    platform: "slack",
  },
  {
    title: "Finance: Q3 Cost Optimization",
    updated: "3 weeks ago",
    author: "Dushyant Kumar",
    authorImageUrl: "/people/dk.png",
    department: "Finance",
    description:
      "Optimize operational costs by 10% through better resource allocation and vendor negotiations. The focus will be on improving the financial bottom line by cutting unnecessary expenses.",
    frequency: "Quarterly goal",
    tags: ["finance", "cost optimization", "vendor negotiations"],
    status: "Completed",
    dueDate: "2024-09-15",
    priority: "Medium",
    img: 16,
    platform: "google",
  },
  {
    title: "Customer Support: CSAT Improvement",
    updated: "2 weeks ago",
    author: "Anya Gupta",
    authorImageUrl: "/people/anya.jpeg",
    department: "Customer Support",
    description:
      "Increase customer satisfaction (CSAT) scores by 5% through better response times and customer feedback loops. Focus will be on training support agents and improving tools.",
    frequency: "Quarterly goal",
    tags: ["customer support", "CSAT", "response times", "feedback"],
    status: "In Progress",
    dueDate: "2024-11-15",
    priority: "High",
    img: 17,
    platform: "meet",
  },
];

export const toolbarOptions = [
  { label: "Anytime", icon: <CalendarMonthOutlinedIcon /> },
  { label: "From", icon: <PersonOutlinedIcon /> },
  { label: "Type", icon: <ListAltOutlinedIcon /> },
  { label: "Collection", icon: <WidgetsOutlinedIcon /> },
  { label: "My history", icon: <RestoreOutlinedIcon /> },
];

export const toolbarOptions2 = [
  // { label: "Anytime", icon: <CalendarMonthOutlinedIcon /> },
  // { label: "Who From", icon: <PersonOutlinedIcon /> },
  // { label: "What Type", icon: <ListAltOutlinedIcon /> },
  { label: "My history", icon: <RestoreOutlinedIcon /> },
];

export const searchResults = [
  { category: "All", results: "10+", img: 14 },
  { category: "Document", results: 2, img: 11 },
  { category: "SAP", results: 1, img: 16 },
  { category: "Drive", results: 1, img: 6 },
  { category: "Salesforce", results: 2, img: 17 },
  { category: "Management", results: 6, img: 15 },
  { category: "Slack", results: 1, img: 12 },
];

export const managementArray = [
  {
    Name: "Kunal Verma",
    Department: "Engineering",
    Role: "Software Engineer",
    id: 1,
    gender: "Male",
    imageUrl: "/people/kv.jpeg",
    managementKey: "KV",
  },
  {
    Name: "Dushyant Kumar",
    Department: "Sales",
    Role: "Sales",
    id: 2,
    gender: "Male",
    imageUrl: "/people/dk.png",
    managementKey: "DK",
  },
  {
    Name: "Abhinav Dhir",
    Department: "Marketing",
    Role: "Marketing Management",
    id: 3,
    gender: "Male",
    imageUrl: "/people/abhinav.jpeg",
    managementKey: "AD",
  },
  {
    Name: "Himanshu Jadon",
    Department: "Human Resources",
    Role: "HR Specialist",
    id: 4,
    gender: "Male",
    imageUrl: "/people/himanshu.jpeg",
    managementKey: "Emily Johnson",
  },
  {
    Name: "Shubh Wadekar",
    Department: "IT",
    Role: "System Administrator",
    id: 5,
    gender: "Male",
    imageUrl: "/people/shubh.jpeg",
    managementKey: "Shubh",
  },
  {
    Name: "Sarah Wilson",
    Department: "Sales",
    Role: "Sales Executive",
    id: 6,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Sarah",
    managementKey: "Sarah Wilson",
  },
  {
    Name: "David Martinez",
    Department: "Customer Support",
    Role: "Support Specialist",
    id: 7,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=David",
    managementKey: "David Martinez",
  },
  {
    Name: "Emma Garcia",
    Department: "Operations",
    Role: "Operations Manager",
    id: 8,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Emma",
    managementKey: "Emma Garcia",
  },
  {
    Name: "James Lee",
    Department: "Product",
    Role: "Product Manager",
    id: 9,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=James",
    managementKey: "James Lee",
  },
  {
    Name: "Olivia Harris",
    Department: "Legal",
    Role: "Legal Advisor",
    id: 10,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Olivia",
    managementKey: "Olivia Harris",
  },
  {
    Name: "Lucas Turner",
    Department: "Engineering",
    Role: "DevOps Engineer",
    id: 11,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Lucas",
    managementKey: "Lucas Turner",
  },
  {
    Name: "Ava Scott",
    Department: "Design",
    Role: "UX Designer",
    id: 12,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Ava",
    managementKey: "Ava Scott",
  },
  {
    Name: "Benjamin White",
    Department: "Sales",
    Role: "Sales Director",
    id: 13,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Benjamin",
    managementKey: "Benjamin White",
  },
  {
    Name: "Sophia Perez",
    Department: "Customer Success",
    Role: "Customer Success Manager",
    id: 14,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Sophia",
    managementKey: "Sophia Perez",
  },
  {
    Name: "Ethan Ramirez",
    Department: "Engineering",
    Role: "Backend Developer",
    id: 15,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Ethan",
    managementKey: "Ethan Ramirez",
  },
  {
    Name: "Mia Carter",
    Department: "Finance",
    Role: "Accountant",
    id: 16,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Mia",
    managementKey: "Mia Carter",
  },
  {
    Name: "Alexander Clark",
    Department: "Operations",
    Role: "Logistics Coordinator",
    id: 17,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Alexander",
    managementKey: "Alexander Clark",
  },
  {
    Name: "Isabella Lewis",
    Department: "HR",
    Role: "HR Manager",
    id: 18,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Isabella",
    managementKey: "Isabella Lewis",
  },
  {
    Name: "Mason Walker",
    Department: "Engineering",
    Role: "Front-end Developer",
    id: 19,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Mason",
    managementKey: "Mason Walker",
  },
  {
    Name: "Harper Young",
    Department: "Design",
    Role: "Graphic Designer",
    id: 20,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Harper",
    managementKey: "Harper Young",
  },
  {
    Name: "Logan Hall",
    Department: "Marketing",
    Role: "Content Strategist",
    id: 21,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Logan",
    managementKey: "Logan Hall",
  },
  {
    Name: "Ella King",
    Department: "Legal",
    Role: "Compliance Officer",
    id: 22,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Ella",
    managementKey: "Ella King",
  },
  {
    Name: "Daniel Hill",
    Department: "Product",
    Role: "Product Owner",
    id: 23,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Daniel",
    managementKey: "Daniel Hill",
  },
  {
    Name: "Grace Adams",
    Department: "Engineering",
    Role: "QA Engineer",
    id: 24,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Grace",
    managementKey: "Grace Adams",
  },
  {
    Name: "Matthew Baker",
    Department: "IT",
    Role: "Network Engineer",
    id: 25,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Matthew",
    managementKey: "Matthew Baker",
  },
  {
    Name: "Chloe Gonzalez",
    Department: "Sales",
    Role: "Account Executive",
    id: 26,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Chloe",
    managementKey: "Chloe Gonzalez",
  },
  {
    Name: "Elijah Green",
    Department: "Operations",
    Role: "Supply Chain Analyst",
    id: 27,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Elijah",
    managementKey: "Elijah Green",
  },
  {
    Name: "Lily Mitchell",
    Department: "Customer Support",
    Role: "Support Manager",
    id: 28,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Lily",
    managementKey: "Lily Mitchell",
  },
  {
    Name: "Samuel Perez",
    Department: "Engineering",
    Role: "Cloud Architect",
    id: 29,
    gender: "Male",
    imageUrl: "https://fakeimg.pl/250x250/?text=Samuel",
    managementKey: "Samuel Perez",
  },
  {
    Name: "Amelia Edwards",
    Department: "Marketing",
    Role: "SEO Specialist",
    id: 30,
    gender: "Female",
    imageUrl: "https://fakeimg.pl/250x250/?text=Amelia",
    managementKey: "Amelia Edwards",
  },
];

export const userPermissions = [
  {
    type: "Member Permissions",
    data: [
      { permission: "View Data", isEnabled: true },
      { permission: "Access Data", isEnabled: false },
      { permission: "Edit Data", isEnabled: true },
    ],
  },
  {
    type: "Additional Permissions",
    data: [
      { permission: "Answer Moderator", isEnabled: false },
      { permission: "Collections Moderator", isEnabled: false },
      { permission: "Announcements Moderator", isEnabled: false },
      { permission: "Verification Moderator", isEnabled: true },
      { permission: "Can access the Insights Dashboard", isEnabled: false },
    ],
  },
];

export const profileDetails = {
  name: "Kunal Verma",
  pronouns: "",
  job_title: "Group Product Manager, Product",
  location: {
    time: "5:30pm",
    city: "New York",
    building: "Bldg 1-192",
  },
  joined: "2 years ago",
  contact: {
    email: "sam.eve@acme.com",
    website: "sam.eve",
    phone: "510-824-8909",
  },
  about:
    "Passionate about solving problems for our users. Love producing videos and drawing comics in my free time. Ask me about my cat, Kenji.",
  social: {
    linkedin: "LinkedIn",
    twitter: "Twitter",
  },
  org_chart: {
    manager: {
      name: "Adam Henshaw",
      title: "VP of Product",
    },

    direct_reports: "3 direct reports",
  },
  work_schedule: {
    office_hours: "9:00 AM - 6:00 PM",
    timezone: "EST",
  },
  projects: [
    {
      name: "Project Alpha",
      description: "Developing a new user onboarding experience.",
      status: "In progress",
      team: ["Sam Eve", "Kunal Verma", "Dushyant Kumar"],
    },
    {
      name: "Project Beta",
      description: "Redesign of the product dashboard.",
      status: "Completed",
      team: ["Sam Eve", "Alex Johnson"],
    },
  ],
  skills: [
    "Product Management",
    "User Research",
    "UX Design",
    "Team Leadership",
  ],
};

export const managementAppsArray = [
  { id: 1, name: "Airtable", image: "1" },
  { id: 2, name: "Tally", image: "2" },
  { id: 3, name: "Bitbucket", image: "3" },
  { id: 4, name: "Box", image: "4" },
  { id: 5, name: "Brightspot", image: "5" },
  { id: 6, name: "Coda", image: "6" },
  { id: 7, name: "Confluence (Cloud)", image: "7" },
  { id: 8, name: "Confluence (Datacenter)", image: "7" },
  { id: 9, name: "Docebo", image: "8" },
  { id: 10, name: "15Five", image: "9" },
  { id: 11, name: "Figma", image: "18" },
  { id: 12, name: "Freshservice", image: "10" },
  { id: 13, name: "Gong", image: "11" },
  { id: 14, name: "Google Groups", image: "12" },
  { id: 15, name: "Google Sites", image: "13" },
  { id: 16, name: "Google Tools", image: "14" },
  { id: 17, name: "Guru", image: "15" },
  { id: 18, name: "Highspot", image: "16" },
  { id: 19, name: "Jira (Cloud)", image: "19" },
  { id: 20, name: "Jira (Datacenter)", image: "19" },
  { id: 21, name: "Lattice", image: "17" },
];

export const contentArray = [
  "Index user permissions associated with documents",
  "Content and permissions updates sync multiple times every hour after initial indexing",
  "Search for issues, stories, tasks, epics, dashboards, and filters",
];
