---
description: Run VibeMap build + test pipeline and report coverage
---

Run the full VibeMap verification pipeline and report the result in a compact summary.

Execute these in sequence:

1. `make compile` — must output "0 broken"
2. `make test 2>&1 | tail -10` — must show "fail 0"
3. `node scripts/build-references.mjs --strict || node scripts/build-references.mjs` — note if `--strict` fails (non-zero unmapped) and fall back
4. Read `docs/nodes.json` stats and `docs/references.json` stats

Then print a single-block summary in this exact format:

```
pipeline: OK | compile broken=<N> | tests pass=<P>/fail=<F>
nodes:    total=<T> md=<M> legacy=<L>
edges:    <E>
refs:     sources=<S> mapped=<MN> unmapped=<U>
```

If any stage fails, stop after that stage and print the failure output verbatim. Do not attempt to fix issues — this is read-only verification. The user decides next steps.
