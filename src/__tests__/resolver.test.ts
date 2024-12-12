import { DNSResolver } from '../resolver.js';

describe('DNSResolver', () => {
  let resolver: DNSResolver;

  beforeEach(() => {
    resolver = new DNSResolver();
  });

  describe('lookup', () => {
    it('should resolve google.com successfully', async () => {
      const result = await resolver.lookup('google.com');
      expect(result.domain).toBe('google.com');
      expect(result.records).toBeInstanceOf(Array);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(typeof result.responseTime).toBe('number');
      expect(result.fromCache).toBe(false);
    });

    it('should use cache for repeated lookups', async () => {
      const result1 = await resolver.lookup('google.com');
      expect(result1.fromCache).toBe(false);

      const result2 = await resolver.lookup('google.com');
      expect(result2.fromCache).toBe(true);
    });

    it('should clear cache when requested', async () => {
      await resolver.lookup('google.com');

      resolver.clearCache();

      const result = await resolver.lookup('google.com');
      expect(result.fromCache).toBe(false);
    });

    it('should respect cache timeout', async () => {
      const shortCacheResolver = new DNSResolver({ cacheTimeout: 1 }); 

      await shortCacheResolver.lookup('google.com');

      await new Promise(resolve => setTimeout(resolve, 10));

      const result = await shortCacheResolver.lookup('google.com');
      expect(result.fromCache).toBe(false);
    });

    it('should fail with invalid domain', async () => {
      await expect(
        resolver.lookup('invalid-domain-name.xyz')
      ).rejects.toThrow();
    });
  });

  describe('lookupAll', () => {
    it('should resolve multiple domains', async () => {
      const domains = ['google.com', 'github.com'];
      const results = await resolver.lookupAll(domains);
      
      expect(results).toHaveLength(2);
      results.forEach((result, index) => {
        expect(result.domain).toBe(domains[index]);
        expect(result.records).toBeInstanceOf(Array);
      });
    });
    
    it('should use cache in bulk lookups', async () => {
      await resolver.lookupAll(['google.com', 'github.com']);

      const results = await resolver.lookupAll(['google.com', 'github.com']);
      results.forEach(result => {
        expect(result.fromCache).toBe(true);
      });
    });

    it('should handle mix of valid and invalid domains', async () => {
      const domains = ['google.com', 'invalid-domain-123.xyz'];
      const results = await resolver.lookupAll(domains);
      
      expect(results).toHaveLength(1);
      expect(results[0].domain).toBe('google.com');
    });
  });
});
