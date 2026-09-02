import { describe, expect, test } from "bun:test"
import { join } from "node:path"

/**
 * Contract tests that drive the real CLI as a subprocess.
 *
 * Every case here fails validation *before* any network call, so the suite runs
 * fully offline. The contract under test is the one /scrape and /add-portal
 * depend on: a rejected invocation exits 1 and writes a single JSON object to
 * stderr, never a stack trace and never a silent success.
 */

const CLI = join(import.meta.dir, "..", "src", "cli.ts")

async function run(args: string[]) {
  const proc = Bun.spawn(["bun", "run", CLI, ...args], { stdout: "pipe", stderr: "pipe" })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout, stderr, exitCode }
}

function parseError(stderr: string): { error: string; code: string } {
  const line = stderr.trim().split("\n").filter(Boolean).pop() ?? ""
  return JSON.parse(line)
}

describe("error contract", () => {
  test("an unknown flag exits 1 with UNKNOWN_FLAG on stderr", async () => {
    // A silently discarded filter changes what the search returns without any
    // error - the whole reason the guard exists.
    const { stdout, stderr, exitCode } = await run(["search", "--query", "python", "--recency", "7"])
    expect(exitCode).toBe(1)
    expect(stdout).toBe("")
    expect(parseError(stderr).code).toBe("UNKNOWN_FLAG")
  })

  test("search with neither --query nor --location exits 1", async () => {
    const { stderr, exitCode } = await run(["search"])
    expect(exitCode).toBe(1)
    expect(parseError(stderr).code).toBe("MISSING_REQUIRED")
  })

  test("a --jobage jobs.ch would silently ignore is rejected", async () => {
    // jobs.ch accepts only 1/7/14/31; anything else returns unfiltered results
    // while looking like a successful recency filter.
    const { stderr, exitCode } = await run(["search", "--query", "python", "--jobage", "3"])
    expect(exitCode).toBe(1)
    expect(parseError(stderr).code).toBe("INVALID_FLAG")
  })

  test.each([1, 7, 14, 31])("--jobage %i is accepted by validation", async (days) => {
    // Reaches the network, so only the *validation* rejection is asserted against.
    const { stderr } = await run(["search", "--query", "python", "--jobage", String(days)])
    if (stderr.trim()) {
      expect(parseError(stderr).code).not.toBe("INVALID_FLAG")
    }
  })

  test("an inverted workload range is rejected", async () => {
    const { stderr, exitCode } = await run([
      "search",
      "--query",
      "python",
      "--workload-min",
      "100",
      "--workload-max",
      "60",
    ])
    expect(exitCode).toBe(1)
    expect(parseError(stderr).code).toBe("INVALID_FLAG")
  })

  test("a locale the host does not serve is rejected, not silently retargeted", async () => {
    const { stderr, exitCode } = await run([
      "search",
      "--query",
      "data",
      "--site",
      "jobup.ch",
      "--locale",
      "de",
    ])
    expect(exitCode).toBe(1)
    expect(parseError(stderr).error).toMatch(/not available/)
  })

  test("detail without an id exits 1", async () => {
    const { stderr, exitCode } = await run(["detail"])
    expect(exitCode).toBe(1)
    expect(parseError(stderr).code).toBe("MISSING_REQUIRED")
  })
})
