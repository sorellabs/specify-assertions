macro (=>) {
  case infix { $actual:expr | $m not $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      alright.verify($alright.not($alright.equals($expected)($actual)))
    }
  }
  case infix { $actual:expr | $m $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $alright.verify($alright.equals($expected)($actual))
    }
  }
}
 
macro (|>) {
  case infix { $actual:expr | $m not $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $alright.verify($alright.not($test($actual)))
    }
  }
  case infix { $actual:expr | $m $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];    
    return #{
      $alright.verify($test($actual))
    }
  }
}

macro (>=>) {
  case infix { $actual:expr | $m not $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $actual.chain(function(a) {
        return alright.verify(alright.not(alright.equals($expected)(a)))
      })
    }
  }
  case infix { $actual:expr | $m $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $actual.chain(function(a) {
        return alright.verify(alright.equals($expected)(a))
      })
    }
  }
}
 
macro (>>=) {
  case infix { $actual:expr | $m not $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $actual.chain(function(a) {      
        return alright.verify(alright.not($test(a)))
      })
    }
  }
  case infix { $actual:expr | $m $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $actual.chain(function(a) {
        return alright.verify($test(a))
      })
    }
  }
}

export =>
export |>
export >=>
export >>=
