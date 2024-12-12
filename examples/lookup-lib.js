import { DNSResolver } from "mini-dns-resolver";

async function lookupLib() {
  const resolver = new DNSResolver({ cacheTimeout: 60000 });

  try {
    const result = await resolver.lookup("google.com");
    console.log("Single domain lookup result:");
    console.log(JSON.stringify(result, null, 2));

    console.log("\nSingle domain lookup result from cache:");
    const resultFromCache = await resolver.lookup("google.com");
    console.log(JSON.stringify(resultFromCache, null, 2));
  } catch (error) {
    console.error("Single lookup failed:", error);
  }

  try {
    const domains = ["github.com", "example.com", "invalid-domain-123.xyz"];

    const results = await resolver.lookupAll(domains);
    console.log("\nBulk domain lookup results:");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Bulk lookup failed:", error);
  }

  try {
    const result = await resolver.lookup("gmail.com");
    console.log("\nMX records for email server:");
    const mxRecords = result.records.filter((record) => record.type === "MX");
    console.log(JSON.stringify(mxRecords, null, 2));
  } catch (error) {
    console.error("MX lookup failed:", error);
  }
}

lookupLib();
