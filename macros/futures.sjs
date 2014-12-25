macro $alright__load {
  rule {} => {
    typeof module !== 'undefined' && typeof require !== 'undefined'?  require('specify-assertions')
    :                                                                 window.Specify.Assertions
  }
}

macro will {
  rule infix { $future:expr | not be $test:expr } => {
    $future will not $test
  }
  rule infix { $future:expr | be $test:expr } => {
    $future will $test
  }
  rule infix { $future:expr | not $test:expr } => {
    (function(alright) {
      return alright.verifyFuture($future)(alright.not($test))
    })($alright__load)
  }
  rule infix { $future:expr | $test:expr } => {
    (function(alright) {
      return alright.verifyFuture($future)($test)
    })($alright__load)
  }
}

export will;
