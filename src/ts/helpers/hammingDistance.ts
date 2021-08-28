export function hammingDistance(hash1, hash2) {
  let similarity = 0;
  const hash1Array = hash1.split("")
  hash1Array.forEach((bit, index) => {
    hash2[index] === bit ? similarity++ : null
  });
  return Math.round((similarity / hash1.length) * 100)
}