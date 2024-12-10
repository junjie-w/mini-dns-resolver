# Mini DNS Resolver Examples

Examples of using [mini-dns-resolver](https://www.npmjs.com/package/@junjie-wu/mini-dns-resolver/) package.

## Library Usage

Shows how to use the package as a library in your code, including:
- Single domain lookup
- Multiple domains lookup
- Filtering specific record types

```bash
npm run lookup:lib
```

## CLI-style Usage

Interactive example that accepts domain names as arguments:

```bash
# Single domain lookup
npm run lookup:cli google.com

# Multiple domains lookup
npm run lookup:cli google.com github.com
```

## Example Output

Single domain lookup:
```json
{
  "domain": "google.com",
  "records": [
    { "type": "A", "value": "142.250.72.78" },
    { "type": "AAAA", "value": "2607:f8b0:4004:c1b::71" },
    { "type": "MX", "value": "10 smtp.google.com" }
  ],
  "timestamp": "2024-12-10T12:34:56.789Z",
  "responseTime": 123
}
```

## Output Details

- `domain`: The domain that was looked up
- `records`: Array of DNS records found
- `timestamp`: When the lookup was performed
- `responseTime`: Time taken in milliseconds