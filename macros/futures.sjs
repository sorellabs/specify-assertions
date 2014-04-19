macro will {
  case infix { $future:expr | _ $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verifyFuture($future)($test)
    }
  }
  case infix { $future:expr | _ not $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verifyFuture($future)($alright.not($test))
    }
  }
  case infix { $future:expr | _ be $test:expr } => {
    return #{ $future will $test }
  }
  case infix { $future:expr | _ not be $test:expr } => {
    return #{ $future will not $test }
  }
}

export will;
