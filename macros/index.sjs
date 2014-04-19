macro should {
  case infix { $actual:expr | _ not $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verify($actual)($alright.not($test))
    }
  }
  case infix { $actual:expr | _ $test:expr } => {
    letstx $alright = [makeIdent('alright', #{$test}[0])];
    return #{
      $alright.verify($actual)($test)
    }
  }
  case infix { $actual:expr | _ not be $test:expr } => {
    return #{ $actual should not $test }
  }
  case infix { $actual:expr | _ be $test:expr } => {
    return #{ $actual should $test }
  }
}

macro (=>) {
  case infix { $actual:expr | _ not $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$expected}[0])];
    return #{
      $actual should not $alright.equal($expected)
    }
  }
  case infix { $actual:expr | _ $expected:expr } => {
    letstx $alright = [makeIdent('alright', #{$expected}[0])];
    return #{
      $actual should $alright.equal($expected)
    }
  }
}

macro will {
  rule infix { $monad:expr | => $expected:expr } => {
    $monad.chain(function(a) {
      return a => $expected
    })
  }

  rule infix { $monad:expr | not => $expected:expr } => {
    $monad.chain(function(a) {
      return a => not $expected
    })
  }

  rule infix { $monad:expr | be $test:expr } => {
    $monad.chain(function(a) {
      return a should $test
    })
  }

  rule infix { $monad:expr | not be $test:expr } => {
    $monad.chain(function(a) {
      return a should not $test
    })
  }

}

export =>;
export should;
export will
