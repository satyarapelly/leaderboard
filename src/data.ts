import type { AppData } from './types';

export const DEFAULT_DATA: AppData = {
  mandals: [
    { id: 'sirpur-t', name: 'Sirpur (T)', district: 'Komaram Bheem Asifabad', constituency: 'Sirpur Kaghaznagar', population: 45000, villages: 32 },
    { id: 'kaghaznagar', name: 'Kaghaznagar', district: 'Komaram Bheem Asifabad', constituency: 'Sirpur Kaghaznagar', population: 62000, villages: 45 },
    { id: 'tiryani', name: 'Tiryani', district: 'Komaram Bheem Asifabad', constituency: 'Sirpur Kaghaznagar', population: 28000, villages: 22 },
    { id: 'dahegaon', name: 'Dahegaon', district: 'Komaram Bheem Asifabad', constituency: 'Sirpur Kaghaznagar', population: 31000, villages: 28 },
    { id: 'rebbena', name: 'Rebbena', district: 'Komaram Bheem Asifabad', constituency: 'Sirpur Kaghaznagar', population: 22000, villages: 19 },
    { id: 'bejjur', name: 'Bejjur', district: 'Komaram Bheem Asifabad', constituency: 'Sirpur Kaghaznagar', population: 26000, villages: 24 },
  ],

  people: [
    { id: 'p1', name: 'Ramaiah Goud', phone: '9876543210', mandalId: 'kaghaznagar', village: 'Kaghaznagar Town', role: 'leader', createdAt: '2024-01-10', notes: 'Ward president' },
    { id: 'p2', name: 'Laxmi Bai', phone: '9876543211', mandalId: 'sirpur-t', village: 'Sirpur Town', role: 'volunteer', createdAt: '2024-01-12' },
    { id: 'p3', name: 'Suresh Kumar', phone: '9876543212', mandalId: 'tiryani', village: 'Tiryani', role: 'constituent', createdAt: '2024-01-15' },
    { id: 'p4', name: 'Savita Rao', phone: '9876543213', mandalId: 'dahegaon', village: 'Dahegaon', role: 'beneficiary', createdAt: '2024-01-18' },
    { id: 'p5', name: 'Raju Atram', phone: '9876543214', mandalId: 'rebbena', village: 'Rebbena', role: 'leader', createdAt: '2024-01-20' },
    { id: 'p6', name: 'Nirmala Devi', phone: '9876543215', mandalId: 'bejjur', village: 'Bejjur', role: 'volunteer', createdAt: '2024-01-22' },
    { id: 'p7', name: 'Shankar Meshram', phone: '9876543216', mandalId: 'kaghaznagar', village: 'Kaghaznagar Rural', role: 'constituent', createdAt: '2024-01-25' },
    { id: 'p8', name: 'Geetha Pawar', phone: '9876543217', mandalId: 'sirpur-t', village: 'Sirpur Rural', role: 'beneficiary', createdAt: '2024-01-28' },
    { id: 'p9', name: 'Vijay Tekam', mandalId: 'tiryani', village: 'Narsapur', role: 'volunteer', createdAt: '2024-02-01' },
    { id: 'p10', name: 'Anitha Madavi', mandalId: 'dahegaon', village: 'Chandrapur', role: 'constituent', createdAt: '2024-02-05' },
    { id: 'p11', name: 'Pradeep Usendi', mandalId: 'kaghaznagar', village: 'Bhopal', role: 'volunteer', createdAt: '2024-02-08' },
    { id: 'p12', name: 'Kalavati Shyam', mandalId: 'sirpur-t', village: 'Manikpur', role: 'leader', createdAt: '2024-02-10' },
  ],

  programs: [
    { id: 'pr1', name: 'Kaghaznagar Road Widening', description: 'Widening of NH-63 stretch through Kaghaznagar town', mandalId: 'kaghaznagar', status: 'ongoing', category: 'infrastructure', budget: 4500000, beneficiaries: 8000, startDate: '2024-03-01' },
    { id: 'pr2', name: 'Rythu Bandhu Facilitation Camp', description: 'Ensuring all eligible farmers receive investment support', mandalId: 'sirpur-t', status: 'completed', category: 'agriculture', budget: 1200000, beneficiaries: 1200, startDate: '2024-04-01', endDate: '2024-04-30' },
    { id: 'pr3', name: 'Aarogyasri Health Camp', description: 'Free health checkup and treatment facilitation', mandalId: 'tiryani', status: 'completed', category: 'health', budget: 300000, beneficiaries: 2500, startDate: '2024-02-15', endDate: '2024-02-20' },
    { id: 'pr4', name: 'SC/ST Colony Development', description: 'Road + drainage works in SC/ST colonies', mandalId: 'dahegaon', status: 'ongoing', category: 'welfare', budget: 2800000, beneficiaries: 3500, startDate: '2024-05-01' },
    { id: 'pr5', name: 'Scholarship Distribution Drive', description: 'Ensuring all eligible students receive state scholarships', mandalId: 'rebbena', status: 'planned', category: 'education', budget: 500000, beneficiaries: 800, startDate: '2024-06-15' },
    { id: 'pr6', name: 'Women SHG Livelihood Program', description: 'Linking SHGs to markets and providing skill training', mandalId: 'bejjur', status: 'ongoing', category: 'women', budget: 850000, beneficiaries: 600, startDate: '2024-03-15' },
    { id: 'pr7', name: 'Youth Sports Academy', description: 'Establishing a multi-sport training facility', mandalId: 'kaghaznagar', status: 'planned', category: 'youth', budget: 1500000, beneficiaries: 400, startDate: '2024-07-01' },
    { id: 'pr8', name: 'Drinking Water Supply Upgrade', description: 'Upgrading water supply lines in rural habitations', mandalId: 'sirpur-t', status: 'ongoing', category: 'infrastructure', budget: 3200000, beneficiaries: 5500, startDate: '2024-04-15' },
  ],

  activities: [
    { id: 'a1', title: 'Constituency Jan Sabha', description: 'Large public meeting on development agenda', type: 'meeting', mandalId: 'kaghaznagar', date: '2024-01-26', attendees: 3200, status: 'completed' },
    { id: 'a2', title: 'Rythu Bandhu Camp', description: 'Farmer support distribution event', type: 'event', mandalId: 'sirpur-t', date: '2024-02-10', attendees: 850, status: 'completed' },
    { id: 'a3', title: 'Health Survey – Tiryani Villages', description: 'Door-to-door health data collection', type: 'survey', mandalId: 'tiryani', date: '2024-02-14', attendees: 120, status: 'completed' },
    { id: 'a4', title: 'Village Outreach – Dahegaon', description: 'Reaching remote habitations, grievance collection', type: 'outreach', mandalId: 'dahegaon', date: '2024-03-05', attendees: 400, status: 'completed' },
    { id: 'a5', title: 'Road Inauguration – Bejjur–Rebbena Link', description: 'Inauguration of newly constructed road', type: 'inauguration', mandalId: 'rebbena', date: '2024-03-20', attendees: 1200, status: 'completed' },
    { id: 'a6', title: 'SHG Network Meeting', description: 'Coordination meeting with all SHG leaders in Bejjur', type: 'meeting', mandalId: 'bejjur', date: '2024-04-02', attendees: 280, status: 'completed' },
    { id: 'a7', title: 'Voter Awareness Campaign', description: 'Civic awareness outreach across all villages', type: 'outreach', mandalId: 'kaghaznagar', date: '2024-04-10', attendees: 600, status: 'completed' },
    { id: 'a8', title: 'Youth Job Fair', description: 'Connecting youth with employment and skill programs', type: 'event', mandalId: 'sirpur-t', date: '2024-04-25', attendees: 950, status: 'completed' },
    { id: 'a9', title: 'School Infrastructure Review', description: 'Inspecting and cataloguing school needs', type: 'survey', mandalId: 'tiryani', date: '2024-05-12', attendees: 45, status: 'planned' },
    { id: 'a10', title: 'Drinking Water Inauguration', description: 'Opening upgraded water supply in 5 villages', type: 'inauguration', mandalId: 'sirpur-t', date: '2024-06-01', attendees: 800, status: 'planned' },
  ],

  funding: [
    { id: 'f1', programId: 'pr1', description: 'Road Widening – Phase 1 release', amount: 2000000, source: 'State PWD', date: '2024-03-10', type: 'released', mandalId: 'kaghaznagar' },
    { id: 'f2', programId: 'pr1', description: 'Road Widening – contractor payment', amount: 1800000, source: 'State PWD', date: '2024-04-15', type: 'spent', mandalId: 'kaghaznagar' },
    { id: 'f3', programId: 'pr2', description: 'Rythu Bandhu disbursement', amount: 1200000, source: 'Agriculture Dept', date: '2024-04-05', type: 'released', mandalId: 'sirpur-t' },
    { id: 'f4', programId: 'pr3', description: 'Aarogyasri camp medicines', amount: 250000, source: 'Health Dept', date: '2024-02-16', type: 'spent', mandalId: 'tiryani' },
    { id: 'f5', programId: 'pr4', description: 'Colony development – Phase 1', amount: 1400000, source: 'SC/ST Development Corp', date: '2024-05-05', type: 'released', mandalId: 'dahegaon' },
    { id: 'f6', programId: 'pr6', description: 'SHG seed funding', amount: 500000, source: 'WD&CW Dept', date: '2024-03-20', type: 'released', mandalId: 'bejjur' },
    { id: 'f7', programId: 'pr6', description: 'SHG training expenses', amount: 320000, source: 'WD&CW Dept', date: '2024-04-10', type: 'spent', mandalId: 'bejjur' },
    { id: 'f8', programId: 'pr8', description: 'Water supply – pipe procurement', amount: 1600000, source: 'PHED', date: '2024-04-20', type: 'spent', mandalId: 'sirpur-t' },
    { id: 'f9', description: 'MLA fund release 2024-25', amount: 5000000, source: 'MLA Local Area Development Fund', date: '2024-04-01', type: 'allocated', mandalId: 'kaghaznagar' },
    { id: 'f10', description: 'District Collector special grant', amount: 800000, source: 'District Administration', date: '2024-03-15', type: 'allocated', mandalId: 'rebbena' },
  ],

  team: [
    { id: 't1', name: 'Kondal Rao', phone: '9912345670', role: 'Constituency Coordinator', mandalId: 'kaghaznagar', joinDate: '2023-10-01', isActive: true },
    { id: 't2', name: 'Meena Shende', phone: '9912345671', role: 'Mandal In-charge – Sirpur (T)', mandalId: 'sirpur-t', joinDate: '2023-10-15', isActive: true },
    { id: 't3', name: 'Anil Tekam', phone: '9912345672', role: 'Mandal In-charge – Tiryani', mandalId: 'tiryani', joinDate: '2023-10-15', isActive: true },
    { id: 't4', name: 'Pushpa Wagh', phone: '9912345673', role: 'Women Cell Lead', mandalId: 'dahegaon', joinDate: '2023-11-01', isActive: true },
    { id: 't5', name: 'Ramesh Uike', phone: '9912345674', role: 'Youth Wing Lead', mandalId: 'kaghaznagar', joinDate: '2023-11-10', isActive: true },
    { id: 't6', name: 'Devika Atram', phone: '9912345675', role: 'Social Media & Comms', mandalId: 'sirpur-t', joinDate: '2023-11-15', isActive: true },
    { id: 't7', name: 'Bhavesh Madavi', phone: '9912345676', role: 'Field Officer', mandalId: 'rebbena', joinDate: '2023-12-01', isActive: true },
    { id: 't8', name: 'Sushila Pawar', phone: '9912345677', role: 'Field Officer', mandalId: 'bejjur', joinDate: '2023-12-01', isActive: true },
    { id: 't9', name: 'Naresh Vetti', phone: '9912345678', role: 'Data Entry Operator', mandalId: 'kaghaznagar', joinDate: '2024-01-05', isActive: true },
    { id: 't10', name: 'Kamalesh Soyam', phone: '9912345679', role: 'Grievance Cell Lead', mandalId: 'dahegaon', joinDate: '2024-01-10', isActive: false },
  ],
};
