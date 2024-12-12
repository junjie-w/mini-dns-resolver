import dns from 'dns';
import { promisify } from 'util';
import { DNSRecord, DNSLookupResult, CacheEntry } from './types.js';

export class DNSResolver {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly cacheTimeout: number;

  private resolve4 = promisify(dns.resolve4);
  private resolve6 = promisify(dns.resolve6);
  private resolveMx = promisify(dns.resolveMx);
  private resolveTxt = promisify(dns.resolveTxt);
  private resolveNs = promisify(dns.resolveNs);
  private resolveCname = promisify(dns.resolveCname);

  constructor({ cacheTimeout = 300000 } = {}) {
    this.cacheTimeout = cacheTimeout;
  }

  private getCachedResult(domain: string): DNSLookupResult | null {
    const cached = this.cache.get(domain);
    if (cached && cached.expires > new Date()) {
      return cached.result;
    }
    this.cache.delete(domain);
    return null;
  }

  private setCacheResult(domain: string, result: DNSLookupResult): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + this.cacheTimeout);
    this.cache.set(domain, { result, expires });
  }

  async lookup(domain: string): Promise<DNSLookupResult> {
    const cached = this.getCachedResult(domain);
    if (cached) {
      return {
        ...cached,
        timestamp: new Date(),
        fromCache: true
      };
    }

    const startTime = Date.now();
    const records: DNSRecord[] = [];

    try {
      const results = await Promise.allSettled([
        this.resolve4(domain).then(ips => 
          ips.map(ip => ({ type: 'A' as const, value: ip }))),
        this.resolve6(domain).then(ips => 
          ips.map(ip => ({ type: 'AAAA' as const, value: ip }))),
        this.resolveMx(domain).then(mxRecords => 
          mxRecords.map(mx => ({ type: 'MX' as const, value: `${mx.priority} ${mx.exchange}` }))),
        this.resolveTxt(domain).then(txtRecords => 
          txtRecords.flat().map(txt => ({ type: 'TXT' as const, value: txt }))),
        this.resolveNs(domain).then(nsRecords => 
          nsRecords.map(ns => ({ type: 'NS' as const, value: ns }))),
        this.resolveCname(domain).then(cnameRecords => 
          cnameRecords.map(cname => ({ type: 'CNAME' as const, value: cname })))
      ]);

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          records.push(...result.value);
        }
      });

      if (records.length === 0) {
        throw new Error(`No DNS records found for ${domain}`);
      }

      const result = {
        domain,
        records,
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        fromCache: false
      };

      this.setCacheResult(domain, result);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to resolve ${domain}: ${error.message}`);
      }
      throw new Error(`Failed to resolve ${domain}: Unknown error`);
    }
  }

  async lookupAll(domains: string[]): Promise<DNSLookupResult[]> {
    const results = await Promise.allSettled(domains.map(domain => this.lookup(domain)));
    return results
      .filter((result): result is PromiseFulfilledResult<DNSLookupResult> => 
        result.status === 'fulfilled')
      .map(result => result.value);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
