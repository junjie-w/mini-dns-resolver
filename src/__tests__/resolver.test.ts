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
    
    it('should handle mix of valid and invalid domains', async () => {
      const domains = ['google.com', 'invalid-domain-123.xyz'];
      const results = await resolver.lookupAll(domains);
      
      expect(results).toHaveLength(1);
      expect(results[0].domain).toBe('google.com');
    });
  });
});