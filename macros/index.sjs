macro $alright__load {
  rule {} => {
    typeof module !== 'undefined' && typeof require !== 'undefined'?  require('specify-assertions')
    :                                                                 window.Specify.Assertions
  }
}

macro should {
  rule infix { $actual:expr | not be $test:expr } => {
    $actual should not $test
  }
  rule infix { $actual:expr | be $test:expr } => {
    $actual should $test
  }
  rule infix { $actual:expr | not $test:expr } => {
    (function(alright) {
      return alright.verify($actual)(alright.not($test))
    })($alright__load)
  }
  rule infix { $actual:expr | $test:expr } => {
    (function(alright) {
      return alright.verify($actual)($test)
    })($alright__load)
  }
}

macro (=>) {
  rule infix { $actual:expr | not $expected:expr } => {
    (function(alright) {
      return alright.verify($actual)(alright.not(alright.equal($expected)))
    })($alright__load)
  }
  rule infix { $actual:expr | $expected:expr } => {
    (function(alright) {
      return alright.verify($actual)(alright.equal($expected))
    })($alright__load)
  }
}

export =>;
export should;

