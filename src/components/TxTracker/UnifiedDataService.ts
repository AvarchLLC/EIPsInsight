import { getBlockDetails, fetchLast10Blocks, fetchEthPriceInUSD } from './ethereumService';

interface UnifiedBlockData {
  blockNumber: number;
  timestamp: number;
  baseFeeGwei: number;
  gasUsed: number;
  gasLimit: number;
  transactionCount: number;
  gasBurntEth: number;
}

interface LiveDataStore {
  latestBlock: UnifiedBlockData | null;
  recentBlocks: UnifiedBlockData[];
  ethPrice: number;
  lastUpdated: Date | null;
  isLoading: boolean;
}

class UnifiedDataService {
  private data: LiveDataStore = {
    latestBlock: null,
    recentBlocks: [],
    ethPrice: 0,
    lastUpdated: null,
    isLoading: false
  };

  private subscribers: Array<(data: LiveDataStore) => void> = [];
  private updateInterval: NodeJS.Timeout | null = null;

  subscribe(callback: (data: LiveDataStore) => void) {
    this.subscribers.push(callback);
    // Immediately provide current data
    callback(this.data);
    
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.data));
  }

  private parseBlockData(rawBlock: any): UnifiedBlockData {
    const blockNumber = Number(rawBlock.blockNumber || rawBlock.number || 0);
    const timestamp = Number(rawBlock.timestamp || 0);
    
    // Parse base fee - handle different formats
    let baseFeeGwei = 0;
    if (rawBlock.baseFee) {
      // If it's already formatted as "X.XX Gwei"
      const feeMatch = rawBlock.baseFee.match(/([0-9.]+)/);
      baseFeeGwei = feeMatch ? parseFloat(feeMatch[1]) : 0;
    } else if (rawBlock.baseFeePerGas) {
      // Convert from wei to gwei
      baseFeeGwei = Number(rawBlock.baseFeePerGas) / 1e9;
    }

    // Parse gas values
    const gasUsed = this.parseGasValue(rawBlock.gasUsed);
    const gasLimit = this.parseGasValue(rawBlock.gasLimit);
    
    // Parse transaction count
    const transactionCount = Number(rawBlock.transactions || 0);
    
    // Parse gas burnt - handle different formats
    let gasBurntEth = 0;
    if (rawBlock.gasBurnt) {
      const burntMatch = rawBlock.gasBurnt.match(/([0-9.]+)/);
      gasBurntEth = burntMatch ? parseFloat(burntMatch[1]) : 0;
    }

    return {
      blockNumber,
      timestamp,
      baseFeeGwei,
      gasUsed,
      gasLimit,
      transactionCount,
      gasBurntEth
    };
  }

  private parseGasValue(gasValue: any): number {
    if (!gasValue) return 0;
    
    if (typeof gasValue === 'string') {
      // Handle "X.XM" format
      if (gasValue.includes('M')) {
        const numMatch = gasValue.match(/([0-9.]+)/);
        return numMatch ? parseFloat(numMatch[1]) * 1e6 : 0;
      }
    }
    
    return Number(gasValue) || 0;
  }

  async fetchLiveData(network: 'mainnet' | 'sepolia' = 'mainnet') {
    if (this.data.isLoading) return;
    
    console.log('🔄 Fetching unified live data...');
    this.data.isLoading = true;
    this.notifySubscribers();

    try {
      // Fetch all data in parallel
      const [latestBlockRaw, recentBlocksRaw, ethPrice] = await Promise.all([
        getBlockDetails('latest', network === 'sepolia'),
        fetchLast10Blocks(network === 'sepolia'),
        fetchEthPriceInUSD()
      ]);

      console.log('📦 Raw latest block:', latestBlockRaw);
      console.log('📚 Raw recent blocks sample:', recentBlocksRaw.slice(0, 2));

      // Parse and normalize the data
      this.data.latestBlock = this.parseBlockData(latestBlockRaw);
      this.data.recentBlocks = recentBlocksRaw.slice(0, 10).map(block => this.parseBlockData(block));
      this.data.ethPrice = ethPrice;
      this.data.lastUpdated = new Date();

      console.log('✅ Unified latest block:', this.data.latestBlock);
      console.log('💰 ETH Price:', this.data.ethPrice);

    } catch (error) {
      console.error('❌ Error fetching unified data:', error);
    } finally {
      this.data.isLoading = false;
      this.notifySubscribers();
    }
  }

  startAutoUpdate(network: 'mainnet' | 'sepolia' = 'mainnet', intervalMs: number = 15000) {
    this.stopAutoUpdate();
    
    // Initial fetch
    this.fetchLiveData(network);
    
    // Set up interval
    this.updateInterval = setInterval(() => {
      this.fetchLiveData(network);
    }, intervalMs);

    console.log(`🚀 Started auto-update every ${intervalMs/1000}s`);
  }

  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏹️ Stopped auto-update');
    }
  }

  getData(): LiveDataStore {
    return { ...this.data };
  }

  getLatestBlock(): UnifiedBlockData | null {
    return this.data.latestBlock;
  }

  getEthPrice(): number {
    return this.data.ethPrice;
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();
export type { UnifiedBlockData, LiveDataStore };