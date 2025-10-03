interface MongoDataPoint {
  time: string;
  block: number;
  fee?: number;
  gasBurnt?: number;
  gasUsed?: number;
  priorityFee?: number;
}

interface LatestValues {
  blockNumber: number;
  baseFeeGwei: number;
  priorityFeeGwei: number;
  gasUsed: number;
  gasBurnt: number;
  gasLimit: number;
  gasUsedPercentage: number;
  totalTransactions: number;
  timestamp: Date;
  isLoading: boolean;
}

class MongoDataService {
  private static instance: MongoDataService;
  private data: {
    fees: MongoDataPoint[];
    gasBurnt: MongoDataPoint[];
    gasUsed: MongoDataPoint[];
    priorityFee: MongoDataPoint[];
    allBlocks: any[];
    lastUpdated: number;
  } = {
    fees: [],
    gasBurnt: [],
    gasUsed: [],
    priorityFee: [],
    allBlocks: [],
    lastUpdated: 0
  };
  
  private subscribers: Array<(data: LatestValues) => void> = [];
  private isRefreshing = false;

  static getInstance(): MongoDataService {
    if (!MongoDataService.instance) {
      MongoDataService.instance = new MongoDataService();
    }
    return MongoDataService.instance;
  }

  async fetchAllData(): Promise<void> {
    if (this.isRefreshing) return;
    
    this.isRefreshing = true;
    
    try {
      console.log('🔄 Fetching MongoDB data from API routes...');
      
      const [feesRes, gasBurntRes, gasUsedRes, priorityFeeRes, allBlocksRes] = await Promise.allSettled([
        fetch('/api/txtracker/fetchData'),
        fetch('/api/fetchData1'),
        fetch('/api/fetchData2'),
        fetch('/api/fetchData3'),
        fetch('/api/fetchData4')
      ]);

      if (feesRes.status === 'fulfilled' && feesRes.value.ok) {
        const feesData = await feesRes.value.json();
        this.data.fees = feesData.fees || [];
        console.log('📊 Fees data:', this.data.fees.length, 'points');
      }

      if (gasBurntRes.status === 'fulfilled' && gasBurntRes.value.ok) {
        const gasBurntData = await gasBurntRes.value.json();
        this.data.gasBurnt = gasBurntData.gasBurnt || [];
        console.log('🔥 Gas burnt data:', this.data.gasBurnt.length, 'points');
      }

      if (gasUsedRes.status === 'fulfilled' && gasUsedRes.value.ok) {
        const gasUsedData = await gasUsedRes.value.json();
        this.data.gasUsed = gasUsedData.gasUsed || [];
        console.log('⛽ Gas used data:', this.data.gasUsed.length, 'points');
      }

      if (priorityFeeRes.status === 'fulfilled' && priorityFeeRes.value.ok) {
        const priorityFeeData = await priorityFeeRes.value.json();
        this.data.priorityFee = priorityFeeData.priorityFee || [];
        console.log('💰 Priority fee data:', this.data.priorityFee.length, 'points');
      }

      if (allBlocksRes.status === 'fulfilled' && allBlocksRes.value.ok) {
        const allBlocksData = await allBlocksRes.value.json();
        this.data.allBlocks = allBlocksData.allBlocks || [];
        console.log('📦 All blocks data:', this.data.allBlocks.length, 'blocks');
      }

      this.data.lastUpdated = Date.now();
      const latestValues = this.getLatestValues();
      console.log('✅ Latest values calculated:', latestValues);
      
      this.notifySubscribers();
      
    } catch (error) {
      console.error('❌ Error fetching MongoDB data:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  // Get the most recent values from MongoDB data
  getLatestValues(): LatestValues {
    const latest: LatestValues = {
      blockNumber: 0,
      baseFeeGwei: 0,
      priorityFeeGwei: 0,
      gasUsed: 0,
      gasBurnt: 0,
      gasLimit: 30_000_000, // Standard Ethereum gas limit
      gasUsedPercentage: 0,
      totalTransactions: 0,
      timestamp: new Date(),
      isLoading: this.isRefreshing
    };

    // Get latest base fee (most recent = index 0 due to sort in API)
    if (this.data.fees.length > 0) {
      const latestFee = this.data.fees[0];
      latest.blockNumber = latestFee.block;
      latest.baseFeeGwei = latestFee.fee || 0;
    }

    // Get latest priority fee
    if (this.data.priorityFee.length > 0) {
      latest.priorityFeeGwei = this.data.priorityFee[0].priorityFee || 0;
    }

    // Get latest gas used
    if (this.data.gasUsed.length > 0) {
      latest.gasUsed = this.data.gasUsed[0].gasUsed || 0;
    }

    // Get latest gas burnt
    if (this.data.gasBurnt.length > 0) {
      latest.gasBurnt = this.data.gasBurnt[0].gasBurnt || 0;
    }

    // Get transaction count from latest block
    if (this.data.allBlocks.length > 0) {
      const latestBlock = this.data.allBlocks[0];
      // Sum all transaction types
      latest.totalTransactions = (latestBlock.type0 || 0) + 
                                (latestBlock.type1 || 0) + 
                                (latestBlock.type2 || 0) + 
                                (latestBlock.type3 || 0) + 
                                (latestBlock.type4 || 0);
    }

    // Calculate gas used percentage
    if (latest.gasUsed > 0) {
      latest.gasUsedPercentage = Math.round((latest.gasUsed / latest.gasLimit) * 100);
    }

    return latest;
  }

  subscribe(callback: (data: LatestValues) => void) {
    this.subscribers.push(callback);
    // Immediately call with current data
    callback(this.getLatestValues());
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    const latestValues = this.getLatestValues();
    this.subscribers.forEach(callback => callback(latestValues));
  }

  // Get chart data (for existing charts)
  getChartData() {
    return {
      fees: this.data.fees,
      gasBurnt: this.data.gasBurnt,
      gasUsed: this.data.gasUsed,
      priorityFee: this.data.priorityFee,
      allBlocks: this.data.allBlocks
    };
  }

  // Start auto-refresh
  startAutoRefresh(intervalMs = 30000) {
    console.log('🚀 Starting MongoDB data auto-refresh every', intervalMs/1000, 'seconds');
    
    // Initial fetch
    this.fetchAllData();
    
    // Set up interval
    setInterval(() => {
      this.fetchAllData();
    }, intervalMs);
  }
}

export default MongoDataService;
export type { LatestValues, MongoDataPoint };