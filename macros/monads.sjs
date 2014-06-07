macro $alright__load {
  rule {} => {
    typeof module !== 'undefined' && typeof require !== 'undefined'?  require('alright')
    :                                                                 window.alright
  }
}

macro will {
  rule infix { $monad:expr | not be $test:expr } => {
    $monad will not $test
  }
  rule infix { $monad:expr | be $test:expr } => {
    $monad will $test
  }
  rule infix { $monad:expr | not $test:expr } => {
    (function(alright) {
      return alright.verifyMonad($monad)(alright.not($test))
    })($alright__load)
  }
  rule infix { $monad:expr | $test:expr } => {
    (function(alright) {
      return alright.verifyMonad($monad)($test)
    })($alright__load)
  }
}

export will;
