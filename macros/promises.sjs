macro will {
  case infix { $promise:expr | _ not be $test:expr } => {
    return #{ $promise will not $test }
  }
  case infix { $promise:expr | _ be $test:expr } => {
    return #{ $promise will $test }
  }
  case infix { $promise:expr | _ not $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verifyPromise($promise)($alright.not($test))
    }
  }
  case infix { $promise:expr | _ $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verifyPromise($promise)($test)
    }
  }
}

export will;
