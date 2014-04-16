macro (=>) {
  case infix { $actual:expr | $m not $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      alright.verify($alright.not($alright.equal($expected)($actual)))
    }
  }
  case infix { $actual:expr | $m $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$m})];
    return #{
      $alright.verify($alright.equal($expected)($actual))
    }
  }
}
 
macro should {
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


export =>;
export should;
