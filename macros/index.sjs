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

macro (>==>) {
  rule infix { $actual:expr | ! $expected:expr } => {
    $actual.chain(function(a) {
      return alright.verify(alright.not(alright.equals($expected)(a)))
    })
  }
  rule infix { $actual:expr | $expected:expr } => {
    $actual.chain(function(a) {
      return alright.verify(alright.equals($expected)(a))
    })
  }
}
 
macro (>=>) {
  rule infix { $actual:expr | ! $test:expr } => {
    $actual.chain(function(a) {
      return alright.verify(alright.not($test(a)))
    })
  }
  rule infix { $actual:expr | $test:expr } => {
    $actual.chain(function(a) {
      return alright.verify($test(a))
    })
  }
}