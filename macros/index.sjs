macro (==>) {
  rule infix { $actual:expr | ! $expected:expr } => {
    alright.verify(alright.not(alright.equals($expected)($actual)))
  }
  rule infix { $actual:expr | $expected:expr } => {
    alright.verify(alright.equals($expected)($actual))
  }
}
 
macro (=>) {
  rule infix { $actual:expr | ! $test:expr } => {
    alright.verify(alright.not($test($actual)))
  }
  rule infix { $actual:expr | $test:expr } => {
    alright.verify($test($actual))
  }
}