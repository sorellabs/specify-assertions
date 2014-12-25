macro $alright__load {
  rule {} => {
    typeof module !== 'undefined' && typeof require !== 'undefined'?  require('specify-assertions')
    :                                                                 window.Specify.Assertions
  }
}

macro will {
  rule infix { $promise:expr | not be $test:expr } => {
    $promise will not $test
  }
  rule infix { $promise:expr | be $test:expr } => {
    $promise will $test
  }
  rule infix { $promise:expr | not $test:expr } => {
    (function(alright) {
      return alright.verifyPromise($promise)(alright.not($test))
    })($alright__load)
  }
  rule infix { $promise:expr | $test:expr } => {
    (function(alright) {
      return alright.verifyPromise($promise)($test)
    })($alright__load)
  }
}

export will;
