import { createHmac, randomBytes } from "node:crypto";

console.log("This will print first");

setTimeout(() => console.log("Finally!"), 10);
setTimeout(() => console.log("This will print third"), 0);

// Let's waste some time
const hmacStart = Date.now();
const sha256 = createHmac("sha256", "super secret key");
for (let i = 0; i < 1_000_000; i++) {
   sha256.update(randomBytes(16));
}
const hmacEnd = Date.now();

console.log("This will print second. Hmac took", hmacEnd - hmacStart, "ms. Sha256 digest:", sha256.digest("hex"));
