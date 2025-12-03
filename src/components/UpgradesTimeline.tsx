import TimelineChart from '@/components/TimelineChart';
import { Heading, Box } from '@chakra-ui/react';
import { prop } from 'cheerio/dist/commonjs/api/attributes';

interface Props {
  selectedOption: 'pectra' | 'fusaka' | 'glamsterdam'; // Updated to include glamsterdam
  setSelectedOption?: (option: 'pectra' | 'fusaka') => void; // Only if needed for child toggling
  pectraData: any[];
  fusakaData: any[];
}
const EIPTimelinePage: React.FC<Props> = ({ selectedOption, setSelectedOption, pectraData, fusakaData }) => {
  // Pick data based on selected option
  const dataToRender = selectedOption === 'pectra' ? pectraData : fusakaData;
  const data = selectedOption === 'pectra' ? pectraData : fusakaData;


const originalData = [
  {
    date: '2024-03-21',
    included: [],
    scheduled: ['EIP-2537', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549'],
    declined: [],
    considered: ['EIP-7547'],
    proposed: []
  },
  {
    date: '2024-04-11',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549'],
    declined: [],
    considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623'],
        proposed: [],
  },
  {
    date: '2024-04-26',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'],
    declined: [],
    considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623'],
        proposed: [],
  },
  {
    date: '2024-05-09',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'],
    declined: [],
    considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623', 'EIP-7692', 'EIP-7698'],
    proposed: [],
  },
  {
    date: '2024-05-29',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'],
    declined: [],
    considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623', 'EIP-7692', 'EIP-7698', 'EIP-7702'],
    proposed: [],
  },
  {
    date: '2024-06-10',
    included: [],
    scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'],
    declined: [],
    considered: ['EIP-7212', 'EIP-7547', 'EIP-7623'],
    proposed: [],
  },
  {
    date: '2024-06-17',
    included: [],
    scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7594', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'],
    declined: [],
    considered: ['EIP-7212', 'EIP-7547', 'EIP-7623'],
    proposed: [],
  },
  {
    date: '2024-08-21',
    included: [],
    scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7594', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'],
    declined: [],
    considered: ['EIP-7547', 'EIP-7623'],
    proposed: [],
  },
  {
    date: '2024-10-16',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685', 'EIP-7702'],
    declined: [],
    considered: ['EIP-7623', 'EIP-7742', 'EIP-7762'],
    proposed: [],
  },
  {
    date: '2024-10-24',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685', 'EIP-7702', 'EIP-7742'],
    declined: [],
    considered: ['EIP-7623', 'EIP-7762'],
    proposed: [],
  },
  {
    date: '2024-12-18',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7685', 'EIP-7691', 'EIP-7702'],
    declined: [],
    considered: [],
    proposed: [],
  },
  {
    date: '2025-04-14',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'],
    declined: [],
    considered: [],
    proposed: [],
  },
  {
    date: '2025-05-06',
    included: [],
    scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7642', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'],
    declined: [],
    considered: [],
    proposed: [],
  },
  {
    date: '2025-06-09',
    included: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7642', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'],
    scheduled: [],
    declined: [],
    considered: [],
    proposed: []
  },
];


 const data2 = [
  { date: '2024-02-15', included: [], scheduled: [], declined: [], considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545'] , proposed: [] },
  { date: '2024-04-11', included: [], scheduled: [], declined: [], considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'] , proposed: []},
  { date: '2025-03-27', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7692', 'EIP-7698', 'EIP-7873'], declined: [], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7834', 'EIP-7880', 'EIP-7883'], proposed: [] },
  { date: '2025-04-14', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7642', 'EIP-7692', 'EIP-7698', 'EIP-7873'], declined: ['EIP-7666', 'EIP-7668', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7843', 'EIP-7889', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7834', 'EIP-7880', 'EIP-7883', 'EIP-7892', 'EIP-7907', 'EIP-7918'] , proposed: []},
  { date: '2025-04-19', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7642', 'EIP-7692', 'EIP-7698', 'EIP-7873', 'EIP-7892'], declined: ['EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7732', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7843', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7834', 'EIP-7880', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'], proposed: [] },
  { date: '2025-04-28', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7892'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'] , proposed: []},
  { date: '2025-05-05', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7892'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'], proposed: [] },
  { date: '2025-05-09', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7892', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934'], proposed: [] },
  { date: '2025-05-13', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7892', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934'], proposed: [] },
  { date: '2025-05-21', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7883', 'EIP-7892', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7762', 'EIP-7825', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934'], proposed: [] },
  { date: '2025-05-22', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7918', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7762', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7907', 'EIP-7917', 'EIP-7934'], proposed: [] },
  { date: '2025-06-02', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7917', 'EIP-7918', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7762', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7907', 'EIP-7934'] , proposed: []},
  { date: '2025-06-05', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7917', 'EIP-7918', 'EIP-7935'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-5920', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7762', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: ['EIP-7907', 'EIP-7934'] , proposed: []},
  { date: '2025-07-02', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7907', 'EIP-7917', 'EIP-7918', 'EIP-7934', 'EIP-7935', 'EIP-7939', 'EIP-7951'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-5920', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7762', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: [] , proposed: []},
  { date: '2025-07-10', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7907', 'EIP-7910', 'EIP-7917', 'EIP-7918', 'EIP-7934', 'EIP-7935', 'EIP-7939', 'EIP-7951'], declined: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-5920', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7620', 'EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7692', 'EIP-7698', 'EIP-7732', 'EIP-7761', 'EIP-7762', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7834', 'EIP-7843', 'EIP-7873', 'EIP-7880', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7912', 'EIP-7919'], considered: [] , proposed: []},
  { date: '2025-07-17', included: [], scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7910', 'EIP-7917', 'EIP-7918', 'EIP-7934', 'EIP-7935', 'EIP-7939', 'EIP-7951'], 
    declined: [
  'EIP-663',
  'EIP-3540',
  'EIP-3670',
  'EIP-4200',
  'EIP-4750',
  'EIP-5450',
  'EIP-5920',
  'EIP-6206',
  'EIP-7069',
  'EIP-7480',
  'EIP-7620',
  'EIP-7666',
  'EIP-7668',
  'EIP-7688',
  'EIP-7698',
  'EIP-7732',
  'EIP-7761',
  'EIP-7762',
  'EIP-7783',
  'EIP-7791',
  'EIP-7793',
  'EIP-7805',
  'EIP-7819',
  'EIP-7834',
  'EIP-7843',
  'EIP-7873',
  'EIP-7880',
  'EIP-7889',
  'EIP-7898',
  'EIP-7903',
  'EIP-7912',
  'EIP-7919'
], considered: [] , proposed: []},
  { date: '2025-09-16', 
    included: [], 
    scheduled: ['EIP-7594', 'EIP-7642', 'EIP-7823', 'EIP-7825', 'EIP-7883', 'EIP-7892', 'EIP-7910', 'EIP-7917', 'EIP-7918', 'EIP-7934', 'EIP-7935', 'EIP-7939', 'EIP-7951'], 
    declined: [], considered: [] , proposed: []},
    
];

const glamsterDamData = [
  {
    date: '2024-09-28',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'],
    proposed: []
  },
  {
    date: '2025-06-09',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'],
    proposed: ['EIP-7793', 'EIP-7843']
  },
  {
    date: '2025-06-10',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'],
    proposed: ['EIP-7793', 'EIP-7843', 'EIP-7919']
  },
  {
    date: '2025-07-04',
    included: [],
    scheduled: [],
    declined: [],
    considered: [],
    proposed : ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7843', 'EIP-7919']
  },
  {
    date: '2025-07-25',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-7732', 'EIP-7782', 'EIP-7805'],
    proposed: ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7819', 'EIP-7843', 'EIP-7919']
  },
  {
    date: '2025-07-31',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-7732', 'EIP-7782', 'EIP-7805', 'EIP-7928'],
    proposed: ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7819', 'EIP-7843', 'EIP-7919']  
  },
    {
    date: '2025-08-11',
    included: [],
    scheduled: [],
    declined: [],
    considered: ['EIP-7732', 'EIP-7782', 'EIP-7805', 'EIP-7928'],
    proposed: ['EIP-6873', 'EIP-7667', 'EIP-7793', 'EIP-7819', 'EIP-7843', 'EIP-7919', 'EIP-5920', 'EIP-7791', 'EIP-7903', 'EIP-7907', 'EIP-7923' ]  
  },
      {
    date: '2025-08-14',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-7919',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7997'
]

  },
      {
    date: '2025-08-27',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-7919',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7932',
  'EIP-7979',
  'EIP-7980',
  'EIP-7981',
  'EIP-7997',
  'EIP-7999'
]

  },
        {
    date: '2025-09-04',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-7919',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7932',
    'EIP-7979',
  'EIP-7980',
  'EIP-7981',
  'EIP-7997',
  'EIP-7999',
  'EIP-7778',
  'EIP-7976',
  'EIP-7688',
]

  },
          {
    date: '2025-09-12',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-7919',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7932',
    'EIP-7979',
  'EIP-7980',
  'EIP-7981',
  'EIP-7997',
  'EIP-7999',
  'EIP-7778',
  'EIP-7976',
  'EIP-7688',
  'EIP-2780',
]

  },
            {
    date: '2025-09-24',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7782'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-7919',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7932',
    'EIP-7979',
  'EIP-7980',
  'EIP-7981',
  'EIP-7997',
  'EIP-7999',
  'EIP-7778',
  'EIP-7976',
  'EIP-7688',
  'EIP-2780',
  'EIP-7610'
]

  },
              {
    date: '2025-10-15',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7692','EIP-7782','EIP-7886','EIP-7919','EIP-7937','EIP-7942'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-6466',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7932',
    'EIP-7979',
  'EIP-8030',
  'EIP-7981',
  'EIP-7997',
  'EIP-7999',
  'EIP-7778',
  'EIP-7976',
  'EIP-7688',
  'EIP-2780',
  'EIP-7610',
  'EIP-7668',
  'EIP-8032',
]

  },
                {
    date: '2025-10-16',
    included: [],
    scheduled: ['EIP-7732',  'EIP-7928'],
    declined: ['EIP-7692','EIP-7782','EIP-7886','EIP-7919','EIP-7937','EIP-7942'],
    considered: [ 'EIP-7805'],
proposed: [
  'EIP-2926',
  'EIP-6873',
  'EIP-7667',
  'EIP-7793',
  'EIP-7819',
  'EIP-7843',
  'EIP-6466',
  'EIP-5920',
  'EIP-7791',
  'EIP-7903',
  'EIP-7907',
  'EIP-7923',
  'EIP-7932',
    'EIP-7979',
  'EIP-8030',
  'EIP-7981',
  'EIP-7997',
  'EIP-7999',
  'EIP-7778',
  'EIP-7976',
  'EIP-7688',
  'EIP-2780',
  'EIP-7610',
  'EIP-7668',
  'EIP-7904',
  'EIP-8011',
  'EIP-8037',
  'EIP-8038',
  'EIP-8032',
]

  },
  {
  date: '2025-10-21',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-6873',
    'EIP-7610',
    'EIP-7667',
    'EIP-7668',
    'EIP-7688',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-7999',
    'EIP-8011',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038'
  ]
},
{
  date: '2025-10-23',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-6873',
    'EIP-7610',
    'EIP-7667',
    'EIP-7668',
    'EIP-7688',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-7999',
    'EIP-8011',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045'
  ]
},
{
  date: '2025-10-29',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-6873',
    'EIP-7610',
    'EIP-7667',
    'EIP-7668',
    'EIP-7688',
    'EIP-7708',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8057',
    'EIP-8061'
  ]
},
{
  date: '2025-10-30',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-6873',
    'EIP-7610',
    'EIP-7667',
    'EIP-7668',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8057',
    'EIP-8061'
  ]
},
{
  date: '2025-11-2',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-6873',
    'EIP-7610',
    'EIP-7667',
    'EIP-7668',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8057',
    'EIP-8058',
    'EIP-8061'
  ]
},
{
  date: '2025-10-30',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-6873',
    'EIP-7610',
    'EIP-7667',
    'EIP-7668',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7971',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8053',
    'EIP-8059',
    'EIP-8057',
    'EIP-8061'
  ]
},
{
  date: '2025-11-11',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8053',
    'EIP-8057',
    'EIP-8058',
    'EIP-8061',
    'EIP-8062',
    'EIP-8068',
    'EIP-8071'
  ]
},
{
  date: '2025-11-13',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6466',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8013',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8053',
    'EIP-8057',
    'EIP-8058',
    'EIP-8061',
    'EIP-8062',
    'EIP-8068',
    'EIP-8070',
    'EIP-8071'
  ]
},
{
  date: '2025-11-26',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942'],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6404',
    'EIP-6466',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8013',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8053',
    'EIP-8057',
    'EIP-8058',
    'EIP-8061',
    'EIP-8062',
    'EIP-8068',
    'EIP-8070',
    'EIP-8071',
    'EIP-8080',
  ]
},
{
  date: '2025-11-26',
  included: [],
  scheduled: ['EIP-7732', 'EIP-7928'],
  declined: ['EIP-7692', 'EIP-7782', 'EIP-7886', 'EIP-7919', 'EIP-7937', 'EIP-7942', 'EIP-8068',],
  considered: ['EIP-7805'],
  proposed: [
    'EIP-2780',
    'EIP-2926',
    'EIP-5920',
    'EIP-6404',
    'EIP-6466',
    'EIP-7610',
    'EIP-7668',
    'EIP-7686',
    'EIP-7688',
    'EIP-7708',
    'EIP-7745',
    'EIP-7778',
    'EIP-7791',
    'EIP-7793',
    'EIP-7819',
    'EIP-7843',
    'EIP-7872',
    'EIP-7903',
    'EIP-7904',
    'EIP-7907',
    'EIP-7923',
    'EIP-7932',
    'EIP-7949',
    'EIP-7971',
    'EIP-7973',
    'EIP-7976',
    'EIP-7979',
    'EIP-7981',
    'EIP-7997',
    'EIP-8011',
    'EIP-8013',
    'EIP-8024',
    'EIP-8030',
    'EIP-8032',
    'EIP-8037',
    'EIP-8038',
    'EIP-8045',
    'EIP-8053',
    'EIP-8057',
    'EIP-8058',
    'EIP-8061',
    'EIP-8062',
    'EIP-8070',
    'EIP-8071',
    'EIP-8080',
  ]
}







];

  // Preprocess to add "declined" field based on removed EIPs
