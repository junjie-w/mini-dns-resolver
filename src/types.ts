export interface DNSRecord {
  type: 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME';
  value: string;
}

export interface DNSLookupResult {
  domain: string;
  records: DNSRecord[];
  timestamp: Date;
  responseTime: number;
  fromCache: boolean;
}

export interface CacheEntry {
  result: DNSLookupResult;
  expires: Date;
}
