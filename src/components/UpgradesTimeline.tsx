import TimelineChart from '@/components/TimelineChart';
import { Heading, Box } from '@chakra-ui/react';

const EIPTimelinePage = () => {
  const originalData = [
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
  ];

  const data2 = [
    { date: '2024-02-15', included: [], scheduled: [], declined: [], considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545'] },
    { date: '2024-08-30', included: [], scheduled: [], declined: [], considered: ['EIP-4762', 'EIP-6800', 'EIP-6873', 'EIP-7545', 'EIP-7667'] },
    { date: '2025-03-27', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7692', 'EIP-7698', 'EIP-7873'], declined: [], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7834', 'EIP-7880', 'EIP-7883'] },
    { date: '2025-03-27', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7692', 'EIP-7698'], declined: [], considered: [] },
    { date: '2025-04-14', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7642', 'EIP-7692', 'EIP-7698', 'EIP-7873'], declined: ['EIP-7666', 'EIP-7668', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7843', 'EIP-7889', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7834', 'EIP-7880', 'EIP-7883', 'EIP-7892', 'EIP-7907', 'EIP-7918'] },
    { date: '2025-04-19', included: [], scheduled: ['EIP-663', 'EIP-3540', 'EIP-3670', 'EIP-4200', 'EIP-4750', 'EIP-5450', 'EIP-6206', 'EIP-7069', 'EIP-7480', 'EIP-7594', 'EIP-7620', 'EIP-7642', 'EIP-7692', 'EIP-7698', 'EIP-7873', 'EIP-7892'], declined: ['EIP-7666', 'EIP-7668', 'EIP-7688', 'EIP-7732', 'EIP-7783', 'EIP-7791', 'EIP-7793', 'EIP-7805', 'EIP-7819', 'EIP-7843', 'EIP-7889', 'EIP-7898', 'EIP-7903', 'EIP-7919'], considered: ['EIP-5920', 'EIP-7692', 'EIP-7761', 'EIP-7762', 'EIP-7823', 'EIP-7825', 'EIP-7834', 'EIP-7880', 'EIP-7883', 'EIP-7907', 'EIP-7917', 'EIP-7918'] }
  ];

  // Preprocess to add "declined" field based on removed EIPs
  const processedData = originalData.map((entry, index, arr) => {
    const allPrevEIPs = new Set<string>();
    for (let i = 0; i < index; i++) {
      arr[i].scheduled.forEach((eip) => allPrevEIPs.add(eip));
      arr[i].considered.forEach((eip) => allPrevEIPs.add(eip));
    }

    const currentEIPs = new Set([
      ...entry.scheduled,
      ...entry.considered,
    ]);

    const declined = [...allPrevEIPs].filter((eip) => !currentEIPs.has(eip));

    return {
      ...entry,
      declined,
    };
  });

  const processedData2 = data2.map((entry, index, arr) => {
    const allPrevEIPs = new Set<string>();
    for (let i = 0; i < index; i++) {
      arr[i].scheduled.forEach((eip) => allPrevEIPs.add(eip));
      arr[i].considered.forEach((eip) => allPrevEIPs.add(eip));
    }

    const currentEIPs = new Set([
      ...entry.scheduled,
      ...entry.considered,
    ]);

    const declined = [...allPrevEIPs].filter((eip) => !currentEIPs.has(eip));

    return {
      ...entry,
      declined,
    };
  });

  return (
    <Box p={4}>
      <TimelineChart data={processedData.reverse()} data2={data2.reverse()}/>
    </Box>
  );
};

export default EIPTimelinePage;
