import { DNSResolver } from "mini-dns-resolver";

async function lookupArgs(domains) {
  const resolver = new DNSResolver({ cacheTimeout: 60000 });

  if (domains.length === 0) {
    console.log("Usage: npm run lookup:args <domain1> [domain2 ...]");
    console.log("Example: npm run lookup:args google.com github.com");
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

lookupArgs(process.argv.slice(2));
