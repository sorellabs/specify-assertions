macro will {
  case infix { $monad:expr | _ $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verifyMonad($monad)($test)
    }
  }
  case infix { $monad:expr | _ not $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verifyMonad($monad)($alright.not($test))
    }
  }
  case infix { $monad:expr | _ be $test:expr } => {
    return #{ $monad will $test }
  }
  case infix { $monad:expr | _ not be $test:expr } => {
    return #{ $monad will not $test }
  }
}

export will;