const processedData = originalData.map((entry, index, arr) => {
  if (index === 0) return { ...entry, declined: [], proposed: [] };

  const prev = arr[index - 1];

  const prevEIPs = new Set([
    ...(prev.scheduled || []),
    ...(prev.considered || []),
  ]);

  const currentEIPs = new Set([
    ...(entry.scheduled || []),
    ...(entry.considered || []),
    ...(entry.included || []), // Don't count included EIPs as declined
  ]);

  const declined = Array.from(prevEIPs).filter(eip => !currentEIPs.has(eip));

  return {
    ...entry,
    declined,
    proposed: entry.proposed ?? [],
  };
});


const processedData2 = data2.map((entry, index, arr) => {
  // Collect all scheduled/considered up to previous entry,
  // remove anything that was already included or declined
  const allPrevEIPs = new Set<string>();
  const excluded = new Set<string>();
  for (let i = 0; i < index; i++) {
    arr[i].scheduled?.forEach((eip: string) => allPrevEIPs.add(eip));
    arr[i].considered?.forEach((eip: string) => allPrevEIPs.add(eip));
    arr[i].included?.forEach((eip: string) => excluded.add(eip));
    arr[i].declined?.forEach((eip: string) => excluded.add(eip));
  }

  // Only keep EIPs that weren't already included/declined
  excluded.forEach((eip: string) => allPrevEIPs.delete(eip));

  // Current EIPs in consideration
  const currentEIPs = new Set<string>([
    ...entry.scheduled,
    ...entry.considered,
    ...entry.included,
    ...entry.declined,
  ]);

  // Anything that dropped off, and not in current statuses (other than proposed)
  const declined = [...allPrevEIPs].filter((eip: string) => !currentEIPs.has(eip));

  return {
    ...entry,
    // Use actual declined from input
    declined: entry.declined,
    proposed: entry.proposed ?? [],
  };
});


const processedData3 = glamsterDamData.map((entry, index, arr) => {
  if (index === 0) return { ...entry, declined: [], proposed: entry.proposed ?? [] };

  // Previous step: union of scheduled, considered, proposed
  const prev = arr[index - 1];

  const prevEIPs = new Set([
    ...(prev.scheduled || []),
    ...(prev.considered || []),
    ...(prev.proposed || []),
  ]);

  // Current union: scheduled, considered, proposed
  const currentEIPs = new Set([
    ...(entry.scheduled || []),
    ...(entry.considered || []),
    ...(entry.proposed || []),
    ...(entry.included || []), // Don't count included as declined
  ]);

  // Declined = in prevEIPs, but NOT in currentEIPs nor included this time
  const declined =  entry.declined || []

  // Put that in the entry
  return {
    ...entry,
    declined,
    proposed: entry.proposed ?? [],
  };
});


  return (

<TimelineChart
  data={
    selectedOption === 'fusaka'
      ? processedData2
      : selectedOption === 'glamsterdam'
        ? processedData3
        : processedData
  }
  selectedOption={selectedOption}
/>

  );
};

export default EIPTimelinePage;

