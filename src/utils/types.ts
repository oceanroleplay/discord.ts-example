function assertNever(x: never): never {
  throw new Error(`Unexpected type: ${x}`)
}

export { assertNever }
