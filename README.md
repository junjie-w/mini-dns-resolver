# Mini DNS Resolver

A simple DNS resolver package for Node.js with TypeScript support. Provides both single and bulk domain lookups. Available as [NPM package](https://www.npmjs.com/package/mini-dns-resolver).

## Installation

```bash
npm install mini-dns-resolver
```

## Usage

```typescript
import { DNSResolver } from 'mini-dns-resolver';

// Create resolver instance with optional cache timeout (default: 5 minutes)
const resolver = new DNSResolver({ cacheTimeout: 60000 });

// Single domain lookup
try {
  const result = await resolver.lookup('google.com');
  console.log(result);
} catch (error) {
  console.error('Lookup failed:', error);
}

// Multiple domains lookup (failures won't affect successful lookups)
try {
  const results = await resolver.lookupAll(['github.com', 'example.com']);
  console.log(results);
} catch (error) {
  console.error('Bulk lookup failed:', error);
}

// Filter specific record types
const result = await resolver.lookup('gmail.com');
const mxRecords = result.records.filter(record => record.type === 'MX');
```

## API

### `lookup(domain: string): Promise<DNSLookupResult>`
Resolves all DNS records for a single domain. Uses cache if available. Throws an error if no records are found or if resolution fails.

### `lookupAll(domains: string[]): Promise<DNSLookupResult[]>`
Resolves DNS records for multiple domains. Returns results only for successful lookups, silently skipping failed ones.

### Types

```typescript
interface DNSRecord {
  type: 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME';
  value: string;
}

interface DNSLookupResult {
  domain: string;
  records: DNSRecord[];
  timestamp: Date;
  responseTime: number;
  fromCache: boolean;
}
```

## Examples

For working examples, check out the [examples](https://github.com/junjie-w/mini-dns-resolver/tree/main/examples) directory:

```bash
git clone https://github.com/junjie-w/mini-dns-resolver.git
cd mini-dns-resolver/examples

# Try different examples
npm install
npm run lookup:lib                           # Library usage with caching example
npm run lookup:args google.com               # Command line lookup with single domain
npm run lookup:args google.com github.com    # Command line lookup with multiple domains
```

## Error Handling

The package throws errors in these cases:
- No DNS records found for domain
- DNS resolution failures
- Network issues

## License

MIT