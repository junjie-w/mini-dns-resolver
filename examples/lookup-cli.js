import { DNSResolver } from "mini-dns-resolver";

async function lookupCli(domains) {
  const resolver = new DNSResolver();

  if (domains.length === 0) {
    console.log("Usage: npm run start <domain1> [domain2 ...]");
    console.log("Example: npm run start google.com github.com");
    return;
  }

  try {
    if (domains.length === 1) {
      const result = await resolver.lookup(domains[0]);
      console.log(`DNS records for ${domains[0]}:`);
      console.log(JSON.stringify(result, null, 2));
    } else {
      const results = await resolver.lookupAll(domains);
      console.log(`DNS records for multiple domains:`);
      console.log(JSON.stringify(results, null, 2));
    }
  } catch (error) {
    console.error("Lookup failed:", error);
  }
}

lookupCli(process.argv.slice(2));
