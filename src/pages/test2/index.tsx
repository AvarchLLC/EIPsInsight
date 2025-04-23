import TimelineChart from '@/components/TimelineChart';
import { Heading, Box } from '@chakra-ui/react';

const EIPTimelinePage = () => {
  const data = [
    { date: '2024-03-21', included: [], scheduled: ['EIP-2537', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549'], declined: [], considered: ['EIP-7547'] },
    { date: '2024-04-11', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623'] },
    { date: '2024-04-26', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623'] },
    { date: '2024-05-09', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-3074', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623', 'EIP-7692', 'EIP-7698'] },
    { date: '2024-05-29', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685'], declined: [], considered: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7212', 'EIP-7480', 'EIP-7547', 'EIP-7620', 'EIP-7623', 'EIP-7692', 'EIP-7698', 'EIP-7702'] },
    { date: '2024-06-10', included: [], scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'], declined: [], considered: ['EIP-7212', 'EIP-7547', 'EIP-7623'] },
    { date: '2024-06-17', included: [], scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7594', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'], declined: [], considered: ['EIP-7212', 'EIP-7547', 'EIP-7623'] },
    { date: '2024-08-21', included: [], scheduled: ['EIP-663', 'EIP-2537', 'EIP-2935', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6110', 'EIP-6206', 'EIP-7002', 'EIP-7069', 'EIP-7251', 'EIP-7480', 'EIP-7549', 'EIP-7594', 'EIP-7620', 'EIP-7685', 'EIP-7692', 'EIP-7698', 'EIP-7702'], declined: [], considered: ['EIP-7547', 'EIP-7623'] },
    { date: '2024-10-16', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685', 'EIP-7702'], declined: [], considered: ['EIP-7623', 'EIP-7742', 'EIP-7762'] },
    { date: '2024-10-24', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7685', 'EIP-7702', 'EIP-7742'], declined: [], considered: ['EIP-7623', 'EIP-7762'] },
    { date: '2024-12-18', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7685', 'EIP-7691', 'EIP-7702'], declined: [], considered: [] },
    { date: '2025-04-14', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'], declined: [], considered: [] },
    { date: '2025-04-17', included: [], scheduled: ['EIP-2537', 'EIP-2935', 'EIP-6110', 'EIP-7002', 'EIP-7251', 'EIP-7549', 'EIP-7623', 'EIP-7642', 'EIP-7685', 'EIP-7691', 'EIP-7702', 'EIP-7840'], declined: [], considered: [] }
  ];
  

  return (
    <Box p={1}>
      <Heading mb={8}>EIP Timeline</Heading>
      <TimelineChart data={data} />
    </Box>
  );
};

export default EIPTimelinePage;